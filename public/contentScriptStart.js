// /**
//  * Save the original `XMLHttpRequest.open` method.
//  */
// const originalOpen = XMLHttpRequest.prototype.open;

// /**
//  * Override `XMLHttpRequest.open` to capture the request URL.
//  * @param {string} method - The HTTP method (e.g., "GET", "POST").
//  * @param {string} url - The request URL.
//  */
// XMLHttpRequest.prototype.open = function (method, url) {
//   this._url = url; // Save URL for later use in send()
//   originalOpen.apply(this, arguments);
// };

// /**
//  * Save the original `XMLHttpRequest.send` method.
//  */
// const originalSend = XMLHttpRequest.prototype.send;

// /**
//  * Override `XMLHttpRequest.send` to intercept and process the response of specific requests.
//  */
// XMLHttpRequest.prototype.send = function () {
//   const xhr = this;
//   const url = this._url || '';

//   // Add event listener for when the request loads
//   xhr.addEventListener("load", function () {
//     // Only process specific API call
//     if (url.includes("voyager/api/relationships/connections?")) {
//       const blob = xhr.response;
//       const reader = new FileReader();

//       /**
//        * Handle FileReader load event to parse and broadcast the response.
//        */
//       reader.onload = function () {
//         try {
//           const text = reader.result;
//           const response = JSON.parse(text);

//           /**
//            * Broadcast the intercepted LinkedIn Sales Navigator response to other parts of the extension.
//            * @type {BroadcastChannel}
//            */
//           const bc = new BroadcastChannel("linkedin-monkey-channel");

//           bc.postMessage({
//             type: "linkedin_sales",
//             url,
//             response,
//           });
//         } catch (err) {
//           console.error("Failed to parse XHR response:", err);
//         }
//       };

//       reader.readAsText(blob);
//     }
//   });

//   // Ensure the response is treated as a Blob so it can be read via FileReader
//   xhr.responseType = 'blob';

//   originalSend.apply(this, arguments);
// };
