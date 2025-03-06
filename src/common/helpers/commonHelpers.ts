/**
 * Opens a new browser tab with the specified URL.
 *
 * @param {string} url - The URL to open in a new tab.
 */
export const openWindowTab = (url: string) => {
    window.open(url, '_blank');
};

/**
 * Go to dashbaord page
 */
export const goToDashBoard = () => {
    const pageUrl = chrome.runtime.getURL('dashboard.html');
    openWindowTab(pageUrl);
}