let lifeline;

const keepAlive = async () => {
  if (lifeline) return;

  const tabs = await chrome.tabs.query({ url: "*://*/*" });

  for (const tab of tabs) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => chrome.runtime.connect({ name: "keepAlive" }),
      });
      chrome.tabs.onUpdated.removeListener(retryOnTabUpdate);
      return;
    } catch (e) {
      // Handle error if needed
    }
  }

  chrome.tabs.onUpdated.addListener(retryOnTabUpdate);
};

const keepAliveForced = () => {
  lifeline?.disconnect();
  lifeline = null;
  keepAlive();
};

const retryOnTabUpdate = async (tabId, info, tab) => {
  if (info.url && /^(file|https?):/.test(info.url)) {
    keepAlive();
  }
};

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "keepAlive") {
    lifeline = port;
    setTimeout(keepAliveForced, 295e3); // 295,000 milliseconds = 4.92 minutes
    port.onDisconnect.addListener(keepAliveForced);
  }
});
