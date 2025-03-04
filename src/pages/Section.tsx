/**
 * @component
 * @description
 * The `Dashboard` component represents the main layout for the application, including a sidebar and a header. It is designed to wrap around child components, providing a consistent layout and navigation structure. The component also handles search functionality, displaying matched names based on user input.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered inside the `Dashboard`.
 *
 * @example
 * <Dashboard>
 *   <SomeChildComponent />
 * </Dashboard>
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @hooks
 * - `useState`: Manages local state for `sidebarOpen`, `inputValue`, and `matchedNames`.
 *
 * @state
 * - `sidebarOpen` (boolean): Indicates whether the sidebar is open or closed.
 * - `inputValue` (string): The current value of the input field in the header.
 * - `matchedNames` (Array<{ matchedPart: string, remainingPart: string }>): Array of objects representing the names that match the search input.
 *
 * @effects
 * - Uses `setTimeout` to perform a navigation action after 10 seconds (commented out in the provided code).
 *
 * @methods
 * - `setSidebarOpen`: Toggles the sidebar open state.
 * - `setInputValue`: Updates the value of the input field in the header.
 * - `setMatchedNames`: Updates the list of matched names based on the search input.
 *
 * @returns {JSX.Element}
 * - Renders a `div` with the main structure of the dashboard including:
 *   - `Sidebar`: A component that represents the sidebar.
 *   - `Header`: A component that represents the header and includes search functionality.
 *   - A `main` section that contains the main content area for child components.
 *   - A list of matched names that is displayed as a dropdown below the search input when there are search results.
 *
 * @styles
 * - The sidebar and content area are styled to occupy the full height of the screen.
 * - The matched names dropdown is positioned absolutely and styled to appear over other content with a z-index of 9999.
 */

import Header from "../components/Header";
import SideBar from "../components/SideBar";

const Section = ({ children }: any) => {
  return (
    <div id="wrapper" className="bge7e9f6">
      <SideBar />
      <div className="right-baar-div transition">
        <Header />
        {children}
      </div>
    </div >
  );
};

export default Section;
