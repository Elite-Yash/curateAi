// Import necessary scripts for configuration and keeping the extension alive
console.log("Background...!");


// When toolbar icon is clicked, toggle popup in the current tab
chrome.action.onClicked.addListener(function (tab) {
  chrome.tabs.create({ url: "https://www.linkedin.com" });
});

