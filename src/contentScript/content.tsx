import { useState, useEffect } from "react";
import LinkedinPopup from "../components/linkedInComponents/linkedinPopup";
import { LinkedinPostData } from "../constants/types";

const Layout = () => {
    const [openAiPopup, setOpenAiPopup] = useState(false);
    const [linkedinPostData, setlinkedinPostData] = useState<LinkedinPostData>({
        postText: '',
        authorName: ''
    });

    const [selectedCommentBoxId, setSelectedCommentBoxId] = useState('');

    const getPostData = (commentElement) => {
        const parentElement = commentElement?.parentElement?.parentElement?.previousElementSibling;
        let postText = "";
        let authorName = "";

        if (parentElement) {
            // Extract post text (second child element)
            const secondChild = parentElement?.children[1];
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


    const insertGeneratedComment = (comment: string) => {
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




    const addCustomIcons = () => {
        const commentBoxes = document.querySelectorAll(
            ".comments-comment-box__form .comments-comment-texteditor .editor-container"
        );

        commentBoxes.forEach((box) => {
            // Check if the custom icon already exists
            if (box.querySelector(".custom-comment-icon")) return;

            const commentBoxCr = box.closest(".comments-comment-box--cr");
            const commentBoxCrId = commentBoxCr?.id || 'No ID found';

            setSelectedCommentBoxId(commentBoxCrId);
            // Create and append the custom icon
            const customIcon = document.createElement("img");
            customIcon.src = chrome.runtime.getURL("/icon.png"); // Adjust the path to match your folder structure
            customIcon.alt = "Custom Icon";
            customIcon.className = "custom-comment-icon";
            customIcon.style.cursor = "pointer";
            customIcon.style.marginLeft = "10px";
            customIcon.style.width = "24px";
            customIcon.style.height = "24px";

            customIcon.addEventListener("click", () => {
                const postData = getPostData(commentBoxCr);
                setlinkedinPostData(postData);
                setOpenAiPopup(true);
            });

            box.appendChild(customIcon);
        });
    };

    useEffect(() => {
        // Manually trigger the function on initial load
        addCustomIcons();

        // Set up MutationObserver
        const observer = new MutationObserver(addCustomIcons);

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
                <LinkedinPopup
                    isOpen={openAiPopup}
                    onClose={() => setOpenAiPopup(false)}
                    postData={linkedinPostData}
                    insertGeneratedComment={insertGeneratedComment}
                />
            </div>
        );
    }

    return null;
};

export default Layout;
