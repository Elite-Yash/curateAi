import { Link, useLocation } from "react-router-dom";
import { getImage } from "../common/utils/logoUtils";
import "@fortawesome/fontawesome-free/css/all.min.css";
// import { openWindowTab } from "../common/helpers/commonHelpers";
import Header from "./UserProfile/Header";
import { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

// const SideBar = ({setOpenplanpopup} : any) => {
const SideBar = () => {
  const location = useLocation();
  const [isCampaignOpen, setIsCampaignOpen] = useState(false);
  return (
    <div className="flex flex-col left-baar-menu  max-[1150px]:-translate-x-64 h-[100vh] fixed left-[0] top-1/2 z-20 transition-transform rounded-[11px] -translate-y-1/2 bg-[#fafafa]">
      {/* 🔹 LOGO TOP ME */}
      <div className="logo p-[24px] pt-3">
        <Link
          to="/"
          className="logo flex w-full gap-2 border-color-gr2 color-one  py-3"
        >
          <img
            src={getImage("logoBlack")}
            className="re-logo-b-o transition w-32"
            alt="img"
          />
        </Link>
      </div>


      <div className="left-menu pt-4 p-4 w-73">
        <ul className="flex flex-col gap-1">
          {/* Dashboard */}
          <li className="">
            <Link
              to="/"
              className={`flex items-start gap-3 rounded-xl px-[16px] py-[7px]  hover:!bg-[#eff6ff] transition-all duration-200 ${location.pathname === "/" || location.pathname === "/home"
                ? " text-[#ff5c35] shadow-sm !bg-[#ff5c350f]"
                : "text-[#334155] hover:text-[#ff5c35]"
                }`}
            >
              <span className="mt-1 flex w-[20px] justify-center">
                <i className="fa-solid fa-house text-sm"></i>
              </span>
              <div className="flex flex-col ">
                <div className="font-medium text-sm">Dashboard</div>
                <div className="text-xs text-[#6b7280] ">
                  AI-powered LinkedIn
                </div>
              </div>
            </Link>
          </li>

          {/* Content studio */}
          <li className="">
            <Link
              to="/content-studio"
              className={`flex items-start gap-3 rounded-xl px-[16px] py-[7px]  hover:!bg-[#ff5c350f] transition-all duration-200 ${location.pathname === "/content-studio"
                ? "text-[#ff5c35] shadow-sm !bg-[#ff5c350f]"
                : "text-[#334155] hover:text-[#ff5c35]"
                }`}
            >
              <span className="mt-1 flex w-[20px] justify-center">
                <i className="fa-solid fa-file text-sm"></i>
              </span>
              <div className="flex flex-col">
                <div className="font-medium text-sm ">Content studio</div>
                <div className="text-xs text-[#6b7280] ">
                  Generate posts & Comments
                </div>
              </div>
            </Link>
          </li>

          {/* message assistant */}
          <li className="">
            <Link
              to="/message-assistant"
              className={`flex items-start gap-3 rounded-xl px-[16px] py-[7px]  hover:!bg-[#ff5c350f] transition-all duration-200 ${location.pathname === "/message-assistant"
                ? "text-[#ff5c35] shadow-sm !bg-[#ff5c350f]"
                : "text-[#334155] hover:text-[#ff5c35]"
                }`}
            >
              <span className="mt-1 flex w-[20px] justify-center">
                <i className="fa-solid fa-comment-dots text-sm"></i>
              </span>
              <div className="flex flex-col">
                <div className="font-medium text-sm ">Message Assistant</div>
                <div className="text-xs text-[#6b7280] ">
                  Messages replies & Connection
                </div>
              </div>
            </Link>
          </li>


          {/* Comments */}
          <li className="">
            <Link
              to="/comments"
              className={`flex items-start gap-3 rounded-xl px-[16px] py-[7px] hover:!bg-[#ff5c350f] transition-all duration-200 ${location.pathname === "/comments"
                ? "text-[#ff5c35] shadow-sm !bg-[#ff5c350f]"
                : "text-[#334155] hover:text-[#ff5c35]"
                }`}
            >
              <span className="mt-1 flex w-[20px] justify-center">
                <i className="fas fa-comments text-sm"></i>
              </span>
              <div className="flex text-sm flex-col">
                <div className="font-medium text-sm ">Comments</div>
                <div className="text-xs text-[#6b7280] ">
                  AI-powered LinkedIn
                </div>
              </div>
            </Link>
          </li>

          {/* Save Profile */}
          <li className="">
            <Link
              to="/save-profile"
              className={`flex items-start gap-3 rounded-xl px-[16px] py-[7px]  hover:!bg-[#ff5c350f] transition-all duration-200 ${location.pathname === "/save-profile"
                ? "text-[#ff5c35] shadow-sm !bg-[#ff5c350f]"
                : "text-[#334155] hover:text-[#ff5c35]"
                }`}
            >
              <span className="mt-1 flex w-[20px] justify-center">
                <i className="fa-solid fa-user-plus text-sm"></i>
              </span>
              <div className="flex flex-col">
                <div className="font-medium text-sm ">Save Profile</div>
                <div className="text-xs text-[#6b7280] ">
                  AI-powered LinkedIn
                </div>
              </div>
            </Link>
          </li>

          {/* 🔹 Manage Campaign (with Submenu) */}
          <li className="">
            <button
              onClick={() => setIsCampaignOpen(!isCampaignOpen)}
              className={`flex items-start gap-3 rounded-xl px-[16px] py-[7px]  hover:!bg-[#ff5c350f] transition-all duration-200 w-[100%] ${isCampaignOpen
                ? "text-[#ff5c35] shadow-sm !bg-[#ff5c350f]"
                : "text-[#334155] hover:text-[#ff5c35]"
                }`}
            >
              <span className="mt-1 flex w-[20px] justify-center">
                <i className="fas fa-tasks text-sm"></i>
              </span>
              <div className="flex flex-col ms">
                <span className="font-medium text-left text-sm">Manage Campaign</span>
                <div className="text-xs text-[#6b7280] w-max">
                  Manage LinkedIn Campaign
                </div>
              </div>

              <MdKeyboardArrowDown
                className={`transition-transform duration-300 ease-in-out ${isCampaignOpen ? "rotate-180" : "rotate-0"
                  }`}
                size={22}
              />
            </button>

            {/* Submenu */}
            {isCampaignOpen && (
              <ul className="pl-8 mt-1 space-y-1">
                <li>
                  <Link
                    to="/message-campaign"
                    className={`flex items-start gap-3 rounded-xl px-1 py-1 transition-all duration-200 ${location.pathname === "/message-campaign"
                      ? "text-[#ff5c35] shadow-sm !bg-[#ff5c350f]"
                      : "text-[#334155] hover:text-[#ff5c35]"
                      }`}
                  >
                    <span className="mt-1 flex w-[20px] justify-center">
                      <i className="fas fa-envelope text-sm"></i>
                    </span>
                    <div className="flex flex-col">
                      <div className="font-medium text-sm">
                        Message Campaign
                      </div>
                      <div className="text-xs text-[#6b7280]">
                        Automate LinkedIn DMs
                      </div>
                    </div>
                  </Link>
                </li>

                {/* <li>
                  <Link
                    to="/connect-campaign"
                    className={`flex items-start gap-3 rounded-xl px-1 py-1 transition-all duration-200 ${location.pathname === "/connect-campaign"
                      ? "text-[#ff5c35] shadow-sm !bg-[#ff5c350f]"
                      : "text-[#334155] hover:text-[#ff5c35]"
                      }`}
                  >
                    <span className="mt-1 flex w-[20px] justify-center">
                      <i className="fas fa-user-plus text-sm"></i>
                    </span>
                    <div className="flex flex-col">
                      <div className="font-medium text-sm">
                        Connect Campaign
                      </div>
                      <div className="text-xs text-[#6b7280]">
                        Automate LinkedIn connections
                      </div>
                    </div>
                  </Link>
                </li> */}

                <li>
                  <Link
                    to="/messgae-template"
                    className={`flex items-start gap-3 rounded-xl px-1 py-1 transition-all duration-200 ${location.pathname === "/messgae-template"
                      ? "text-[#ff5c35] shadow-sm !bg-[#ff5c350f]"
                      : "text-[#334155] hover:text-[#ff5c35]"
                      }`}
                  >
                    <span className="mt-1 flex w-[20px] justify-center">
                      <i className="fas fa-file-alt text-base"></i>
                    </span>
                    <div className="flex flex-col">
                      <div className="font-medium text-sm">
                        Template
                      </div>
                      <div className="text-xs text-[#6b7280]">
                        Personalized DMs
                      </div>
                    </div>
                  </Link>
                </li>
              </ul>
            )}
          </li>


          {/* LinkedIn  */}
          {/* <li className="">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                goToLinkedIn[();
16px]   }[12px] hover:!bg-[#ff5c350f]
              className={`flex items-start gap-3 rounded-xl px-1 py-1 transition-all duration-200
                hover:text-[#ff5c35] text-[#334155]`}
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
      {/* <div className="mt-auto p-4">
        <button
          onClick={() => setOpenplanpopup(true)}
          className="flex ms-[25px] items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-[#ff5c35] font-medium text-sm px-4 py-2 rounded-xl shadow-sm transition w-[160px]"
        >
          <GiUpgrade className="text-base" />
          <span>Upgrade Plan</span>
        </button>

      
        <div className="pt-3">
          <a
            href="https://evarobo.ai/contact-us/"
            target="_blank"
            className="block w-full text-center text-gray-600 hover:text-[#ff5c35] text-sm font-medium transition"
          >
            Need Help ?
          </a>
        </div>
      </div> */}

      {/* <hr className="w-full" /> */}
      <div className="px-1 py-1 mt-auto">
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
