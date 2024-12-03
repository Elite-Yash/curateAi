// Import necessary scripts for configuration and keeping the extension alive
console.log("Background...!");
importScripts('./apiUrlConfig.js');

// When toolbar icon is clicked, toggle popup in the current tab
chrome.action.onClicked.addListener(function (tab) {
    chrome.tabs.create({ url: "https://www.linkedin.com" });
});


// background.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "GENERATE_CONTENT") {
        const { language, tone, postText, authorName, contentType, command, platform } = request.data;
        console.log('request.data: ', request.data);

        // Perform the API call


        const url = `${BASE_URL}${GENERATE_CONTENT_URL}`;

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ language, tone, postText, authorName, contentType, command, platform }),
        })
            .then((response) => response.json())
            .then((data) => {
                // Send success response back to the popup
                sendResponse({ success: true, data });
            })
            .catch((error) => {
                // Send error response back to the popup
                sendResponse({ success: false, error });
            });

        // Return true to indicate that the response will be sent asynchronously
        return true;
    }
});
