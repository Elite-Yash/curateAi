import "../src/css/popup.css";
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import CustomIframe from "./CustomIframe";
import dashboardStyles from "./css/dashboard.css?inline";
import Router from "./routes/Router";
import { ToastContainer } from "react-toastify";

// Check if chrome.runtime is available
/**
 * Main application component.
 *
 * This component handles the main logic of the application, including:
 * - Toggle functionality for opening/closing the main content.
 * - Drag-and-drop functionality for a draggable icon.
 * - Application of dynamic styles to iframes.
 * - Interaction with Chrome's storage and runtime APIs.
 *
 * @returns {JSX.Element} The rendered component.
 */

const Dashboard = () => {
  return <>
    <CustomIframe>
      <style>
        {dashboardStyles}
      </style>
      <div className="overflow-x-hidden relative w-full background-three">
        <ToastContainer position="top-right" autoClose={3000} />
        <Router />
      </div>
    </CustomIframe>
  </>
};

export default Dashboard;