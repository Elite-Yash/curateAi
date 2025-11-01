import { useEffect, useRef, useState } from "react";
import LinkedIn from "../injector/LinkedIn";
import LinkedInProfile from "../injector/LinkedInProfile";
import Twitter from "../injector/Twitter";
import { LinkedInHelper, scrapeLinkedInConnections } from "../utils";

const Layout = () => {
  const [platform, setPlatform] = useState<string | null>(null);
  const stopCampaignRef = useRef(false);

  const detectPlatform = () => {
    const hostname = window.location.hostname;
    let platformName = "Unknown";

    if (window.location.href.includes("linkedin.com/in/")) {
      platformName = "LinkedIn-Profile";
    } else if (hostname.includes("linkedin.com")) {
      platformName = "LinkedIn";
    } else if (hostname.includes("twitter.com") || hostname.includes("x.com")) {
      platformName = "Twitter";
    }

    return platformName;
  };

  useEffect(() => {
    // Detect platform
    chrome.runtime.sendMessage({ type: "getCookies" }, (response) => {
      if (response.token && response.success) {
        setPlatform(detectPlatform());

        const interval = setInterval(() => {
          const currentPlatform = detectPlatform();
          setPlatform((prev) => (prev !== currentPlatform ? currentPlatform : prev));
        }, 1000);

        return () => clearInterval(interval);
      }
    });

    // --- Message listener ---
    const messageListener = async (request: any, sender: any, sendResponse: (response?: any) => void) => {
      try {
        if (request.type === "stopCampaign") {
          stopCampaignRef.current = true;
        }

        if (request.type === "fetchSearchMembers") {
          // Call your LinkedIn fetch logic here
          await LinkedInHelper.fetchMembers({
            maxConnections: request.maxConnections,
            campaignId: request.campaign_id,
            message: request.message,
            typeOfCampaign: request.typeOfCampaign,
            stopCampaign: stopCampaignRef,
            campaignName: request.campaignName,
          });
          sendResponse({ status: "started" });
        }

        if (request.type === 'PROCESS_MEMBER') {
          const { name, message, action } = request.data;
          await LinkedInHelper.openMessageBox(name, message, action);
        }

        if (request.type === "START_CONNECTION_SCRAPING") {
          console.log("📩 Starting connection scraping...");
          const data = await scrapeLinkedInConnections(request.startFrom, request.endAt);
          console.log("  ~ messageListener ~ data:", data)
          chrome.runtime.sendMessage({
            type: "CONNECTIONS_SCRAPED",
            data,
          });
        }

        
      } catch (err) {
        console.error(err);
        sendResponse({ status: "error", error: err });
      }

      return true; // keep message channel open for async response
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  if (!platform) return null;

  switch (platform) {
    case "LinkedIn":
      return <LinkedIn />;
    case "Twitter":
      return <Twitter />;
    case "LinkedIn-Profile":
      return <LinkedInProfile key={window.location.href} />;
    default:
      return null;
  }
};



export default Layout;
