import React, { useState } from "react";
import "../../css/InputAiPopup.css";
import { LANGUAGES, TONES, COMMENT_MOTIVES, POSTING_MOTIVES } from "../../constants/constants";
import { ArticleInfo, PostData } from "../../constants/types";
import { getAuthTokenFromLocalStorage, getCurrentLinkedInUsernameFromLocalStorage } from "../../helpers/commonHelper";
import SignIn from "./Signin";

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
    const [isAuth, setIsAuth] = useState(false);
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
            <div className="popup-container bg-white rounded-lg shadow-lg p-6 w-96 relative">
                <h2 className="popup-title text-xl font-semibold text-gray-800">Curate Your Comment</h2>
                <span
                    onClick={onClose}
                    className="close-box absolute top-4 right-4 w-6 h-6 bg-no-repeat bg-center cursor-pointer"
                    style={{ backgroundImage: `url(${chrome.runtime.getURL("/close.png")})` }}
                ></span>
                {!isAuth && <SignIn />}
                {isAuth && <React.Fragment>
                    <label className="popup-label block mt-4 text-gray-700 font-medium">Motive:</label>
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

                    <label className="popup-label block mt-4 text-gray-700 font-medium">Language:</label>
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

                    <label className="popup-label block mt-4 text-gray-700 font-medium">Tone:</label>
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

                    <label className="popup-label block mt-4 text-gray-700 font-medium">Your Comment:</label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="popup-textarea w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 h-24 resize-none"
                        disabled={loading}
                    ></textarea>

                    <div className="popup-buttons mt-4 justify-end space-x-2">
                        {isTextGenerated && (
                            <button className="popup-button-insert px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600" onClick={insertContent}>
                                Insert
                            </button>
                        )}
                        <button
                            className="popup-button-submit px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 disabled:bg-gray-400"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (isTextGenerated ? "Regenerating..." : "Generating...") : isTextGenerated ? "Regenerate" : "Generate"}
                        </button>
                    </div>
                    {error && <div className="popup-error text-red-500 mt-2">{error}</div>}
                </React.Fragment>}
            </div>
        </div>
    );
};

export default InputAiPopup;
