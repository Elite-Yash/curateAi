// Import necessary scripts for configuration and keeping the extension alive
console.log("Background...!");
importScripts('./apiUrlConfig.js');

// When toolbar icon is clicked, toggle popup in the current tab
chrome.action.onClicked.addListener(function (tab) {
    chrome.tabs.create({ url: "https://www.linkedin.com" });
});


// Background script or content script
chrome.webNavigation.onCompleted.addListener((details) => {
    if (details.url.includes("linkedin.com/m/logout")) {
        // Clear localStorage when the user logs out
        localStorage.clear();
    }
}, { url: [{ hostContains: 'linkedin.com' }] });


// background.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    // Retrieve Token from Chrome Storage
    if (request.type === "getCookies") {
        chrome.storage.local.get(["token"], (result) => {
            if (result.token) {
                sendResponse({ success: true, token: result.token });
            }
        });

        return true; // Keep async response channel open
    }

    // Check if the message type is "LogOut"
    if (request.type === "LogOut") {
        if (request.action === "PopupLogout") {
            
            chrome.storage.local.remove("token", () => {
                // Get the dynamic extension URL
                const extensionBaseUrl = `chrome-extension://${chrome.runtime.id}/dashboard.html`;
                // Find the dashboard tab and close it
                chrome.tabs.query({}, (tabs) => {
                    tabs.forEach((tab) => {
                        if (tab.url === extensionBaseUrl) {
                            chrome.tabs.remove(tab.id);
                        }
                    });
                });

                sendResponse({ success: true });
            });
        } else {
            chrome.storage.local.remove("token", () => {
                sendResponse({ success: true });
            });
        }
        return true; // Keep the message channel open for async response
    }


    if (request.type === "GENERATE_CONTENT") {
        const { language, tone, postText, authorName, contentType, command, platform, commentAuthorName, commentText, goal, articleInfo, lastMessages, currentUserName, authToken } = request.data;
        console.log('request.data: ', request.data);

        // Perform the API call


        const url = `${BASE_URL}${GENERATE_CONTENT_URL}`;

        fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${authToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ language, tone, postText, authorName, contentType, command, platform, commentAuthorName, commentText, goal, articleInfo, lastMessages, currentUserName }),
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

    if (request.type === "reload") {
        sendResponse({ success: true })
        return true;
    }

    // Fetch API call
    if (request.type === "api-request") {
        const response = {
            data: null,
            status: 0,
        };

        // Rebuild FormData if required
        const formRequest = Object.keys(request.formData).length ? true : false;
        const form = new FormData();
        if (formRequest) {
            for (const key in request.formData) {
                if (Object.prototype.hasOwnProperty.call(request.formData, key)) {
                    form.append(key, request.formData[key]);
                }
            }
        }

        // Perform the fetch call
        fetch(request.requestUrl, {
            method: request.method, // GET or POST
            headers: request.header,
            body: formRequest ? form : request.body,
        })
            .then((res) => {
                response.status = res.status;

                // Determine response type based on Content-Type header
                const contentType = res.headers.get("Content-Type");
                if (contentType) {
                    if (contentType.includes("application/json")) {
                        return res.json(); // Handle JSON
                    } else if (contentType.includes("text/html")) {
                        return res.text(); // Handle HTML as plain text
                    } else if (contentType.includes("text/plain")) {
                        return res.text(); // Handle plain text
                    }
                }

                // Default fallback if content type is unknown
                return res.text();
            })
            .then((data) => {
                response.data = data || null; // Assign the fetched data
                sendResponse(response); // Send the response back
            })
            .catch((error) => {
                console.error("Fetch error:", error); // Log the error for debugging
                response.status = 500; // Set status to 500 for server errors
                sendResponse(response);
            });

        return true; // Required for async sendResponse
    }

});
