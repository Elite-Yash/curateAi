import React, { useEffect, useState } from "react";
import {
  MessageSquare,
  Copy,
  RefreshCw,
  Send,
  User,
  Sparkles,
} from "lucide-react";
import {
  TONES,
  COMMENT_MOTIVES,
  LANGUAGES,
} from "../../constants/constants";
import { apiService } from "../../common/config/apiService";
import { getCurrentLinkedInUsernameFromLocalStorage } from "../../helpers/commonHelper";
import { getImage } from "../../common/utils/logoUtils";
import { removeEmoji } from "../../common/utils/removeicon";
import { useSelector } from "react-redux";
import { selectActivePlanValue } from "../../redux/selector/activePlanSelector";
import ActivePlanModal from "../activeplanModal/activeplanmodal";


interface ModalProps {
  insertGeneratedComment?: (comment: string) => void;
  insertGeneratedPost?: (post: string) => void;
  post_url?: string;
  activePlan?: boolean;
  popupTriggeredFrom: "message-reply";
}

const MessageReplyGenerator: React.FC<ModalProps> = ({
  post_url,
  popupTriggeredFrom,
}) => {
  const [messageReply, setMessageReply] = useState("");
  const [context, setContext] = useState("");
  const [generatedReply, setGeneratedReply] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAuth, setIsAuth] = useState(true);
  const [displayedText, setDisplayedText] = useState("");
  const [isTextGenerated, setIsTextGenerated] = useState(false);

  const [isOriginalActive, setIsOriginalActive] = useState(false);
  const [isContextActive, setIsContextActive] = useState(false);

  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [tone, setTone] = useState(TONES[0]);
  const [motive, setMotive] = useState(COMMENT_MOTIVES[0]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [showPlanAlert, setShowPlanAlert] = useState(false);
  const activePlanValue = useSelector(selectActivePlanValue);

  // fake defaults (replace with real data later)
  const articleInfo = {};
  const lastMessages: string[] = [];
  let apiCalled = false;

  const handleSubmit = () => {
    if (!activePlanValue) {
      setShowPlanAlert(true);
      return;
    }


    if (!validateForm()) return;
    setIsGenerating(true);
    setLoading(true);
    setError("");

    let platform = 'linkedin';
    const currentUserName = getCurrentLinkedInUsernameFromLocalStorage();

    // Fetch auth token before sending the request
    chrome.runtime.sendMessage({ type: "getCookies" }, (response) => {
      if (!response || !response.success || !response.token) {
        setError("Failed to retrieve auth token.");
        setLoading(false);
        setIsAuth(true);
        setIsGenerating(false);
        return;
      }

      const authToken = response.token;

      const requestData = {
        language,
        tone: removeEmoji(tone.toString().trim()),
        postText: messageReply || '',
        authorName: '',
        platform,
        command: context.length > 0 ? context : messageReply,
        contentType: popupTriggeredFrom,
        commentAuthorName: '',
        commentText: '',
        goal: removeEmoji((motive ?? '').toString().trim()),
        articleInfo,
        lastMessages,
        currentUserName,
        authToken,
      };

      chrome.runtime.sendMessage(
        { type: "GENERATE_CONTENT", data: requestData },
        (response) => {
          if (response?.success && !apiCalled) {
            setLoading(true);
            setDisplayedText("");
            setGeneratedReply(""); // reset before new typing animation

            const generatedMessage = response.data?.data || "";
            // setGeneratedReply(generatedMessage);
            let index = -1;
            const typingSpeed = 20;

            const type = () => {
              index++;
              if (index < generatedMessage.length) {
                setGeneratedReply((prev) => prev + generatedMessage[index]);
                setTimeout(type, typingSpeed);
              } else {
                setLoading(false);
                setIsTextGenerated(true);
                setIsGenerating(false);
              }
            };

            type();
            apiCalled = true;

            const payload = {
              comment: generatedMessage,
              post_url: post_url ? post_url : window.location.href,
            };

            const requestUrl = apiService.EndPoint.createComments;

            apiService
              .commonAPIRequest(
                requestUrl,
                apiService.Method.post,
                undefined,
                payload,
                (result: any) => {
                  if (
                    result?.status === 201 &&
                    result?.data.message === "Comment created successfully"
                  ) {
                    console.log("Comment created successfully");
                  } else {
                    throw new Error(
                      result?.message || "Failed to create comment."
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
            setIsGenerating(false);
          }
        }
      );
    });
  };

  const copyToClipboard = () => {
    if (generatedReply) {
      navigator.clipboard.writeText(generatedReply);
      setCopied(true);
    }
    setTimeout(() => {
      setCopied(false);
    }, 2000);
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
          console.log("⚠️ Some data missing in storage, resetting...");
          setLanguage("Language");
          setTone("Tone");
          setMotive("Motive");
        }
      }
    );
  }, []);

  useEffect(() => {
    // Save selections to Chrome storage whenever they change
    chrome.storage.local.set({
      selectedLanguage: language,
      selectedTone: tone,
      selectedMotive: motive,
    });
  }, [language, tone, motive]);


  const validateForm = () => {
    let newErrors: any = {};

    // check Original Message if popup is create-post
    if (popupTriggeredFrom === "message-reply" && !messageReply?.trim()) {
      newErrors.messageReply = "Original Message is required";
    }

    // motive must not include "Motive"
    if (!motive || motive.includes("Motive")) {
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
    if (popupTriggeredFrom === "message-reply" && messageReply?.trim()) {
      setErrors((prev) => ({ ...prev, messageReply: "" }));
    }
  }, [messageReply, popupTriggeredFrom]);

  useEffect(() => {
    if (motive && !motive.includes("Motive")) {
      setErrors((prev) => ({ ...prev, motive: "" }));
    }
  }, [motive]);

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
      {(showPlanAlert && !activePlanValue) && (
        <>
          <ActivePlanModal
            isOpen={showPlanAlert}
            onClose={() => setShowPlanAlert(false)}
          />
        </>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="border-none shadow-lg bg-white/80 backdrop-blur-sm rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-2 font-semibold text-base mb-6">
            <MessageSquare className="w-5 h-5 text-[#00B247]" />
            Generate Message Reply
          </div>

          {/* Original Message */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Original Message <span className="text-red">*</span>
            </label>
            <div
              className={`rounded-lg overflow-hidden border ${isOriginalActive ? "active" : "border-[#cbd5e1]"
                } custom_textarea relative`}
            >
              <textarea
                placeholder="Paste the LinkedIn message you received..."
                value={messageReply}
                onChange={(e) => setMessageReply(e.target.value)}
                onFocus={() => setIsOriginalActive(true)}
                onBlur={() => setIsOriginalActive(false)}
                className="w-full min-h-24 p-2 text-sm resize-none focus:ring-0 border-0"
              />
            </div>
            {errors.messageReply && (
              <p className="text-red !text-sm ms-1 !mt-0 absolute">{errors.messageReply}</p>
            )}
          </div>

          {/* Additional Context */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Additional Context (Optional)
            </label>
            <div
              className={`rounded-lg overflow-hidden border ${isContextActive ? "active" : "border-[#cbd5e1]"
                } custom_textarea`}
            >
              <textarea
                placeholder="Any additional information about the sender..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                onFocus={() => setIsContextActive(true)}
                onBlur={() => setIsContextActive(false)}
                className="w-full min-h-24 p-2 text-sm resize-none focus:ring-0 border-0"
              />
            </div>
          </div>

          {/* Motive */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Select Motive <span className="text-red">*</span>
            </label>
            <span className="relative">
              <select
                value={motive}
                onChange={(e) => setMotive(e.target.value)}
                className="w-full p-2 border text-sm rounded-md border-[#cbd5e1]"
                disabled={loading}
              >
                {COMMENT_MOTIVES.map((motive, index) => (
                  <option key={index} value={motive}>
                    {motive}
                  </option>
                ))}
              </select>
            </span>
            {errors.motive && (
              <p className="text-red !text-sm ms-1 !mt-0 absolute">{errors.motive}</p>
            )}
          </div>

          {/* Tone */}
          <div className="space-y-2">
            <label className="text-sm font-medium ">
              Select Tone <span className="text-red">*</span>
            </label>
            <span className="relative">
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full p-2 border text-sm rounded-md border-[#cbd5e1]"
                disabled={loading}
              >
                {TONES.map((toneOption, index) => (
                  <option key={index} value={toneOption}>
                    {toneOption}
                  </option>
                ))}
              </select>
            </span>
            {errors.tone && (
              <p className="text-red !text-sm ms-1 !mt-0 absolute">{errors.tone}</p>
            )}
          </div>

          {/* Language */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Select Language <span className="text-red">*</span>
            </label>
            <span className="relative">
              <img
                src={getImage("translate")}
                alt="img"
                className="w-4 absolute left-[11px] top-[50%] -translate-y-[50%]"
              />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-2 border text-sm rounded-md border-[#cbd5e1] pl-[30px]"
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
              <p className="text-red !text-sm ms-1 !mt-0 absolute">{errors.language}</p>
            )}
          </div>

          {/* Generate Button */}
          <button
            onClick={handleSubmit}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 bg-green hover:bg-[#008234] text-white px-4 py-2 rounded-lg transition"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Reply
              </>
            )}
          </button>


        </div>

        {/* Output Section */}
        <div className="border-none shadow-lg bg-white/80 backdrop-blur-sm rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 first-line: font-semibold text-base">
              <Send className="w-5 h-5 text-[#16a34a]" />
              Generated Reply
            </div>
            {generatedReply && (
              <div className="flex items-center gap-2">
                <button onClick={handleSubmit} className="p-2 hover:bg-slate-100 rounded">
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button onClick={copyToClipboard} className="p-2 hover:bg-slate-100 rounded">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {generatedReply ? (
            <div className="space-y-4">
              <div className="p-4 border border-[#cbd5e1] rounded-lg bg-slate-50">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 bg-[#edfdf2] rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-green" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="font-medium text-sm">You</span>
                      <span className="text-xs text-slate-500">• Draft</span>
                    </div>
                  </div>
                </div>
                <div className="">
                  <div className="whitespace-pre-wrap text-sm text-[#1e293b] !h-125 !overflow-auto">
                    {generatedReply}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 px-4 py-2  border text-sm font-medium rounded-lg border-[#2563eb] text-[#2563eb] hover:bg-[#2563eb] hover:text-white transition flex items-center justify-center"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copied ? "Reply Copied!" : "Copy Reply"}
                </button>
                <button className="flex-1 px-4 py-2 rounded-lg  bg-green hover:bg-[#008234] text-white flex items-center justify-center">
                  <Send className="w-4 h-4 mr-2" />
                  Open LinkedIn
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#f1f5f9] rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-[#94a3b8]" />
              </div>
              <p className="text-[#64748b] font-medium !text-xl mb-2">
                No reply generated yet
              </p>
              <div className="!text-base text-[#94a3b8]">
                Paste the original message and choose your reply style to get
                started
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MessageReplyGenerator;