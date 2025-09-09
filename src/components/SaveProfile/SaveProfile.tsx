import { useEffect, useState, useCallback } from "react";
import { apiService } from "../../common/config/apiService";
import Swal from "sweetalert2";
import { Tooltip } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";

import {
  FiUsers,
  FiUserCheck,
  FiStar,
  FiBriefcase,
  FiTrendingUp,
  FiGlobe,
} from "react-icons/fi";
import Profilecard from "./Profilecard";
import { Users } from "lucide-react";

/**
 * @component
 * @description
 * The `SaveProfile` component renders a page header section with navigation breadcrumbs and a dropdown menu.
 * It includes a title, breadcrumb navigation links, and a campaign selection dropdown, making it ideal
 * for a "SaveProfile" page or similar SaveProfile structure.
 *
 * @example
 * <SaveProfile />
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @returns {JSX.Element}
 * - Renders a `div` with the main structure for the SaveProfile page including:
 *   - Page title with an icon and "SaveProfile" label.
 *   - Breadcrumb navigation for SaveProfile > SaveProfile.
 *   - Dropdown menu for campaign selection.
 *
 * @styles
 * - Utilizes Tailwind CSS classes for layout and styling, with responsive adjustments for smaller screens.
 */

interface Profile {
  id: string;
  profile?: string;
  name?: string;
  email?: string;
  position?: string;
  organization?: string;
  url?: string;
  created_at?: string;
}

