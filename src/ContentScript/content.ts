
function addCustomIcons() {
    const commentBoxes = document.querySelectorAll(
        '.comments-comment-box__form .comments-comment-texteditor .editor-container'
    );

    commentBoxes.forEach((box) => {
        // Find the parent element with the class 'comments-comment-box--cr'
        const commentBoxCr = box.closest('.comments-comment-box--cr');

        // Check if the element exists and has an ID
        const commentBoxCrId = commentBoxCr?.id || 'No ID found';

        console.log("Comment Box ID:", commentBoxCrId);

        if (!box.querySelector('.custom-comment-icon')) {
            const customIcon = document.createElement('img');
            customIcon.src = chrome.runtime.getURL('/icon.png'); // Adjust the path to match your folder structure
            customIcon.alt = 'Custom Icon';
            customIcon.className = 'custom-comment-icon';
            customIcon.style.cursor = 'pointer';
            customIcon.style.marginLeft = '10px';
            customIcon.style.width = '24px';
            customIcon.style.height = '24px';

            customIcon.addEventListener('click', () => {
                console.log(`Custom icon clicked in box with ID: ${commentBoxCrId}`);
                alert(`Custom icon clicked in box with ID: ${commentBoxCrId}`);
            });

            box.appendChild(customIcon);
        }
    });
}

const observer = new MutationObserver(addCustomIcons);

observer.observe(document.body, {
    childList: true, // Watch for added or removed child nodes
    subtree: true,   // Watch all descendant nodes
});

addCustomIcons();
