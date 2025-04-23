import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { getImage } from "../common/utils/logoUtils";
import { apiService } from "../common/config/apiService";

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

const Header = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [login, setLogin] = useState<string | null>(null);
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLLIElement | null>(null);
    const [userDetails, seUserDetails] = useState({
        name: "",
    });
    useEffect(() => {
        chrome.storage.local.get(["token"], (result) => {
            if (result.token) {
                setLogin(result.token);
            } else {
                setLogin(null);
            }
        });
    }, [login]);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        checkActivePlan();
        function handleClickOutside(event: any) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const LogOut = () => {
        chrome.runtime.sendMessage({ type: "LogOut" }, () => { });
        setDropdownOpen(false);
        navigate("/signin");
        setLogin(null);
    };

    const checkActivePlan = async () => {
        try {
            const requestUrl = apiService.EndPoint.checkActivePlan;
            // Make the API request to check the active plan status
            await apiService.commonAPIRequest(
                requestUrl,
                apiService.Method.get,
                undefined, // No query parameters
                {}, // No request body
                (result: any) => {
                    seUserDetails({
                        name: result.data.userDetails.name,
                    })
                }
            );
        } catch (error) {
            console.error("Error fetching plans:", error);
        }
    };
    return (
        <div className="header-baar flex flex-col c-padding-r fixed w-full z-20 pl-[280px] pr-[30px]">
            <div className="flex flex-col justify-center bg-white relative g-box mt-5 px-8 py-3">
                <div className="flex justify-between items-center">
                    <div className="header-r-menu flex items-center gap-8 ms-auto">
                        <ul className="flex gap-5 items-center">
                            <li ref={dropdownRef}>
                                <a
                                    href="#"
                                    className="color00517C flex items-center font-light gap-2 overlay-before relative"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        toggleDropdown();
                                    }}
                                >
                                    <span className="icon w-8 h-8 rounded-full overflow-hidden border-2 border-solid border-white outline-1 outline-green-950 outline">
                                        <img src={getImage('user')} alt="img" className="w-full h-full rounded-full" />
                                    </span>
                                    <span className="text-sm dec-color font-normal ">{userDetails.name ? userDetails.name : ""}</span>
                                    <i className="text-xs fa-solid fa-chevron-down dec-color"></i>
                                </a>
                                {dropdownOpen && (
                                    <div className="absolute right-3.5 mt-2 bg-white g-box w-40 drop-menu z-50">
                                        <button onClick={() => { navigate("/setting"); setDropdownOpen(false); }} className="w-full text-left px-3 py-3 text-sm transition rounded-xl flex items-center gap-2">
                                            <i className="fa-solid fa-gear color-one transition"></i>
                                            Setting
                                        </button>
                                        <button
                                            className="w-full text-left px-3 py-3 text-sm transition rounded-xl flex items-center gap-2"
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
