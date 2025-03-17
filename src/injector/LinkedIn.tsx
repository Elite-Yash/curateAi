import { useState, useEffect } from "react";
import InputAiPopup from "../components/aiPopup/InputAiPopup";
import { PostData, ArticleInfo } from "../constants/types";
import { LINKEDIN_CLASS_NAMES, LINKEDIN_ID_NAMES } from "../constants/linkedinSelectors";
import { sleep, removeEmojis, trimAllWhiteSpaces, isLinkedInArticlePage } from "../helpers/commonHelper";

export interface LinkedInMessage {
    messageSpeaker: string;
    messageText: string;
}

const LinkedIn = () => {
    const [openAiPopup, setOpenAiPopup] = useState(false);
    const [postData, setPostData] = useState<PostData>({
        postText: '',
        postAutherName: '',
        commentText: '',
        commentAuthorName: '',
    });

    const [selectedCommentBoxId, setSelectedCommentBoxId] = useState('');

    const [popupTriggeredFrom, setPopupTriggeredFrom] = useState('comment');
    const [articleInfo, setArticleInfo] = useState<ArticleInfo>({
        title: '',
        author: '',
        postDate: '',
        contentHTML: '',
        rawText: '',
    });
    const [lastMessages, setLastMessages] = useState<LinkedInMessage[]>([]);
    const [selectedMessageBoxContainer, setSelectedMessageBoxContainer] = useState<HTMLElement | null>(null);

    const getPostText = (commentBoxEditor: HTMLElement): string => {
        let parentElement = commentBoxEditor.parentElement;
        let postText = "";

        while (parentElement) {

            if (parentElement.className == LINKEDIN_CLASS_NAMES.FIE_IMPRESSION_CONTAINER) {
                const secondChild = parentElement.children[1] as HTMLElement;
                postText = secondChild?.innerText || "";
                return postText;
            }

            parentElement = parentElement.parentElement;
        }

        return "";
    };

    const getPostCommentTextNew1 = (commentBoxEditor: HTMLElement) => {
        //EvyAILogger.log("getPostCommentTextNew1");
        // get parent element and find its mentioned
        let iconParentElement = commentBoxEditor?.parentElement;
        let mentioned_name_element = iconParentElement?.querySelector(
            `div[${LINKEDIN_CLASS_NAMES.DATA_QL_EDITOR_CONTENT_EDITABLE}="true"]`
        ) as HTMLElement;
        let mentioned_name = mentioned_name_element?.innerText.trim();
        // then loop through all thread and find all comments merge it
        let comment_text = "";
        // get actor name
        // step 1:
        //comments-comment-meta__container
        //comments-thread-entity
        // comment-social-activity comments-thread-entity
        //step 2
        //comment-social-activity
        let threadElemArray: HTMLElement[] = [];
        let parentElement = commentBoxEditor?.closest(LINKEDIN_CLASS_NAMES.COMMENTS_COMMENT_ITEM) as HTMLElement;
        threadElemArray.push(parentElement);
        let childElementsArray = parentElement?.querySelectorAll(LINKEDIN_CLASS_NAMES.COMMENTS_COMMENT_ITEM) ?? [];

        // Convert NodeList to an array and push each element individually
        childElementsArray?.forEach((childElement) => {
            threadElemArray.push(childElement as HTMLElement);
        });

        threadElemArray?.forEach((element) => {
            let actor_name_elem = element?.querySelector(LINKEDIN_CLASS_NAMES.COMMENTS_POST_META_H3_SPAN_COMMENTS__TEXT) as HTMLElement;

            if (actor_name_elem) {
                let actor_name_elem1 = actor_name_elem?.querySelector(`span[aria-hidden="true"]`) as HTMLElement;
                if (actor_name_elem1) {
                    actor_name_elem = actor_name_elem1;
                }
            }

            let actor_name = actor_name_elem?.innerText?.trim();
            if (mentioned_name.includes(actor_name)) {
                if (element?.querySelector(LINKEDIN_CLASS_NAMES.DIV_COMMENTS_COMMENT_ITEM_SHOW_MORE_TEXT)) {
                    const comment_div = element.querySelector(LINKEDIN_CLASS_NAMES.DIV_COMMENTS_COMMENT_ITEM_SHOW_MORE_TEXT) as HTMLElement;
                    comment_text += comment_div?.innerText ?? "";
                }
                comment_text += "\n";
            }
        });

        return comment_text;
    };

    const getPostCommentTextNewUI1 = (commentBoxEditor: HTMLElement) => {
        //EvyAILogger.log("getPostCommentTextNewUI1");
        // get parent element and find its mentioned
        let iconParentElement = commentBoxEditor?.parentElement;
        let mentioned_name_element = iconParentElement?.querySelector(
            `div[${LINKEDIN_CLASS_NAMES.DATA_QL_EDITOR_CONTENT_EDITABLE}="true"]`
        ) as HTMLElement;
        let mentioned_name = mentioned_name_element?.innerText.trim();
        let comment_text = "";

        let threadElemArray: HTMLElement[] = [];
        let parentElement = commentBoxEditor?.closest(LINKEDIN_CLASS_NAMES.COMMENTS_COMMENT_ENTITY) as HTMLElement;
        threadElemArray.push(parentElement);
        let childElementsArray = parentElement?.querySelectorAll(LINKEDIN_CLASS_NAMES.COMMENTS_COMMENT_ENTITY) ?? [];
        if (childElementsArray.length == 0) {
            childElementsArray = parentElement?.querySelectorAll(LINKEDIN_CLASS_NAMES.COMMENTS_COMMENT_ITEM) ?? [];
        }
        // Convert NodeList to an array and push each element individually
        childElementsArray?.forEach((childElement) => {
            threadElemArray.push(childElement as HTMLElement);
        });

        threadElemArray?.forEach((element) => {
            let actor_name_elem = element?.querySelector(
                `.comments-comment-meta__container h3 .${LINKEDIN_CLASS_NAMES.COMMENTS_COMMENT_META_DESCRIPTION_TITLE}`
            ) as HTMLElement;

            if (actor_name_elem) {
                let actor_name_elem1 = actor_name_elem?.querySelector(`span[aria-hidden="true"]`) as HTMLElement;
                if (actor_name_elem1) {
                    actor_name_elem = actor_name_elem1;
                }
            }
            if (!actor_name_elem) {
                actor_name_elem = element?.querySelector(LINKEDIN_CLASS_NAMES.COMMENTS_POST_META_H3_SPAN_COMMENTS__TEXT) as HTMLElement;

                if (actor_name_elem) {
                    let actor_name_elem1 = actor_name_elem?.querySelector(`span[aria-hidden="true"]`) as HTMLElement;
                    if (actor_name_elem1) {
                        actor_name_elem = actor_name_elem1;
                    }
                }
            }

            let actor_name = actor_name_elem?.innerText?.trim();
            if (mentioned_name.includes(actor_name)) {
                if (element?.querySelector(`div.` + LINKEDIN_CLASS_NAMES.COMMENTS_COMMENT_CONTENT_ELEMENT)) {
                    const comment_div = element.querySelector(`div.` + LINKEDIN_CLASS_NAMES.COMMENTS_COMMENT_CONTENT_ELEMENT) as HTMLElement;
                    comment_text += comment_div?.innerText ?? "";
                }
                setPopupTriggeredFrom("comment-reply");
                comment_text += "\n";
            }
        });

        return comment_text;
    };

    const getPostCommentAuthorNameNew = (commentBoxEditor: HTMLElement) => {
        // get parent element and find its mentioned
        let iconParentElement = commentBoxEditor?.parentElement;
        let mentioned_name_element = iconParentElement?.querySelector(
            `div[${LINKEDIN_CLASS_NAMES.DATA_QL_EDITOR_CONTENT_EDITABLE}="true"]`
        ) as HTMLElement;
        //EvyAILogger.log("mentioned_name_element?.innerText",mentioned_name_element?.innerText);
        return mentioned_name_element?.innerText;
        // then loop through all thread and find all comments merge it
    };

    const getPostCommentAuthorName = (commentBoxEditor: HTMLElement) => {
        let parentElement = commentBoxEditor.parentElement;
        while (parentElement) {
            if (
                parentElement.classList.contains(LINKEDIN_CLASS_NAMES.COMMENTS_COMMENT_ITEM) ||
                parentElement.classList.contains(LINKEDIN_CLASS_NAMES.COMMENTS_HIGHLIGHTED_COMMENT_ITEM) ||
                parentElement.classList.contains(LINKEDIN_CLASS_NAMES.COMMENTS_COMMENT_ITEM_HIGHLIGHTED)
            ) {
                const postCommentAuthorOuterContainer = parentElement.querySelector(
                    `.${LINKEDIN_CLASS_NAMES.COMMENT_COMMENT_ITEM_POST_META}`
                ) as HTMLElement;
                if (postCommentAuthorOuterContainer) {
                    const spanContainer = postCommentAuthorOuterContainer.querySelector(
                        `.${LINKEDIN_CLASS_NAMES.COMMENT_POST_META_NAME_TEXT_SPAN_CONTAINER}`
                    ) as HTMLElement;
                    if (spanContainer) {
                        if (spanContainer.firstElementChild?.firstElementChild) {
                            return (spanContainer?.firstElementChild?.firstElementChild as HTMLElement)?.innerText ?? "";
                        } else {
                            return spanContainer.innerText;
                        }
                    }
                }
            }
            parentElement = parentElement.parentElement;
        }
        return "";
    };

    const getPostAuthorName = (commentBoxEditor: HTMLElement) => {
        let parentElement = commentBoxEditor.parentElement;
        let authorName = "";
        while (parentElement) {
            if (parentElement.className == LINKEDIN_CLASS_NAMES.FIE_IMPRESSION_CONTAINER) {
                const authorElement = parentElement.children[0].querySelector(`.${LINKEDIN_CLASS_NAMES.AUTHOR_NAME}`);
                if (authorElement) {
                    // Select the span with 'dir="ltr"' that is not inside 'aria-hidden'
                    const innerSpan = authorElement.querySelector("span[dir='ltr'] > span:not([aria-hidden])");

                    // If the span exists and is an HTMLElement, get the inner text
                    if (innerSpan && innerSpan instanceof HTMLElement) {
                        authorName = innerSpan.innerText.trim(); // Extract and clean up the name
                    }
                }
                return authorName;
            }
            parentElement = parentElement.parentElement;
        }
        return "";
    };
    const getPostAndCommentInfo = (commentElement: any, isFromArticle: boolean) => {
        const commentBoxEditor = commentElement?.parentElement?.parentElement;
        const postText = getPostText(commentBoxEditor);

        const postCommentText = getPostCommentTextNew1(commentBoxEditor).trim();
        const commentText = postCommentText === "" ? getPostCommentTextNewUI1(commentBoxEditor) : postCommentText;
        const postCommentAuthorName = getPostCommentAuthorNameNew(commentBoxEditor);
        const commentAuthorName = postCommentAuthorName === "" ? getPostCommentAuthorName(commentBoxEditor) : postCommentAuthorName;
        const postAutherName = getPostAuthorName(commentBoxEditor);

        if (postAutherName != "" && commentAuthorName === "") {
            setPopupTriggeredFrom("comment");
        };

        if (isFromArticle && commentAuthorName != "" && commentText != "") {
            setPopupTriggeredFrom("article-comment-reply");
        }

        setPostData({ postText, postAutherName, commentText, commentAuthorName });

    };



    const getArticleTitle = (articleElement: HTMLElement) => {
        const articleHeaderH1Element = articleElement?.querySelector(".reader-article-header__title");
        const articleTitle = trimAllWhiteSpaces(articleHeaderH1Element?.textContent ?? "");
        return articleTitle;
    };

    const getArticleAuthor = (articleElement: HTMLElement) => {
        const articleAuthorInfoContainer = articleElement?.querySelector(".reader-author-info__container");
        const articleAuthorInfoElement = articleAuthorInfoContainer?.querySelector(".reader-author-info__inner-container");
        const articleAuthorHeaderElement = articleAuthorInfoElement?.querySelector(
            ".reader-author-info__author-lockup--flex"
        );
        const articleAuthor = trimAllWhiteSpaces(articleAuthorHeaderElement?.textContent ?? "");
        return articleAuthor;
    };

    const getArticlePostDate = (articleElement: HTMLElement) => {
        const articleAuthorInfoContainer = articleElement?.querySelector(".reader-author-info__container");
        const articlePostDateElement = articleAuthorInfoContainer?.querySelector("time");
        const articlePostDate = trimAllWhiteSpaces(articlePostDateElement?.textContent ?? "");
        return articlePostDate;
    };

    const getArticleContent = (articleElement: HTMLElement) => {
        const articleContentElement = articleElement?.querySelector(".reader-article-content");
        const articleContentHTML = articleContentElement?.outerHTML ?? "";
        return articleContentHTML;
    };

    const getArticleRawText = (articleElement: HTMLElement): string => {
        // Ensure articleElement is valid and querySelector returns an HTMLElement
        const articleContentElement = articleElement.querySelector('article[itemtype^="http://"]') as HTMLElement | null;

        // Use innerText to get the text content of the article or default to an empty string
        const articleContentText = articleContentElement?.innerText ?? "";

        return articleContentText;
    };


    const getArticleInfo = () => {
        const articleElement = document.querySelector(
            // ".reader__content"
            ".scaffold-layout--main-aside"
        ) as HTMLElement;
        const articleTitle = getArticleTitle(articleElement);
        const articleAuthor = getArticleAuthor(articleElement);
        const articlePostDate = getArticlePostDate(articleElement);
        const articleContentHTML = getArticleContent(articleElement);
        const articleContentRawText = getArticleRawText(articleElement);


        return { articleTitle, articleAuthor, articlePostDate, articleContentHTML, articleContentRawText };
    };

    const getArticlePageInfo = (commentBoxEditor: any) => {
        const { articleTitle, articleAuthor, articlePostDate, articleContentHTML, articleContentRawText } =
            getArticleInfo();

        setArticleInfo({
            title: articleTitle,
            author: articleAuthor,
            postDate: articlePostDate,
            contentHTML: articleContentHTML,
            rawText: articleContentRawText,
        });
        setPopupTriggeredFrom("article-comment");

        getPostAndCommentInfo(commentBoxEditor, true);
    }

    const insertGeneratedCommentLinkedin = (comment: string) => {

        console.log('selectedMessageBoxContainer: ', selectedMessageBoxContainer);
        if (selectedMessageBoxContainer) {
            const messageEditor = selectedMessageBoxContainer?.querySelector(`.${LINKEDIN_CLASS_NAMES.MESSAGE_EDITOR}`) as HTMLElement;
            const cleanedMessage = removeEmojis(comment);
            messageEditor?.focus();
            document.execCommand("insertText", false, cleanedMessage);
        } else {

            const commentBox = document.getElementById(selectedCommentBoxId);

            if (commentBox) {
                // Locate the contenteditable div inside the comment box (where the comment should be inserted)
                const editor = commentBox.querySelector(`.${LINKEDIN_CLASS_NAMES.POST_EDITOR}`); // This class is used by LinkedIn's editor

                if (editor) {
                    let alreadyContentInComment: any = "";
                    if (popupTriggeredFrom === "comment-reply" || popupTriggeredFrom === "article-comment-reply") {
                        alreadyContentInComment = editor.innerHTML;  // Use innerHTML to preserve mentions (HTML)

                        editor.innerHTML = alreadyContentInComment + " " + comment;
                    } else {
                        editor.textContent = comment;
                    }
                    // Replace the existing content with the new comment

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
        }
        setOpenAiPopup(false);

    };

    const insertGeneratedPostLinkedIn = (comment: string) => {
        const postBox = document.querySelector(`.${LINKEDIN_CLASS_NAMES.POST_EDITOR}`) as HTMLElement; // This class is used by LinkedIn's editor

        if (postBox) {
            postBox?.focus();
            postBox.textContent = comment;

            setOpenAiPopup(false);
        } else {
            console.error("Post box not found");
        }
    };

    const getOtherUserNameOnIndividualMessageBox = (messageBoxTextEditorContainer: HTMLElement) => {
        let parentElement = messageBoxTextEditorContainer.parentElement;
        while (parentElement) {
            if (parentElement.classList.contains(LINKEDIN_CLASS_NAMES.MESSAGE_OVERLAY_CONVERSATION_BUBBLE)) {
                const messageBoxHeaderElement = parentElement.querySelector(`header`) as HTMLElement;
                const userName = messageBoxHeaderElement.querySelector(`h2`)?.textContent;
                return userName?.trim();
            }

            parentElement = parentElement.parentElement;
        }
        return null;
    };

    const getOtherUserNameOnMessagePage = (messageBoxTextEditorContainer: HTMLElement) => {
        const otherUserNameOfIndividualMessageBox = getOtherUserNameOnIndividualMessageBox(messageBoxTextEditorContainer);
        if (otherUserNameOfIndividualMessageBox) {
            return otherUserNameOfIndividualMessageBox;
        }
        const messageThreadOtherUserNameElement = document.getElementById(`${LINKEDIN_ID_NAMES.MESSAGE_THREAD_OTHER_USER}`);
        return messageThreadOtherUserNameElement?.innerText ?? "";
    };

    const getMessageThreadContainer = (messageBoxTextEditorContainer: HTMLElement) => {
        let parentElement = messageBoxTextEditorContainer.parentElement;
        while (parentElement) {
            const messageThreadContainer = parentElement.querySelector(
                `.${LINKEDIN_CLASS_NAMES.MESSAGE_THREAD_CONTAINER}`
            ) as HTMLElement;
            if (messageThreadContainer) {
                return messageThreadContainer;
            }
            parentElement = parentElement.parentElement;
        }
        return null;
    };

    const getLastMessages = (
        messageBoxTextEditorContainer: HTMLElement,
        otherUserName: string,
        numberOfMessages = 6
    ) => {
        const messageThreadContainer = getMessageThreadContainer(messageBoxTextEditorContainer);
        const messageTextListItems =
            messageThreadContainer?.querySelectorAll(`li.${LINKEDIN_CLASS_NAMES.MESSAGE_TEXT_LIST_ITEM}`) ?? [];
        const allMessages: LinkedInMessage[] = [];
        let messageSpeaker = "";
        for (let i = 0; i < messageTextListItems.length; i++) {
            const messageSenderInfoElement = messageTextListItems[i]?.querySelector(
                `.${LINKEDIN_CLASS_NAMES.MESSAGE_TEXT_FROM_USER}`
            ) as HTMLElement;
            const messageTextElement = messageTextListItems[i]?.querySelector(
                `.${LINKEDIN_CLASS_NAMES.MESSAGE_TEXT_CONTENT}`
            ) as HTMLElement;
            if (messageSenderInfoElement) {
                if (messageSenderInfoElement.innerText.trim() === otherUserName.trim()) {
                    messageSpeaker = otherUserName;
                } else {
                    messageSpeaker = "self";
                }
            }
            const messageText = messageTextElement?.innerText ?? "";
            allMessages.push({ messageSpeaker, messageText });
        }
        // EvyAILogger.log(allMessages, "all message");
        return allMessages.reverse().slice(0, numberOfMessages);
    };

    const addCurateIconOnMessageBox = async (messageBoxTextEditorContainer: any) => {

        await sleep(1000);
        // Traverse upwards to locate the form element
        let formElement = messageBoxTextEditorContainer.closest('form.msg-form');

        // Locate the footer inside the form
        const messageBoxFooter = formElement ? formElement.querySelector('.msg-form__footer') : null;

        // Check if the icon already exists
        if (messageBoxFooter.querySelector(`.curateai-open-popup-icon`)) {
            return;
        }
        if (messageBoxFooter) {
            // Create and append the custom icon
            const button = document.createElement("button");
            const icon = document.createElement("img");
            icon.setAttribute("style", "width: 18px; height: 18px;");
            icon.src = chrome.runtime.getURL("/f-logo.png");
            icon.alt = "curateai-open-popup-icon";
            button.setAttribute(
                "style",
                "width: 40px; height: 40px; cursor: pointer; display: flex; justify-content: center; align-items: center; "
            );
            button.appendChild(icon);
            button.setAttribute("class", "curateai-open-popup-icon");
            button.setAttribute("type", "button");

            button.addEventListener("click", () => {
                const otherUserName = getOtherUserNameOnMessagePage(messageBoxTextEditorContainer);
                const lastMessages = getLastMessages(messageBoxTextEditorContainer, otherUserName, 6);
                setLastMessages(lastMessages);
                setPostData({ postText: "", postAutherName: otherUserName, commentText: "", commentAuthorName: "" });
                setSelectedMessageBoxContainer(messageBoxTextEditorContainer);
                setPopupTriggeredFrom("message-reply");
                setOpenAiPopup(true);
            });

            messageBoxFooter.appendChild(button);
        } else {
            console.log("Footer not found");
        }
    };

    const addCustomCommentIconLinkedIn = () => {
        const commentBoxes = document.querySelectorAll(
            ".comments-comment-box__form .comments-comment-texteditor"
        );

        const messageBoxes = document.querySelectorAll(
            ".msg-form__msg-content-container"
        );

        if (messageBoxes) {
            messageBoxes.forEach((box) => {
                addCurateIconOnMessageBox(box);
            })
        }

        commentBoxes.forEach((box) => {
            // Check if the custom icon already exists
            if (box.querySelector(".curateai-open-popup-icon")) return;

            const commentBoxCr = box.closest(`.${LINKEDIN_CLASS_NAMES.COMMENT_BOX_CR}`) as HTMLElement;
            const commentBoxCrId = commentBoxCr?.id || 'No ID found';

            let appendIcon = box.querySelector(".comments-comment-box__detour-container") as HTMLElement;
            // Create and append the custom icon
            const customIcon = document.createElement("div");
            customIcon.style.backgroundImage = `url(${chrome.runtime.getURL("/f-logo.png")})`;
            customIcon.style.backgroundSize = "contain"; // Ensures the image fits inside
            customIcon.style.backgroundRepeat = "no-repeat";
            customIcon.style.backgroundPosition = "center";
            customIcon.className = "curateai-open-popup-icon";
            customIcon.style.cursor = "pointer";
            customIcon.style.width = "21px";
            customIcon.style.height = "21px";
            customIcon.style.margin = "9px 7px 10px 8px";
            customIcon.style.border = "2px solid #ff5c35";
            customIcon.style.borderRadius = "50%";
            customIcon.style.padding = "10px";

            customIcon.addEventListener("click", () => {
                setSelectedCommentBoxId(commentBoxCrId);
                if (isLinkedInArticlePage(window.location.href)) {
                    getArticlePageInfo(box);
                } else {
                    getPostAndCommentInfo(box, false);
                }

                setOpenAiPopup(true);
            });

            appendIcon.appendChild(customIcon);
        });
    };

    const addCustomIconToElement = (element: HTMLElement) => {
        // Check if the custom icon already exists
        if (element.querySelector(".curateai-open-popup-icon")) return;

        // Create and append the custom icon
        const customIcon = document.createElement("span");
        customIcon.className = "curateai-open-popup-icon";
        customIcon.style.cssText = "display: inline-flex; align-items: center; margin-left: 3px; cursor: pointer; position: relative; top: 7px; background: #ff5c35; border-radius: 50px; padding: 2px;";

        const contentsSpan = document.createElement("span");
        contentsSpan.className = "contents";
        contentsSpan.style.cssText = "border-radius: 50px; padding: 3px 8px 2px 2px; display: flex; align-items: center;background: #fff;";

        // Create image span
        const imgSpan = document.createElement("span");
        const imgElement = document.createElement("img");
        imgElement.src = chrome.runtime.getURL("/f-logo.png");
        imgElement.alt = "Post";
        imgSpan.style.cssText = "width: 25px; display: inline-flex; height: 25px; overflow: hidden; margin-left: 3px; padding: 2px; cursor: pointer;border: 2px solid #ff5c35; border-radius: 50%;";
        imgSpan.appendChild(imgElement);

        // Create text span
        const textSpan = document.createElement("span");
        textSpan.innerText = "Post";
        textSpan.style.cssText = "margin-left: 5px; font-size: 15px; color: #ff5c35;";

        // Append image and text spans to contents span
        contentsSpan.appendChild(imgSpan);
        contentsSpan.appendChild(textSpan);

        // Append contents span to main span
        customIcon.appendChild(contentsSpan);

        customIcon.addEventListener("click", () => {
            console.log("Icon clicked, triggering popup.");
            setPopupTriggeredFrom("create-post");
            setOpenAiPopup(true);
        });

        element?.insertBefore(customIcon, element.lastElementChild);
    };

    const addIconInCreatePostLinkedin = () => {
        const modalPostBox = document.querySelector(`.${LINKEDIN_CLASS_NAMES.SHARE_CREATION_FOOTER}`) as HTMLElement; // LinkedIn's create-post modal class
        if (modalPostBox) {
            addCustomIconToElement(modalPostBox);
        }
    };

    const storeLoggedInLinkedInUserNameInStorage = () => {
        if (localStorage.getItem("linkedInUserName")) {
            return; // Exit the function early
        }
        const meDropDownElement = document.querySelector(`.${LINKEDIN_CLASS_NAMES.ME_MENU_TRIGGER}`) as HTMLElement;

        if (meDropDownElement) {
            const meMenuItemsContainer = document.querySelector(`.${LINKEDIN_CLASS_NAMES.ME_MENU_ITEMS_CONTAINER}`) as HTMLElement;

            if (meMenuItemsContainer) {
                // Temporarily hide the menu
                meDropDownElement.click();
                meMenuItemsContainer.style.opacity = "0";

                const div = meMenuItemsContainer.children[0]

                const header = div.querySelector('.p2') as HTMLElement;

                if (header) {
                    const linkElement = header.querySelector('a') as HTMLElement;

                    if (linkElement) {
                        const href = linkElement.getAttribute('href');

                        if (href) {
                            localStorage.setItem('linkedInProfileUrl', href);
                        }
                    }
                    const title = header.querySelector(`.${LINKEDIN_CLASS_NAMES.ART_DECO_ENTITY_LOCKUP__TITLE}`) as HTMLElement;
                    const userName = title.textContent?.trim();
                    if (userName) {
                        // Store the extracted name in local storage
                        localStorage.setItem("linkedInUserName", userName);
                    } else {
                    }
                }


                // Restore the original display style
                setTimeout(() => {
                    if (localStorage.getItem('linkedInUserName')) {

                        meMenuItemsContainer.style.opacity = "1";
                    }
                }, 1000);
            } else {
                console.warn("Menu items container not found.");
            }
        } else {
            console.warn("Dropdown trigger element not found.");
        }
    };

    useEffect(() => {
        addCustomCommentIconLinkedIn();

        // Set up MutationObserver
        const observer = new MutationObserver(() => {
            storeLoggedInLinkedInUserNameInStorage();
            addCustomCommentIconLinkedIn();
            addIconInCreatePostLinkedin();
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
                    insertGeneratedComment={insertGeneratedCommentLinkedin}
                    insertGeneratedPost={insertGeneratedPostLinkedIn}
                    popupTriggeredFrom={popupTriggeredFrom}
                    articleInfo={articleInfo}
                    lastMessages={lastMessages}
                />
            </div>
        );
    }

    return null;
};

export default LinkedIn;
