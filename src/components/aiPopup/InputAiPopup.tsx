import React, { useEffect, useState } from "react";
import "../../css/InputAiPopup.css";
import { LANGUAGES, TONES, COMMENT_MOTIVES, POSTING_MOTIVES } from "../../constants/constants";
import { ArticleInfo, PostData } from "../../constants/types";
import { getCurrentLinkedInUsernameFromLocalStorage } from "../../helpers/commonHelper";
import SignIn from "./Signin";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { getImage } from "../../common/utils/logoUtils";
import { apiService } from "../../common/config/apiService"; // Import API function

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
    activePlan
}) => {
    const [language, setLanguage] = useState(LANGUAGES[0]);
    const [tone, setTone] = useState(TONES[0]);
    const [motives, setMotive] = useState(
        popupTriggeredFrom === "create-post" ? POSTING_MOTIVES[0] : COMMENT_MOTIVES[0]
    );
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isTextGenerated, setIsTextGenerated] = useState(false);
    const [isAuth, setIsAuth] = useState(true);
    const [copied, setCopied] = useState(false);
    let apiCalled = false;

    const handleCopy = () => {
        if (text.trim()) {
            navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500); // Reset after 1.5s
        }
    };

    if (!isOpen) return null;

    const handleSubmit = () => {
        setLoading(true);
        setError("");

        const currentUrl = window.location.href;
        let platform = currentUrl.includes("linkedin.com") ? "linkedin" : currentUrl.includes("x.com") ? "twitter" : "";

        const currentUserName = getCurrentLinkedInUsernameFromLocalStorage();
        // console.log("currentUserName:", currentUserName);
        // console.log("postData, articleInfo:", postData, articleInfo);

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
                tone,
                postText: postData.postText || text,
                authorName: postData.postAutherName,
                platform,
                command: text,
                contentType: popupTriggeredFrom,
                commentAuthorName: postData.commentAuthorName,
                commentText: postData.commentText,
                goal: motives,
                articleInfo,
                lastMessages,
                currentUserName,
                authToken,
            };


            chrome.runtime.sendMessage({ type: "GENERATE_CONTENT", data: requestData }, (response) => {
                if (response.success && !apiCalled) {
                    setText(response.data.data);
                    setIsTextGenerated(true);
                    apiCalled = true;

                    const payload = {
                        comment: response.data.data,
                        post_url: post_url ? post_url : window.location.href,
                    };

                    const requestUrl = apiService.EndPoint.createComments;

                    apiService.commonAPIRequest(
                        requestUrl,
                        apiService.Method.post,
                        undefined, // No query params for this request
                        payload,
                        (result: any) => {
                            if (result?.status === 201 && result?.data.message === "Comment created successfully") {
                                // console.log("Comment created successfully");
                            } else {
                                throw new Error(result.message || "Failed to create comment.");
                            }
                        }
                    )
                        .catch((err: any) => {
                            console.error("API error:", err);
                        }).finally(() => {
                            setLoading(false);
                        });

                } else {
                    setError("Failed to submit the comment. Please try again.");
                    setLoading(false);
                }
            });


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
            insertGeneratedComment(text);
        } else if (popupTriggeredFrom === "create-post") {
            insertGeneratedPost(text);
        }
    };

    useEffect(() => {
        // Load saved selections from Chrome storage
        chrome.storage.sync.get(['selectedLanguage', 'selectedTone', 'selectedMotive'], (result) => {
            if (result.selectedLanguage) {
                setLanguage(result.selectedLanguage);
            }
            if (result.selectedTone) {
                setTone(result.selectedTone);
            }
            if (result.selectedMotive) {
                setMotive(result.selectedMotive);
            }
        });
    }, []);

    useEffect(() => {
        // Save selections to Chrome storage whenever they change
        chrome.storage.sync.set({
            selectedLanguage: language,
            selectedTone: tone,
            selectedMotive: motives
        });
    }, [language, tone, motives]);

    return (
        <div className={`popup-overlay ${isOpen ? "open" : ""} fixed inset-0 flex items-center justify-center bg-black bg-opacity-50`}>
            <div className={`popup-container bg-white rounded-lg shadow-lg absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-3xl overflow-hidden ${!activePlan ? "!w-[42rem]" : ""}`}>
                <div className="relative header-top p-9 py-10 flex justify-between item-center">
                    <span className="relative p-logo border-[2.5px] border-solid rounded-full border-[#ff5c35]">
                        <img src={getImage('fLogo')} alt="img" className="" />
                    </span>
                    <h4 className="popup-title font-semibold text-xl leading-10">Ask to Eva</h4>
                    <span
                        onClick={onClose}
                        className="close-box w-6 h-6 bg-no-repeat bg-center cursor-pointer"

                    ><img src={getImage('close')} alt="img" className="w-full h-full rounded-full" /></span>
                </div>
                {!isAuth && <SignIn />}
                {isAuth && activePlan ?
                    <React.Fragment>
                        <div className="p-9 flex justify-between item-center flex-col gap-5">
                            <div className="flex justify-between item-center gap-5">
                                <div className="w-full input-group">
                                    <span className="relative ">
                                        {/* <img src={getImage('translate')} alt="img" className="w-4 absolute left-3.5 top-1.5" /> */}
                                        {/* <label className="popup-label block text-gray-700 font-medium text-sm">Motive:</label> */}
                                        <select
                                            value={motives}
                                            onChange={(e) => setMotive(e.target.value)}
                                            className="popup-select  w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-[#ff9479]"
                                            disabled={loading}
                                        >
                                            {(popupTriggeredFrom === "create-post" ? POSTING_MOTIVES : COMMENT_MOTIVES).map(
                                                (motive, index) => (
                                                    <option key={index} value={motive}>
                                                        {motive}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </span>

                                </div>
                                <div className="w-full input-group ">
                                    <span className="relative ">
                                        <img src={getImage('translate')} alt="img" className="w-4 absolute left-3.5 top-1.5" />
                                        {/* <label className="popup-label block text-gray-700 font-medium text-sm">Language:</label> */}
                                        <select
                                            value={language}
                                            onChange={(e) => setLanguage(e.target.value)}
                                            className="popup-select data w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-[#ff9479]"
                                            disabled={loading}
                                        >
                                            {LANGUAGES.map((lang, index) => (
                                                <option key={index} value={lang}>
                                                    {lang}
                                                </option>
                                            ))}
                                        </select>
                                    </span>


                                </div>
                                <div className="w-full input-group">

                                    <span className="relative ">
                                        {/* <img src={getImage('translate')} alt="img" className="w-4 absolute left-3.5 top-1.5" /> */}
                                        {/* <label className="popup-label block text-gray-700 font-medium text-sm">Language:</label> */}
                                        <select
                                            value={tone}
                                            onChange={(e) => setTone(e.target.value)}
                                            className="popup-select w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-[#ff9479]"
                                            disabled={loading}
                                        >
                                            {TONES.map((toneOption, index) => (
                                                <option key={index} value={toneOption}>
                                                    {toneOption}
                                                </option>
                                            ))}
                                        </select>
                                    </span>
                                </div>


                            </div>

                            <div className="w-full textarea-group relative">
                                <span>
                                    <span onClick={handleCopy} className="c-btn flex gap-1 item-center absolute right-3.5 top-1.5 cursor-pointer text-[#585858]">
                                        {copied ? "Copied!" : "Copy"}
                                        <img src={getImage('copyIcon')} alt="img" className="w-4" />
                                    </span>
                                    {/* <label className="popup-label block text-gray-700 font-medium text-sm">Your Comment:</label> */}
                                    <textarea
                                        placeholder="Tell me how you want to modify"
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        className="popup-textarea !pt-8 w-full mt-1 p-2 border border-gray-300 rounded-md text-[#ff5c35] focus:ring focus:ring-[#ff9479] h-24 resize-none"
                                        disabled={loading}
                                    ></textarea>
                                </span>
                            </div>

                            <div className="popup-buttons justify-end space-x-2 text-right relative flex">


                                {isTextGenerated && (
                                    <button className="popup-button-insert px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600" onClick={insertContent}>
                                        Insert
                                    </button>
                                )}
                                <button
                                    // className="flex gap-2 ml-auto leading-6	 popup-button-submit px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 disabled:bg-gray-400"
                                    className={`flex gap-2 ml-auto leading-6	 popup-button-submit px-4 py-2 ${isTextGenerated ? "bg-green" : "bg-[#ff5c35]"}  text-white rounded-md ${isTextGenerated ? "hover:bg-[#008234]" : "hover:bg-[#c64e30]"}  disabled:bg-gray-40`}
                                    onClick={handleSubmit}
                                    disabled={loading}
                                ><img src={getImage('sendIcon')} alt="img" className="w-4" />
                                    {loading ? (isTextGenerated ? "Regenerating..." : "Generating...") : isTextGenerated ? "Regenerate" : "Generate"}
                                </button>

                                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full text-left">
                                    {error && <div className="popup-error text-red-500 mt-0">{error}</div>}
                                </div>
                            </div>
                        </div>

                    </React.Fragment>
                    :
                    <>
                        <div className="p-9 flex justify-between item-center flex-col gap-5">
                            <span className="text-center text-5xl font-bold text-red">!! Alert !!</span>
                            <span className="text-justify">
                                Hey User, you don’t have an active plan on Evarobo yet.Subscribe now and start enjoying all the amazing features!
                            </span>
                        </div>
                    </>
                }
            </div>
        </div>
    );
};

export default InputAiPopup;
