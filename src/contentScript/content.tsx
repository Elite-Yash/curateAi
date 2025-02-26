import LinkedIn from "../injector/linkedin";
import Twitter from "../injector/twitter";

const Layout = () => {
    const getPlatformName = () => {
        const hostname = window.location.hostname;
        
        switch (true) {
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
        default:
            return null;
    }
};

export default Layout;
