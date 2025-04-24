import { useEffect, useState, useCallback } from "react";
import { apiService } from "../../common/config/apiService";
import { getImage } from "../../common/utils/logoUtils";
import Loader from "../Loader/Loader";
import Swal from "sweetalert2";
import { Tooltip } from "flowbite-react";
import { useNavigate } from "react-router-dom";

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

  const getCRMdData = () => {
    chrome.storage.local.get(["crmData"], (response) => {
      const { crmConnection, crmName, token, url } = response.crmData;
      if (crmConnection) {
        setCrmConnection({ crmConnection, crmName, token, url })
      }
    });
  }
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
      confirmButtonColor: "#ff5c35",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const requestUrl = `${apiService.EndPoint.deleteProfile.replace(':id', id)}`;

        await apiService.commonAPIRequest(
          requestUrl,
          apiService.Method.delete,
          undefined,
          {},
          (response: any) => {
            if (response?.status === 200 && response.data.message === "Saved profile removed successfully") {
              fetchProfiles();
              Swal.fire({ title: "Deleted!", text: "Profile has been deleted.", icon: "success", confirmButtonColor: "#ff5c35" });
            } else {
              Swal.fire({ title: "Error!", text: response?.message || "Failed to delete profile.", icon: "error", confirmButtonColor: "#ff5c35" });
            }
          }
        );
      } catch (err) {
        console.error("Error deleting profile:", err);
        Swal.fire({ title: "Error!", text: "An unexpected error occurred.", icon: "error", confirmButtonColor: "#ff5c35" });
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
            if (result?.status === 200 && result?.data.message === "User does not have an active subscription.") {
              setActiveplan(false);
            } else {
              setActiveplan(true);
            }
          } else {
            setActiveplan(true);
          }
          setUser_id(result?.data?.userDetails?.id)
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
        confirmButtonColor: "#ff5c35",
      });
      return;
    }

    if (!activePlan) {
      Swal.fire({
        icon: "warning",
        title: "Subscription Required",
        text: "You need an active subscription to export data. Please subscribe.",
        confirmButtonColor: "#ff5c35",
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


    const headers = ["Name", "Email", "Position", "Organization", "URL", "Created At"];
    const csvRows = profilesData.map((profile) => [
      profile.name || "N/A",
      profile.email || "N/A",
      profile.position || "N/A",
      profile.organization || "N/A",
      profile.url || "N/A",
      profile.created_at ? new Date(profile.created_at).toLocaleDateString("en-GB") : "N/A",
    ]);

    // Convert to CSV string
    const csvString = [headers, ...csvRows].map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")).join("\n");

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
        confirmButtonColor: "#ff5c35",
      });
      return;
    }

    if (!activePlan) {
      Swal.fire({
        icon: "warning",
        title: "Subscription Required",
        text: "You need an active subscription to export data. Please subscribe.",
        confirmButtonColor: "#ff5c35",
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
      title: 'Enter Google Sheet URL',
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
      input: 'url',
      inputPlaceholder: 'Paste your Google Sheet URL here...',
      showCancelButton: true,
      confirmButtonText: 'Save',
      confirmButtonColor: '#ff5c35',
      customClass: {
        title: '!text-3xl font-semibold',
        actions: 'flex justify-end w-full gap-2 px-7',
        input: "w-[87%] mx-auto mt-4 outline-0 border placeholder-[#545c66] !border-[#4f59662b] text-[#545c66] bg-[#f6f9fc] text-base font-light color5a5783 transition p-3 relative  rounded-xl m-0 swal2-input",
      },
      inputValidator: (value) => {
        if (!value) return 'Please enter the URL!'
        const isValid = /^https:\/\/docs\.google\.com\/spreadsheets\/d\/.+/.test(value)
        if (!isValid) return 'Please enter a valid Google Sheet URL!'
      }
    })

    if (sheetUrl) {
      // Call your API here
      const payload = {
        google_sheet_url: sheetUrl,
      }
      try {
        Swal.fire({
          title: 'Saving...',
          text: 'Please wait while we save your file.',
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: () => Swal.showLoading()
        })
        const requestUrl = apiService.EndPoint.saveGooglegrive;
        // Make the API request to check the active plan status
        await apiService.commonAPIRequest(
          requestUrl,
          apiService.Method.post,
          undefined, // No query parameters
          payload, // No request body
          (result: any) => {
            if (result.data.status === 200 && result.data.message === "Profiles exported successfully.") {
              Swal.fire('Success!', 'Your file has been saved to Google Drive.', 'success')
            } else {
              Swal.fire('Something went wrong', result.data.message || 'Something issue at server.', 'error')
            }
          }
        );
      } catch (error) {
        console.error("Error fetching plans:", error);
        Swal.fire('Error', 'Something went wrong while connecting to the server.', 'error')
      }
    }
  }

  const connectToCRM = async () => {

    if (crmConnection.crmConnection) {
      Swal.fire({
        icon: "warning",
        title: "Connection Status: CRM Active",
        text: `You have successfully linked your account with ${crmConnection.crmName}.`,
        confirmButtonColor: "#ff5c35",
        confirmButtonText: "OK",
        customClass: {
          title: "!text-[1.7rem] font-bold",
        },
      });
      return;
    }

    if (!activePlan) {
      Swal.fire({
        icon: "warning",
        title: "Subscription Required",
        text: "You need an active subscription to connect CRM. Please subscribe.",
        confirmButtonColor: "#ff5c35",
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

    const { value: formValues } = await Swal.fire({
      title: 'Connect With CRM',
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
      confirmButtonText: 'Connect',
      confirmButtonColor: '#ff5c35',
      customClass: {
        title: '!text-3xl font-semibold',
        actions: 'flex justify-end w-full gap-2 px-7',
      },
      didOpen: () => {
        const crmSelect = document.getElementById('crm-select') as HTMLSelectElement | null;
        const zendeskFields = document.getElementById('zendesk-fields') as HTMLElement | null;

        if (crmSelect && zendeskFields) {
          crmSelect.addEventListener('change', (e: Event) => {
            const target = e.target as HTMLSelectElement | null;
            if (target) {
              zendeskFields.style.display = target.value === 'zendesk' ? 'block' : 'none';
            }
          });
        }
      },
      preConfirm: () => {
        const crm = (document.getElementById('crm-select') as HTMLSelectElement).value;
        if (crm === 'zendesk') {
          const url = (document.getElementById('zendesk-url') as HTMLInputElement).value.trim();
          const token = (document.getElementById('zendesk-token') as HTMLInputElement).value.trim();
          if (!url || !token) {
            Swal.showValidationMessage('Please enter both Zendesk URL and token');
          }
          return { crm, url, token };
        } else {
          Swal.showValidationMessage('Please select a CRM');
        }
      }
    });

    if (formValues?.crm === 'zendesk') {
      const { url, token } = formValues;

      try {
        Swal.fire({
          title: 'Connecting...',
          text: 'Please wait while we connect your CRM.',
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: () => Swal.showLoading()
        });

        const payload = {
          crm_name: 'zendesk',
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
            if (result.status === 201 && result?.data?.message === "Connected Successfully") {
              const crmData = {
                crmConnection: true,
                crmName: "zendesk",
                token: payload?.token || "",
                url: payload?.crm_url,
              };
              chrome.storage.local.set({ crmData });
              Swal.fire('Success!', 'Your CRM is now connected.', 'success');
              getCRMdData();
            } else if (result?.data?.message.includes("Duplicate entry")) {
              Swal.fire('Error', 'Connection Error: This CRM is already connected.', 'error');
            } else {
              Swal.fire('Failed', result.data.message || 'Unable to connect CRM.', 'error');
            }
          }
        );
      } catch (error) {
        console.error("CRM Connection Error:", error);
        Swal.fire('Error', 'Something went wrong while connecting CRM.', 'error');
      }
    }
  };


  return (
    <>
      <div className="c-padding-r pt-24 h-screen relative pl-[280px] pr-[30px] overflow-hidden">
        <div className="flex justify-between gap-5 w-full">
          <div className="rounded-2xl w-full">
            <div className="p-5 bg-white g-box g-box-table">
              <div className="d-table h-connect-table !w-full max-h-[580px] overflow-auto overflow-x-hidden">
                <div className="flex justify-between sticky top-0 bg-white pb-[14px] z-10">
                  <div className="g-box-title">
                    <h4 className="font-medium mb-3">Save Profile</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tooltip content="Sync with your CRM system" className="custom-tooltip c-bottom-t ex !w-auto">
                      <button onClick={connectToCRM} className="bg-white border border-[#ff5c35] text-[#ff5c35] px-4 py-2 text-base rounded-lg hover:bg-[#ff5c35] hover:text-white flex items-center gap-2 transition-transform duration-200 ease-in-out">
                        <span><i className="fa-solid fa-globe"></i></span>
                        <span>Connect to CRM</span>
                      </button>
                    </Tooltip>

                    <Tooltip content="Send a copy to Google Drive" className="custom-tooltip c-bottom-t ex !w-auto">
                      <button onClick={saveToDrive} className="background-white border border-[#ff5c35] text-[#ff5c35] px-3 py-2 text-base rounded-lg hover:!bg-[#ff5c35] hover:!text-white transform">
                        <span><i className="fa-brands fa-google-drive"></i></span>
                        <span> Save to Drive</span>
                      </button>
                    </Tooltip>
                    <Tooltip content="Download your data as a CSV file" className="custom-tooltip c-bottom-t ex">
                      <button onClick={exportToCSV} className="background-white border border-[#ff5c35] text-[#ff5c35] px-3 py-2 text-base rounded-lg hover:!bg-[#ff5c35] hover:!text-white transform">
                        <span><i className="fa-solid fa-file-arrow-down"></i></span>
                        <span> Export CSV</span>
                      </button>
                    </Tooltip>
                  </div>
                </div>
                <table className="w-full overflow-auto g-table">
                  <thead className="sticky top-[55px]">
                    <tr>
                      <th className="font-light text-base px-4 color00517C py-3 text-left">
                        <span className="inline-block connect-table-checkbox float-left relative">
                        </span>
                        <span className="info w-auto block text-left">
                          <span className="text-base uppercase font-semibold whitespace-nowrap">Name</span><br />
                        </span>
                      </th>
                      <th className="font-light text-base px-4 color00517C py-3 text-left"><span className="text-base uppercase font-semibold whitespace-nowrap">Email</span></th>
                      <th className="font-light text-base px-4 color00517C py-3 text-left"><span className="text-base uppercase font-semibold whitespace-nowrap">Position</span></th>
                      <th className="font-light text-base px-4 color00517C py-3 text-left"><span className="text-base uppercase font-semibold whitespace-nowrap">Organization</span></th>
                      <th className="font-light text-base px-4 color00517C py-3 text-left"><span className="text-base uppercase font-semibold whitespace-nowrap">Url</span></th>
                      <th className="font-light text-base px-4 color00517C py-3 text-left"><span className="text-base uppercase font-semibold whitespace-nowrap">Created At</span></th>
                      <th className="font-light text-base px-4 color00517C py-3 text-left"><span className="text-base uppercase font-semibold whitespace-nowrap">Action</span></th>
                    </tr>
                  </thead>
                  {
                    load ?
                      <tbody>
                        <tr>
                          <td colSpan={6} className="p-4">
                            <Loader />
                          </td>
                        </tr>
                      </tbody>
                      :
                      <tbody>
                        {profilesData.length > 0 ? (
                          profilesData.map((profile, index) => {
                            return (
                              <tr key={index}>
                                <td className="px-4 py-3">
                                  <span className="flex items-center gap-2">
                                    {profile.profile?.startsWith("data:image") ? (
                                      <span className="relative s-logo border-[2.5px] border-solid rounded-full border-[#ff5c35] w-12">
                                        <img src={getImage('fLogo')} alt="img" className="" />
                                      </span>
                                    ) : (
                                      <span className="rounded-full overflow-hidden w-12 h-12">
                                        <img className="object-cover h-full w-full" src={`${profile.profile}`} />
                                      </span>
                                    )}
                                    <span className="whitespace-nowrap">{profile.name || "N/A"}</span>
                                  </span>
                                </td>

                                <td className="px-4 py-3">{profile.email || "N/A"}</td>
                                <td className="px-4 py-3 *:whitespace-nowrap">
                                  {profile.position && profile.position.length > 13 ? (
                                    <Tooltip content={profile.position} className="custom-tooltip">
                                      {profile.position.substring(0, 13) + "..."}
                                    </Tooltip>
                                  ) : (
                                    profile.position || "N/A"
                                  )}
                                </td>
                                <td className="px-4 py-3 *:whitespace-nowrap">
                                  {profile.organization && profile.organization.length > 13 ? (
                                    <Tooltip content={profile.organization} className="custom-tooltip">
                                      {profile.organization.substring(0, 13) + "..."}
                                    </Tooltip>
                                  ) : (
                                    profile.organization || "N/A"
                                  )}
                                </td>
                                {/* <td className="px-4 py-3 whitespace-nowrap">{profile.organization || "N/A"}</td> */}
                                <td className="px-4 py-3">
                                  {profile.url ? (
                                    <a
                                      href={profile.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="hover:text-[#ff5c35]"
                                    >
                                      {profile.url.length > 25
                                        ? profile.url.substring(0, 25) + "..."
                                        : profile.url}
                                    </a>
                                  ) : (
                                    "N/A"
                                  )}
                                </td>
                                <td className="px-4 py-3">{profile.created_at ? new Date(profile.created_at).toLocaleDateString("en-GB") : "N/A"}</td>
                                <td onClick={() => deleteProfile(profile.id)} className="px-4 py-3 text-center text-blue-300 cursor-pointer">
                                  <i className="fa-solid fa-trash"></i>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={7} className="px-4 py-3 text-center">
                              No Profiles found
                            </td>
                          </tr>
                        )}
                      </tbody>
                  }
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SaveProfile;
