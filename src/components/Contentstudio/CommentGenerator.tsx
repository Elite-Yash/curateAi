import { useEffect, useState } from "react";
import {
  MessageCircle,
  Copy,
  RefreshCw,
  Sparkles,
  Link as LinkIcon,
} from "lucide-react";
import { getCurrentLinkedInUsernameFromLocalStorage } from "../../helpers/commonHelper";
import { apiService } from "../../common/config/apiService";
import {
  TONES,
  LANGUAGES,
  COMMENT_MOTIVES,
} from "../../constants/constants";
import { getImage } from "../../common/utils/logoUtils";
import { removeEmoji } from "../../common/utils/removeicon";
import { selectActivePlanValue } from "../../redux/selector/activePlanSelector";
import { useSelector } from "react-redux";
import ActivePlanModal from "../activeplanModal/activeplanmodal";


interface ModalProps {
  post_url?: string;
  popupTriggeredFrom: "comment" ;
}

const CommentGenerator: React.FC<ModalProps> = ({ post_url, popupTriggeredFrom }) => {
  const [commentContext, setCommentContext] = useState("");
  const [generatedComment, setGeneratedComment] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [ispostContextActive, setIspostContextActive] = useState(false);
  const [error, setError] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  // ✅ Missing states added
  const [motive, setMotive] = useState(COMMENT_MOTIVES[0]);
  const [tone, setTone] = useState(TONES[0]);
  const [language, setLanguage] = useState(LANGUAGES[0]);
    const [showPlanAlert, setShowPlanAlert] = useState(false);
  const activePlanValue = useSelector(selectActivePlanValue);

  const handleSubmit = () => {

     if (!activePlanValue) {
      setShowPlanAlert(true);
      return;
    }

        if (!validateForm()) return;

    setIsGenerating(true);
    setError("");

    let platform = "linkedin";
    const currentUserName = getCurrentLinkedInUsernameFromLocalStorage();

    chrome.runtime.sendMessage({ type: "getCookies" }, (response) => {
      if (!response || !response.success || !response.token) {
        setError("Failed to retrieve auth token.");
        setIsGenerating(false);
        return;
      }

      let apiCalled = false;
      const authToken = response.token;

      const requestData = {
        language,
        tone: removeEmoji(tone.toString().trim()),
        postText: commentContext,
        authorName: "",
        platform,
        command: commentContext,
        contentType: popupTriggeredFrom,
        goal: removeEmoji((motive ?? '').toString().trim()),
        articleInfo: {},
        lastMessages: [],
        currentUserName,
        authToken,
      };

      chrome.runtime.sendMessage(
        { type: "GENERATE_CONTENT", data: requestData },
        (response) => {
          console.log(". ~ generatePost ~ response:", response);
          if (response?.success && !apiCalled) {
            const generatedMessage = response.data?.data || "";

            // animate typing
            let index = -1;
            const typingSpeed = 20;
            const type = () => {
              index++;
              if (index < generatedMessage.length) {
                setGeneratedComment((prev) => prev + generatedMessage[index]);
                setTimeout(type, typingSpeed);
              } else {
                setIsGenerating(false);
              }
            };
            type();
            apiCalled = true;


            // ✅ FIXED payload field name
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
                  } else {
                    throw new Error(result?.message || "Failed to create post.");
                  }
                }
              )
              .catch((err: any) => {
                console.error("API error:", err);
              })
              .finally(() => {
                setIsGenerating(false);
              });
          } else {
            setError("Failed to generate post. Please try again.");
            setIsGenerating(false);
          }
        }
      );
    });
  };

  const copyToClipboard = () => {
    if (generatedComment) {
      navigator.clipboard.writeText(generatedComment);
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
      if (popupTriggeredFrom === "comment" && !commentContext?.trim()) {
        newErrors.commentContext = "Original Message is required";
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
      if (popupTriggeredFrom === "comment" && commentContext?.trim()) {
        setErrors((prev) => ({ ...prev, commentContext: "" }));
      }
    }, [commentContext, popupTriggeredFrom]);
  
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
      <div className="shadow-lg bg-white rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-2 font-semibold text-base">
          <MessageCircle className="w-5 h-5 text-[#ff5c35]" />
          Generate LinkedIn Comment
        </div>

        {/* Post Context */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#334155]">
            What do you want to comment about? <span className="text-red">*</span>
          </label>
          <div
            className={`rounded-lg overflow-hidden border ${ispostContextActive ? "active" : "border-[#e2e8f0]"
              } custom_textarea relative`}
          >
            <textarea
              placeholder="Write your LinkedIn post idea here..."
              value={commentContext}
              onChange={(e) => setCommentContext(e.target.value)}
              onFocus={() => setIspostContextActive(true)}
              onBlur={() => setIspostContextActive(false)}
              className="w-full min-h-24 h-full p-2 outline-none text-sm resize-none focus:ring-0 border-0"
            />
          </div>
          <div className="text-sm text-[#8c97a9] mt-0">
            💡 Write clearly for better generated results
          </div>
          {errors.commentContext && (
            <p className="text-red !text-sm ms-1 !mt-0 absolute">{errors.commentContext}</p>
          )}
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
            className="w-full p-2 border text-sm rounded-md border-[#e2e8f0] focus:outline-none focus:ring-1 focus:ring-[#ff5c35] focus:border-[#ff5c35]"
            disabled={isGenerating}
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
          <label className="text-sm font-medium">Select Tone <span className="text-red">*</span></label>
        <span className="relative">
            <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full p-2 border text-sm rounded-md border-[#e2e8f0] focus:outline-none focus:ring-1 focus:ring-[#ff5c35] focus:border-[#ff5c35]"
            disabled={isGenerating}
          >
            {TONES.map((toneOption, index) => (
              <option key={index} value={toneOption}>
                {toneOption}
              </option>
            ))}
          </select>
           {errors.tone && (
            <p className="text-red !text-sm ms-1 !mt-0 absolute">{errors.tone}</p>
          )}
        </span>
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
              className="w-full p-2 border text-sm rounded-md border-[#e2e8f0] pl-[30px] focus:outline-none focus:ring-1 focus:ring-[#ff5c35] focus:border-[#ff5c35]"
              disabled={isGenerating}
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
          className="w-full flex items-center justify-center gap-2 bg-[#ff5c35] text-white font-medium py-2 px-4 rounded-lg transition"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Generating Post...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Post
            </>
          )}
        </button>

        {/* Tips */}
        <div className="p-4 bg-[#ff5c350f] rounded-lg">
          <div className="font-semibold text-base mb-2">
            💡 Tips for better posts:
          </div>
          <ul className="text-sm space-y-1">  
            <li>• Add personal insights or experiences</li>
            <li>• Ask thoughtful follow-up questions</li>
            <li>• Tag relevant people when appropriate</li>
            <li>• Keep comments concise but meaningful</li>
          </ul>
        </div>

      </div>

      {/* Output Section */}
      <div className="shadow-lg bg-white rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 font-semibold text-base">
            <MessageCircle className="w-5 h-5 text-[#ff5c35]" />
            Generated Comment
          </div>
          {generatedComment && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleSubmit}
                className="p-2 rounded-lg hover:bg-[#f1f5f9]"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={copyToClipboard}
                className="p-2 rounded-lg hover:bg-[#f1f5f9]"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {generatedComment ? (
          <div className="space-y-4">
            <div className="p-4 border border-[#e2e8f0] rounded-lg bg-[#f8fafc] whitespace-pre-wrap text-sm text-[#1e293b] !h-125 !overflow-auto">
              {generatedComment}
            </div>
            {/* <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <span>{generatedComment.length} characters</span>
                <span>{generatedComment.split(" ").length} words</span>
              </div>
              <span className="px-2 py-1 border border-[#ff5c35] text-[#ff5c35] hover:bg-[#ff5c35] hover:text-white transition rounded-lg cursor-pointer">
                Ready to post
              </span>
            </div> */}
            <div className="flex gap-3">
              <button
                onClick={copyToClipboard}
                className="flex-1 flex items-center justify-center gap-2 border text-sm font-medium rounded-lg border-[#ff5c35] text-[#ff5c35] hover:bg-[#ff5c35] hover:text-white transition"
              >
                <Copy className="w-4 h-4" />
                 {copied ? "Comment Copied!" : "Copy Comment"}
              </button>
              <button className="flex-1 flex items-center justify-center rounded-lg gap-2 bg-[#ff5c35] text-white py-2">
                <LinkIcon className="w-4 h-4" />
                Go to LinkedIn
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[#ff5c350f] rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-[#ff5c35]" />
            </div>
            <p className="font-medium text-[#64748b] !text-xl mb-2">
              No Comment generated yet
            </p>
            <p className="!text-base text-[#94a3b8]">
              Write your idea and select a style to get started
            </p>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default CommentGenerator;