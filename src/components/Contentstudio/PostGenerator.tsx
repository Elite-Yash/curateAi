import { useEffect, useState } from "react";
import {
  FileText,
  RefreshCw,
  Copy,
  Send,
  Sparkles,
  Wand2,
} from "lucide-react";
import {
  TONES,
  POSTING_MOTIVES,
  LANGUAGES,
} from "../../constants/constants";
import { apiService } from "../../common/config/apiService";
import { getCurrentLinkedInUsernameFromLocalStorage } from "../../helpers/commonHelper";
import { getImage } from "../../common/utils/logoUtils";
import { removeEmoji } from "../../common/utils/removeicon";
import ActivePlanModal from "../activeplanModal/activeplanmodal";
import { useSelector } from "react-redux";
import { selectActivePlanValue } from "../../redux/selector/activePlanSelector";
import { IoCheckmarkSharp } from "react-icons/io5";


interface ModalProps {
  post_url?: string;
  popupTriggeredFrom?: "create-post";
  personasData: any;
}

const PostGenerator: React.FC<ModalProps> = ({ post_url, popupTriggeredFrom, personasData }) => {
  const [prompt, setPrompt] = useState("");
  const [generatedPost, setGeneratedPost] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isContextActive, setIsContextActive] = useState(false);

  const [motive, setMotive] = useState(POSTING_MOTIVES[0]);
  const [tone, setTone] = useState(TONES[0]);
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [isAuth, setIsAuth] = useState(true);
  const [error, setError] = useState("");
  const [showPlanAlert, setShowPlanAlert] = useState(false);
  const activePlanValue = useSelector(selectActivePlanValue);

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
    setError("");

    let platform = "linkedin";
    const currentUserName = getCurrentLinkedInUsernameFromLocalStorage();

    // Fetch auth token before sending the request
    chrome.runtime.sendMessage({ type: "getCookies" }, (response) => {
      if (!response || !response.success || !response.token) {
        setError("Failed to retrieve auth token.");
        setIsGenerating(false);
        setIsAuth(true);
        return;
      }
      const personasvalue = {
        personas_name: personasData?.personas_name,
        personas_bio: personasData?.personas_bio,
        jobTitle: personasData?.jobTitle,
        company: personasData?.company,
        industry: personasData?.industry
      }
      const authToken = response.token;
      const requestData = {
        language,
        status: "saved",
        tone,
        postText: prompt || "",
        authorName: "",
        platform,
        // command: prompt,
        command: `This is my persona ${JSON.stringify(personasvalue)}. Please generate content according to this persona information.`,
        contentType: popupTriggeredFrom,
        goal: motive,
        articleInfo,
        lastMessages,
        currentUserName,
        authToken,
      };

      chrome.runtime.sendMessage(
        { type: "GENERATE_CONTENT", data: requestData },
        (response) => {
          if (response?.success && !apiCalled) {
            setDisplayedText("");

            const generatedMessage = response.data?.data || "";
            setGeneratedPost(generatedMessage);

            // animate typing
            let index = -1;
            const typingSpeed = 20;
            const type = () => {
              index++;
              if (index < generatedMessage.length) {
                setDisplayedText((prev) => prev + generatedMessage[index]);
                setTimeout(type, typingSpeed);
              } else {
                setIsGenerating(false);
              }
            };
            type();
            apiCalled = true;

            // Correct API endpoint for post
            const payload = {
              comment: generatedMessage,
              post_url: post_url ? post_url : window.location.href,
              comment_type: popupTriggeredFrom,
              motive: motive,
              tone: tone,
              language: language,
              status: "saved",
              genarate_title: prompt,
              command: requestData.command,
            };

            const requestUrl = apiService.EndPoint.createComments

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

  // --- Copy ---
  const copyToClipboard = () => {
    if (generatedPost) {
      navigator.clipboard.writeText(generatedPost);
      setCopied(true);
    }
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  useEffect(() => {
    chrome.storage.local.get(
      ["selectedLanguage", "selectedTone", "selectedMotive"],
      (result) => {
        if (result.selectedLanguage) {
          setLanguage(result.selectedLanguage);
        }
        if (result.selectedTone) {
          setTone(result.selectedTone);
        }

        const motiveArray = Array.isArray(result.selectedMotive)
          ? result.selectedMotive
          : ["", ""];
        if (motiveArray) {
          setMotive(motiveArray[0] || "");
        }
      }
    );
  }, []);

  useEffect(() => {
    // Save selections to Chrome storage whenever they change
    chrome.storage.local.get(["selectedMotive"], (result) => {
      // Always start with an array structure
      const existingMotiveArray = Array.isArray(result.selectedMotive)
        ? result.selectedMotive
        : ["", ""];

      let updatedMotiveArray = [...existingMotiveArray];
      updatedMotiveArray[0] = motive;

      chrome.storage.local.set({
        selectedLanguage: language,
        selectedTone: tone,
        selectedMotive: updatedMotiveArray,
      });
    });
  }, [language, tone, motive]);

  const validateForm = () => {
    let newErrors: any = {};

    // check Original Message if popup is create-post
    if (popupTriggeredFrom === "create-post" && !prompt?.trim()) {
      newErrors.prompt = "Original Message is required";
    }

    // motive must not include "Motive"
    if (!motive || motive.includes("Motive")) {
      newErrors.motive = "Please select a valid motive";
    }

    // language must not equal "Language"
    // if (!language || language === "Language") {
    //   newErrors.language = "Please select a valid language";
    // }

    // tone must not include "Tone"
    if (!tone || tone.includes("Tone")) {
      newErrors.tone = "Please select a valid tone";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (popupTriggeredFrom === "create-post" && prompt?.trim()) {
      setErrors((prev) => ({ ...prev, prompt: "" }));
    }
  }, [prompt, popupTriggeredFrom]);

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
        <div className="border-none g-box bg-white/80 backdrop-blur-sm rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-2 font-semibold text-base">
            <Wand2 className="w-5 h-5 text-[#ff5c35]" />
            Generate LinkedIn Post
          </div>

          {/* promp Topic */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#334155]">
              What do you want to post about? <span className="text-red">*</span>
            </label>

            <div
              className={`rounded-lg overflow-hidden border ${isContextActive ? "active" : "border-[#e2e8f0]"
                } custom_textarea relative`}
            >
              <textarea
                placeholder="e.g., Share insights about remote work trends, celebrate a team achievement..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onFocus={() => setIsContextActive(true)}
                onBlur={() => setIsContextActive(false)}
                className="w-full min-h-24 h-full p-2 outline-none text-sm resize-none focus:ring-0 border-0"
              />
            </div>
            <div className="text-sm flex text-[#8c97a9] mt-0">
              {/* <span>💡 Write clearly for better generated results</span> */}
              <span className="bg-[#f6f9fc] border font-bold border-[#e0eaf3] py-[3px] px-[10px] text-black">
                Current Personas:{" "}
                <span className="font-semibold text-[#545c66]">
                  {personasData?.personas_name}
                </span>
              </span>
            </div>
            {errors.prompt && (
              <p className="text-red !text-sm ms-1 !mt-0 absolute">{errors.prompt}</p>
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
                {POSTING_MOTIVES.map((motive, index) => {
                  const textOnly = removeEmoji(String(motive));
                  return (
                    <option key={index} value={textOnly}>
                      {motive}
                    </option>
                  );
                })}
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
                  <option key={index} value={removeEmoji(String(toneOption))}>
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
              Select Language<span className="text-red">*</span>
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
                <span className="text-sm">Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">Generate Post</span>
              </>
            )}
          </button>

          {/* Quick Tips */}
          <div className="p-4 bg-[#ff5c350f] rounded-lg">
            <div className="font-semibold text-base mb-2">
              Post Writing Tips:
            </div>
            <ul className="text-sm space-y-1">
              <li>• Start with a strong hook in the first 2 lines</li>
              <li>• Use simple and clear language</li>
              <li>• Add value with insights, examples, or data</li>
              <li>• Keep paragraphs short for easy reading</li>
              <li>• End with a question or call-to-action to boost engagement</li>
              <li>• Use emojis sparingly to make posts more relatable</li>
              <li>• Add 2–5 relevant hashtags to increase reach</li>
            </ul>
          </div>


        </div>

        {/* Output Section */}
        <div className="border-none g-box  bg-white/80 backdrop-blur-sm rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 font-semibold text-base">
              <FileText className="w-5 h-5 text-[#ff5c35]" />
              Generated Post
            </div>
          </div>

          {generatedPost ? (
            <div className="space-y-4">
              {/* Post Preview */}
              <div className="p-4 border border-[#e2e8f0] rounded-lg  whitespace-pre-wrap text-sm text-[#1e293b] !h-125 !overflow-auto ">
                {displayedText.replace(/"/g, '')}
              </div>

              {/* Post Stats */}
              {/* <div className="flex items-center justify-between text-xs text-[#64748b]">
              <div className="flex items-center gap-4">
                <span>{generatedPost.length} characters</span>
                <span>{generatedPost.split("\n").length} lines</span>
                <span>
                  {(generatedPost.match(/#\w+/g) || []).length} hashtags
                </span>
              </div>
              <span className="px-2 py-1 border rounded-lg border-[#ff5c35] text-[#ff5c35] hover:bg-[#ff5c35] hover:text-white transition cursor-pointer">
                Ready to post
              </span>
            </div> */}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 flex items-center justify-center gap-2 border text-sm font-medium rounded-lg text-[#ff5c35] hover:bg-[#ff5c35] hover:text-white transition"
                >
                  {copied ?
                    <>
                      <IoCheckmarkSharp className="w-4 h-4" />Post Copied!
                    </>
                    : (
                      <>
                        <Copy className="w-4 h-4" />Copy Post
                      </>
                    )}
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-2 bg-[#ff5c35] text-white rounded-lg py-2"
                  onClick={() => {
                    const text = encodeURIComponent(displayedText);
                    const url = `https://www.linkedin.com/feed/?shareActive=true&text=${text}`;
                    window.open(url, "_blank");
                  }}
                >
                  <Send className="w-4 h-4" />
                  Open LinkedIn
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#ff5c350f] rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-[#ff5c35]" />
              </div>
              <p className="font-medium text-[#64748b] !text-xl mb-2">
                No post generated yet
              </p>
              <div className="!text-base text-[#94a3b8]">
                Fill out the form and click "Generate Post" to get started
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PostGenerator;
