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

export interface LinkedInMessage {
  messageSpeaker: string;
  messageText: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  postData: PostData;
  insertGeneratedComment: (comment: string) => void;
  insertGeneratedPost: (post: string) => void;
  popupTriggeredFrom: string;
  articleInfo?: ArticleInfo | null;
  lastMessages: LinkedInMessage[];
  post_url?: string;
  activePlan?: boolean;
  collectedText?: string;
  setCollectedText: React.Dispatch<React.SetStateAction<string | undefined>>;
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
  setCollectedText
}) => {
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [tone, setTone] = useState(TONES[0]);
  const [motives, setMotive] = useState(
    popupTriggeredFrom === "create-post"
      ? POSTING_MOTIVES[0]
      : COMMENT_MOTIVES[0]
  );

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAuth, setIsAuth] = useState(true);
  const [isTextGenerated, setIsTextGenerated] = useState(false);
  let apiCalled = false;
  const [newUser, setNewUser] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [isActive, setisActive] = useState(false);
  const [isGenerateActive, setIsGenerateActive] = useState(false);

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
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    const currentUrl = window.location.href;
    let platform = currentUrl.includes("linkedin.com")
      ? "linkedin"
      : currentUrl.includes("x.com")
        ? "twitter"
        : "";

    const currentUserName = getCurrentLinkedInUsernameFromLocalStorage();

    // Fetch auth token before sending the request
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
        postText: collectedText,
        authorName: postData.postAutherName,
        platform,
        command: text.length > 0 ? text : collectedText,
        contentType: popupTriggeredFrom,
        commentAuthorName: postData.commentAuthorName,
        commentText: postData.commentText,
        goal: removeEmoji((motives ?? '').replace(/^[^\p{L}\p{N}\s]+/u, "").trim()),
        articleInfo,
        lastMessages,
        currentUserName,
        authToken,
      };

      chrome.runtime.sendMessage(
        { type: "GENERATE_CONTENT", data: requestData },
        (response) => {
          if (response.success && !apiCalled) {
            setLoading(true);
            setDisplayedText(""); // Reset displayed text for typing animation

            const generatedMessage = response.data.data;
            let index = -1;
            const typingSpeed = 20; // Speed of typing in milliseconds

            const type = () => {
              index++;
              if (index < generatedMessage.length) {
                setDisplayedText((prev) => prev + generatedMessage[index]);
                setTimeout(type, typingSpeed);
              } else {
                setLoading(false); // Enable buttons after typing completes
                setIsTextGenerated(true);
              }
            };

            type();

            apiCalled = true;

            const payload = {
              comment: response.data.data,
              post_url: post_url ? post_url : window.location.href,
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
                  } else {
                    throw new Error(
                      result.message || "Failed to create comment."
                    );
                  }
                }
              )
              .catch((err: any) => {
                console.error("API error:", err);
              })
              .finally(() => {
                setLoading(false);
              });
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
      insertGeneratedComment(displayedText);
    } else if (popupTriggeredFrom === "create-post") {
      insertGeneratedPost(displayedText);
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
          setNewUser(false);
        } else {
          setNewUser(true);
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
          } fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 `}
      >
        <div
          className={`popup-container bg-white shadow-lg absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 overflow-hidden ${!activePlan ? "!w-[45rem]" : ""
            }`}
        >
          <div className="relative header-top p-9 py-4 flex justify-between item-center">
            <span className="relative p-logo border-[2.5px] border-solid rounded-full border-[#2563eb]">
              <img src={getImage("fLogo")} alt="img" className="" />
            </span>
            <h4 className="popup-title font-semibold text-xl leading-10">
              {loading
                ? "Generate Message Reply"
                : "Generate Message Reply Ask to Eva"}
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
            newUser ? (
              <React.Fragment>
                <div className="p-9 flex flex-col gap-5 item-center">
                  <div className="grid grid-cols-1 gap-5">
                    <div className="w-full input-group flex-col col-span-1">
                      <div className="flex flex-col gap-5 item-center">
                        <div className="flex flex-col gap-8 item-center">
                          {/* original Message only reply */}
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

                          {/* Generate Message */}
                          <div className="w-full textarea-group relative">
                            <label className="block text-xl font-medium text-gray-700 ms-2">
                              Generate Message
                            </label>
                            <div
                              className={`rounded-lg overflow-hidden border ${isGenerateActive ? "active" : "border-[#6b7280]"
                                } custom_textarea h-[150px]`}
                            >
                              {/* Copy Button - sibling of textarea */}
                              <span
                                onClick={handleCopy}
                                className={`c-btn flex gap-1 items-center absolute right-3.5 top-9 cursor-pointer text-[#585858] ${loading ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
                                  }`}
                              >
                                {/* {copied ? "Copied!" : "Copy"} */}
                                <img src={getImage("copyIcon")} alt="img" className="w-4" />
                              </span>

                              <textarea
                                placeholder="AI generated message will appear here..."
                                value={loading ? displayedText : isTextGenerated ? displayedText : text}
                                ref={textareaRef}
                                onChange={(e) => {
                                  if (!loading) setText(e.target.value);
                                }}
                                onFocus={() => setIsGenerateActive(true)}
                                onBlur={() => setIsGenerateActive(false)}
                                className="popup-textarea w-full mt-1 !pt-6 focus:ring-0 border-0 text-black resize-none"
                                disabled={loading}
                              ></textarea>
                            </div>
                            <p className="text-xl text-[#8c97a9] mt-1">
                              💡 This is the AI generated response
                            </p>
                          </div>

                          {/* Select Motive */}
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
                            {/* Select Language */}
                            <div className="w-full input-group">
                              <label className="block text-xl font-medium text-gray-700 ms-2">
                                Select Language<span className="text-red">*</span>
                              </label>
                              <span className="relative">
                                {/* <img
                                  src={getImage("translate")}
                                  alt="img"
                                  className="w-4 absolute left-3.5 !top-[5px]"
                                /> */}
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

                            {/* Select Tone */}
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

                        {/* Selected Info */}
                        <h4 className="!my-0 text-base font-medium flex items-center gap-1.5 *:dec-color *:background-three *:px-2.5 *:rounded-3xl">
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

                        {/* Action Buttons */}
                        <div className="justify-end space-x-2 text-right relative flex">
                          {isTextGenerated && (
                            <button
                              className="popup-button-insert px-4 py-2 bg-[#2563eb] text-white rounded-md hover:bg-green-600"
                              onClick={insertContent}
                              disabled={loading}
                            >
                              Insert
                            </button>
                          )}
                          <button
                            className={`flex gap-2 ml-auto leading-6 popup-button-submit px-4 py-2 w-[56rem] h-[4rem] justify-center bg-green text-white rounded-md hover:bg-[#008234] disabled:bg-gray4`}
                            onClick={handleSubmit}
                            disabled={loading}
                          >
                            <img
                              src={getImage("sendIcon")}
                              alt="img"
                              className="w-4 !static text-black"
                            />
                            {loading
                              ? isTextGenerated
                                ? "Regenerating..."
                                : "Generating..."
                              : isTextGenerated
                                ? "Regenerate"
                                : "Generate Reply"}
                          </button>

                          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full text-left">
                            {error && (
                              <div className="popup-error text-red-500 mt-0">
                                {error}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Best Practices */}
                      <div
                        style={{
                          backgroundColor:
                            "rgb(200 255 217 / var(--tw-bg-opacity, 1))",
                        }}
                        className="p-4 rounded-lg message-reply mt-8"
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

                    {/* Evalogo (always visible now) */}
                    {/* <div className="w-full">
                      <Evalogo />
                    </div> */}
                  </div>
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {loading ? (
                  <div className="flex flex-col gap-5 item-center">
                    <div className="w-full relative ms-4 mt-4">
                      <label className="block text-2xl font-medium text-gray-700 ms-9">
                        Original Message auto Generate
                      </label>
                      <span className="text-black rounded-lg">
                        <textarea
                          placeholder="AI generated message will appear here..."
                          value={
                            loading
                              ? displayedText
                              : isTextGenerated
                                ? displayedText
                                : text
                          }
                          ref={textareaRef}
                          onChange={(e) => {
                            if (!loading) setText(e.target.value);
                          }}
                          className="w-[93%] text-xl mt-1 m-4 mb-0 h-[52rem] resize-none border rounded-lg p-4"
                          disabled={loading}
                        ></textarea>
                      </span>
                    </div>

                    <div className="justify-center gap-2 relative flex m-4 mt-0 ">
                      {isTextGenerated && (
                        <button
                          className="popup-button-insert px-4 py-2 h-[4rem] w-[28rem] bg-[#2563eb] text-white rounded-md hover:bg-green-600"
                          onClick={insertContent}
                          disabled={loading}
                        >
                          Insert
                        </button>
                      )}

                      <button
                        className={`flex gap-4 leading-6 px-4 py-2 popup-button-submit h-[4rem] rounded-[8px] mb-4 justify-center text-white
            ${isTextGenerated
                            ? "w-[11rem] bg-green hover:bg-[#008234]"
                            : "w-[56rem] bg-green hover:bg-[#008234]"
                          }
            disabled:bg-gray4`}
                        onClick={handleSubmit}
                        disabled={loading}
                      >
                        <img
                          src={getImage("sendIcon")}
                          alt="img"
                          className="w-4 !static text-black"
                        />
                        {loading
                          ? isTextGenerated
                            ? "Regenerating..."
                            : "Generating..."
                          : isTextGenerated
                            ? "Regenerate"
                            : "Generate Reply"}
                      </button>

                      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full text-left">
                        {error && (
                          <div className="popup-error text-red-500 mt-0">
                            {error}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-9 flex flex-col gap-5 item-center">
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

                      {/* Generate Message */}
                      <div className="w-full textarea-group relative">
                        <label className="block text-xl font-medium text-gray-700 ms-2">
                          Generate Message
                        </label>

                        <div
                          className={`rounded-lg overflow-hidden border ${isGenerateActive ? "active" : "border-[#6b7280]"
                            } custom_textarea h-[150px]`}
                        >
                          <span
                            onClick={handleCopy}
                            className={`c-btn flex gap-1 items-center absolute right-3.5 top-9 cursor-pointer text-[#585858] ${loading ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
                              }`}
                          >
                            {/* {copied ? "Copied!" : "Copy"} */}
                            <img src={getImage("copyIcon")} alt="img" className="w-4" />
                          </span>
                          <textarea
                            placeholder="AI generated message will appear here..."
                            value={
                              loading
                                ? displayedText
                                : isTextGenerated
                                  ? displayedText
                                  : text
                            }
                            ref={textareaRef}
                            onChange={(e) => {
                              if (!loading) setText(e.target.value);
                            }}
                            onFocus={() => setIsGenerateActive(true)}
                            onBlur={() => setIsGenerateActive(false)}
                            className="popup-textarea w-full mt-1 !pt-6 focus:ring-0 border-0 text-black resize-none aaa"
                            disabled={loading}
                          ></textarea>
                        </div>
                        <p className="text-xl text-[#8c97a9] mt-1">
                          💡 This is the AI generated response
                        </p>
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

                    {/* Submit Buttons */}
                    <div className="justify-end space-x-2 text-right relative flex">
                      {isTextGenerated && (
                        <button
                          className="popup-button-insert px-4 py-2 h-[4rem] w-[28rem] bg-[#2563eb] text-white rounded-md hover:bg-green-600"
                          onClick={insertContent}
                          disabled={loading}
                        >
                          Insert
                        </button>
                      )}

                      <button
                        className={`flex gap-2 ml-auto leading-6 popup-button-submit px-4 py-2 h-[4rem] rounded-[8px] justify-center text-white
            ${isTextGenerated
                            ? "w-[11rem] bg-green hover:bg-[#008234]"
                            : "w-[56rem] bg-green hover:bg-[#008234]"
                          }
            disabled:bg-gray4`}
                        onClick={handleSubmit}
                        disabled={loading}
                      >
                        <img
                          src={getImage("sendIcon")}
                          alt="img"
                          className="w-4 !static text-black"
                        />
                        {loading
                          ? isTextGenerated
                            ? "Regenerating..."
                            : "Generating..."
                          : isTextGenerated
                            ? "Regenerate"
                            : "Generate Reply"}
                      </button>

                      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full text-left">
                        {error && (
                          <div className="popup-error text-red-500 mt-0">
                            {error}
                          </div>
                        )}
                      </div>
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
                )}
              </React.Fragment>
            )
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
