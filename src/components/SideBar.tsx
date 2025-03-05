/**
 * @component
 * @description
 * The `Sidebar` component renders a page Sidebar section with navigation breadcrumbs and a dropdown menu. 
 * It includes a title, breadcrumb navigation links, and a campaign selection dropdown, making it ideal 
 * for a "Sidebar" page or similar Sidebar structure.
 *
 * @example
 * <Sidebar />
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @returns {JSX.Element}
 * - Renders a `div` with the main structure for the Sidebar page including:
 *   - Page title with an icon and "Sidebar" label.
 *   - Breadcrumb navigation for Sidebar > Sidebar.
 *   - Dropdown menu for campaign selection.
 *
 * @styles
 * - Utilizes Tailwind CSS classes for layout and styling, with responsive adjustments for smaller screens.
 */
import { Link } from "react-router-dom";
import { getImage } from "../common/utils/logoUtils";
// import dashboard from "../images/dashboard.svg";
// import connect from "../images/connect.svg";
import "@fortawesome/fontawesome-free/css/all.min.css";
import message from "../images/message.svg";
import { selectUser } from "../redux/selector/usersSelector";
import { useSelector } from "react-redux";

const SideBar = () => {
    const loginUser = useSelector(selectUser);
    return (
        // <div className="left-baar-menu w-64 max-[1150px]:-translate-x-64 h-screen fixed left-0 top-0 z-20 transition background-one">
        <div className="left-baar-menu w-60 max-[1150px]:-translate-x-64 h-[96vh] fixed left-[18px] top-1/2 z-20 transition-transform background-one rounded-[11px] -translate-y-1/2">
            <div className="menu-baar-d absolute -right-14">
                <button data-collapse-toggle="navbar-default" type="button" className="max-[1023px]:ms-auto max-[1150px]:block inline-flex items-center p-2 justify-center text-sm text-white hidden  focus:outline-none" aria-controls="navbar-default" aria-expanded="false">
                    <div className="toggle relative w-11 h-10 max-[1023px]:h-8 bgFF3E3A rounded-xl flex items-center justify-center cursor-pointer overflow-hidden">
                        <span className="bg-white absolute transition left-0 w-5 h-0.5 left-1.5 rounded-full"></span>
                        <span className="bg-white absolute transition left-0 w-5 h-0.5 left-1.5 rounded-full"></span>
                        <span className="bg-white absolute transition left-0 w-8 h-0.5 left-1.5 rounded-full"></span>
                    </div>
                </button>
            </div>
            <div className="logo p-4 pt-5">
                <Link to="/" className="logo flex justify-center items-center w-full gap-2 bg-white color-one rounded-xl py-3">
                    <img src={getImage('iconLogo')} className="re-logo-b-o transition w-9" alt="img" />
                    <span className="color-one uppercase larger font-semibold">Curate ai</span>
                </Link>
            </div>
            {/* <div className="user-profile text-center flex flex-col justify-center items-center pt-8 block pb-20">
                <div className="user-profile-img w-24 h-24 overflow-hidden rounded-full outline outline-offset-2 outline-1 outline-cyan-500 outline-offset-4">
                    <img src={getImage('user')} className="w-full" alt="img" />
                </div>
                <div className="user-profile-name"><h4 className="color00517C font-semibold pt-3 pb-1">{loginUser.name}</h4></div>
            </div> */}
            {/* <div className="px-4"></div> */}
            <div className="left-menu pt-12">
                <ul className="flex flex-col">
                    <li className="px-4 py-1">
                        <Link to="/" className="text-base flex items-center font-light color5a5783 gap-2 transition p-3 relative overlay-before rounded-xl active">
                            <span className="icon">
                                <i className="fa-solid fa-house white-color"></i>
                            </span>
                            <span className="white-color font-normal white-color">Dashboard</span>
                        </Link>
                    </li>
                    <li className="px-4 py-1">
                        <Link to="/" className="text-base flex items-center font-light color5a5783 gap-2 transition p-3 relative overlay-before rounded-xl">
                            <span className="icon">
                                <i className="fa-solid fa-message white-color"></i>
                            </span>
                            <span className="white-color font-normal">Comments</span>
                        </Link>
                    </li>
                    <li className="px-4 py-1">
                        <Link to="/" className="text-base flex items-center font-light color5a5783 gap-3 transition p-3 relative overlay-before rounded-xl">
                            <span className="icon">
                                {/* <i className="fas fa-link white-color"></i> */}
                                <i className="fa-solid fa-user-plus white-color"></i>
                            </span>
                            <span className="white-color font-normal">Save Profile</span>
                        </Link>
                    </li>

                </ul>
            </div>
        </div >
    );
};

export default SideBar;
