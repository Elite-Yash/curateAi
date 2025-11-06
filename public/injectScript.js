// (() => {
//   "use strict";

//   // Prevent duplicate injections
//   if (window.__notion_chrome_runtime_injected) {
//     console.log("Script already injected, skipping.");
//     return;
//   }

//   const scriptUrl = chrome.runtime?.getURL?.("contentScriptStart.js");
//   if (!scriptUrl) {
//     console.error("chrome.runtime.getURL is unavailable.");
//     return;
//   }

//   const injectScript = () => {
//     if (document.head || document.documentElement) {
//       if (window.__notion_chrome_runtime_injected) {
//         clearInterval(injectionInterval);
//         return;
//       }

//       const s = document.createElement("script");
//       s.type = "module";
//       s.src = scriptUrl;
//       s.onload = function () {
//         this.remove();
//         console.log("Script injected and removed");
//       };

//       console.log("DBUG - injecting notion_chromeruntimeid");
//       (document.head || document.documentElement).appendChild(s);

//       // Mark as injected to avoid future injections
//       window.__notion_chrome_runtime_injected = true;

//       clearInterval(injectionInterval);
//     }
//   };

//   const injectionInterval = setInterval(injectScript, 500);
// })();
