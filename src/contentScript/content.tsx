import { useState, useEffect } from "react";
import InputAiPopup from "../components/aiPopup/InputAiPopup";
import { PostData } from "../constants/types";

const Layout = () => {
    const [openAiPopup, setOpenAiPopup] = useState(false);
    const [postData, setPostData] = useState<PostData>({
        postText: '',
        authorName: ''
    });

    const [selectedCommentBoxId, setSelectedCommentBoxId] = useState('');
    const [currentPlatform, setCurrentPlatform] = useState('');
    const [popupTriggeredFrom, setPopupTriggeredFrom] = useState('comment');

    const getPlatformName = () => {
        const hostname = window.location.hostname;

        if (hostname.includes("linkedin.com")) {
            setCurrentPlatform("LinkedIn");
            return "LinkedIn";
        } else if (hostname.includes("twitter.com") || hostname.includes("x.com")) {
            setCurrentPlatform("Twitter");
            return "Twitter";
        } else {
            return "Unknown";
        }
    };

    const getPostDataLinkedin = (commentElement: HTMLElement) => {
        const parentElement = commentElement?.parentElement?.parentElement?.previousElementSibling;
        let postText = "";
        let authorName = "";

        if (parentElement) {
            // Extract post text (second child element)
            const secondChild = parentElement?.children[1] as HTMLElement;
            postText = secondChild?.innerText || "";

            // Extract author name (searching for a specific class within the first child)

            const firstChild = parentElement?.children[0];
            // Find element with either of the two classes
            const authorElement = firstChild.querySelector(".update-components-actor__title");

            if (authorElement) {
                // Select the span with 'dir="ltr"' that is not inside 'aria-hidden'
                const innerSpan = authorElement.querySelector("span[dir='ltr'] > span:not([aria-hidden])");

                // If the span exists and is an HTMLElement, get the inner text
                if (innerSpan && innerSpan instanceof HTMLElement) {
                    authorName = innerSpan.innerText.trim(); // Extract and clean up the name
                }
            }
        }

        return { postText, authorName }; // Return the extracted data
    };

    const getPostDataTwitter = () => {
        let postText = "";
        let authorName = "";

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
                    authorName = replyTextElement.textContent.trim(); // Extract the text
                    console.log('Username text: ', authorName); // Should log "@ia_william"
                } else {
                    console.warn('Username span or its textContent is null.');
                }
            } else {
                console.warn('Reply button not found.');
            }
        }


        console.log('{ postText, authorName };: ', { postText, authorName });
        return { postText, authorName };
    };

    const addCustomCommentIconTwitter = () => {
        const commentBoxes = document.querySelectorAll("div[data-testid='tweetTextarea_0']");

        commentBoxes.forEach((box) => {
            // Check if the custom icon already exists
            if (box.parentElement?.querySelector(".custom-comment-icon")) return;

            const commentBoxId = box.closest("div")?.id || "No ID found";
            setSelectedCommentBoxId(commentBoxId);

            // Create and append the custom icon
            const customIcon = document.createElement("img");
            customIcon.src = chrome.runtime.getURL("/icon.png");
            customIcon.alt = "Custom Icon";
            customIcon.className = "custom-comment-icon";
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
                const editableDiv = commentBox.querySelector("div[contenteditable='true']");
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


    const insertGeneratedCommentLinkedin = (comment: string) => {
        const commentBox = document.getElementById(selectedCommentBoxId);

        if (commentBox) {
            // Locate the contenteditable div inside the comment box (where the comment should be inserted)
            const editor = commentBox.querySelector('.ql-editor'); // This class is used by LinkedIn's editor

            if (editor) {
                // Replace the existing content with the new comment
                editor.textContent = comment;

                // Optionally, trigger an 'input' event to simulate the user typing and update listeners
                const event = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });
                editor.dispatchEvent(event);

                // Close the popup after the comment is inserted (optional, as per your requirement)
                setOpenAiPopup(false);
            } else {
                console.error("Editor not found within the comment box");
            }
        } else {
            console.error("Comment box with id", selectedCommentBoxId, "not found");
        }
    };


    const addCustomCommentIconLinkedIn = () => {
        const commentBoxes = document.querySelectorAll(
            ".comments-comment-box__form .comments-comment-texteditor .editor-container"
        );

        commentBoxes.forEach((box) => {
            // Check if the custom icon already exists
            if (box.querySelector(".custom-comment-icon")) return;

            const commentBoxCr = box.closest(".comments-comment-box--cr") as HTMLElement;
            const commentBoxCrId = commentBoxCr?.id || 'No ID found';

            setSelectedCommentBoxId(commentBoxCrId);

            // Create and append the custom icon
            const customIcon = document.createElement("img");
            customIcon.src = chrome.runtime.getURL("/icon.png");
            customIcon.alt = "Custom Icon";
            customIcon.className = "custom-comment-icon";
            customIcon.style.cursor = "pointer";
            customIcon.style.marginLeft = "10px";
            customIcon.style.width = "24px";
            customIcon.style.height = "24px";

            customIcon.addEventListener("click", () => {
                const postData = getPostDataLinkedin(commentBoxCr);
                setPostData(postData);
                setOpenAiPopup(true);
            });

            box.appendChild(customIcon);
        });
    };

    const addCustomIconToElement = (element: HTMLElement) => {
        // Check if the custom icon already exists
        if (element.querySelector(".custom-comment-icon")) return;

        // Create and append the custom icon
        const customIcon = document.createElement("img");
        customIcon.src = chrome.runtime.getURL("/icon.png");
        customIcon.alt = "Custom Icon";
        customIcon.className = "custom-comment-icon";
        customIcon.style.cursor = "pointer";
        customIcon.style.width = "24px";
        customIcon.style.height = "24px";

        customIcon.addEventListener("click", () => {
            setOpenAiPopup(true);
            setPopupTriggeredFrom("create-post");
        });

        element?.insertBefore(customIcon, element.lastElementChild);
    };
    const addIconInCreatePostLinkedin = () => {
        const modalPostBox = document.querySelector(".share-creation-state__footer") as HTMLElement; // LinkedIn's create-post modal class
        if (modalPostBox) {
            addCustomIconToElement(modalPostBox);
        }
    };

    useEffect(() => {
        // Determine the platform
        let platform = getPlatformName();
        if (platform === "LinkedIn") {
            addCustomCommentIconLinkedIn();
        } else if (platform === "Twitter") {
            addCustomCommentIconTwitter();
        }

        // Set up MutationObserver
        const observer = new MutationObserver(() => {
            if (platform === "LinkedIn") {
                addCustomCommentIconLinkedIn();
                addIconInCreatePostLinkedin();
            } else if (platform === "Twitter") {
                addCustomCommentIconTwitter();
            }
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
                    insertGeneratedComment={currentPlatform === "LinkedIn" ? insertGeneratedCommentLinkedin : insertGeneratedCommentTwitter}
                    popupTriggeredFrom={popupTriggeredFrom}
                />
            </div>
        );
    }

    return null;
};

export default Layout;
