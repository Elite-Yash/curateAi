// Import necessary scripts for configuration and keeping the extension alive
console.log("Background...!");
importScripts("./apiUrlConfig.js");

// background.js
let lastLinkedInTabId = null;
let campaignActive = false;
let campaignTabIds = [];

// Track tabs that belong to LinkedIn during an active campaign
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && tab.url.includes("linkedin.com")) {
    lastLinkedInTabId = tabId;

    // Track tab if campaign is running and not already tracked
    if (campaignActive && !campaignTabIds.includes(tabId)) {
      campaignTabIds.push(tabId);
      console.log("🆕 Tracked LinkedIn tab:", tabId);
    }
  }
});

// Remove closed tabs from tracking
chrome.tabs.onRemoved.addListener((tabId) => {
  campaignTabIds = campaignTabIds.filter((id) => id !== tabId);
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

    campaignActive = true;
    campaignTabIds = [];

    chrome.tabs.create({ url }, (tab) => {
      if (!tab.id) return;

      const listener = (tabId, changeInfo, tabInfo) => {
        if (tabId === tab.id && changeInfo.status === 'complete') {
          const isSameUrl = tabInfo.url?.includes(url.split("?")[0]) ?? false;
          console.log({ isSameUrl, url: tabInfo.url });

          sendResponse({ status: 'tabCreated', isSameUrl });

          if (isSameUrl) {
            setTimeout(() => {
              if (url.includes("linkedin.com/groups/")) {
                chrome.tabs.sendMessage(tabId, {
                  type: "fetchGroupsMembers",
                  maxConnections,
                  campaign_id,
                  message,
                  typeOfCampaign,
                  campaignName
                });
              } else if (url.includes("linkedin.com/search/")) {
                chrome.tabs.sendMessage(tabId, {
                  type: "fetchSearchMembers",
                  maxConnections,
                  campaign_id,
                  message,
                  typeOfCampaign,
                  campaignName
                });
              }
            }, 500);
          }

          chrome.tabs.onUpdated.removeListener(listener);
        }
      };

      chrome.tabs.onUpdated.addListener(listener);
    });

    return true;
  }

  // --- OPEN PROFILE TAB ---
  if (request.type === "OPEN_PROFILE_TAB") {
    const { profileLink, name, message, action } = request.data;
    console.log("Opening profile:", { profileLink, name, message, action });

    if (!campaignActive) {
      console.warn("⚠️ Campaign not active, ignoring OPEN_PROFILE_TAB.");
      return;
    }

    chrome.tabs.create({ url: profileLink, active: false }, (tab) => {
      if (!tab?.id) return;

      // Add immediately in case URL isn’t ready yet
      if (!campaignTabIds.includes(tab.id)) {
        campaignTabIds.push(tab.id);
        console.log("🆕 Added new profile tab:", tab.id);
      }

      const tabId = tab.id;
      let retryCount = 0;
      const maxRetries = 10;

      const onLoad = (updatedTabId, changeInfo) => {
        if (!campaignActive) {
          chrome.tabs.onUpdated.removeListener(onLoad);
          return;
        }

        if (updatedTabId === tabId && changeInfo.status === "complete") {
          const sendProcessMessage = () => {
            if (!campaignActive) return;

            if (retryCount >= maxRetries) {
              console.warn("⚠️ Max retries reached for PROCESS_MEMBER.");
              return;
            }

            retryCount++;

            chrome.tabs.sendMessage(
              tabId,
              { type: "PROCESS_MEMBER", data: { name, message, action } },
              (response) => {
                if (chrome.runtime.lastError) {
                  console.warn(`⏳ Content script not ready (attempt ${retryCount})...`);
                  setTimeout(sendProcessMessage, 1000);
                } else {
                  console.log("📨 PROCESS_MEMBER sent successfully.");
                }
              }
            );
          };

          setTimeout(sendProcessMessage, 1500);
          chrome.tabs.onUpdated.removeListener(onLoad);
        }
      };

      chrome.tabs.onUpdated.addListener(onLoad);
    });

    return true;
  }

  // --- CLOSE PROFILE TAB AFTER MESSAGE SENT ---
  if (request.type === "CLOSE_ACTIVE_TAB" && sender.tab && sender.tab.id) {
    setTimeout(() => {
      chrome.tabs.remove(sender.tab.id);
      chrome.runtime.sendMessage({ type: "PROFILE_DONE" });
    }, 1500);
    return;
  }

  // --- STOP CAMPAIGN ---
  if (request.type === "stopCampaign") {
    console.log("🛑 Stopping campaign...");
    campaignActive = false;

    if (campaignTabIds.length > 0) {
      console.log("Closing all LinkedIn tabs:", campaignTabIds);
      for (const tabId of campaignTabIds) {
        chrome.tabs.remove(tabId, () => {
          console.log("✅ Closed LinkedIn tab:", tabId);
        });
      }
      campaignTabIds = [];
    } else {
      console.warn("⚠️ No LinkedIn tabs tracked.");
    }

    lastLinkedInTabId = null;
    return;
  }

  // --- STATUS CHECK ---
  if (request.type === "isCampaignActive") {
    sendResponse({ active: campaignActive });
    return true;
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




  // 🚀 Start main scraping
  if (request.type === "START_SCRAPING") {
    chrome.storage.local.get(["lastScrapeTime", "totalScraped", "scrapedConnections"], (data) => {
      const now = Date.now();
      const lastScrape = data.lastScrapeTime ? new Date(data.lastScrapeTime).getTime() : 0;
      const hoursPassed = (now - lastScrape) / (1000 * 60 * 60);
      const totalScraped = data.totalScraped || 0;

      // 500 Limit Check
      if (totalScraped >= 500) {
        chrome.runtime.sendMessage({
          type: "SHOW_ALERT",
          message: "You have reached the 500 connections limit!",
        });
        return;
      }

      // 24 Hour Restriction
      if (hoursPassed < 24 && totalScraped > 0) {
        const remaining = (24 - hoursPassed).toFixed(1);
        chrome.runtime.sendMessage({
          type: "SHOW_ALERT",
          message: `You can scrape again after ${remaining} hours.`,
        });
        return;
      }

      // Start Range
      const startFrom = totalScraped;
      const endAt = Math.min(totalScraped + 100, 500);

      chrome.tabs.create(
        { url: "https://www.linkedin.com/mynetwork/invite-connect/connections/", active: false,  },
        (tab) => {
          chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
            if (tabId === tab.id && info.status === "complete") {
              setTimeout(() => {
                chrome.tabs.sendMessage(tab.id, {
                  type: "START_CONNECTION_SCRAPING",
                  startFrom,
                  endAt,
                });
              }, 2000);

              chrome.runtime.onMessage.addListener(function handleResponse(msg) {
                if (msg.type === "CONNECTIONS_SCRAPED") {
                  const newData = msg.data || [];

                  const updatedConnections = [
                    ...(data.scrapedConnections || []),
                    ...newData,
                  ];

                  chrome.storage.local.set({
                    scrapedConnections: updatedConnections,
                    totalScraped: updatedConnections.length,
                    lastScrapeTime: new Date().toISOString(),
                  });

                  chrome.tabs.remove(tab.id);

                  //  Now start one-by-one profile scraping
                  scrapeAllProfiles(newData);
                  chrome.runtime.onMessage.removeListener(handleResponse);
                }
              });

              chrome.tabs.onUpdated.removeListener(listener);
            }
          });
        }
      );
    });
  }

  // Cleanup for profile tabs
  if (request.type === "PROFILE_SCRAPING_DONE" && sender.tab?.id) {
    chrome.tabs.remove(sender.tab.id);
  }


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


