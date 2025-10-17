import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MdKeyboardArrowDown } from "react-icons/md";
import { PiLinkSimpleBold } from "react-icons/pi";

const SidebarMyLinkedinConnection = () => {
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const workspaces = [
    {
      id: 1,
      name: "Default Workspace",
    },
   ];

  const workspacePath = (workspaceId: number) => `/workspace/${workspaceId}`;

  return (
    <li>
      {/* Main Button */}
      <button
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        className={`flex items-start gap-3 rounded-xl px-[16px] py-[7px] w-full hover:!bg-[#ff5c350f] transition-all duration-200 ${
          isProfileOpen
            ? "text-[#ff5c35] shadow-sm !bg-[#ff5c350f]"
            : "text-[#334155] hover:text-[#ff5c35]"
        }`}
      >
        <span className="mt-1 flex w-[20px] justify-center">
          <PiLinkSimpleBold className=" text-sm"/>
        </span>
        <div className="flex flex-col flex-1 text-left">
          <span className="font-medium text-sm">My LinkedIn Connection</span>
          <span className="text-xs text-[#6b7280]">AI-powered LinkedIn</span>
        </div>
        <MdKeyboardArrowDown
          className={`transition-transform duration-300 ml-auto ${
            isProfileOpen ? "rotate-180" : "rotate-0"
          }`}
          size={22}
        />
      </button>

      {/* Submenu - Only Workspaces */}
      {isProfileOpen && (
        <ul className="pl-8 mt-1 space-y-2">
          {workspaces.map((ws) => (
            <li key={ws.id}>
              <Link
                to={workspacePath(ws.id)}
                className={`flex items-start gap-2 rounded-xl px-2 py-[6px] w-full transition-all duration-200 ${
                  location.pathname === workspacePath(ws.id)
                    ? "text-[#ff5c35] shadow-sm !bg-[#ff5c350f]"
                    : "text-[#334155] hover:text-[#ff5c35]"
                }`}
              >
                <span className="mt-1 flex w-[20px] justify-center">
                  <i className="fa-solid fa-briefcase text-sm"></i>
                </span>
                <div className="flex flex-col flex-1 text-left">
                  <span className="font-medium text-sm">{ws.name}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default SidebarMyLinkedinConnection;
