import { useEffect, useState } from "react";
import LinkedIn from "../injector/LinkedIn";
import LinkedInProfile from "../injector/LinkedInProfile";
import Twitter from "../injector/Twitter";

const Layout = () => {
    const [platform, setPlatform] = useState<string | null>(null);
    useEffect(() => {
        if (platform) {
            console.log("Detected platform:", platform);
        }
    }, [platform]);

    useEffect(() => {
        chrome.runtime.sendMessage({ type: "getCookies" }, (response) => {
            console.log("response", response)
            if (response.token && response.success) {
                const hostname = window.location.hostname;
                let platformName = "Unknown";

                if (window.location.href.includes("linkedin.com/in/")) {
                    platformName = "LinkedIn-Profile";
                } else if (hostname.includes("linkedin.com")) {
                    platformName = "LinkedIn";
                } else if (hostname.includes("twitter.com") || hostname.includes("x.com")) {
                    platformName = "Twitter";
                }

                setPlatform(platformName);
            }
        });
    }, []);

    if (!platform) return null;

    switch (platform) {
        case "LinkedIn":
            return <LinkedIn />;
        case "Twitter":
            return <Twitter />;
        case "LinkedIn-Profile":
            return <LinkedInProfile />;
        default:
            return null;
    }
};

export default Layout;