const SaveProfile = () => {
  const [profilesData, setProfilesData] = useState<Profile[]>([]);
  const [load, setLoad] = useState(true);
  const [activePlan, setActiveplan] = useState(false);
  const navigate = useNavigate();
  const [user_id, setUser_id] = useState<number | string>("");
  const [crmConnection, setCrmConnection] = useState({
    crmConnection: false,
    crmName: null,
    token: null,
    url: null,
  });
  const [activeButton, setActiveButton] = useState("all");

  // Search term state
  const [searchTerm, setSearchTerm] = useState("");
  const [starredIds, setStarredIds] = useState<number[]>([]);

  // Load starred ids from localStorage on refresh
  useEffect(() => {
    const saved = localStorage.getItem("starredIds");
    if (saved) {
      setStarredIds(JSON.parse(saved));
    }
  }, []);

  // Search + Starred + Recent filter combine
  const filteredProfiles = profilesData
    // search logic
    .filter(
      (profile) =>
        profile.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.organization?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    // starred filter
    .filter((profile) =>
      activeButton === "starred" ? starredIds.includes(profile.id) : true
    )

  // Star feature
  const toggleStar = (id: number) => {
    let updated: number[];
    if (starredIds.includes(id)) {
      updated = starredIds.filter((i) => i !== id);
    } else {
      updated = [...starredIds, id];
    }
    setStarredIds(updated);
    localStorage.setItem("starredIds", JSON.stringify(updated));
  };

  // const getCRMdData = () => {
  //   chrome.storage.local.get(["crmData"], (response) => {
  //     const { crmConnection, crmName, token, url } = response.crmData ;
  //     if (crmConnection) {
  //       setCrmConnection({ crmConnection, crmName, token, url });
  //     }
  //   });
  // };
  const getCRMdData = () => {
  chrome.storage.local.get(["crmData"], (response) => {
    const crmData = response.crmData;

    if (crmData) {
      const { crmConnection, crmName, token, url } = crmData; 

      if (crmConnection) {
        setCrmConnection({ crmConnection, crmName, token, url });
      }
    }
  });
};


  useEffect(() => {
    getCRMdData();
  }, []);

  const fetchProfiles = useCallback(async () => {
    try {
      if (!chrome?.runtime?.sendMessage) {
        throw new Error("Chrome API is not available.");
      }

      const requestUrl = `${apiService.EndPoint.getProfiles}`;

      await apiService.commonAPIRequest(
        requestUrl,
        apiService.Method.get,
        undefined,
        {},
        (response: any) => {
          if (response?.status === 200 && response?.data?.data.profiles) {
            setProfilesData(response?.data?.data.profiles || []);
          } else {
            console.error(response?.message || "Failed to fetch profiles.");
          }
        }
      );
    } catch (err) {
      console.error("An unexpected error occurred:", err);
    } finally {
      setLoad(false);
    }
  }, []);

  const deleteProfile = async (id: any) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const requestUrl = `${apiService.EndPoint.deleteProfile.replace(
          ":id",
          id
        )}`;

        await apiService.commonAPIRequest(
          requestUrl,
          apiService.Method.delete,
          undefined,
          {},
          (response: any) => {
            if (
              response?.status === 200 &&
              response.data.message === "Saved profile removed successfully"
            ) {
              fetchProfiles();
              Swal.fire({
                title: "Deleted!",
                text: "Profile has been deleted.",
                icon: "success",
                confirmButtonColor: "#2563eb",
              });
            } else {
              Swal.fire({
                title: "Error!",
                text: response?.message || "Failed to delete profile.",
                icon: "error",
                confirmButtonColor: "#ff52563ebc35",
              });
            }
          }
        );
      } catch (err) {
        console.error("Error deleting profile:", err);
        Swal.fire({
          title: "Error!",
          text: "An unexpected error occurred.",
          icon: "error",
          confirmButtonColor: "#2563eb",
        });
      }
    }
  };

  useEffect(() => {
    fetchProfiles();
    checkActivePlan();
  }, [fetchProfiles]);

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
          if (result.data.userDetails.isTrialExpired) {
            if (
              result?.status === 200 &&
              result?.data.message ===
              "User does not have an active subscription."
            ) {
              setActiveplan(false);
            } else {
              setActiveplan(true);
            }
          } else {
            setActiveplan(true);
          }
          setUser_id(result?.data?.userDetails?.id);
        }
      );
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setLoad(false);
    }
  };

  const exportToCSV = () => {
    if (!profilesData.length) {
      Swal.fire({
        icon: "warning",
        title: "No Data Available",
        text: "There is no data to export.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    if (!activePlan) {
      Swal.fire({
        icon: "warning",
        title: "Subscription Required",
        text: "You need an active subscription to export data. Please subscribe.",
        confirmButtonColor: "#2563eb",
        showCancelButton: true,
        cancelButtonText: "Maybe Later",
        confirmButtonText: "Subscribe Now",
        customClass: {
          title: "!text-[2.5rem] font-bold",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/pricing");
        }
      });
      return;
    }

    const headers = [
      "Name",
      "Email",
      "Position",
      "Organization",
      "URL",
      "Created At",
    ];
    const csvRows = profilesData.map((profile) => [
      profile.name || "N/A",
      profile.email || "N/A",
      profile.position || "N/A",
      profile.organization || "N/A",
      profile.url || "N/A",
      profile.created_at
        ? new Date(profile.created_at).toLocaleDateString("en-GB")
        : "N/A",
    ]);

    // Convert to CSV string
    const csvString = [headers, ...csvRows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    // Create Blob and download
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "profiles.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const saveToDrive = async () => {
    if (!profilesData.length) {
      Swal.fire({
        icon: "warning",
        title: "No Data Available",
        text: "There is no data to export.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    if (!activePlan) {
      Swal.fire({
        icon: "warning",
        title: "Subscription Required",
        text: "You need an active subscription to export data. Please subscribe.",
        confirmButtonColor: "#2563eb",
        showCancelButton: true,
        cancelButtonText: "Maybe Later",
        confirmButtonText: "Subscribe Now",
        customClass: {
          title: "!text-[2.5rem] font-bold",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/pricing");
        }
      });
      return;
    }

    const { value: sheetUrl } = await Swal.fire({
      title: "Enter Google Sheet URL",
      html: `
            <p class="color-one mb-2">Please follow these steps:</p>
            <ul class="list-disc space-y-2 pl-5 text-justify">
              <li>Make sure you are logged into your <strong>Google</strong> account.</li>
              <li>Open a new tab and create a <strong>blank Google Sheet</strong> by visiting 
                <a href="https://sheets.new" target="_blank" class="text-blue-400 underline">sheets.new</a>.
              </li> 
              <li>Click on the <strong>Share</strong> button in the top-right corner.</li>
              <li>Change <strong>Restricted</strong> to <strong>Anyone with the link</strong>.</li>
              <li>Set the permission from <strong>Viewer</strong> to <strong>Editor</strong>.</li>
              <li>Click on the <strong>Copy link</strong> button.</li>
              <li>Paste the copied URL here in the input field below.</li>
            </ul>
            `,
      input: "url",
      inputPlaceholder: "Paste your Google Sheet URL here...",
      showCancelButton: true,
      confirmButtonText: "Save",
      confirmButtonColor: "#2563eb",
      customClass: {
        title: "!text-3xl font-semibold",
        actions: "flex justify-end w-full gap-2 px-7",
        input:
          "w-[87%] mx-auto mt-4 outline-0 border placeholder-[#545c66] !border-[#4f59662b] text-[#545c66] bg-[#f6f9fc] text-base font-light color5a5783 transition p-3 relative  rounded-xl m-0 swal2-input",
      },
      inputValidator: (value) => {
        if (!value) return "Please enter the URL!";
        const isValid =
          /^https:\/\/docs\.google\.com\/spreadsheets\/d\/.+/.test(value);
        if (!isValid) return "Please enter a valid Google Sheet URL!";
      },
    });

    if (sheetUrl) {
      // Call your API here
      const payload = {
        google_sheet_url: sheetUrl,
      };
      try {
        Swal.fire({
          title: "Saving...",
          text: "Please wait while we save your file.",
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: () => Swal.showLoading(),
        });
        const requestUrl = apiService.EndPoint.saveGooglegrive;
        // Make the API request to check the active plan status
        await apiService.commonAPIRequest(
          requestUrl,
          apiService.Method.post,
          undefined, // No query parameters
          payload, // No request body
          (result: any) => {
            if (
              result.data.status === 200 &&
              result.data.message === "Profiles exported successfully."
            ) {
              Swal.fire(
                "Success!",
                "Your file has been saved to Google Drive.",
                "success"
              );
            } else {
              Swal.fire(
                "Something went wrong",
                result.data.message || "Something issue at server.",
                "error"
              );
            }
          }
        );
      } catch (error) {
        console.error("Error fetching plans:", error);
        Swal.fire(
          "Error",
          "Something went wrong while connecting to the server.",
          "error"
        );
      }
    }
  };

  const connectToCRM = async () => {
    if (!activePlan) {
      Swal.fire({
        icon: "warning",
        title: "Subscription Required",
        text: "You need an active subscription to connect CRM. Please subscribe.",
        confirmButtonColor: "#2563eb",
        showCancelButton: true,
        cancelButtonText: "Maybe Later",
        confirmButtonText: "Subscribe Now",
        customClass: {
          title: "!text-[2.5rem] font-bold",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/pricing");
        }
      });
      return;
    }

    if (crmConnection.crmConnection) {
      Swal.fire({
        icon: "warning",
        title: "Connection Status: CRM Active",
        text: `You have successfully linked your account with ${crmConnection.crmName}.`,
        confirmButtonColor: "#2563eb",
        confirmButtonText: "OK",
        customClass: {
          title: "!text-[1.7rem] font-bold",
        },
      });
      return;
    }

    const { value: formValues } = await Swal.fire({
      title: "Connect With CRM",
      html: `
        <label for="crm-select" class="block text-left mb-1 text-sm font-medium">Select your CRM:</label>
        <select id="crm-select" class="swal2-input w-full outline-0 border placeholder-[#545c66] !border-[#4f59662b] text-[#545c66] bg-[#f6f9fc] text-base font-light color5a5783 transition p-3 relative  rounded-xl">
          <option value="">-- Select CRM --</option>
          <option value="zendesk">Zendesk</option>
        </select>
  
        <div id="zendesk-fields" style="display:none;">
          <label class="block text-left mt-4 mb-1 text-sm font-medium">Zendesk URL</label>
          <input type="text" id="zendesk-url" class="w-full outline-0 border placeholder-[#545c66] !border-[#4f59662b] text-[#545c66] bg-[#f6f9fc] text-base font-light color5a5783 transition p-3 relative  rounded-xl m-0 swal2-input" placeholder="https://yourcompany.zendesk.com" />
  
          <label class="block text-left mt-4 mb-1 text-sm font-medium">Zendesk Token</label>
          <input type="text" id="zendesk-token" class="w-full outline-0 border placeholder-[#545c66] !border-[#4f59662b] text-[#545c66] bg-[#f6f9fc] text-base font-light color5a5783 transition p-3 relative  rounded-xl m-0 swal2-input" placeholder="Enter your token" />
  
          <div class="mt-6 text-left text-sm bg-gray-100 p-0 rounded">
            <p class="font-font-semibold mb-2">How to get your Zendesk URL & Token:</p>
            <ol class="list-decimal ml-5 space-y-1 text-gray-700">
              <li>Your Zendesk URL is like: https://yourcompany.zendesk.com</li>
              <li>Go to <strong>Zendesk Admin</strong> → Channels → API</li>
              <li>Enable <strong>Token Access</strong> and generate a new token</li>
              <li>Copy & paste the token here</li>
            </ol>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Connect",
      confirmButtonColor: "#2563eb",
      customClass: {
        title: "!text-3xl font-semibold",
        actions: "flex justify-end w-full gap-2 px-7",
      },
      didOpen: () => {
        const crmSelect = document.getElementById(
          "crm-select"
        ) as HTMLSelectElement | null;
        const zendeskFields = document.getElementById(
          "zendesk-fields"
        ) as HTMLElement | null;

        if (crmSelect && zendeskFields) {
          crmSelect.addEventListener("change", (e: Event) => {
            const target = e.target as HTMLSelectElement | null;
            if (target) {
              zendeskFields.style.display =
                target.value === "zendesk" ? "block" : "none";
            }
          });
        }
      },
      preConfirm: () => {
        const crm = (document.getElementById("crm-select") as HTMLSelectElement)
          .value;
        if (crm === "zendesk") {
          const url = (
            document.getElementById("zendesk-url") as HTMLInputElement
          ).value.trim();
          const token = (
            document.getElementById("zendesk-token") as HTMLInputElement
          ).value.trim();
          if (!url || !token) {
            Swal.showValidationMessage(
              "Please enter both Zendesk URL and token"
            );
          }
          return { crm, url, token };
        } else {
          Swal.showValidationMessage("Please select a CRM");
        }
      },
    });

    if (formValues?.crm === "zendesk") {
      const { url, token } = formValues;

      try {
        Swal.fire({
          title: "Connecting...",
          text: "Please wait while we connect your CRM.",
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: () => Swal.showLoading(),
        });

        const payload = {
          crm_name: "zendesk",
          crm_url: url,
          token: token,
          user_id: user_id,
        };

        const requestUrl = apiService.EndPoint.connectToCRM;

        await apiService.commonAPIRequest(
          requestUrl,
          apiService.Method.post,
          undefined,
          payload,
          (result: any) => {
            if (
              result.status === 201 &&
              result?.data?.message === "Connected Successfully"
            ) {
              const crmData = {
                crmConnection: true,
                crmName: "zendesk",
                token: payload?.token || "",
                url: payload?.crm_url,
              };
              chrome.storage.local.set({ crmData });
              Swal.fire("Success!", "Your CRM is now connected.", "success");
              getCRMdData();
            } else if (result?.data?.message.includes("Duplicate entry")) {
              Swal.fire(
                "Error",
                "Connection Error: This CRM is already connected.",
                "error"
              );
            } else {
              Swal.fire(
                "Failed",
                result.data.message || "Unable to connect CRM.",
                "error"
              );
            }
          }
        );
      } catch (error) {
        console.error("CRM Connection Error:", error);
        Swal.fire(
          "Error",
          "Something went wrong while connecting CRM.",
          "error"
        );
      }
    }
  };

  return (
    <>
      <div className="c-padding-r py-12  h-screen relative pl-[390px] pr-[110px]">
        {/* --- Header Section (Title + Search + Buttons) --- */}
        <div className="flex flex-wrap items-center justify-between bg-white z-10 mb-4 g-box p-4 rounded-lg shadow-sm">
          {/* Left Side: Title */}
          <div className="mb-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  Saved Profiles
                </div>
                <div className="text-sm text-[#717c8c]">
                  Manage your LinkedIn contacts and prospects
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-slate-600">
                {filteredProfiles.length} profiles saved
              </span>
            </div>
          </div>

          {/* Right Side: Search + Buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-3 md:mt-0">
            {/* --- Button 1: Connect CRM --- */}
            <Tooltip
              content="Sync with your CRM system"
              placement="bottom"
              className="custom-tooltip c-bottom-t ex !w-auto"
            >
              <button
                onClick={connectToCRM}
                className="flex items-center gap-2 border  px-4 py-2 text-sm font-medium rounded-lg border-[#2563eb] text-[#2563eb] hover:bg-[#2563eb] hover:text-white transition"
              >
                <i className="fa-solid fa-globe"></i>
                <span>Connect to CRM</span>
              </button>
            </Tooltip>

            {/* --- Button 2: Save to Drive --- */}
            <Tooltip
              content="Send a copy to Google Drive"
              placement="bottom"
              className="custom-tooltip c-bottom-t ex !w-auto"
            >
              <button
                onClick={saveToDrive}
                className="flex items-center gap-2 border border-[#2563eb] text-[#2563eb] px-4 py-2 text-sm font-medium rounded-lg hover:bg-[#2563eb] hover:text-white transition"
              >
                <i className="fa-brands fa-google-drive"></i>
                <span>Save to Drive</span>
              </button>
            </Tooltip>

            {/* --- Button 3: Export CSV --- */}
            <Tooltip
              content="Download your data as a CSV file"
              placement="bottom"
              className="custom-tooltip c-bottom-t ex !w-auto"
            >
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 border border-[#2563eb] text-[#2563eb] px-4 py-2 text-sm font-medium rounded-lg hover:bg-[#2563eb] hover:text-white transition"
              >
                <i className="fa-solid fa-file-arrow-down"></i>
                <span>Export CSV</span>
              </button>
            </Tooltip>
          </div>
        </div>

        {/* All Box */}
        <div className="grid grid-cols-6 gap-4 bg-white p-4 rounded-xl border border-[#e3e9f1] shadow-sm mb-4 g-box ">
          {/* Box 1 */}
          <div
            onClick={() => setActiveButton("all")}
            className="p-4 bg-[#f0f8ff] rounded-xl hover:bg-[#d7dbdf] shadow-sm flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-full  bg-[#bfdbfe]">
              <FiUsers className="text-[#2563eb] text-lg" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">
                {profilesData.length}
              </div>
              <div className="text-sm text-gray-600">Total Profiles</div>
            </div>
          </div>

          {/* Box 2 */}
          <div className="p-4 bg-[#f0f8ff] rounded-xl hover:bg-[#d7dbdf] shadow-sm flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#edfdf2]">
              <FiUserCheck className="text-green text-lg" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">0</div>
              <div className="text-sm text-gray-600">1st Connections</div>
            </div>
          </div>

          {/* Box 3 */}
          <div
            onClick={() => setActiveButton("starred")}
            className="p-4 bg-[#f0f8ff] rounded-xl hover:bg-[#d7dbdf] shadow-sm flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-full  bg-[#fefce8]">
              <FiStar className="text-yellow-400 text-lg" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">
                {starredIds.length}
              </div>
              <div className="text-sm text-gray-600">Starred</div>
            </div>
          </div>

          {/* Box 4 */}
          <div className="p-4 bg-[#f0f8ff] rounded-xl hover:bg-[#d7dbdf] shadow-sm flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#eee7f5]">
              <FiBriefcase className="text-[#9333ea] text-lg" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">0</div>
              <div className="text-sm text-gray-600">Companies</div>
            </div>
          </div>

          {/* Box 5 */}
          <div className="p-4 bg-[#f0f8ff] rounded-xl hover:bg-[#d7dbdf] shadow-sm flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 flex items-center justify-center rounded-full  bg-[#f7ecde]">
              <FiTrendingUp className="text-[#ea580c] text-lg" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">0</div>
              <div className="text-sm text-gray-600">High Engagement</div>
            </div>
          </div>

          {/* Box 6 */}
          <div className="p-4 bg-[#f0f8ff] rounded-xl hover:bg-[#d7dbdf] shadow-sm flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 flex items-center justify-center rounded-full  bg-[#bfdbfe]">
              <FiGlobe className="text-[#2563eb] text-lg" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">0</div>
              <div className="text-sm text-gray-600">Out of Network</div>
            </div>
          </div>
        </div>

        {/* search and 3 buttons */}
        <div className="flex w-full bg-white justify-between items-center overflow-hidden mb-4 p-4 g-box gap-2">
          {/* --- Search Box Left --- */}
          <div className="flex items-center bg-white shadow-sm rounded-xl px-3 py-2 w-100 transition border border-[#2563eb] h-[38px]">
            <IoSearchOutline className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search profiles by name or company name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-2 text-sm border-none placeholder-gray-400 focus:outline-none focus:ring-0"
            />
          </div>

          {/* --- Tabs Right --- */}
          <div className="flex items-center gap-2">
            {/* All Tab */}
            <Tooltip
              placement="bottom"
              content="View all saved profiles"
              className="custom-tooltip c-bottom-t ex !w-auto"
            >
              <button
                onClick={() => setActiveButton("all")}
                className={`flex items-center gap-2 px-4 py-2 font-medium rounded-lg border border-[#2563eb] transition ${activeButton === "all"
                    ? "bg-[#2563eb] text-white"
                    : "text-[#2563eb] hover:bg-[#2563eb] hover:text-white"
                  }`}
              >
                <i className="fa-solid fa-user-group text-sm"></i>
                All (0)
              </button>
            </Tooltip>

            {/* Starred Tab */}
            <Tooltip
              content="View your starred profiles"
              placement="bottom"
              className="custom-tooltip c-bottom-t ex !w-auto"
            >
              <button
                onClick={() => setActiveButton("starred")}
                className={`flex items-center gap-2 px-4 py-2 font-medium rounded-lg border border-[#2563eb] transition ${activeButton === "starred"
                    ? "bg-[#2563eb] text-white"
                    : "text-[#2563eb] hover:bg-[#2563eb] hover:text-white"
                  }`}
              >
                <i className="fa-solid fa-star text-sm"></i>
                Starred
              </button>
            </Tooltip>

            {/* Recent Tab */}
            <Tooltip
              content="View last 24 saved profiles"
              placement="bottom"
              className="custom-tooltip c-bottom-t ex !w-auto"
            >
              <button
                onClick={() => setActiveButton("recent")}
                className={`flex items-center gap-2 px-4 py-2 font-medium rounded-lg border border-[#2563eb] transition ${activeButton === "recent"
                    ? "bg-[#2563eb] text-white"
                    : "text-[#2563eb] hover:bg-[#2563eb] hover:text-white"
                  }`}
              >
                <i className="fa-solid fa-clock text-sm"></i>
                Recent
              </button>
            </Tooltip>
          </div>
        </div>

        {/* // Tab Section */}
        {/* All Tab */}
        {activeButton === "all" && (
          <>
            <Profilecard
              profiles={filteredProfiles} // sabhi profiles
              load={load}
              deleteProfile={deleteProfile}
              toggleStar={toggleStar}
              TabButton={activeButton}
              starredIds={starredIds}
            />
          </>
        )}

        {/* Starred Tab */}
        {activeButton === "starred" && (
          <>
            <Profilecard
              profiles={filteredProfiles.filter((p) =>
                starredIds.includes(p.id)
              )}
              load={load}
              deleteProfile={deleteProfile}
              toggleStar={toggleStar}
              TabButton={activeButton}
              starredIds={starredIds}
            />
          </>
        )}

        {/* Recent Tab */}
        {activeButton === "recent" && (
          <>
            <Profilecard
              profiles={[...filteredProfiles]
                .filter((p) => {
                  const createdAt = new Date(p.created_at);
                  const now = new Date();
                  const diffInHours = (now - createdAt) / (1000 * 60 * 60);
                  return diffInHours <= 24; // only 24hr
                })
                .sort(
                  (a, b) => new Date(b.created_at) - new Date(a.created_at)
                )}
              load={load}
              deleteProfile={deleteProfile}
              toggleStar={toggleStar}
              TabButton={activeButton}
              starredIds={starredIds}
            />
          </>
        )}
      </div>
    </>
  );
};

export default SaveProfile;
