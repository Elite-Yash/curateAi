/**
 * @component
 * @description
 * The `Header` component renders a page header section with navigation breadcrumbs and a dropdown menu. 
 * It includes a title, breadcrumb navigation links, and a campaign selection dropdown, making it ideal 
 * for a "Header" page or similar Header structure.
 *
 * @example
 * <Header />
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @returns {JSX.Element}
 * - Renders a `div` with the main structure for the Header page including:
 *   - Page title with an icon and "Header" label.
 *   - Breadcrumb navigation for Header > Header.
 *   - Dropdown menu for campaign selection.
 *
 * @styles
 * - Utilizes Tailwind CSS classes for layout and styling, with responsive adjustments for smaller screens.
 */
import { useSelector } from "react-redux";
import { getImage } from "../common/utils/logoUtils";
import { selectUser } from "../redux/selector/usersSelector";
import { useState } from "react";

const Header = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const loginUser = useSelector(selectUser);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleLogout = () => {
        chrome.runtime.sendMessage({ type: "removeCookies" });
    };
    return (
        <div className="border-s-0 border-e-0 bordere7e9f6 border border-t-0 header-baar flex flex-col pr-7 max-[650px]:pr-3 bg-white c-padding-r fixed w-full z-10">
            <div className="flex h-14 flex-col justify-center">
                <div className="flex justify-between items-center">

                    <div className="header-r-menu flex items-center gap-8 ms-auto">
                        <ul className="flex gap-5 items-center">
                            <li>
                                <a href="#" className="color00517C flex items-center font-light gap-1 overlay-before relative">
                                    {/* <i className="fa-solid fa-envelope"></i> */}
                                </a>
                            </li>
                            <li>
                                <a href="#" className="color00517C flex items-center font-light gap-1 overlay-before relative">
                                    {/* <i className="fa-solid fa-bell"></i> */}
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="color00517C flex items-center font-light gap-1 overlay-before relative"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        toggleDropdown();
                                    }}
                                >
                                    <span className="icon w-7 h-7 rounded-full overflow-hidden">
                                        <img src={getImage('user')} alt="img" className="w-full h-full rounded-full" />
                                    </span>
                                    <span className="text-base max-[1350px]:text-sm font-medium">{loginUser.name}</span>
                                    <i className="fa-regular fa-chevron-down text-sm"></i>
                                </a>
                                {dropdownOpen && (
                                    <div className="absolute right-3.5 mt-2 bg-white shadow-lg rounded-md p-2 w-40">
                                        <button
                                            className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray5"
                                            onClick={handleLogout}
                                        >
                                            Log Out
                                        </button>
                                    </div>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
