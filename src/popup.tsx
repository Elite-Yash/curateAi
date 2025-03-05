import "../src/css/popup.css";
import Popup from "./components/Popup/Popup";
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

const PopUp = () => {
  return <>  
    <Popup />
  </>
};

export default PopUp;