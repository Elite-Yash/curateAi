import { Link, useLocation } from "react-router-dom";
import { getImage } from "../common/utils/logoUtils";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { selectUser } from "../redux/selector/usersSelector";
import { useSelector } from "react-redux";

const SideBar = () => {
    const loginUser = useSelector(selectUser);
    const location = useLocation();

    return (
        <div className="backgroundgradient6841ea flex flex-col left-baar-menu w-60 max-[1150px]:-translate-x-64 h-[96vh] fixed left-[18px] top-1/2 z-20 transition-transform background-one rounded-[11px] -translate-y-1/2">
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
                    <img src={getImage('iconLogo')} className="re-logo-b-o transition w-7" alt="img" />
                    <span className="color-one uppercase larger font-semibold">Curate ai</span>
                </Link>
            </div>
            <div className="left-menu pt-12">
                <ul className="flex flex-col">
                    <li className="px-4 py-1">
                        <Link to="/" className={`text-base flex items-center font-light color5a5783 gap-2 transition p-3 relative overlay-before rounded-xl ${location.pathname === "/" ? "active" : ""}`}>
                            <span className="icon">
                                <i className="fa-solid fa-house white-color"></i>
                            </span>
                            <span className="white-color font-normal">Dashboard</span>
                        </Link>
                    </li>
                    <li className="px-4 py-1">
                        <Link to="/comments" className={`text-base flex items-center font-light color5a5783 gap-2 transition p-3 relative overlay-before rounded-xl ${location.pathname === "/comments" ? "active" : ""}`}>
                            <span className="icon">
                                <i className="fa-solid fa-message white-color"></i>
                            </span>
                            <span className="white-color font-normal">Comments</span>
                        </Link>
                    </li>
                    <li className="px-4 py-1">
                        <Link to="/save-profile" className={`text-base flex items-center font-light color5a5783 gap-3 transition p-3 relative overlay-before rounded-xl ${location.pathname === "/save-profile" ? "active" : ""}`}>
                            <span className="icon">
                                <i className="fa-solid fa-user-plus white-color"></i>
                            </span>
                            <span className="white-color font-normal">Save Profile</span>
                        </Link>
                    </li>

                </ul>
            </div>
            <div className="mt-auto"></div>
            <div className="pt-2 px-4 py-1">
                <ul>
                    <li>
                        <a href="#" className="white-color w-full text-center text-base flex items-center justify-center">Need Help ?</a>
                    </li>
                </ul>
            </div>
            <div className="leftmenu-bottom px-4 py-1 border-t-1 border-b-0 border-l-0 border-r-0 border border-white ">
                <ul>
                    <li>
                        <a href="#" className="white-color w-full text-center text-base flex flex-col items-center justify-center">
                            <span className="font-normal transition">Version</span>
                            <span className="font-normal transition">1.1.7</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default SideBar;
