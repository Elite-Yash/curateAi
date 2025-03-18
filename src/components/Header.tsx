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
import "@fortawesome/fontawesome-free/css/all.min.css";
import { getImage } from "../common/utils/logoUtils";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [login, setLogin] = useState<string | null>(null);
    const navigate = useNavigate();
    // Fetch the token from Chrome storage on component mount
    useEffect(() => {
        chrome.storage.local.get(["token"], (result) => {
            if (result.token) {
                setLogin(result.token);
            } else {
                setLogin(null);
                // console.log("No token found in Chrome storage.");
            }
        });
    }, [login]);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    // Send a message to background.js to handle logout
    const LogOut = () => {
        chrome.runtime.sendMessage({ type: "LogOut" }, () => { });
        setDropdownOpen(!dropdownOpen);
        navigate("/signin")
        setLogin(null)
    };
    return (
        <div className="header-baar flex flex-col c-padding-r fixed w-full z-10 pl-[280px] pr-[30px]">
            <div className="flex flex-col justify-center  bg-white relative g-box mt-5 px-8 py-3">
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
                                    className="color00517C flex items-center font-light gap-2 overlay-before relative"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        toggleDropdown();
                                    }}
                                >
                                    {/* <img src={getImage('user')} alt="img" className="w-full h-full rounded-full" /> */}
                                    <span className="icon w-8 h-8 rounded-full overflow-hidden border border-2 border-solid	border-white outline-1 outline-green-950	outline">
                                        <img src={getImage('user')} alt="img" className="w-full h-full rounded-full" />
                                    </span>
                                    <span className="text-sm dec-color font-normal ">Emma Kwan</span>
                                    <i className="text-xs fa-solid fa-chevron-down dec-color"></i>
                                </a>
                                {dropdownOpen && (
                                    <div className="absolute right-3.5 mt-2 bg-white g-box w-40 drop-menu">
                                        <button
                                            className="w-full text-left px-3 py-3 text-sm transition rounded-xl	 flex items-center gap-2"
                                            onClick={LogOut}
                                        >
                                            <i className="fa-solid fa-power-off color-one transition"></i>
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
