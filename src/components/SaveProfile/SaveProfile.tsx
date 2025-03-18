import { useEffect, useState, useCallback } from "react";
import { Endpoints, fetchAPI, Method } from "../../common/config/apiService";
import { API_URL } from "../../common/config/constMessage";
import { getImage } from "../../common/utils/logoUtils";

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
const SaveProfile = () => {
  const [profilesData, setProfilesData] = useState([]);

  const fetchProfiles = useCallback(async () => {
    try {
      if (!chrome?.runtime?.sendMessage) {
        throw new Error("Chrome API is not available.");
      }

      const getAuthToken = () =>
        new Promise((resolve, reject) => {
          chrome.runtime.sendMessage({ type: "getCookies" }, (response) => {
            if (!response || !response.success || !response.token) {
              reject("Failed to retrieve auth token.");
            } else {
              resolve(response.token);
            }
          });
        });

      const authToken = await getAuthToken();
      if (!authToken) throw new Error("Authentication token is missing.");

      const requestUrl = `${API_URL}/${Endpoints.getProfiles}`;

      const result = await fetchAPI(requestUrl, {
        method: Method.get,
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      // console.log("result", result)
      if (result?.status === 200) {
        setProfilesData(result.data.profiles || []);
      } else {
        throw new Error(result.message || "Failed to fetch profiles.");
      }
    } catch (err) {
      console.error("An unexpected error occurred.");
    }
  }, []);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  return (
    <>
      <div className="c-padding-r pt-24 h-screen relative w-[84%] left-[280px]">
        <div className="flex justify-between gap-5 w-full">
          <div className="rounded-2xl w-full">
            <div className="p-5 bg-white g-box g-box-table">
              <div className="d-table h-connect-table !w-full">
                <div className="g-box-title">
                  <h4 className="font-medium mb-3">SaveProfile</h4>
                </div>
                <table className="w-full overflow-auto g-table">
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
                                  className=""
                                >
                                  {profile.url.length > 35
                                    ? profile.url.substring(0, 35) + "..."
                                    : profile.url}
                                </a>
                              ) : (
                                "N/A"
                              )}
                            </td>
                            <td className="px-4 py-3">{new Date(profile.created_at).toLocaleDateString('en-GB') || "N/A"}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={"6"} className="px-4 py-3 text-center">
                          No Profiles found
                        </td>
                      </tr>
                    )}
                  </tbody>
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
