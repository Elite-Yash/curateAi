import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind + clsx classes
 *
 * @param {...ClassValue[]} inputs - Accepts strings, arrays, or objects
 * @returns {string} - The merged className string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

let messageBoxOpened = false;

export const LinkedInHelper = {

  // waitRandom
  waitRandom: (min: number, max: number): Promise<void> => {
    return new Promise((resolve) => {
      const delay = Math.floor(Math.random() * (max - min + 1)) + min;
      setTimeout(resolve, delay);
    });
  },
  // Helper method to wait for full page load
  waitForPageLoad: async (): Promise<void> => {
    return new Promise((resolve) => {
      if (document.readyState === "complete") {
        resolve();
      } else {
        window.addEventListener("load", () => resolve(), { once: true });
      }
    });
  },

  waitForElement: async (selector: string, timeout = 10000): Promise<Element | null> => {
    return new Promise((resolve) => {
      const interval = 500;
      let elapsed = 0;

      const timer = setInterval(() => {
        const el = document.querySelector(selector);
        if (el) {
          clearInterval(timer);
          resolve(el);
        }

        elapsed += interval;
        if (elapsed >= timeout) {
          clearInterval(timer);
          resolve(null);
        }
      }, interval);
    });
  },

  // Human-like click event
  humanClick: (el: HTMLElement): boolean => {
    if (!el) return false;

    try {
      el.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      ["mousedown", "mouseup", "click"].forEach((eventType) => {
        const event = new MouseEvent(eventType, {
          bubbles: true,
          cancelable: true,
          view: window,
        });
        el.dispatchEvent(event);
      });
      return true;
    } catch (err) {
      console.error("❌ humanClick failed:", err);
      return false;
    }
  },

  // Fetch LinkedIn members
  fetchMembers: async ({ maxConnections, campaignId, message, typeOfCampaign, stopCampaign, campaignName }: any) => {
    await LinkedInHelper.waitForPageLoad();

    const currentWindow = window?.location?.href;
    if (!currentWindow?.includes("all")) {
      console.log("⚠️ Not in 'all' search page, skipping fetchMembers");
      return;
    }

    try {
      const peopleBtn: any = await new Promise((resolve) => {
        const interval = setInterval(() => {
          const resultDataLink = Array.from(
            document.querySelectorAll(".search-reusables__filter-list li")
          ).find((li) => li.querySelector("button")?.textContent.trim() === "People");

          if (resultDataLink) {
            clearInterval(interval);
            resolve(resultDataLink.querySelector("button"));
          }
        }, 1000);

        setTimeout(() => {
          clearInterval(interval);
          resolve(null);
        }, 3000);
      });

      if (!peopleBtn) {
        console.log("❌ People button not found within timeout");
        return;
      }

      const isClicked = LinkedInHelper.humanClick(peopleBtn);
      if (!isClicked) return;

      await LinkedInHelper.waitRandom(3500, 5000);

      const members = await LinkedInHelper.getSearchMembersData(maxConnections);
      console.log("✅ Members fetched:", members);

      if (!members?.length) return;

      const messageSentMembers: any = [];
      await LinkedInHelper.waitRandom(2500, 3000);

      for (const member of members) {
        const active = await LinkedInHelper.isCampaignRunning();
        if (!active) {
          console.log("🛑 Campaign stopped, exiting loop...");
          return;
        }

        try {
          await LinkedInHelper.startCampaignMessage(
            { profileLink: member.profileLink, name: member.name },
            message,
            "message"
          );

          await new Promise((resolve) => {
            const listener = (request: any) => {
              if (request.type === "PROFILE_DONE") {
                chrome.runtime.onMessage.removeListener(listener);
                messageSentMembers.push(member);
                console.log(`📨 Sent to: ${member.name}`);
                resolve(true);
              }
            };
            chrome.runtime.onMessage.addListener(listener);

            setTimeout(() => {
              chrome.runtime.onMessage.removeListener(listener);
              resolve(false);
            }, 30000);
          });

          await LinkedInHelper.waitRandom(1500, 3000);
        } catch (err) {
          console.error(`Error sending message to ${member.name}:`, err);
        }
      }

      chrome.runtime.sendMessage({
        type: "saveMembersData",
        messageSendMember: messageSentMembers,
        campaignId,
        typeOfCampaign,
        campaignName,
      });

      setTimeout(() => {
        chrome.runtime.sendMessage({ type: "CLOSE_ACTIVE_TAB" });
      }, 2000);
    } catch (error) {
      console.error("Error fetching search members:", error);
    }
  },
  getSearchMembersData: async (maxConnections: number) => {
    try {
      const searchMemberData: any[] = [];

      while (searchMemberData.length <= maxConnections) {
        const newMembers = await LinkedInHelper.fetchSearchData();

        newMembers.forEach((member: any) => {
          if (!searchMemberData.some((m) => m.profileLink === member.profileLink)) {
            searchMemberData.push(member);
          }
        });
        if (searchMemberData.length >= maxConnections) break;

        // try scrolling + clicking next
        const success = await LinkedInHelper.autoScrollAndNext();
        if (!success) {
          console.log("⚠️ No more members or Next button missing.");
          break;
        }
      }

      return searchMemberData.slice(0, maxConnections);
    } catch (error) {
      console.error("Error in getSearchMembersData:", error);
      return [];
    }
  },

  fetchSearchData: async () => {
    try {
      const searchMemberData: any = [];
      const groupsList = document.querySelector('div.pv0.ph0.mb2.artdeco-card ul[role="list"]');
      if (!groupsList) {
        console.log("No list found.");
        return [];
      }

      const items = groupsList.querySelectorAll("li");
      items.forEach((item) => {
        const memberTitleElement: any = item.querySelector("div.mb1 div.t-roman.t-sans div.display-flex span");
        const profileLink: any = item.querySelector("div.mb1 div.t-roman.t-sans div.display-flex a")?.getAttribute("href");
        const profileImage: any = item.querySelector("div.ivm-view-attr__img-wrapper div.presence-entity.presence-entity--size-3 img")?.getAttribute("src");

        if (memberTitleElement && profileLink && profileImage) {
          const name = memberTitleElement.innerText.split("\n")[0];
          if (!searchMemberData.some((member: any) => member.profileLink === profileLink)) {
            searchMemberData.push({ name, profileLink, profileImage });
          }
        }
      });
      return searchMemberData;
    } catch (error) {
      console.error("Error in fetchSearchData:", error);
      return [];
    }
  },

  // ✅ Proper async method now
  autoScrollAndNext: async (timeout = 10000) => {
    const startTime = Date.now();
    let lastHeight = document.body.scrollHeight;

    while (Date.now() - startTime < timeout) {
      // Scroll down a small amount
      window.scrollBy({ top: 1000, behavior: "smooth" });
      await LinkedInHelper.waitRandom(800, 1200);

      const newHeight = document.body.scrollHeight;

      if (newHeight > lastHeight) {
        lastHeight = newHeight; // new content loaded
      } else {
        // no new content, maybe reached end
        break;
      }
    }

    // Optional: try Next button if it exists
    const nextBtn: HTMLButtonElement | null = document.querySelector('button[aria-label="Next"]');
    if (nextBtn) {
      nextBtn.scrollIntoView({ behavior: "smooth", block: "center" });
      await LinkedInHelper.humanClick(nextBtn);
      await LinkedInHelper.waitRandom(1500, 2000);
      return true;
    }

    return false; // no more results
  },
  // open 
  startCampaignMessage: async (memberObject?: any, message?: any, action?: any) => {
    const { profileLink, name } = memberObject;
    console.log(". ~ profileLink, name:", profileLink, name)

    // Tell background to open the profile tab
    chrome.runtime.sendMessage({
      type: "OPEN_PROFILE_TAB",
      data: { profileLink, name, message, action },
    });
  },
  hideAndRemoveIframe: async (iframe: any) => {
    iframe.style.right = '-700px'; // Move iframe out of view
    await LinkedInHelper?.waitRandom(1000, 2000); // Wait for 500ms to allow the transition
    iframe.remove(); // Remove the iframe from the DOM
  },

  openMessageBox: async (profileName: string, message: string, action: string) => {
    // Prevent re-trigger
    if (messageBoxOpened) {
      console.log("Message box already opened. Skipping...");
      return;
    }
    messageBoxOpened = true;

    let memberDataPosition = null;
    let memberDataCompany = null;

    // --- STEP 1: Try "Experience" section ---
    const experienceSection = await LinkedInHelper.waitForElement("section div#experience", 15000);

    if (experienceSection) {
      const closestSection = experienceSection.closest("section");
      memberDataPosition = closestSection
        ?.querySelector('div.display-flex.align-items-center span[aria-hidden="true"]')
        ?.textContent?.trim();

      memberDataCompany = closestSection
        ?.querySelector(
          ".display-flex.flex-column.full-width .t-14.t-normal:nth-of-type(1) span[aria-hidden='true']"
        )
        ?.textContent?.trim()
        ?.split(" · ")[0];
    } else {
      // --- Fallback ---
      const experienceHeading = [...document.querySelectorAll("h2")]
        .find(el => el.textContent.trim() === "Experience");

      if (experienceHeading) {
        const container = experienceHeading.parentElement?.nextElementSibling;
        memberDataPosition = container
          ?.querySelector("div a")?.nextElementSibling?.querySelector("a p")?.textContent?.trim() ||
          container?.querySelector("ul li p")?.textContent?.trim();

        memberDataCompany = container
          ?.querySelector("div a")?.nextElementSibling?.querySelector("a")?.nextElementSibling
          ?.textContent?.trim()?.split(" · ")[0]
          || container?.querySelector("p")
            ?.textContent?.trim()?.split(" · ")[0];
      }
    }

    console.log("Position:", memberDataPosition);
    console.log("Company:", memberDataCompany);

    // --- STEP 3: Find Message button ---
    let messageBtn: any = await LinkedInHelper.waitForElement(
      `main section button[aria-label*="Message ${profileName.split(" ")[0]}"]`,
      5000
    );

    if (!messageBtn) {
      messageBtn = [...document.querySelectorAll("a, button")]
        .find(el => el.textContent.trim() === "Message" && el.querySelector("svg"));
    }

    if (!messageBtn) {
      console.warn("Message button not found for:", profileName);
      messageBoxOpened = false;
      return;
    }

    console.log("✅ Clicking Message button:", messageBtn);
    await LinkedInHelper.humanClick(messageBtn);
    await LinkedInHelper.waitRandom(2000, 3500);

    // --- STEP 4: Wait for textbox ---
    const textbox = await LinkedInHelper.waitForElement('.msg-form__contenteditable[role="textbox"]', 5000);
    if (!textbox) {
      console.log("⚠️ Message textbox not found");
      messageBoxOpened = false;
      return;
    }

    // --- STEP 5: Personalize and send message ---
    const nameParts = profileName.split(" ");
    const personalizedMessage = message
      .replace("{{firstname}}", nameParts[0])
      .replace("{{lastname}}", nameParts[1] || "")
      .replace("{{position}}", memberDataPosition || "")
      .replace("{{company}}", memberDataCompany || "");

    textbox.innerHTML = "";
    const pTag = document.createElement("p");
    pTag.innerText = personalizedMessage;
    textbox.appendChild(pTag);
    textbox.dispatchEvent(new Event("input", { bubbles: true }));

    await LinkedInHelper.waitRandom(800, 1500);

    const sendBtn = await LinkedInHelper.waitForElement(
      "div.msg-form__msg-content-container button.msg-form__send-btn",
      7000
    );

    if (sendBtn && action === "message") {
      console.log("✅ Message ready to send to:", profileName);
      // LinkedInHelper.humanClick(sendBtn);
      await LinkedInHelper.waitRandom(1500, 2500);
      chrome.runtime.sendMessage({ type: "CLOSE_ACTIVE_TAB" });
    } else {
      console.log("⚠️ Send button not found for:", profileName);
    }

    // Reset after completion
    messageBoxOpened = false;
  },
  isCampaignRunning: async () => {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ type: "isCampaignActive" }, (response) => {
        resolve(response?.active);
      })
    })
  },
};





