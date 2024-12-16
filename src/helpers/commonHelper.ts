import { LOCAL_STORAGE_NAMES} from "../constants/linkedinSelectors";

export const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};


export const removeEmojis = (str: any) =>
    str.replace(
        /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B50}\u{200D}]/gu,
        ""
    )

export const trimAllWhiteSpaces = (str: string) => {
    return str.replace(/[\n\r\t\s]+/g, " ").trim();
};


export const isLinkedInArticlePage = (url: string) => {
    if (url.toLowerCase().includes("linkedin.com/pulse/")) {
        return true;
    }
    return false;
};


export const getCurrentLinkedInUsernameFromLocalStorage = () => {
    
    const username = localStorage.getItem(LOCAL_STORAGE_NAMES.LINKEDIN_USERNAME);
    if (username) {
        return username;
    }
    return "";
}