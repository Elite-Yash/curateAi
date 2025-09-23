import React, { useEffect, useRef, useState } from "react";
import "../../css/InputAiPopup.css";
import {
  LANGUAGES,
  TONES,
  COMMENT_MOTIVES,
  POSTING_MOTIVES,
} from "../../constants/constants";
import { ArticleInfo, PostData } from "../../constants/types";
import { getCurrentLinkedInUsernameFromLocalStorage } from "../../helpers/commonHelper";
import SignIn from "./Signin";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { getImage } from "../../common/utils/logoUtils";
import { apiService } from "../../common/config/apiService";
import { removeEmoji } from "../../common/utils/removeicon";
import { Copy, FileText, RefreshCw } from "lucide-react";

export interface LinkedInMessage {
  messageSpeaker: string;
  messageText: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  postData: PostData;
  insertGeneratedComment: (comment: string, saveGeneratedMessageData: string) => void;
  insertGeneratedPost: (post: string, saveGeneratedMessageData: string) => void;
  popupTriggeredFrom: string;
  articleInfo?: ArticleInfo | null;
  lastMessages: LinkedInMessage[];
  post_url?: string;
  activePlan?: boolean;
  collectedText?: string;
  setCollectedText: React.Dispatch<React.SetStateAction<string | undefined>>;
  relyedOfPostContent?: React.Dispatch<React.SetStateAction<string | undefined>>;
  saveGeneratedMessageData?: string | undefined;
  setSaveGeneratedMessageData?: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const InputAiPopup: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  postData,
  insertGeneratedComment,
  insertGeneratedPost,
  popupTriggeredFrom,
  articleInfo,
  lastMessages,
  post_url,
  activePlan,
  collectedText,
  setCollectedText,
  relyedOfPostContent,
  saveGeneratedMessageData,
  setSaveGeneratedMessageData,
}) => {
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [tone, setTone] = useState(TONES[0]);
  const [motives, setMotive] = useState(
    popupTriggeredFrom === "create-post"
      ? POSTING_MOTIVES[0]
      : COMMENT_MOTIVES[0]
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAuth, setIsAuth] = useState(true);
  const [isTextGenerated, setIsTextGenerated] = useState(false);
  let apiCalled = false;
  const [displayedText, setDisplayedText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [context, setContext] = useState("");
  const [isContextActive, setIsContextActive] = useState(false);

  const [isActive, setisActive] = useState(false);

  const [errors, setErrors] = useState({
    collectedText: "",
    motive: "",
    language: "",
    tone: "",
  });

  const handleCopy = () => {
    if (displayedText.trim()) {
      navigator.clipboard.writeText(displayedText);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [displayedText]);

  if (!isOpen) return null;

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");

    const currentUrl = window.location.href;
    const platform = currentUrl.includes("linkedin.com")
      ? "linkedin"
      : currentUrl.includes("x.com")
        ? "twitter"
        : "";

    const currentUserName = getCurrentLinkedInUsernameFromLocalStorage();

    // Fetch auth token
    chrome.runtime.sendMessage({ type: "getCookies" }, (response) => {
      if (!response || !response.success || !response.token) {
        setError("Failed to retrieve auth token.");
        setLoading(false);
        setIsAuth(true);
        return;
      }

      const authToken = response.token;

      const requestData = {
        language,
        tone: removeEmoji(tone.replace(/^[^\p{L}\p{N}\s]+/u, "").trim()),
        postText:
          popupTriggeredFrom === "comment-reply" ? relyedOfPostContent : collectedText,
        authorName: postData.postAutherName,
        platform,
        command: context.length > 0 ? context : collectedText,
        contentType: popupTriggeredFrom,
        commentAuthorName: postData.commentAuthorName,
        commentText: postData.commentText,
        goal: removeEmoji((motives ?? "").replace(/^[^\p{L}\p{N}\s]+/u, "").trim()),
        articleInfo,
        lastMessages,
        currentUserName,
        authToken,
      };

      // Generate content
      chrome.runtime.sendMessage(
        { type: "GENERATE_CONTENT", data: requestData },
        (response) => {
          if (response.success && !apiCalled) {
            setDisplayedText(""); // reset for typing

            const generatedMessage = response.data.data;

            // Typing function as a promise
            const typeMessage = (message: string) => {
              return new Promise<void>((resolve) => {
                let index = 0;
                const typingSpeed = 20;
                const type = () => {
                  if (index < message.length) {
                    setDisplayedText((prev: string) => (prev ?? "") + message[index]);
                    index++;
                    setTimeout(type, typingSpeed);
                  } else {
                    resolve();
                  }
                };
                type();
              });
            };

            // First finish typing, then fire API
            typeMessage(generatedMessage).then(() => {
              setIsTextGenerated(true);

              const payload = {
                comment: generatedMessage,
                post_url: null,
                comment_type: popupTriggeredFrom,
              };

              const requestUrl = apiService.EndPoint.createComments;

              apiService
                .commonAPIRequest(
                  requestUrl,
                  apiService.Method.post,
                  undefined, // No query params for this request
                  payload,
                  (result: any) => {
                    if (
                      result?.status === 201 &&
                      result?.data.message === "Comment created successfully"
                    ) {
                      // success
                      setSaveGeneratedMessageData?.(result?.data);
                    } else {
                      throw new Error(result.message || "Failed to create comment.");
                    }
                  }
                )
                .catch((err: any) => {
                  console.error("API error:", err);
                })
                .finally(() => {
                  setLoading(false);
                });
            });

            apiCalled = true;
          } else {
            setError("Failed to submit the comment. Please try again.");
            setLoading(false);
          }
        }
      );
    });
  };


  const insertContent = () => {
    if (
      popupTriggeredFrom === "comment" ||
      popupTriggeredFrom === "comment-reply" ||
      popupTriggeredFrom === "article-comment" ||
      popupTriggeredFrom === "article-comment-reply" ||
      popupTriggeredFrom === "message-reply"
    ) {
      insertGeneratedComment(displayedText, saveGeneratedMessageData || "");
    } else if (popupTriggeredFrom === "create-post") {
      insertGeneratedPost(displayedText, saveGeneratedMessageData || "");
    }
  };

  useEffect(() => {
    // Load saved selections from Chrome storage after removal
    chrome.storage.local.get(
      ["selectedLanguage", "selectedTone", "selectedMotive"],
      (result) => {
        if (result.selectedLanguage) {
          setLanguage(result.selectedLanguage);
        }
        if (result.selectedTone) {
          setTone(result.selectedTone);
        }
        if (result.selectedMotive) {
          setMotive(result.selectedMotive);
        }
        // Check if all data is present
        if (
          result.selectedLanguage &&
          result.selectedTone &&
          result.selectedMotive
        ) {
        } else {
        }
      }
    );
  }, []);

  useEffect(() => {
    // Save selections to Chrome storage whenever they change
    chrome.storage.local.set({
      selectedLanguage: language,
      selectedTone: tone,
      selectedMotive: motives,
    });
  }, [language, tone, motives]);

  const validateForm = () => {
    let newErrors: any = {};
    // check Original Message if popup is create-post
    if (!collectedText?.trim()) {
      newErrors.collectedText = (popupTriggeredFrom === "comment" || popupTriggeredFrom === "comment-reply" ? "Original Comment is required" : "Original Message is required");
    }

    // motive must not include "Motive"
    if (!motives || motives.includes("Motive")) {
      newErrors.motive = "Please select a valid motive";
    }

    // language must not equal "Language"
    if (!language || language === "Language") {
      newErrors.language = "Please select a valid language";
    }

    // tone must not include "Tone"
    if (!tone || tone.includes("Tone")) {
      newErrors.tone = "Please select a valid tone";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (collectedText?.trim()) {
      setErrors((prev) => ({ ...prev, collectedText: "" }));
    }
  }, [collectedText, popupTriggeredFrom]);

  useEffect(() => {
    if (motives && !motives.includes("Motive")) {
      setErrors((prev) => ({ ...prev, motive: "" }));
    }
  }, [motives]);

  useEffect(() => {
    if (language && language !== "Language") {
      setErrors((prev) => ({ ...prev, language: "" }));
    }
  }, [language]);

  useEffect(() => {
    if (tone && !tone.includes("Tone")) {
      setErrors((prev) => ({ ...prev, tone: "" }));
    }
  }, [tone]);


  return (
    <>
      <div
        className={`popup-overlay ${isOpen ? "open" : ""
          } fixed inset-0 flex items-center justify-center`}
      >
        <div
          className={`popup-container !w-[1200px] bg-white shadow-lg absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 overflow-hidden ${!activePlan ? "!w-[45rem]" : ""
            }`}
        >
          <div className="relative header-top p-9 py-4 flex justify-between item-center">
            <span className="relative p-logo border-[2.5px] border-solid rounded-full border-[#2563eb]">
              <img src={getImage("fLogo")} alt="img" className="" />
            </span>
            <h4 className="popup-title font-semibold text-xl leading-10">
              {/* {loading
                ? "Generate Message Reply"
                : "Generate Message Reply Ask to Eva"} */}
              Generate Message Reply Ask to Eva
            </h4>
            <span
              onClick={onClose}
              className="close-box w-6 h-6 bg-no-repeat bg-center cursor-pointer"
            >
              <img
                src={getImage("close")}
                alt="img"
                className="w-full h-full rounded-full"
              />
            </span>
          </div>
          {!isAuth && <SignIn />}
          {isAuth && activePlan ? (
            <React.Fragment>
              <div className="flex gap-4 w-full items-start">

                <div className="p-9 flex flex-col gap-5 w-1/2">
                  <div className="flex flex-col item-center gap-8">
                    {/* original 'comment-reply"  "Original Comment" "Original Message" "message-reply" textaria"*/}
                    {(popupTriggeredFrom === "comment" || popupTriggeredFrom === "comment-reply" || popupTriggeredFrom === "create-post" || popupTriggeredFrom === "message-reply") && (
                      <div className="w-full textarea-group relative">
                        <label className="block text-xl font-medium text-gray-700 ms-2">
                          {(popupTriggeredFrom === "comment" || popupTriggeredFrom === "comment-reply" ? "Original Comment" : "Original Message")}
                          <span className="text-red">*</span>
                        </label>
                        <div
                          className={`rounded-lg overflow-hidden border ${isActive ? "active" : "border-[#6b7280]"
                            } custom_textarea h-[150px] relative`}
                        >   <textarea
                            placeholder="No comment found?"
                            value={collectedText}
                            onChange={(e) => setCollectedText(e.target.value)}
                            onFocus={() => setisActive(true)}
                            onBlur={() => setisActive(false)}
                            className="popup-textarea w-full p-2 text-black focus:ring-0 border-0 resize-none"
                          /></div>
                        {errors.collectedText && (
                          <p className="text-red text-xl ms-1 absolute">{errors.collectedText}</p>
                        )}
                      </div>
                    )}
                    {/* addision text textaria */}
                    <div className="space-y-2">
                      <label className="block text-xl font-medium text-gray-700 ms-2">
                        Additional Message (Optional)
                      </label>
                      <div
                        className={`rounded-lg overflow-hidden border ${isContextActive ? "active" : "border-[#6b7280]"
                          } custom_textarea h-[150px]`}>
                        <textarea
                          placeholder="Any additional information about the sender..."
                          value={context}
                          onChange={(e) => setContext(e.target.value)}
                          onFocus={() => setIsContextActive(true)}
                          onBlur={() => setIsContextActive(false)}
                          className="popup-textarea w-full mt-1 !pt-6 focus:ring-0 border-0 text-black resize-none"
                        />
                      </div>
                    </div>

                    {/* Motive */}
                    <div className="w-full input-group">
                      <label className="block text-xl font-medium text-gray-700 ms-2">
                        Select Motive<span className="text-red">*</span>
                      </label>
                      <span className="relative">
                        <select
                          value={motives}
                          onChange={(e) => setMotive(e.target.value)}
                          className="popup-select w-full p-2 border border-gray-300 rounded-md"
                          disabled={loading}
                        >
                          {(popupTriggeredFrom === "create-post"
                            ? POSTING_MOTIVES
                            : COMMENT_MOTIVES
                          ).map((motive, index) => {
                            const textOnly = motive?.replace(/^[^\p{L}\p{N}\s]+/u, "").trim();
                            return (
                              <option key={index} value={textOnly}>
                                {motive}
                              </option>
                            );
                          })}
                        </select>
                      </span>
                      {errors.motive && (
                        <p className="text-red text-xl ms-1 absolute">{errors.motive}</p>
                      )}
                    </div>

                    <div className="flex gap-5">
                      {/* Language */}
                      <div className="w-full input-group">
                        <label className="block text-xl font-medium text-gray-700 ms-2">
                          Select Language<span className="text-red">*</span>
                        </label>
                        <span className="relative">
                          <img
                            src={getImage("translate")}
                            alt="img"
                            className="w-4 absolute left-3.5 !top-[5px]"
                          />
                          <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="popup-select data w-full p-2 border border-gray-300 rounded-md"
                            disabled={loading}
                          >
                            {LANGUAGES.map((lang, index) => (
                              <option key={index} value={lang}>
                                {lang}
                              </option>
                            ))}
                          </select>
                        </span>
                        {errors.language && (
                          <p className="text-red text-xl ms-1 absolute">{errors.language}</p>
                        )}
                      </div>

                      {/* Tone */}
                      <div className="w-full input-group">
                        <label className="block text-xl font-medium text-gray-700 ms-2">
                          Select Tone<span className="text-red">*</span>
                        </label>
                        <span className="relative">
                          <select
                            value={tone}
                            onChange={(e) => setTone(e.target.value)}
                            className="popup-select w-full p-2 border border-gray-300 rounded-md"
                            disabled={loading}
                          >
                            {TONES.map((toneOption, index) => {
                              const textOnly = toneOption
                                .replace(/^[^\p{L}\p{N}\s]+/u, "")
                                .trim();
                              return (
                                <option key={index} value={textOnly}>
                                  {toneOption}
                                </option>
                              );
                            })}
                          </select>
                        </span>
                        {errors.tone && (
                          <p className="text-red text-xl ms-1 absolute">{errors.tone}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Display Selected Options */}
                  <h4 className="!my-2.5 !mb-4 text-base font-medium flex items-center gap-1.5">
                    <span className="bg-[#f6f9fc] border border-[#e0eaf3] py-[3px] px-[10px] text-black">
                      Motive:{" "}
                      <span className="font-semibold text-[#545c66]">
                        {motives}
                      </span>
                    </span>
                    <span className="bg-[#f6f9fc] border border-[#e0eaf3] py-[3px] px-[10px] text-black">
                      Language:{" "}
                      <span className="font-semibold text-[#545c66]">
                        {language}
                      </span>
                    </span>
                    <span className="bg-[#f6f9fc] border border-[#e0eaf3] py-[3px] px-[10px] text-black">
                      Tone:{" "}
                      <span className="font-semibold text-[#545c66]">
                        {tone}
                      </span>
                    </span>
                  </h4>

                  {/* Generate Reply Button - always visible */}
                  <div className="mb-2">
                    <button
                      className={`flex gap-2 leading-6 popup-button-submit px-4 py-2 h-[4rem] rounded-[8px] justify-center text-white w-[55rem] bg-green hover:bg-[#008234] ${isTextGenerated ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      onClick={handleSubmit}
                      // disabled={loading}
                      disabled={loading || isTextGenerated}
                    >
                      <img
                        src={getImage("sendIcon")}
                        alt="img"
                        className="w-4 !static text-black"
                      />
                      {loading ? "Generating..." : "Generate Reply"}
                    </button>
                  </div>

                  {/* Best Practices */}
                  <div
                    style={{
                      backgroundColor:
                        "rgb(200 255 217 / var(--tw-bg-opacity, 1))",
                    }}
                    className="p-4 rounded-lg message-reply mt-4"
                  >
                    <h3 className="font-semibold text-[#2563eb] flex items-center gap-2">
                      💬 Messaging Best Practices:
                    </h3>
                    <ul className="list-disc list-inside text-xl text-gray-700 mt-2 space-y-1">
                      <li>Respond within 1-2 minute</li>
                      <li>Personalize with specific details</li>
                      <li>Always provide clear next steps</li>
                      <li>Keep messages concise and scannable</li>
                    </ul>
                  </div>
                </div>

                {/* Output Section */}
                <div className="border-none bg-white/80 backdrop-blur-sm rounded-xl pt-9 pe-9 w-1/2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-semibold text-2xl">
                      <FileText className="w-5 h-5 text-[#16a34a]" />
                      Generated Post
                    </div>
                    {isTextGenerated && (
                      <div className="flex items-center gap-4">
                        <button
                          onClick={handleSubmit}
                          className="rounded-lg hover:bg-[#f1f5f9]"
                        >
                          <RefreshCw className="w-6 h-6" />
                        </button>
                        <button
                          onClick={handleCopy}
                          className="rounded-lg hover:bg-[#f1f5f9]"
                        >
                          <Copy className="w-6 h-6" />
                        </button>
                      </div>
                    )}
                  </div>

                  {(isTextGenerated || displayedText.length > 0) ? (
                    <div className=" space-y-4">
                      {/* Post Preview */}
                      <div className="border border-[#6b7280] rounded-lg bg-[#f8fafc] whitespace-pre-wrap text-xl text-[#1e293b] !h-[700px] !overflow-auto p-6 ">
                        {displayedText}
                      </div>

                      <div className="flex gap-5">
                        {/* Insert Button - only visible after text is generated */}
                        <button
                          className="popup-button-insert px-4 py-2 h-[4rem] w-[28rem] bg-[#2563eb] text-white rounded-md hover:bg-green-600"
                          onClick={insertContent}
                          disabled={loading}
                        >
                          Insert
                        </button>
                        {/* Regenerate Button - only visible after text is generated */}
                        <button
                          className="flex gap-2 leading-6 popup-button-submit px-4 py-2 h-[4rem] rounded-[8px] justify-center text-white w-[28rem] bg-green hover:bg-[#008234]"
                          onClick={handleSubmit}
                          disabled={loading}
                        >
                          <img
                            src={getImage("sendIcon")}
                            alt="img"
                            className="w-8 !static text-black"
                          />
                          Regenerate
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 h-[760px] flex flex-col justify-center rounded-lg border border-[#6b7280]">
                      <div className="w-20 h-20 bg-[#f1f5f9] rounded-full flex items-center justify-center mx-auto">
                        <FileText className="w-12 h-12 text-[#94a3b8]" />
                      </div>
                      <p className="text-[#64748b] font-medium !text-2xl mb-2">
                        No post generated yet
                      </p>
                      <div className="!text-xl text-[#94a3b8]">
                        Fill out the form and click "Generate Post" to get started
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </React.Fragment>
          ) : (
            <>
              <div className="p-9 flex flex-col gap-5 item-center ">
                <span className="text-center text-5xl font-bold text-red">
                  !! Alert !!
                </span>
                <span className="text-justify">
                  Hey User, you don’t have an active plan on Evarobo
                  yet.Subscribe now and start enjoying all the amazing features!
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default InputAiPopup;