export async function scrapeLinkedInConnections(startIndex = 1, endIndex = 100) {
  async function autoScrollDown(scrollStep = 1000, intervalTime = 600, maxSteps = 10) {
    function findScrollable() {
      const all = [...document.querySelectorAll("body, body *")];
      const sorted = all
        .map(e => ({ el: e, diff: e.scrollHeight - e.clientHeight }))
        .filter(x => x.diff > 10)
        .sort((a, b) => b.diff - a.diff);
      return sorted.length ? sorted[0].el : (document.scrollingElement || document.documentElement);
    }

    const el = findScrollable();
    let count = 0;
    return new Promise<void>((resolve) => {
      const id = setInterval(() => {
        if (el instanceof Window || el === document.scrollingElement || el === document.documentElement) {
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

  async function extractConnections(start: any, end: any) {
    const connections: any[] = [];

    // 🧠 Step 1: Find total connections count from <p> tag
    const pTag = [...document.querySelectorAll("main p")]
      .find(p => p.textContent.toLowerCase().includes("connections"));
    const totalConnections = pTag ? parseInt(pTag.textContent) || 0 : 0;

    console.log("🔢 Total connections found:", totalConnections);

    // 🧠 Step 2: Decide how many we should actually scrape
    const targetCount = Math.min(end, totalConnections);

    // 🧠 Step 3: Auto scroll only until we have enough cards visible
    for (let i = 0; i < 10; i++) {
      const cards = document.querySelectorAll('div[data-view-name="connections-list"] > div');
      console.log(`📜 Currently loaded cards: ${cards.length}`);

      // Stop if enough cards are loaded or user has fewer connections
      if (cards.length >= targetCount || cards.length >= totalConnections) {
        break;
      }

      // Scroll down to load more connections
      await autoScrollDown(1000, 800, 4);
      await new Promise(r => setTimeout(r, 1500));
    }

    // 🧠 Step 4: Collect visible connections
    const cards = document.querySelectorAll('div[data-view-name="connections-list"] > div');
    cards.forEach((el: any, i: any) => {
      if (i >= start - 1 && i < targetCount) {
        const name = el.querySelector("a p")?.innerText?.trim() || "";
        const occupation = el.querySelectorAll("a p")[1]?.innerText?.trim() || "";
        const profileLink = el.querySelector('a[href*="/in/"]')?.href || "";

        if (name && profileLink) {
          connections.push({ name, occupation, profileLink });
        }
      }
    });

    console.log(`✅ Extracted ${connections.length} connections`);
    return connections;
  }


  const connectionData = await extractConnections(startIndex, endIndex);
  console.log("✅ 100 Connections Scraped:", connectionData);
  return connectionData;
}