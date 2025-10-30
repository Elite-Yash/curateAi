// Import necessary scripts for configuration and keeping the extension alive
console.log("Background...!");
importScripts("./apiUrlConfig.js");

// background.js
let lastLinkedInTabId = null;

// Listen for updates to tabs
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && tab.url.includes("linkedin.com")) {
    lastLinkedInTabId = tabId; // Update the ID of the last LinkedIn tab
  }
});

// Listen for tab activation
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.url && tab.url.includes("linkedin.com")) {
      lastLinkedInTabId = tab.id; // Update the ID of the last active LinkedIn tab
    }
  });
});

// Set a flag when the extension is installed
chrome.runtime.onInstalled.addListener((details) => {
  // Save install flag
  chrome.storage.local.set({ isInstalled: true });

  // Only open dashboard on first install (not on update or Chrome restart)
  if (details.reason === "install") {
    chrome.tabs.create({
      url: chrome.runtime.getURL("dashboard.html")
    });
  }
});

// Clear specific data when the extension is unloaded
chrome.runtime.onSuspend.addListener(() => {
  chrome.storage.local.remove(["token", "isInstalled", "crmData"]);
  chrome.storage.local.remove([
    "selectedLanguage",
    "selectedTone",
    "selectedMotive",
  ]);
});

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
    const {
      language,
      tone,
      postText,
      authorName,
      contentType,
      command,
      platform,
      commentAuthorName,
      commentText,
      goal,
      articleInfo,
      lastMessages,
      currentUserName,
      authToken,
    } = request.data;

    // Perform the API call
    const url = `${BASE_URL}${GENERATE_CONTENT_URL}`;

    fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language,
        tone,
        postText,
        authorName,
        contentType,
        command,
        platform,
        commentAuthorName,
        commentText,
        goal,
        articleInfo,
        lastMessages,
        currentUserName,
      }),
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
    sendResponse({ success: true });
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

  if (request.type === "startCampaign") {
    const { maxConnections, url, campaign_id, message, typeOfCampaign, campaignName } = request;

    chrome.tabs.create({ url }, (tab) => {
      if (!tab.id) return;

      const listener = (tabId, changeInfo, tabInfo) => {
        if (tabId === tab.id && changeInfo.status === 'complete') {
          const isSameUrl = tabInfo.url?.includes(url.split("?")[0]) ?? false;
          console.log({ isSameUrl, url: tabInfo.url });

          sendResponse({ status: 'tabCreated', isSameUrl });

          if (isSameUrl) {
            setTimeout(() => { // small delay to ensure content script is ready
              if (url.includes("linkedin.com/groups/")) {
                chrome.tabs.sendMessage(tabId, { type: "fetchGroupsMembers", maxConnections, campaign_id, message, typeOfCampaign, campaignName });
              } else if (url.includes("linkedin.com/search/")) {
                chrome.tabs.sendMessage(tabId, { type: "fetchSearchMembers", maxConnections, campaign_id, message, typeOfCampaign, campaignName });
              }
            }, 500);
          }

          chrome.tabs.onUpdated.removeListener(listener);
        }
      };

      chrome.tabs.onUpdated.addListener(listener);
    });

    return true; // Keep sendResponse channel open for async
  }

  if (request.type === "stopCampaign") {
    if (lastLinkedInTabId) {
      chrome.tabs.sendMessage(lastLinkedInTabId, { type: "stopCampaign" });
    } else {
      console.error("No LinkedIn tab tracked.");
    }
  }

  if (request.type === "saveMembersData") {
    const { messageSendMember, campaignId, typeOfCampaign, campaignName } = request;

    saveMembersData(campaignId, messageSendMember, typeOfCampaign, campaignName)
      .then((success) => {
        if (success) {
          chrome.runtime.sendMessage({ type: "campaignComplate", campaignId });
        }
      })
      .catch((error) => {
        console.error("Error saving members data:", error);
      });
  }

//  My Linkedin scripting data message pass
  if (request.type === "START_SCRAPING") {
    chrome.storage.local.get(["lastScrapeTime", "totalScraped", "scrapedConnections"], (data) => {
      const now = new Date().getTime();
      const lastScrape = data.lastScrapeTime ? new Date(data.lastScrapeTime).getTime() : 0;
      const hoursPassed = (now - lastScrape) / (1000 * 60 * 60);
      // const minutesPassed = (now - lastScrape) / (60 * 1000);

      const totalScraped = data.totalScraped || 0;

      // ✅ Limit check 500
      if (totalScraped >= 500) {
        chrome.runtime.sendMessage({
          type: "SHOW_ALERT",
          message: "You have reached the 500 connections limit!",
        });
        return;
      }

      //       if (minutesPassed < 1 && totalScraped > 0) {
      //   const remaining = Math.ceil(1 - minutesPassed);
      //   chrome.runtime.sendMessage({
      //     type: "SHOW_ALERT",
      //     message: `You can scrape again after ${remaining} minute(s).`,
      //   });
      //   return;
      // }

      // ⏰ 24 hour lock check
      if (hoursPassed < 24 && totalScraped > 0) {
        const remaining = (24 - hoursPassed).toFixed(1);
        chrome.runtime.sendMessage({
          type: "SHOW_ALERT",
          message: `You can scrape again after ${remaining} hours.`,
        });
        return;
      }

      // ✅ Allowed to scrape next 100
      const startFrom = totalScraped + 1;
      const endAt = Math.min(totalScraped + 100, 500);

      chrome.tabs.create(
        { url: "https://www.linkedin.com/mynetwork/invite-connect/connections/" },
        (tab) => {
          chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
            if (tabId === tab.id && info.status === "complete") {
              chrome.scripting.executeScript(
                {
                  target: { tabId: tab.id },
                  func: scrapeLinkedInConnections,
                  args: [startFrom, endAt],
                },
                async (results) => {
                  const newData = results?.[0]?.result || [];

                  // Close tab safely
                  chrome.tabs.remove(tab.id);

                  const updatedConnections = [
                    ...(data.scrapedConnections || []),
                    ...newData,
                  ];

                  chrome.storage.local.set({
                    scrapedConnections: updatedConnections,
                    totalScraped: updatedConnections.length,
                    lastScrapeTime: new Date().toISOString(),
                  });

                  chrome.runtime.sendMessage({
                    type: "CONNECTIONS_IMPORTED",
                    data: updatedConnections,
                  });
                }
              );

              chrome.tabs.onUpdated.removeListener(listener);
            }
          });
        }
      );
    });
  }


  // important: return true to keep the message channel open for async operations
  return true;
});

