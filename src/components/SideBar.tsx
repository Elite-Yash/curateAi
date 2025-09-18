import { Link, useLocation } from "react-router-dom";
import { getImage } from "../common/utils/logoUtils";
import "@fortawesome/fontawesome-free/css/all.min.css";
// import { openWindowTab } from "../common/helpers/commonHelpers";
import Header from "./UserProfile/Header";

const SideBar = () => {
  const location = useLocation();
  // const manifestData = chrome.runtime.getManifest();

  // const goToLinkedIn = () => {
  //   openWindowTab("https://linkedin.com/");
  // };

  return (
    <div className="flex flex-col left-baar-menu w-60 max-[1150px]:-translate-x-64 h-[96vh] fixed left-[18px] top-1/2 z-20 transition-transform rounded-[11px] -translate-y-1/2">
      {/* 🔹 LOGO TOP ME */}
      <div className="logo p-3 pt-3">
        <Link
          to="/"
          className="logo flex w-full gap-2 border-color-gr2 color-one  py-3"
        >
          <img
            src={getImage("logoBlack")}
            className="re-logo-b-o transition w-32"
            alt="img"
          />
          {/* <span className="color-one uppercase larger font-semibold">Evarobo</span> */}
        </Link>
      </div>

      {/* <div className="menu-baar-d absolute -right-14">
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="max-[1023px]:ms-auto max-[1150px]:block inline-flex items-center p-2 justify-center text-sm text-white   focus:ring-[#ff9479]"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
        </button>
      </div> */}

      <div className="left-menu pt-4 p-4 w-73">
        <ul className="flex flex-col">
          {/* Dashboard */}
          <li className="px-1 py-1">
            <Link
              to="/"
              className={`flex items-start gap-3 rounded-xl px-1 py-1 transition-all duration-200 ${location.pathname === "/" || location.pathname === "/home"
                ? "bg-blue-50 text-[#2563eb] shadow-sm"
                : "text-[#334155] hover:text-[#2563eb]"
                }`}
            >
              <span className="mt-1">
                <i className="fa-solid fa-house text-sm"></i>
              </span>
              <div className="flex flex-col ">
                <div className="font-medium text-sm ">Dashboard</div>
                <div className="text-xs text-[#6b7280] ">
                  AI-powered LinkedIn
                </div>
              </div>
            </Link>
          </li>

          {/* Content studio */}
          <li className="px-1 py-1">
            <Link
              to="/content-studio"
              className={`flex items-start gap-3 rounded-xl px-1 py-1 transition-all duration-200 ${location.pathname === "/content-studio"
                ? "bg-blue-50 text-[#2563eb] shadow-sm"
                : "text-[#334155] hover:text-[#2563eb]"
                }`}
            >
              <span className="mt-1">
                <i className="fa-solid fa-file text-sm"></i>
              </span>
              <div className="flex flex-col ms-[4px]">
                <div className="font-medium text-sm ">Content studio</div>
                <div className="text-sm text-[#6b7280] ">
                  Generate posts & comments
                </div>
              </div>
            </Link>
          </li>

          {/* message assistant */}
          <li className="px-1 py-1">
            <Link
              to="/message-assistant"
              className={`flex items-start gap-3 rounded-xl px-1 py-1 transition-all duration-200 ${location.pathname === "/message-assistant"
                ? "bg-blue-50 text-[#2563eb] shadow-sm"
                : "text-[#334155] hover:text-[#2563eb]"
                }`}
            >
              <span className="mt-1">
                <i className="fa-solid fa-comment-dots text-sm"></i>
              </span>
              <div className="flex flex-col ms-[2px]">
                <div className="font-medium text-sm ">Message Assistant</div>
                <div className="text-sm text-[#6b7280] ">
                  Smart messages replies
                </div>
              </div>
            </Link>
          </li>


          {/* Comments */}
          <li className="px-1 py-1">
            <Link
              to="/comments"
              className={`flex items-start gap-3 rounded-xl px-1 py-1 transition-all duration-200 ${location.pathname === "/comments"
                ? "bg-blue-50 text-[#2563eb] shadow-sm"
                : "text-[#334155] hover:text-[#2563eb]"
                }`}
            >
              <span className="mt-1">
                <i className="fas fa-comments text-sm"></i>
              </span>
              <div className="flex text-sm flex-col ms-[2px]">
                <div className="font-medium text-sm ">Comments</div>
                <div className="text-sm text-[#6b7280] ">
                  AI-powered LinkedIn
                </div>
              </div>
            </Link>
          </li>

          {/* Save Profile */}
          <li className="px-1 py-1">
            <Link
              to="/save-profile"
              className={`flex items-start gap-3 rounded-xl px-1 py-1 transition-all duration-200 ${location.pathname === "/save-profile"
                ? "bg-blue-50 text-[#2563eb] shadow-sm"
                : "text-[#334155] hover:text-[#2563eb]"
                }`}
            >
              <span className="mt-1">
                <i className="fa-solid fa-user-plus text-sm"></i>
              </span>
              <div className="flex flex-col">
                <div className="font-medium text-sm ">Save Profile</div>
                <div className="text-sm text-[#6b7280] ">
                  AI-powered LinkedIn
                </div>
              </div>
            </Link>
          </li>

          {/* Personas */}
          <li className="px-1 py-1">
            <Link
              to="/personas"
              className={`flex items-start gap-3 rounded-xl px-1 py-1 transition-all duration-200 ${location.pathname === "/personas"
                ? "bg-blue-50 text-[#2563eb] shadow-sm"
                : "text-[#334155] hover:text-[#2563eb]"
                }`}
            >
              <span className="mt-1">
                <i className="fa-solid fa-user text-sm"></i>
              </span>
              <div className="flex flex-col ms-[4px]">
                <div className="font-medium text-sm ">Personas</div>
                <div className="text-xs text-[#6b7280] ">
                  AI-powered LinkedIn
                </div>
              </div>
            </Link>
          </li>

          {/* Message Campaigns */}
          {/* <li className="px-1 py-1">
            <Link
              to="/message-campaign"
              className={`flex items-start gap-3 rounded-xl px-1 py-1 transition-all duration-200 ${location.pathname === "/message-campaign"
                ? "bg-blue-50 text-[#2563eb] shadow-sm"
                : "text-[#334155] hover:text-[#2563eb]"
                }`}
            >
              <span className="mt-1">
                <i className="fas fa-envelope text-sm"></i>
              </span>
              <div className="flex flex-col ">
                <div className="font-medium text-sm ">Message Campaign</div>
                <div className="text-xs text-[#6b7280] ">
                  Automate LinkedIn DMs
                </div>
              </div>
            </Link>
          </li> */}

          {/* Connect Campaigns */}
          {/* <li className="px-1 py-1">
            <Link
              to="/connect-campaign"
              className={`flex items-start gap-3 rounded-xl px-1 py-1 transition-all duration-200 ${location.pathname === "/connect-campaign"
                ? "bg-blue-50 text-[#2563eb] shadow-sm"
                : "text-[#334155] hover:text-[#2563eb]"
                }`}
            >
              <span className="mt-1">
                <i className="fas fa-link text-sm"></i>
              </span>
              <div className="flex flex-col ">
                <div className="font-medium text-sm ">Connect Campaign</div>
                <div className="text-xs text-[#6b7280] ">
                  Grow network with invites
                </div>
              </div>
            </Link>
          </li> */}


          {/* Analytics */}
          {/* <li className="px-1 py-1">
            <Link
              to="/"
              className={`flex items-start gap-3 rounded-xl px-1 py-1 transition-all duration-200 ${location.pathname === ""
                  ? "bg-blue-50 text-[#2563eb] shadow-sm"
                  : "text-[#334155] hover:text-[#2563eb]"
                }`}
            >
              <span className="mt-1">
                <i className="fa-solid fa-chart-column text-sm"></i>
              </span>
              <div className="flex flex-col">
                <div className="font-medium text-sm">Analytics</div>
                <div className="text-sm text-[#6b7280]">
                  AI-powered LinkedIn
                </div>
              </div>
            </Link>
          </li> */}

          {/* LinkedIn  */}
          {/* <li className="px-1 py-1">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                goToLinkedIn();
              }}
              className={`flex items-start gap-3 rounded-xl px-1 py-1 transition-all duration-200
                hover:text-[#2563eb] text-[#334155]`}
            >
              <span className="mt-1 text-blue-600">
                <i className="fa-brands fa-linkedin text-sm"></i>
              </span>
              <div className="flex flex-col">
                <div className="font-medium text-sm ">Go To LinkedIn</div>
                <div className="text-sm text-[#6b7280]">
                  Visit your LinkedIn Profile
                </div>
              </div>
            </a>
          </li> */}

        </ul>
      </div>
      <div className="mt-auto"></div>
      <div className="pt-2 px-4 py-1">
        <ul>
          <li>
            <a
              href="https://evarobo.ai/contact-us/"
              target="_blank"
              className="dark-color w-full text-center text-base flex items-center justify-center"
            >
              Need Help ?
            </a>
          </li>
        </ul>
      </div>
      <hr className="w-full" />
      <div className="px-1 py-1">
        <Header />
      </div>
      {/* <div className="leftmenu-bottom px-4 py-1 border-t-1 border-b-0 border-l-0 border-r-0  border border-color-gr2 ">
        <ul>
          <li>
            <a
              href="#"
              className="dark-color w-full text-center text-base flex flex-col items-center justify-center"
            >
              <span className="font-normal transition">Version</span>
              <span className="font-normal transition">
                {manifestData.version}
              </span>
            </a>
          </li>
        </ul>
      </div> */}
    </div>
  );
};

export default SideBar;


