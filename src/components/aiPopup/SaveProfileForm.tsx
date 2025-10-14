import { useEffect, useState } from "react";
import { getImage } from "../../common/utils/logoUtils";
import { apiService } from "../../common/config/apiService"; // Import API function
// import { Tooltip } from "flowbite-react";

// Define the props interface
interface SaveProfileFormProps {
  onClose: () => void; // Type the onClose prop as a function that returns void
  firstName: string;
  lastName: string;
  position: string;
  city?: string;
  phone?: string;
  education_institution?: string;
  company: string;
  companyUrl?: string;
  skill?: string[];
  profileImg: string;
  activePlan: boolean;
  findemail?: string | any;
  onSuccessSave?: () => void;
}

const SaveProfileForm: React.FC<SaveProfileFormProps> = ({
  onClose,
  firstName,
  lastName,
  position,
  city,
  phone,
  education_institution,
  company,
  companyUrl,
  skill,
  profileImg,
  activePlan,
  findemail,
  onSuccessSave,
}) => {
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [positionState, setPosition] = useState("");
  const [companyState, setCompany] = useState("");
  const [email, setEmail] = useState(""); // Handle email input
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error handling
  const [success, setSuccess] = useState(false); // Success message
  const [load, setLoad] = useState(true);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<number | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [workspaceError, setWorkspaceError] = useState(false);
  const [groupError, setGroupError] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  useEffect(() => {
    setFName(firstName || "");
    setLName(lastName || "");
    setPosition(position || "");
    setCompany(company || "");
    setEmail(findemail || "");
  }, [firstName, lastName, position, company, findemail]);

  interface Group {
    id: number;
    name: string;
  }

  // Workspace type
  interface Workspace {
    id: number;
    name: string;
    groups: Group[];
    isDefault: boolean;
  }

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    // --- Workspace & Group required validation ---
    if (workspaces.length === 0) {
      setWorkspaceError(true);
      setLoading(false);
      return;
    }

    if (!selectedWorkspace) {
      setWorkspaceError(true);
      setLoading(false);
      return;
    }

    if (!selectedGroup) {
      setGroupError(true);
      setLoading(false);
      return;
    }

    // Clear errors if all good
    setWorkspaceError(false);
    setGroupError(false);



    if (email && !emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      setTimeout(() => {
        setError(null);
      }, 1500);
      return;
    }

    const payload: any = {
      ...(fName && fName !== "N/A" && fName !== "NA" && { first_name: fName }),
      ...(lName && lName !== "N/A" && lName !== "NA" && { last_name: lName }),
      ...(email && email !== "N/A" && email !== "NA" && emailRegex.test(email) && { email }),
      ...(positionState && positionState !== "N/A" && positionState !== "NA" && { position: positionState }),
      ...(companyState && companyState !== "N/A" && companyState !== "NA" && { organization: companyState }),
      ...(companyUrl && { company_url: companyUrl }),
      ...(city && { city }),
      ...(phone && { phone }),
      ...(education_institution && { education_institution }),
      ...(skill && skill.length > 0 && { skill }),
      ...(window.location.href && { url: window.location.href }),
      ...(profileImg && { profile: profileImg }),
      ...(selectedWorkspace !== null && { workspace_id: selectedWorkspace }),
      ...(selectedGroup !== null && { group_id: selectedGroup }),
    };

    // Check if the payload is empty
    if (Object.keys(payload).length === 0) {
      setError("No valid data to save.");
      setLoading(false);
      return;
    }

    try {
      const requestUrl = `${apiService.EndPoint.createProfile}`;

      await apiService.commonAPIRequest(
        requestUrl,
        apiService.Method.post,
        undefined, // No query params here
        payload, // The payload data
        (response: any) => {
          if (
            response?.status === 201 &&
            response?.data.message === "Profile saved successfully"
          ) {
            setSuccess(true);
            setTimeout(() => {
              setSuccess(false);
              onSuccessSave?.();
              onClose();
            }, 2000);
          } else {
            throw new Error(
              response?.data.message || "Failed to save profile."
            );
          }
        }
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message.includes("Duplicate entry")
            ? "Duplicate entry"
            : err.message
          : "An unknown error occurred."
      );
      setTimeout(() => setError(null), 2000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setLoad(false);
    }, 2000);
  }, []);


  //  Fetch all workspaces + their groups
  const getAllData = async () => {
    try {
      await apiService.commonAPIRequest(
        apiService.EndPoint.getAllDataOfWorkspace,
        apiService.Method.get,
        undefined,
        {},
        (response: any) => {
          if (response?.data?.success && Array.isArray(response.data.data)) {
            const transformed: Workspace[] = response.data.data.map((ws: any, idx: number) => ({
              id: ws.id,
              name: ws.name,
              groups: ws.groups?.map((g: any) => ({ id: g.id, name: g.name })) || [],
              isDefault: idx === 0,
            }));
            setWorkspaces(transformed);
          }
        }
      );
    } catch (error) {
      console.error("Error fetching workspaces:", error);
    }
  };

  //  Fetch on mount
  useEffect(() => {
    getAllData();
  }, []);

  //  When workspace changes → update group list
  useEffect(() => {
    if (selectedWorkspace) {
      const selected = workspaces.find((ws) => ws.id === selectedWorkspace);
      if (selected) {
        setGroups(selected.groups || []);
      } else {
        setGroups([]);
      }
    } else {
      setGroups([]);
    }
  }, [selectedWorkspace, workspaces]);



  const getFullName = (first: string, last: string) => {
    const f = first?.trim();
    const l = last?.trim();
    if (!f && !l) return "N/A";
    if (f && !l) return f;
    if (!f && l) return l;
    return `${f} ${l}`;
  };

  return (
    <>
      <div className="inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="popup-container bg-white shadow-lg w-96 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-3xl w-400">
          <div className="relative save-pr header-top p-9 py-6 flex justify item-center">
            <span className="relative s-logo border-[2.5px] border-solid rounded-full border-[#ff5c35]">
              <img src={getImage("fLogo")} alt="img" className="" />
            </span>
            <h4 className="popup-title font-semibold text-xl leading-10">
              Save Profile
            </h4>
            <span
              onClick={onClose}
              className="w-6 h-6 bg-no-repeat bg-center cursor-pointer ml-auto"
            >
              <img
                src={getImage("close")}
                alt="img"
                className="w-full h-full rounded-full"
              />
            </span>
          </div>
          {load ? (
            <>
              <div className="flex justify-center h-80">
                <div className="flex flex-col justify-center items-center">
                  <span
                    className="loader relative w-32 h-32 object-cover p-2"
                    style={
                      {
                        "--loader-url": `url(${getImage("loader")})`,
                      } as React.CSSProperties
                    }
                  >
                    <img
                      src={getImage("fLogo")}
                      alt="img"
                      className="w-full h-full"
                    />
                  </span>
                  <span className="text-[#ff5c35] !text-2xl font-light">
                    Loading...
                  </span>
                </div>
              </div>
            </>
          ) : activePlan ? (
            <div className="p-9 flex flex-col gap-5">
              <div className="flex items-center gap-4">
                {/* --- Profile Image --- */}
                {profileImg?.startsWith("data:image") ? (
                  <span className="w-[62px] h-[62px] rounded-full p-[3px] border-[2.5px] border-solid border-[#ff5c35]">
                    <img
                      src={profileImg}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </span>
                ) : (
                  <span className="w-[62px] h-[62px] rounded-full p-[3px] border-[2.5px] border-solid border-[#ff5c35] flex items-center justify-center overflow-hidden">
                    <img
                      src={profileImg || getImage("userprofile")}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  </span>
                )}

                {/* --- Profile Name --- */}
                <div className="flex flex-col">
                  <span className="font-medium text-[18px]">
                    {getFullName(firstName, lastName)}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                {/* --- Workspace Select --- */}
                <div className="w-full input-group relative">
                  <label className="block text-xl font-medium text-gray-700 ms-2">
                    Workspace<span className="text-red">*</span>
                  </label>
                  <span className="relative">
                    <select
                      value={selectedWorkspace ?? ""}
                      onChange={(e) => {
                        setSelectedWorkspace(Number(e.target.value));
                        setWorkspaceError(false); // Error clear on select
                      }}
                      className="popup-select w-full p-2 border border-gray-300 rounded-md !mt-[5px] flex focus:outline-none focus:ring-1 focus:ring-[#ff5c35] focus:border-[#ff5c35] text-gray-600"
                    >
                      {workspaces.length === 0 ? (
                        <option value="" disabled>
                          No workspace available
                        </option>
                      ) : (
                        <option value="" disabled>
                          Select Workspace
                        </option>
                      )}
                      {workspaces.map((ws) => (
                        <option key={ws.id} value={ws.id}>
                          {ws.name}
                        </option>
                      ))}
                    </select>
                  </span>
                </div>

                {/* --- Group Select --- */}
                <div className="w-full input-group relative">
                  <label className="block text-xl font-medium text-gray-700 ms-2">
                    Group<span className="text-red">*</span>
                  </label>
                  <span className="relative">
                    <select
                      value={selectedGroup ?? ""}
                      onChange={(e) => {
                        setSelectedGroup(Number(e.target.value));
                        setGroupError(false); // Error clear on select
                      }}
                      className="popup-select w-full p-2 border border-gray-300 rounded-md !mt-[5px] flex focus:outline-none focus:ring-1 focus:ring-[#ff5c35] focus:border-[#ff5c35] text-gray-600"
                      disabled={!selectedWorkspace}
                    >

                      {groups.length === 0 ? (
                        <option value="" disabled>
                          No group available
                        </option>
                      ) : (
                        <option value="" disabled>
                          Workspace Group
                        </option>
                      )}

                      {groups.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                  </span>
                </div>
              </div>

              {error && (
                <p className="text-red text-xl border border-red p-4 rounded-lg">
                  {error}
                </p>
              )}
              {success && (
                <p className="text-green text-xl border border-green p-4 rounded-lg">
                  Profile saved successfully!
                </p>
              )}
              {/* Workspace select */}
              {workspaceError && (
                <p className="text-red text-xl border border-red p-4 rounded-lg">
                  Please select a workspace
                </p>
              )}

              {/* Group select */}
              {groupError && (
                <p className="text-red text-xl border border-red p-4 rounded-lg">
                  Please select a group
                </p>
              )}

              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="w-[36rem] h-[4rem] flex justify-center items-center gap-2 rounded-[8px] bg-[#ff5c35] text-white font-medium disabled:bg-gray-400"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-9 flex justify-between item-center flex-col gap-5">
              <span className="text-center text-5xl font-bold text-red">
                !! Alert !!
              </span>
              <span className="text-justify">
                Hey User, you don’t have an active plan on Evarobo yet. Go To the Evarobo Chrome Extension and
                Subscribe now and start enjoying all the amazing features!
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SaveProfileForm;



