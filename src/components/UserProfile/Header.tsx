import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { getImage } from "../../common/utils/logoUtils";
import { apiService } from "../../common/config/apiService";
import { useDispatch } from "react-redux";
import { setActivePlan } from "../../redux/reducer/activePlan";
import { MdKeyboardArrowUp } from "react-icons/md";

/**..
 * ..
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
  const [userDetails, setUserDetails] = useState<Record<string, any>>({});
  const [freePlan, setFreePlan] = useState(false);
  const [activePlan, setActiveplan] = useState(false);
  const [activePlanDetails, setActiveplanDetails] = useState<
    Record<string, any>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

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
    navigate("/signin", { replace: true });
    setLogin(null);
    window.location.reload();
  };

  const checkActivePlan = async () => {
    try {
      setIsLoading(true); // Start loading
      const requestUrl = apiService.EndPoint.checkActivePlan;
      await apiService.commonAPIRequest(
        requestUrl,
        apiService.Method.get,
        undefined,
        {},
        (result: any) => {
          if (result.data.userDetails.isTrialExpired) {
            if (
              result?.status === 200 &&
              result?.data.message ===
              "User does not have an active subscription."
            ) {
              setActiveplan(false);
              dispatch(setActivePlan(false));
            } else {
              setActiveplan(true);
              setActiveplanDetails(result?.data.subscriptions[0]);
              dispatch(setActivePlan(true));
            }
            setFreePlan(false);
          } else {
            setFreePlan(true);
            dispatch(setActivePlan(true));
          }
          setUserDetails(result.data.userDetails);
          setIsLoading(false); // End loading
        }
      );
    } catch (error) {
      console.error("Error fetching plans:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="header-baar flex flex-col c-padding-r w-full mt-auto">
      <div className="flex flex-col justify-centerrelative mt-5 px-[25px] py-[15px]">
        <div className="flex justify-between items-center gap-5">
          <div className="header-r-menu flex items-center gap-8   ">
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
                  <span className="icon w-8 text-[14px] h-8 rounded-full overflow-hidden border-2 border-solid border-[#ff5c35] bg-[#ff5c35] outline-1 outline-green-950 outline flex justify-center items-center text-white">
                    {userDetails?.name ? userDetails.name.charAt(0).toUpperCase() : "U"}
           

                    {/* <img
                      src={getImage("user")}
                      alt="img"
                      className="w-full h-full rounded-full"
                    /> */}
                  </span>
                  <span className="text-sm dec-color font-normal">
                    <span className="flex flex-col">
                      {isLoading ? (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <i className="fas fa-spinner fa-spin"></i> Loading...
                        </span>
                      ) : (
                        <>
                          <span className="text-[#0f172a] font-medium text-sm">{userDetails?.name}</span>
                                   <span className="text-xs text-[#64478b]">Linkedin Connected</span>
                          {/* <span
                            className={`${freePlan || activePlan ? "text-green" : "text-red"
                              } text-xs`}
                          >
                            {freePlan
                              ? "Free Plan"
                              : activePlan
                                ? activePlanDetails?.interval === "year"
                                  ? "Yearly Plan"
                                  : "Upgrade Plan"
                                : "Subscribe"}
                          </span> */}
                        </>
                      )}
                    </span>
                  </span>
                  {/* <i className="text-xs fa-solid fa-chevron-down dec-color rotate-180"></i> */}
                                {/* <MdKeyboardArrowUp
                                  className={`transition-transform duration-300 ease-in-out ${dropdownOpen ? "rotate-180" : "rotate-0"
                                    }`}
                                  size={22}
                                /> */}
                </a>
                {dropdownOpen && (
                  <div className="absolute bottom-[58px] right-0 left-8 mt-2 bg-white w-32 drop-menu z-50 shadow-lg rounded-xl">
                    <button
                      onClick={() => {
                        navigate("/setting");
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-3 text-sm transition rounded-xl flex items-center gap-2"
                    >
                      <i className="fa-solid text-[#ff5c35] fa-gear transition"></i>
                      Setting
                    </button>
                    <button
                      className="w-full text-left px-3 py-3 text-sm transition rounded-xl flex items-center gap-2"
                      onClick={LogOut}
                    >
                      <i className="fa-solid fa-power-off text-[#ff5c35] transition"></i>
                      LogOut
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
