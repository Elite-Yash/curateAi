import React, { useEffect, useState } from "react";
import "../../css/InputAiPopup.css";
import { LANGUAGES, TONES, COMMENT_MOTIVES, POSTING_MOTIVES } from "../../constants/constants";
import { ArticleInfo, PostData } from "../../constants/types";
import { getCurrentLinkedInUsernameFromLocalStorage } from "../../helpers/commonHelper";
import SignIn from "./Signin";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { getImage } from "../../common/utils/logoUtils";
import { apiService } from "../../common/config/apiService"; // Import API function
import Evalogo from "../Evalogo/Evalogo";

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
    const [currentPage, setCurrentPage] = useState(0);
    const [newUser, setNewUser] = useState(false)
    const [displayedText, setDisplayedText] = useState("");

    const handleCopy = () => {
        if (text.trim()) {
            navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500); // Reset after 1.5s
        }
    };

    useEffect(() => {
        if (text) {
            setLoading(true); // Disable buttons when typing starts
            setDisplayedText(""); // Reset displayed text on new input
            let index = -1;
            const typingSpeed = 30; // Speed of typing in milliseconds

            const type = () => {
                index++;
                if (index < text.length) {
                    setDisplayedText((prev) => prev + text[index]);
                    setTimeout(type, typingSpeed);
                } else {
                    setLoading(false); // Enable buttons after typing completes
                    setIsTextGenerated(true);
                }
            };

            type(); // Start typing effect
        }
    }, [text]);

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
                tone: tone.replace(/^[^\p{L}\p{N}\s]+/u, '').trim(),
                postText: postData.postText || text,
                authorName: postData.postAutherName,
                platform,
                command: text,
                contentType: popupTriggeredFrom,
                commentAuthorName: postData.commentAuthorName,
                commentText: postData.commentText,
                goal: motives.replace(/^[^\p{L}\p{N}\s]+/u, '').trim(),
                articleInfo,
                lastMessages,
                currentUserName,
                authToken,
            };

            chrome.runtime.sendMessage({ type: "GENERATE_CONTENT", data: requestData }, (response) => {
                if (response.success && !apiCalled) {
                    setText(response.data.data);
                    // setIsTextGenerated(true);
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
                            // setLoading(false);
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
        // Load saved selections from Chrome storage after removal
        chrome.storage.local.get(['selectedLanguage', 'selectedTone', 'selectedMotive'], (result) => {
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
            if (result.selectedLanguage && result.selectedTone && result.selectedMotive) {
                setNewUser(false);
            } else {
                setNewUser(true);
            }
        });
    }, []);


    useEffect(() => {
        // Save selections to Chrome storage whenever they change
        chrome.storage.local.set({
            selectedLanguage: language,
            selectedTone: tone,
            selectedMotive: motives
        });
    }, [language, tone, motives]);

    return (
        <div className={`popup-overlay ${isOpen ? "open" : ""} fixed inset-0 flex items-center justify-center bg-black bg-opacity-50`}>
            <div className={`popup-container bg-white shadow-lg absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 overflow-hidden ${!activePlan ? "!w-[42rem]" : ""}`}>
                <div className="relative header-top p-9 py-6 flex justify-between item-center">
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
                    newUser ?
                        <React.Fragment>
                            <div className="p-9 flex justify-between item-center flex-col gap-5">
                                <div className={`flex justify-between item-center ${currentPage === 3 ? "" : "gap-5"} flex-col`}>
                                    <div className="pop-title">
                                        <h4 className="font-medium !text-[25px]">{currentPage === 0 ? "What is your Moto for This Post ?" : currentPage === 1 ? "What is your Mood for This Post ?" : currentPage === 2 ? "What Language want to write this ?" : ""}</h4>
                                    </div>
                                    <div className={`grid ${currentPage === 3 ? "" : "grid-cols-3"} gap-5`}>
                                        <div className="w-full input-group flex flex-col col-span-2">
                                            {
                                                currentPage === 0 ?
                                                    <span className="relative">
                                                        <select
                                                            value={motives}
                                                            onChange={(e) => setMotive(e.target.value)}
                                                            className="popup-select w-full mt-3 p-2 border border-gray-300 rounded-md focus:ring focus:ring-[#ff9479]"
                                                            disabled={loading}
                                                        >
                                                            {(popupTriggeredFrom === "create-post" ? POSTING_MOTIVES : COMMENT_MOTIVES).map((motive, index) => {
                                                                // Extract text-only value: remove emoji
                                                                const textOnly = motive.replace(/^[^\p{L}\p{N}\s]+/u, '').trim();
                                                                return (
                                                                    <option key={index} value={textOnly}>
                                                                        {motive}
                                                                    </option>
                                                                );
                                                            })}
                                                        </select>
                                                    </span>

                                                    :
                                                    currentPage === 1 ?
                                                        <span className="relative">
                                                            <select
                                                                value={tone}
                                                                onChange={(e) => setTone(e.target.value)}
                                                                className="popup-select w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-[#ff9479]"
                                                                disabled={loading}
                                                            >
                                                                {TONES.map((toneOption, index) => {
                                                                    // Extract text-only value: remove emoji
                                                                    const textOnly = toneOption.replace(/^[^\p{L}\p{N}\s]+/u, '').trim(); // Remove leading emojis
                                                                    return (
                                                                        <option key={index} value={textOnly}>
                                                                            {toneOption}  {/* Displaying the full tone option with emoji */}
                                                                        </option>
                                                                    );
                                                                })}
                                                            </select>
                                                        </span>

                                                        :
                                                        currentPage === 2 ?
                                                            <span className="relative ">
                                                                <img src={getImage('translate')} alt="img" className="w-4 absolute left-3.5 top-1.5" />
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
                                                            :
                                                            <React.Fragment>
                                                                <div className="flex justify-between item-center flex-col gap-5">
                                                                    <div className="flex justify-between item-center gap-5">
                                                                        <div className="w-full input-group">
                                                                            <span className="relative ">
                                                                                <select
                                                                                    value={motives}
                                                                                    onChange={(e) => setMotive(e.target.value)}
                                                                                    className="popup-select  w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-[#ff9479]"
                                                                                    disabled={loading}
                                                                                >
                                                                                    {(popupTriggeredFrom === "create-post" ? POSTING_MOTIVES : COMMENT_MOTIVES).map((motive, index) => {
                                                                                        // Extract text-only value: remove emoji
                                                                                        const textOnly = motive.replace(/^[^\p{L}\p{N}\s]+/u, '').trim();
                                                                                        return (
                                                                                            <option key={index} value={textOnly}>
                                                                                                {motive}
                                                                                            </option>
                                                                                        );
                                                                                    })}
                                                                                </select>
                                                                            </span>
                                                                        </div>
                                                                        <div className="w-full input-group ">
                                                                            <span className="relative ">
                                                                                <img src={getImage('translate')} alt="img" className="w-4 absolute left-3.5 !top-[5px]" />
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
                                                                                <select
                                                                                    value={tone}
                                                                                    onChange={(e) => setTone(e.target.value)}
                                                                                    className="popup-select w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-[#ff9479]"
                                                                                    disabled={loading}
                                                                                >
                                                                                    {TONES.map((toneOption, index) => {
                                                                                        // Extract text-only value: remove emoji
                                                                                        const textOnly = toneOption.replace(/^[^\p{L}\p{N}\s]+/u, '').trim(); // Remove leading emojis
                                                                                        return (
                                                                                            <option key={index} value={textOnly}>
                                                                                                {toneOption}  {/* Displaying the full tone option with emoji */}
                                                                                            </option>
                                                                                        );
                                                                                    })}
                                                                                </select>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="w-full textarea-group relative">
                                                                        <span>
                                                                            <span onClick={handleCopy} className={`c-btn flex gap-1 item-center absolute right-3.5 top-1.5 cursor-pointer text-[#585858] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} style={{ pointerEvents: loading ? 'none' : 'auto' }}>
                                                                                {copied ? "Copied!" : "Copy"}
                                                                                <img src={getImage('copyIcon')} alt="img" className="w-4" />
                                                                            </span>
                                                                            <textarea
                                                                                placeholder="Tell me what you want to write about?"
                                                                                // value={text}
                                                                                value={displayedText}
                                                                                onChange={(e) => setText(e.target.value)}
                                                                                className="popup-textarea !pt-8 w-full mt-1 p-2 border border-gray-300 rounded-md text-[#ff5c35] focus:ring focus:ring-[#ff9479] h-24 resize-none"
                                                                                disabled={loading}
                                                                            ></textarea>
                                                                        </span>
                                                                    </div>
                                                                    <h4 className="!my-0 text-base font-medium flex items-center gap-1.5 *:dec-color *:background-three *:px-2.5 *:rounded-3xl">
                                                                        <span className="bg-[#f6f9fc] border border-[#e0eaf3] py-[3px] px-[10px] text-black">
                                                                            Motive: <span className="font-semibold text-[#545c66]">{motives}</span>
                                                                        </span>
                                                                        <span className="bg-[#f6f9fc] border border-[#e0eaf3] py-[3px] px-[10px] text-black">
                                                                            Language: <span className="font-semibold text-[#545c66]">{language}</span>
                                                                        </span>
                                                                        <span className="bg-[#f6f9fc] border border-[#e0eaf3] py-[3px] px-[10px] text-black">
                                                                            Tone: <span className="font-semibold text-[#545c66]">{tone}</span>
                                                                        </span>
                                                                    </h4>
                                                                    <div className="popup-buttons justify-end space-x-2 text-right relative flex">
                                                                        {isTextGenerated && (
                                                                            <button className="popup-button-insert px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600" onClick={insertContent} disabled={loading}>
                                                                                Insert
                                                                            </button>
                                                                        )}
                                                                        <button
                                                                            className={`flex gap-2 ml-auto leading-6	 popup-button-submit px-4 py-2 ${isTextGenerated ? "bg-green" : "bg-[#ff5c35]"}  text-white rounded-md ${isTextGenerated ? "hover:bg-[#008234]" : "hover:bg-[#c64e30]"}  disabled:bg-gray-40`}
                                                                            onClick={handleSubmit}
                                                                            disabled={loading}
                                                                        ><img src={getImage('sendIcon')} alt="img" className="w-4 !static" />
                                                                            {loading ? (isTextGenerated ? "Regenerating..." : "Generating...") : isTextGenerated ? "Regenerate" : "Generate"}
                                                                        </button>

                                                                        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full text-left">
                                                                            {error && <div className="popup-error text-red-500 mt-0">{error}</div>}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </React.Fragment>

                                            }
                                            <div className="flex justify-between mt-auto">
                                                {
                                                    currentPage !== 0 && currentPage !== 3 && (
                                                        <a onClick={() => setCurrentPage(currentPage - 1)} className={`flex !gap-2 !leading-6	 popup-button-submit !px-4 !py-2.5 bg-[#ff5c35]  text-white rounded-md  hover:bg-[#c64e30]`}>
                                                            <svg className="w-[12px] fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" /></svg>
                                                            Back
                                                        </a>
                                                    )
                                                }
                                                {
                                                    currentPage !== 3 && (
                                                        <a onClick={() => setCurrentPage(currentPage + 1)} className={`flex !gap-2 ml-auto !leading-6	 popup-button-submit !px-4 !py-2.5 bg-[#ff5c35]  text-white rounded-md  hover:bg-[#c64e30]`}>
                                                            Next
                                                            <svg className="w-[12px] fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" /></svg>
                                                        </a>
                                                    )
                                                }
                                            </div>
                                        </div>
                                        {currentPage === 3 ? "" : <div className="w-full"><Evalogo /></div>}
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <div className="p-9 flex justify-between item-center flex-col gap-5">
                                <div className="flex justify-between item-center gap-5">
                                    <div className="w-full input-group">
                                        <span className="relative ">
                                            <select
                                                value={motives}
                                                onChange={(e) => setMotive(e.target.value)}
                                                className="popup-select  w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-[#ff9479]"
                                                disabled={loading}
                                            >
                                                {(popupTriggeredFrom === "create-post" ? POSTING_MOTIVES : COMMENT_MOTIVES).map((motive, index) => {
                                                    // Extract text-only value: remove emoji
                                                    const textOnly = motive.replace(/^[^\p{L}\p{N}\s]+/u, '').trim();
                                                    return (
                                                        <option key={index} value={textOnly}>
                                                            {motive}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </span>

                                    </div>
                                    <div className="w-full input-group ">
                                        <span className="relative ">
                                            <img src={getImage('translate')} alt="img" className="w-4 absolute left-3.5 !top-[5px]" />
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
                                            <select
                                                value={tone}
                                                onChange={(e) => setTone(e.target.value)}
                                                className="popup-select w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-[#ff9479]"
                                                disabled={loading}
                                            >
                                                {TONES.map((toneOption, index) => {
                                                    // Extract text-only value: remove emoji
                                                    const textOnly = toneOption.replace(/^[^\p{L}\p{N}\s]+/u, '').trim(); // Remove leading emojis
                                                    return (
                                                        <option key={index} value={textOnly}>
                                                            {toneOption}  {/* Displaying the full tone option with emoji */}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </span>
                                    </div>
                                </div>
                                <div className="w-full textarea-group relative">
                                    <span>
                                        <span onClick={handleCopy} className={`c-btn flex gap-1 item-center absolute right-3.5 top-1.5 cursor-pointer text-[#585858] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} style={{ pointerEvents: loading ? 'none' : 'auto' }}>
                                            {copied ? "Copied!" : "Copy"}
                                            <img src={getImage('copyIcon')} alt="img" className="w-4" />
                                        </span>
                                        <textarea
                                            placeholder="Tell me what you want to write about?"
                                            // value={text}
                                            value={displayedText}
                                            onChange={(e) => setText(e.target.value)}
                                            className="popup-textarea !pt-8 w-full mt-1 p-2 border border-gray-300 rounded-md text-[#ff5c35] focus:ring focus:ring-[#ff9479] h-24 resize-none"
                                            disabled={loading}
                                        ></textarea>
                                    </span>
                                </div>
                                <h4 className="!my-2.5 !mb-4 text-base font-medium flex items-center gap-1.5 *:dec-color *:background-three *:px-2.5 *:rounded-3xl">
                                    <span className="bg-[#f6f9fc] border border-[#e0eaf3] py-[3px] px-[10px] text-black">
                                        Motive: <span className="font-semibold text-[#545c66]">{motives}</span>
                                    </span>
                                    <span className="bg-[#f6f9fc] border border-[#e0eaf3] py-[3px] px-[10px] text-black">
                                        Language: <span className="font-semibold text-[#545c66]">{language}</span>
                                    </span>
                                    <span className="bg-[#f6f9fc] border border-[#e0eaf3] py-[3px] px-[10px] text-black">
                                        Tone: <span className="font-semibold text-[#545c66]">{tone}</span>
                                    </span>
                                </h4>
                                <div className="popup-buttons justify-end space-x-2 text-right relative flex">
                                    {isTextGenerated && (
                                        <button className="popup-button-insert px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600" onClick={insertContent} disabled={loading}>
                                            Insert
                                        </button>
                                    )}
                                    <button
                                        className={`flex gap-2 ml-auto leading-6 popup-button-submit px-4 py-2 ${isTextGenerated ? "bg-green" : "bg-[#ff5c35]"} text-white rounded-md ${isTextGenerated ? "hover:bg-[#008234]" : "hover:bg-[#c64e30]"} disabled:bg-gray-40`}
                                        onClick={handleSubmit}
                                        disabled={loading}
                                    >
                                        <img src={getImage('sendIcon')} alt="img" className="w-4 !static" />
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
        </div >
    );
};

export default InputAiPopup;