const saveMembersData = async (campaign_id, members, typeOfCampaign, campaignName) => {
  try {
    const firstResult = await makeApiRequest(
      `${BASE_URL}/campaigns/create-automation-process`,
      "POST",
      { campaign_id, name: campaignName }
    );

    if (firstResult.status === 201 && firstResult.data) {
      const automationId = firstResult.data?.automation_id;

      if (!automationId) {
        console.error("Automation ID not found in the response:", firstResult);
        return false;
      }

      const secondResult = await makeApiRequest(
        `${BASE_URL}/process-activities/create-activities`,
        "POST",
        {
          campaignId: campaign_id,
          profiles: members,
          type: typeOfCampaign,
          automation_id: automationId
        }
      );

      if (secondResult.status === 201) {
        chrome.runtime.sendMessage({ type: "connectionComplete", campaign_id });
        return true;
      } else {
        console.error("Second API call failed:", secondResult);
        return false;
      }
    } else {
      console.error("First API call failed:", firstResult);
      return false;
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return false;
  }
};


const makeApiRequest = async (url, method, bodyData) => {
  try {
    // Get token from chrome storage
    const token = await new Promise((resolve, reject) => {
      chrome.storage.local.get(['token'], (data) => {
        if (data && data.token) {
          resolve(data.token);
        } else {
          reject('Token not found');
        }
      });
    });

    if (!token) {
      console.error('Token not found.');
      return { data: null, status: 401 };
    }

    const options = {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    // Only include body if it's not a GET request
    if (bodyData && method !== 'GET') {
      options.body = JSON.stringify(bodyData);
    }

    const res = await fetch(url, options);
    let responseData = null;

    try {
      responseData = await res.json();
    } catch (e) {
      responseData = null; // In case the response has no body
    }

    return {
      data: responseData,
      status: res.status,
    };
  } catch (error) {
    console.error('Fetch error:', error);
    return { data: null, status: 500 };
  }
};

//  My Linkedin scripting data 100 connection
async function scrapeLinkedInConnections(startIndex = 1, endIndex = 100) {
  async function autoScrollDown(scrollStep = 1000, intervalTime = 600, maxSteps = 10) {
    function findScrollable() { 
      const all = [...document.querySelectorAll("body, body *")];
      const sorted = all
        .map(e => ({ el: e, diff: e.scrollHeight - e.clientHeight }))
        .filter(x => x.diff > 10)
        .sort((a, b) => b.diff - a.diff);
      return sorted.length
        ? sorted[0].el
        : (document.scrollingElement || document.documentElement);
    }

    const el = findScrollable();
    let count = 0;
    return new Promise(resolve => {
      const id = setInterval(() => {
        if (el === window || el === document.scrollingElement || el === document.documentElement) {
          window.scrollBy({ top: scrollStep, behavior: "smooth" });
          if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 5) {
            clearInterval(id);
            resolve();
          }
        } else {
          el.scrollBy({ top: scrollStep, behavior: "smooth" });
          if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5) {
            clearInterval(id);
            resolve();
          }
        }
        count++;
        if (count > maxSteps) {
          clearInterval(id);
          resolve();
        }
      }, intervalTime);
    });
  }

  async function extractConnections(start, end) {
    const connections = [];

    for (let i = 0; i < 15; i++) {
      const cards = document.querySelectorAll('div[data-view-name="connections-list"] > div');
      if (cards.length >= end) break;
      await autoScrollDown(1000, 800, 4);
      await new Promise(r => setTimeout(r, 1500));
    }

    const cards = document.querySelectorAll('div[data-view-name="connections-list"] > div');
    cards.forEach((el, i) => {
      if (i >= start - 1 && i < end) {
        const name = el.querySelector("a p")?.innerText?.trim() || "";
        const occupation = el.querySelectorAll("a p")[1]?.innerText?.trim() || "";
        const profileLink = el.querySelector('a[href*="/in/"]')?.href || "";

        if (name) {
          connections.push({ name, occupation, profileLink });
        }
      }
    });
    return connections;
  }

  const connetionMemberData = await extractConnections(startIndex, endIndex);
  return connetionMemberData;
}