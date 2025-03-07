import LinkedIn from "../injector/LinkedIn";
import LinkedInProfile from "../injector/LinkedInProfile";
import Twitter from "../injector/Twitter";

const Layout = () => {
    const getPlatformName = () => {
        const hostname = window.location.hostname;
        switch (true) {
            case window.location.href.includes("linkedin.com/in/"):
                return "LinkedIn-Profile";
            case hostname.includes("linkedin.com"):
                return "LinkedIn";
            case hostname.includes("twitter.com"):
            case hostname.includes("x.com"):
                return "Twitter";
            default:
                return "Unknown";
        }
    };

    switch (getPlatformName()) {
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
