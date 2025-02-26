import ReactDOM from "react-dom/client";
import Layout from "./contentScript/content.tsx";
import cssStyles from "./css/InputAiPopup.css?inline"; // Ensure Vite inlines the CSS

// Create a new div for the extension root
const div = document.createElement("div");
div.id = "curateai-extension-root";

// Attach Shadow DOM
const shadowRoot = div.attachShadow({ mode: "open" });
document.body.appendChild(div);

// Create a container inside the Shadow DOM
const reactRoot = document.createElement("div");
shadowRoot.appendChild(reactRoot);

// Inject CSS inside Shadow DOM
const style = document.createElement("style");
style.textContent = cssStyles; // Insert CSS content
shadowRoot.appendChild(style);

// Render the React app inside Shadow DOM
ReactDOM.createRoot(reactRoot).render(<Layout />);
