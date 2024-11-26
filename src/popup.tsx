/**
 * Entry point for the React application.
 * This script initializes the root DOM element and renders the main React component, `App`, into it.
 * It also sets up routing with `MemoryRouter` from `react-router-dom` and integrates Redux state management
 * with the `Provider` component from `react-redux`.
 *
 * @module
 * @requires react-dom/client
 * @requires react-router-dom
 * @requires react-redux
 * @requires ./App.tsx
 * @requires ./index.css
 */

import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "../src/assets/css/index.css";
import { MemoryRouter as Router } from "react-router-dom";
// Create a new <div> element to serve as the root container for the React app
const root = document.querySelector("body");

// Render the React application into the root container
if (root) {
  ReactDOM.createRoot(root).render(
    <Router>
        <App />
    </Router>
  );
}