// background.js — updated scrapeAllProfiles with overlay contact scraping
async function scrapeAllProfiles(connectionList, connectionTabId) {
  const results = [];

  for (let i = 0; i < connectionList.length; i++) {
    const { navigationUrl } = connectionList[i];

    // 1) Open profile in a VISIBLE tab (user should see it)
    const tab = await new Promise((resolve) =>
      chrome.tabs.create({ url: navigationUrl, active: true }, resolve)
    );

    // 2) Wait for profile page to finish loading (status "complete")
    await new Promise((resolve) => {
      const listener = (tabId, info) => {
        if (tabId === tab.id && info.status === "complete") {
          chrome.tabs.onUpdated.removeListener(listener);
          // small extra delay to let LinkedIn render SPA content
          setTimeout(resolve, 1200);
        }
      };
      chrome.tabs.onUpdated.addListener(listener);
    });

    // 3) Scrape main profile fields (name, position, city) using executeScript
    let mainResult = { name: "", position: "", city: "" };
    try {
      const execRes = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          // This runs inside profile page context
          const grab = (sel) =>
            document.querySelector(sel)?.innerText?.trim?.() || "";
          const name = grab(".text-heading-xlarge") || grab("h1");
          const position = grab(".text-body-medium.break-words");
          const city = grab(".text-body-small.inline.t-black--light.break-words");
          return { name, position, city };
        },
      });
      mainResult = (execRes && execRes[0] && execRes[0].result) || mainResult;
    } catch (e) {
      console.warn("⚠️ main profile scrape failed:", e);
    }

    // 4) Now navigate this SAME tab to overlay contact page
    // ensure trailing slash and then 'overlay/contact-info/'
    const overlayUrl = navigationUrl.replace(/\/+$/, "") + "/overlay/contact-info/";
    try {
      await new Promise((resolve) => {
        chrome.tabs.update(tab.id, { url: overlayUrl, active: true }, (updatedTab) => {
          // Wait for overlay page to load
          const listener2 = (tabId, info) => {
            if (tabId === updatedTab.id && info.status === "complete") {
              chrome.tabs.onUpdated.removeListener(listener2);
              // give a bit of time for overlay content to render
              setTimeout(resolve, 1000);
            }
          };
          chrome.tabs.onUpdated.addListener(listener2);
        });
      });
    } catch (e) {
      console.warn("⚠️ overlay navigation failed:", e);
    }

    // 5) Scrape overlay page: try DOM selectors, fallback to body text + regex
    let contactResult = { email: "", phone: "" };
    try {
      const execRes2 = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          // run inside overlay page
          const out = { email: "", phone: "" };

          // 1) try common selectors (LinkedIn overlay may have mailto/tel anchors)
          const emailEl = document.querySelector("a[href^='mailto:']");
          if (emailEl) out.email = emailEl.innerText?.trim?.() || emailEl.getAttribute("href")?.replace(/^mailto:/, "") || "";

          const phoneEl = document.querySelector("a[href^='tel:']");
          if (phoneEl) out.phone = phoneEl.innerText?.trim?.() || phoneEl.getAttribute("href")?.replace(/^tel:/, "") || "";

          // 2) fallback: search visible text for emails/phones
          if (!out.email || !out.phone) {
            const text = (document.body && document.body.innerText) || "";
            // email regex
            const emailRegex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
            const foundEmails = text.match(emailRegex);
            if (!out.email && foundEmails && foundEmails.length) out.email = foundEmails[0];

            // phone regex (lenient)
            const phoneRegex = /(\+\d{1,3}[\s-]?)?\(?\d{3,5}\)?[\s-]?\d{3,5}[\s-]?\d{4,6}/g;

            const foundPhones = (text.match(phoneRegex) || []).filter(p => p.replace(/\D/g, "").length >= 8);
            if (!out.phone && foundPhones.length) out.phone = foundPhones[0];
          }

          return out;
        },
      });

      contactResult = (execRes2 && execRes2[0] && execRes2[0].result) || contactResult;
    } catch (e) {
      console.warn("⚠️ overlay scrape failed:", e);
    }

    // 6) Merge results and push
    const fullProfile = {
      ...connectionList[i],
      name: mainResult.name || connectionList[i].name,
      position: mainResult.position || "",
      city: mainResult.city || "",
      email: contactResult.email || "",
      phone: contactResult.phone || "",
      scrapedAt: new Date().toISOString(),
    };

    results.push(fullProfile);

    // 7) Send LIVE update to React/UI so table can show row-by-row
    chrome.runtime.sendMessage({
      type: "LIVE_PROFILE_SCRAPED",
      data: fullProfile,
      current: i + 1,
      total: connectionList.length,
    });

    // 8) Close this profile tab
    try {
      await chrome.tabs.remove(tab.id);
    } catch (e) {
      console.warn("⚠️ failed to close profile tab:", e);
    }

    // 9) Focus back to connection tab so user returns there
    try {
      await chrome.tabs.update(connectionTabId, { active: true });
    } catch (e) {
      // ignore
    }

    // 10) polite delay before next profile to avoid rate-limit
    await new Promise((r) => setTimeout(r, 2500));
  } // for each profile

  // All done: merge into chrome.storage and notify
  chrome.storage.local.get(["profileDetails"], (store) => {
    const merged = [...(store.profileDetails || []), ...results];
    chrome.storage.local.set({ profileDetails: merged }, () => {

      // close the connection tab (if you want)
      try {
        chrome.tabs.remove(connectionTabId);
      } catch (e) {
        // ignore
      }

      chrome.runtime.sendMessage({
        type: "SCRAPING_COMPLETE",
        data: merged,
      });
    });
  });
}

