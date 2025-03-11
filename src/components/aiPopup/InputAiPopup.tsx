import React, { useState } from "react";
import "../../css/InputAiPopup.css";
import { LANGUAGES, TONES, COMMENT_MOTIVES, POSTING_MOTIVES } from "../../constants/constants";
import { ArticleInfo, PostData } from "../../constants/types";
import { getAuthTokenFromLocalStorage, getCurrentLinkedInUsernameFromLocalStorage } from "../../helpers/commonHelper";
import SignIn from "./Signin";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { getImage } from "../../common/utils/logoUtils";

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
    if (!isOpen) return null;

    const handleSubmit = () => {
        setLoading(true);
        setError("");

        const currentUrl = window.location.href;
        let platform = "";

        if (currentUrl.includes("linkedin.com")) {
            platform = "linkedin";
        } else if (currentUrl.includes("x.com")) {
            platform = "twitter";
        }

        const currentUserName = getCurrentLinkedInUsernameFromLocalStorage();
        console.log('currentUserName: ', currentUserName);

        console.log("postData: , articleInfo", postData, articleInfo);

        const authToken = getAuthTokenFromLocalStorage();

        const requestData = {
            language,
            tone,
            postText: postData.postText ? postData.postText : text,
            authorName: postData.postAutherName,
            platform: platform,
            command: text,
            contentType: popupTriggeredFrom,
            commentAuthorName: postData.commentAuthorName,
            commentText: postData.commentText,
            goal: motives,
            articleInfo: articleInfo,
            lastMessages: lastMessages,
            currentUserName: currentUserName,
            authToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhamF5QGdtYWlsLmNvbSIsInN1YnNjcmlwdGlvbl9zdGF0dXMiOiJ0cmlhbCIsImlhdCI6MTc0MDU1NjUzMiwiZXhwIjoxNzQ1NzQwNTMyfQ.4B6itUSJZiz1VVd2kI8Y-gyxk63HwAJd7cY_ERzo7XI'
        };

        chrome.runtime.sendMessage(
            { type: "GENERATE_CONTENT", data: requestData },
            (response) => {
                if (response.success) {
                    setText(response.data.data);
                    setLoading(false);
                    setIsTextGenerated(true);
                } else {
                    setError("Failed to submit the comment. Please try again.");
                }
                setLoading(false);
            }
        );
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

    return (
        <div className={`popup-overlay ${isOpen ? "open" : ""} fixed inset-0 flex items-center justify-center bg-black bg-opacity-50`}>
            <div className="popup-container bg-white rounded-lg shadow-lg w-96 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-3xl overflow-hidden">
                <div className="header-top p-9 py-10 flex justify-start item-center">
                    <span className="relative mr-3 pr-9">
                        <img src={getImage('iconLogo')} alt="img" className="absolute w-11" />
                    </span>
                    <h4 className="popup-title font-semibold text-xl mt-0.5">Ask to Cureate Ai</h4>
                    <span
                        onClick={onClose}
                        className="close-box absolute top-6 right-6 w-6 h-6 bg-no-repeat bg-center cursor-pointer"

                    ><img src={getImage('close')} alt="img" className="w-full h-full rounded-full" /></span>
                </div>
                {!isAuth && <SignIn />}
                {isAuth && <React.Fragment>
                    <div className="p-9 flex justify-between item-center flex-col gap-5">

                        <div className="flex justify-between item-center gap-5">
                            <div className="w-full input-group">


                                <span className="relative ">
                                    <img src={getImage('translate')} alt="img" className="w-4 absolute left-3.5 top-1.5" />
                                    {/* <label className="popup-label block text-gray-700 font-medium text-sm">Motive:</label> */}
                                    <select
                                        value={motives}
                                        onChange={(e) => setMotive(e.target.value)}
                                        className="popup-select w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
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
                                        className="popup-select w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
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
                                    <img src={getImage('translate')} alt="img" className="w-4 absolute left-3.5 top-1.5" />
                                    {/* <label className="popup-label block text-gray-700 font-medium text-sm">Language:</label> */}
                                    <select
                                        value={tone}
                                        onChange={(e) => setTone(e.target.value)}
                                        className="popup-select w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
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

                            <span className=" ">
                                <span className="flex gap-1 item-center absolute right-3.5 top-1.5 cursor-pointer">
                                    Copy
                                    <img src={getImage('copyIcon')} alt="img" className="w-4" />
                                </span>
                                {/* <label className="popup-label block text-gray-700 font-medium text-sm">Your Comment:</label> */}
                                <textarea
                                    placeholder="Tell me how you want to modify"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    className="popup-textarea w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 h-24 resize-none"
                                    disabled={loading}
                                ></textarea>
                            </span>
                        </div>

                        <div className="popup-buttons justify-end space-x-2 text-right relative">


                            {isTextGenerated && (
                                <button className="popup-button-insert px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600" onClick={insertContent}>
                                    Insert
                                </button>
                            )}
                            <button
                                // className="flex gap-2 ml-auto leading-6	 popup-button-submit px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 disabled:bg-gray-400"
                                className="flex gap-2 ml-auto leading-6	 popup-button-submit px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-md hover:bg-indigo-600 disabled:bg-gray-400"
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

                </React.Fragment>}
            </div>
        </div>
    );
};

export default InputAiPopup;
