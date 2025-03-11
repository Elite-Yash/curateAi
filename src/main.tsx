import ReactDOM from "react-dom/client";
import Layout from "./contentScript/content.tsx";
import cssStyles from "./css/InputAiPopup.css?inline"; // Ensure Vite inlines the CSS
import App from "./App.tsx";
import { MemoryRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import Dashboard from "./Dashboard.tsx";
import PopUp from "./popup.tsx";


setTimeout(() => {

    let demo = document.querySelector('body');
    const boxType = demo?.getAttribute('dom');
    if (boxType === 'popup') {
        // Create a new <div> element to serve as the root container for the React app
        const root = document.querySelector("body");

        // Render the React application into the root container
        if (root) {
            ReactDOM.createRoot(root).render(
                <Router>
                    <Provider store={store}>
                        <App />
                    </Provider>
                </Router>
            );
        }

    }
    if (boxType === 'dashboard') {
        // Create a new <div> element to serve as the root container for the React app
        const root = document.querySelector("body");

        // Render the React application into the root container
        if (root) {
            ReactDOM.createRoot(root).render(
                <Router>
                    <Provider store={store}>
                        <Dashboard />
                    </Provider>
                </Router>
            );
        }
    }
    if (boxType != 'dashboard' && boxType != 'popup' && !boxType) {
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
    }
})