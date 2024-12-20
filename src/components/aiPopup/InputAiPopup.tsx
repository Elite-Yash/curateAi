import React, { useState } from "react";
import "../../css/InputAiPopup.css";
import { LANGUAGES, TONES, COMMENT_MOTIVES, POSTING_MOTIVES } from "../../constants/constants";
import { ArticleInfo, PostData } from "../../constants/types";
import { getAuthTokenFromLocalStorage, getCurrentLinkedInUsernameFromLocalStorage } from "../../helpers/commonHelper";

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
            authToken : authToken
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
        <div className={`popup-overlay ${isOpen ? "open" : ""}`}>
            <div className="popup-container">
                <h2 className="popup-title">Curate Your Comment</h2>

                <label className="popup-label">Motive:</label>
                <select
                    value={motives}
                    onChange={(e) => setMotive(e.target.value)}
                    className="popup-select"
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

                <label className="popup-label">Language:</label>
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="popup-select"
                    disabled={loading}
                >
                    {LANGUAGES.map((lang, index) => (
                        <option key={index} value={lang}>
                            {lang}
                        </option>
                    ))}
                </select>

                <label className="popup-label">Tone:</label>
                <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="popup-select"
                    disabled={loading}
                >
                    {TONES.map((toneOption, index) => (
                        <option key={index} value={toneOption}>
                            {toneOption}
                        </option>
                    ))}
                </select>

                <label className="popup-label">Your Comment:</label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="popup-textarea"
                    disabled={loading}
                ></textarea>

                <div className="popup-buttons">
                    <button className="popup-button-cancel" onClick={onClose}>
                        Cancel
                    </button>
                    {isTextGenerated && (
                        <button className="popup-button-insert" onClick={insertContent}>
                            Insert
                        </button>
                    )}
                    <button
                        className="popup-button-submit"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading
                            ? isTextGenerated
                                ? "Regenerating..."
                                : "Generating..."
                            : isTextGenerated
                                ? "Regenerate"
                                : "Generate"}
                    </button>
                </div>

                {error && <div className="popup-error">{error}</div>}
            </div>
        </div>
    );
};

export default InputAiPopup;
