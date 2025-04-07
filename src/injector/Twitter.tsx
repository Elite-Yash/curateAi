import { useState, useEffect } from "react";
import InputAiPopup from "../components/aiPopup/InputAiPopup";
import { PostData, ArticleInfo } from "../constants/types";

export interface LinkedInMessage {
    messageSpeaker: string;
    messageText: string;
}

const Twitter = () => {
    const [openAiPopup, setOpenAiPopup] = useState(false);
    const [postData, setPostData] = useState<PostData>({
        postText: '',
        postAutherName: '',
        commentText: '',
        commentAuthorName: '',
    });

    const [, setSelectedCommentBoxId] = useState('');
    const [articleInfo,] = useState<ArticleInfo>({
        title: '',
        author: '',
        postDate: '',
        contentHTML: '',
        rawText: '',
    });
    const [lastMessages,] = useState<LinkedInMessage[]>([]);
    const [popupTriggeredFrom,] = useState('comment');

    const getPostDataTwitter = () => {
        let postText = "";
        let postAutherName = "";
        let commentText = "";
        let commentAuthorName = "";

        const tweetContainer = document.querySelector("article");
        if (tweetContainer) {
            // Extract post text
            const textElement = tweetContainer.querySelector("div[data-testid='tweetText']");
            postText = textElement?.querySelector("span")?.textContent?.trim() || "";

            // Extract author name
            const authorElement = tweetContainer.nextElementSibling;
            if (authorElement) {
                // Safely query the span containing the username text
                const replyTextElement = tweetContainer.querySelector('div[dir="ltr"]')?.children[0].children[0];
                console.log('replyTextElement: ', replyTextElement);

                if (replyTextElement?.textContent) { // Optional chaining ensures textContent is accessed safely
                    postAutherName = replyTextElement.textContent.trim(); // Extract the text
                } else {
                    console.warn('Username span or its textContent is null.');
                }
            } else {
                console.warn('Reply button not found.');
            }
        }


        return { postText, postAutherName, commentText, commentAuthorName };
    };

    const addCustomCommentIconTwitter = () => {
        const commentBoxes = document.querySelectorAll("div[data-testid='tweetTextarea_0']");

        commentBoxes.forEach((box) => {
            // Check if the custom icon already exists
            if (box.parentElement?.querySelector(".curateai-open-popup-icon")) return;

            const commentBoxId = box.closest("div")?.id || "No ID found";
            setSelectedCommentBoxId(commentBoxId);

            // Create and append the custom icon
            const customIcon = document.createElement("img");
            customIcon.src = chrome.runtime.getURL("/f-logo.png");
            customIcon.alt = "curateai-open-popup-icon";
            customIcon.className = "curateai-open-popup-icon";
            customIcon.style.cursor = "pointer";
            customIcon.style.marginLeft = "10px";
            customIcon.style.width = "24px";
            customIcon.style.height = "24px";

            customIcon.addEventListener("click", () => {
                const postData = getPostDataTwitter();
                setPostData(postData);
                setOpenAiPopup(true);
            });

            box.parentElement?.appendChild(customIcon);
        });
    };

    const insertGeneratedCommentTwitter = (comment: string) => {
        try {
            // Find the main comment box
            const commentBox = document.querySelector("div[data-testid='tweetTextarea_0']");
            console.log("commentBox: ", commentBox);

            if (commentBox) {
                // Identify the contenteditable div within the comment box
                const editableDiv = commentBox;
                if (editableDiv) {
                    // Set the comment text
                    editableDiv.textContent = comment;

                    // Dispatch input event to ensure Twitter recognizes the input
                    const event = new InputEvent("input", {
                        bubbles: true,
                        cancelable: true,
                    });
                    editableDiv.dispatchEvent(event);

                    // Close any OpenAI popup or additional UI
                    setOpenAiPopup(false);

                    console.log("Comment inserted successfully.");
                } else {
                    console.error("Editable div not found within the comment box.");
                }
            } else {
                console.error("Comment box not found.");
            }
        } catch (error) {
            console.error("Error inserting comment:", error);
        }
    };


    useEffect(() => {
        addCustomCommentIconTwitter();

        // Set up MutationObserver
        const observer = new MutationObserver(() => {
            addCustomCommentIconTwitter();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        // Cleanup observer on component unmount
        return () => {
            observer.disconnect();
        };
    }, []);

    if (openAiPopup) {
        return (
            <div
                style={{
                    position: "fixed",
                    width: "100%",
                    height: "100vh",
                    maxHeight: "100vh",
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    top: 0,
                    left: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 21213123,
                }}
            >
                <InputAiPopup
                    isOpen={openAiPopup}
                    onClose={() => setOpenAiPopup(false)}
                    postData={postData}
                    insertGeneratedComment={insertGeneratedCommentTwitter}
                    insertGeneratedPost={() => { }}
                    popupTriggeredFrom={popupTriggeredFrom}
                    articleInfo={articleInfo}
                    lastMessages={lastMessages}
                />
            </div>
        );
    }

    return null;
};

export default Twitter;
