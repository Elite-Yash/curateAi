import React, { useState } from "react";
import "../../css/InputAiPopup.css"; // Import the CSS file
import { LANGUAGES, TONES } from "../../constants/constants"; // Import constants
import { PostData } from "../../constants/types";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    postData: PostData;
    insertGeneratedComment: (comment: string) => void;
    insertGeneratedPost: (post: string) => void;
    popupTriggeredFrom: string;
}

const InputAiPopup: React.FC<ModalProps> = ({ isOpen, onClose, postData, insertGeneratedComment, insertGeneratedPost, popupTriggeredFrom }) => {
    const [language, setLanguage] = useState(LANGUAGES[0]); // Default to first language in the list
    const [tone, setTone] = useState(TONES[0]); // Default to first tone in the list
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isTextGenerated, setIsTextGenerated] = useState(false);


    if (!isOpen) return null;

    // Function to handle form submission and make the API call
    const handleSubmit = () => {
        setLoading(true);
        setError(""); // Reset any previous error
        const currentUrl = window.location.href;
        let platform = ""

        if (currentUrl.includes("linkedin.com")) {
            platform = "linkedin";
        } else if (currentUrl.includes("x.com")) {
            platform = "twitter";
        }
        // Prepare the data to send to the background script
        const requestData = {
            language,
            tone,
            postText: postData.postText,
            authorName: postData.authorName,
            platform: platform,
            command: text,
            contentType: popupTriggeredFrom
        };

        console.log('requestData: ', requestData);
        console.log("triggered", popupTriggeredFrom);


        // Send the data to the background script
        chrome.runtime.sendMessage(
            { type: 'GENERATE_CONTENT', data: requestData },
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
        if (popupTriggeredFrom === "comment") {
            insertGeneratedComment(text);
        } else if (popupTriggeredFrom === "create-post") {
            insertGeneratedPost(text);
        }
    }

    return (
        <div className="popup-overlay">
            <div className="popup-container">
                <h2 className="popup-title">Curate Your Comment</h2>

                {/* Language Selector */}
                <label className="popup-label">Language:</label>
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="popup-select"
                    disabled={loading} // Disable when loading
                >
                    {LANGUAGES.map((lang, index) => (
                        <option key={index} value={lang}>
                            {lang}
                        </option>
                    ))}
                </select>

                {/* Tone Selector */}
                <label className="popup-label">Tone:</label>
                <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="popup-select"
                    disabled={loading} // Disable when loading
                >
                    {TONES.map((toneOption, index) => (
                        <option key={index} value={toneOption}>
                            {toneOption}
                        </option>
                    ))}
                </select>

                {/* Text Area */}
                <label className="popup-label">Your Comment:</label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="popup-textarea"
                    disabled={loading} // Disable when loading
                ></textarea>

                {/* Buttons */}
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
                        disabled={loading} // Disable when loading
                    >
                        {loading ? "Generating..." : (isTextGenerated ? "Regenerate" : "Generate")}

                    </button>
                </div>

                {/* Error Message */}
                {error && <div className="popup-error">{error}</div>}
            </div>
        </div>
    );
};

export default InputAiPopup;