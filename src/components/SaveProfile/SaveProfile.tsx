import { useEffect, useState, useCallback } from "react";
import { apiService } from "../../common/config/apiService";
import { getImage } from "../../common/utils/logoUtils";
import Loader from "../Loader/Loader";

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
  const [load, setLoad] = useState(true)

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
          console.log("fetchProfiles", response)
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

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const exportToCSV = () => {
    if (!profilesData.length) {
      alert("No data available to export.");
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
    const csvString = [headers, ...csvRows].map((row) => row.join(",")).join("\n");

    // Create Blob and download
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "profiles.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="c-padding-r pt-24 h-screen relative pl-[280px] pr-[30px]">
        <div className="flex justify-between gap-5 w-full">
          <div className="rounded-2xl w-full">
            <div className="p-5 bg-white g-box g-box-table">
              <div className="d-table h-connect-table !w-full">
                {/* <div className="g-box-title">
                  <h4 className="font-medium mb-3">SaveProfile</h4>
                </div> */}
                <div className="flex justify-between">
                  <div className="g-box-title mt-3">
                    <h4 className="font-medium mb-3">Pricing</h4>
                  </div>
                  <div className="flex space-x-4 items-center">
                    <button onClick={exportToCSV} className="background-white border border-[#ff5c35] text-[#ff5c35] px-3 py-2 text-base rounded-lg hover:!bg-[#ff5c35] hover:!text-white transform">
                      <span><i className="fa-solid fa-file-arrow-down"></i></span>
                      <span> Export CSV</span>
                    </button>
                  </div>
                </div>
                <table className="w-full overflow-auto g-table mt-3">
                  <thead>
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
                                    <span>{profile.name || "N/A"}</span>
                                  </span>
                                </td>

                                <td className="px-4 py-3">{profile.email || "N/A"}</td>
                                <td className="px-4 py-3">{profile.position || "N/A"}</td>
                                <td className="px-4 py-3">{profile.organization || "N/A"}</td>
                                <td className="px-4 py-3">
                                  {profile.url ? (
                                    <a
                                      href={profile.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="hover:text-[#ff5c35]"
                                    >
                                      {profile.url.length > 35
                                        ? profile.url.substring(0, 35) + "..."
                                        : profile.url}
                                    </a>
                                  ) : (
                                    "N/A"
                                  )}
                                </td>
                                <td className="px-4 py-3">{profile.created_at ? new Date(profile.created_at).toLocaleDateString("en-GB") : "N/A"}</td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={6} className="px-4 py-3 text-center">
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
