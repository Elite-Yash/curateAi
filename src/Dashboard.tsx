import "../src/css/popup.css";
import Header from "./components/Header";
import Comments from "./components/Comments/Comments";
import SideBar from "./components/SideBar";
import CustomIframe from "./CustomIframe";
import dashboardStyles from "./css/dashboard.css?inline";
import Home from "./components/Home/Home";
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
      <SideBar />
      <Header />
      <div className="overflow-x-hidden relative w-full background-three">
        <Comments />
        {/* <Home /> */}
      </div>
    </CustomIframe>
  </>
};

export default Dashboard;