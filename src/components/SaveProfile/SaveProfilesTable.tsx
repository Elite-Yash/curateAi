import { Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { IoLogoLinkedin } from "react-icons/io5";
import ProfileCardTable from "./ProfileCardTable";
import { useParams } from "react-router-dom";
import { apiService } from "../../common/config/apiService";
import Loader from "../Loader/Loader";
import Swal from "sweetalert2";

export interface Profile {
    id: number;
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    position: string;
    organization?: string;
    city: string;
    education_institution?: string;
    skill?: string[];
    profile?: string;
    url?: string;
    company_url?: string;
    workspace_id?: number;
    group_id?: number;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
}

const SaveProfilesTable = () => {
    const [showingProfile, setShowingProfile] = useState(false);
    const [showingProfileData, setShowingProfileData] = useState<Profile | null>(null);
    const [profilesData, setProfilesData] = useState<Profile[]>([]);
    const [loader, setLoader] = useState(true);
    const { workspaceId, groupId } = useParams<{ workspaceId: string; groupId: string }>();

    // Fetch profiles by workspaceId & groupId with pagination
    const fetchProfiles = useCallback(async () => {
        try {
            setLoader(true);

            if (!workspaceId || !groupId) {
                console.warn("Workspace ID or Group ID missing in route params.");
                setProfilesData([]);
                setLoader(false);
                return;
            }

            // ✅ Use proper limit & page values
            const page = 1;
            const limit = 10;

            const requestUrl = `${apiService.EndPoint.getProfiles}?page=${page}&limit=${limit}&workspace_id=${workspaceId}&group_id=${groupId}`;

            await apiService.commonAPIRequest(
                requestUrl,
                apiService.Method.get,
                undefined,
                {},
                (response: any) => {
                    if (response?.status === 200 && response?.data?.data?.profiles) {
                        // Convert skill from string to array if needed
                        const profiles = response.data.data.profiles.map((p: any) => ({
                            ...p,
                            skill: typeof p.skill === "string" ? JSON.parse(p.skill) : p.skill || [],
                        }));
                        setProfilesData(profiles);
                    } else {
                        console.error(response?.message || "Failed to fetch profiles.");
                        setProfilesData([]);
                    }
                }
            );
        } catch (error) {
            console.error("An unexpected error occurred while fetching profiles:", error);
            setProfilesData([]);
        } finally {
            setLoader(false);
        }
    }, [workspaceId, groupId]);

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
                                confirmButtonColor: "#ff5c35",
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
                    confirmButtonColor: "#ff5c35",
                });
            }
        }
    };
    


    useEffect(() => {
        fetchProfiles();
    }, [fetchProfiles]);

    return (
        <div className="c-padding-r py-[24px] relative pl-[320px] pr-[24px]">
            {/* Header Section */}
            <div className="flex flex-wrap items-center justify-between bg-white z-10 mb-4 g-box p-4 rounded-lg shadow-sm">
                <div className="mb-0">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r bg-[#ff5c35] rounded-2xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">Saved Profiles</div>
                            <div className="text-sm text-[#717c8c]">
                                Manage your LinkedIn contacts and prospects
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm">
                            {profilesData.length} profiles saved
                        </span>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-xl g-box">
                {showingProfile && showingProfileData ? (
                    <ProfileCardTable
                        profile={showingProfileData}
                        onClose={() => {
                            setShowingProfile(false);
                            setShowingProfileData(null);
                        }}
                    />
                ) : (
                    <>
                        <div className="flex items-center justify-between p-5">
                            <div className="flex items-center gap-2 font-semibold text-base">
                                <Users className="w-5 h-5 text-[#ff5c35]" />
                                Profiles Table
                            </div>
                        </div>

                        <div className="p-2.5 pt-0">
                            <div className="overflow-auto flex-1 max-h-[490px] relative border rounded-lg border-[#e0eaf3]">
                                <table className="min-w-[1530px] w-full text-left border-collapse">
                                    <thead className="sticky top-0 !bg-[#fbf7f8] border-b border-[#e1eaf4] z-10">
                                        <tr className="font-semibold text-[14px]">
                                            <th className="py-3 px-4 w-[150px] whitespace-nowrap">First Name</th>
                                            <th className="py-3 px-4 w-[150px] whitespace-nowrap">Last Name</th>
                                            <th className="py-3 px-4 w-[150px] whitespace-nowrap">Phone</th>
                                            <th className="py-3 px-4 w-[200px] whitespace-nowrap">E-mail</th>
                                            <th className="py-3 px-4 w-[150px] whitespace-nowrap">Job Position</th>
                                            <th className="py-3 px-4 w-[150px] whitespace-nowrap">Organization</th>
                                            <th className="py-3 px-4 w-[150px] whitespace-nowrap">Company_url</th>
                                            <th className="py-3 px-4 w-[120px] whitespace-nowrap">City</th>
                                            <th className="py-3 px-4 w-[120px] whitespace-nowrap">Institution</th>
                                            <th className="py-3 px-4 w-[180px] whitespace-nowrap">LinkedIn</th>
                                            <th className="py-3 px-4 w-[150px] whitespace-nowrap">Skills</th>
                                            {/* <th className="py-3 px-4 w-[100px]">Status</th>
                      <th className="py-3 px-4 w-[120px]">Owner</th> */}
                                            <th className="py-3 px-4 w-[120px]">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loader ? (
                                            <tr>
                                                <td colSpan={12} className="text-center py-12">
                                                    <Loader />
                                                </td>
                                            </tr>
                                        ) : profilesData.length === 0 ? (
                                            <tr>
                                                <td colSpan={12} className={`text-center py-12 ${profilesData.length === 0 ? "h-[420px]" : ""}`}>
                                                    <div className="w-16 h-16 bg-[#ff5c350f] rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <i className="fa-solid fa-user-plus text-sm text-[#ff5c35]"></i>
                                                    </div>
                                                    <p className="text-[#64748b] font-medium !text-xl mb-2">
                                                        No Profiles Found
                                                    </p>
                                                </td>
                                            </tr>
                                        ) : (
                                            profilesData.map((profile, idx) => {
                                                const isEven = idx % 2 === 1;
                                                return (
                                                    <tr
                                                        key={profile.id}
                                                        className={`text-sm ${isEven ? "bg-[#fff5f380]" : "bg-[#fff]"}`}
                                                    >
                                                        <td className="py-4 px-4 align-top whitespace-nowrap">{profile.first_name || "N/A"}</td>
                                                        <td className="py-4 px-4 align-top whitespace-nowrap">{profile.last_name || "N/A"}</td>
                                                        <td className="py-4 px-4 align-top whitespace-nowrap">{profile.phone || "N/A"}</td>
                                                        <td className="py-4 px-4 align-top whitespace-nowrap">{profile.email || "N/A"}</td>
                                                        <td className="py-4 px-4 align-top whitespace-nowrap">{profile.position || "N/A"}</td>
                                                        <td className="py-4 px-4 align-top whitespace-nowrap">{profile.organization || "N/A"}</td>
                                                        <td className="py-4 px-4 align-top whitespace-nowrap">
                                                            <a
                                                                href={profile.company_url || "N/A"}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-[#ff5c35] border border-[#ff5c35] px-2 py-[2px] rounded-[5px] flex items-center text-sm gap-1 whitespace-nowrap"
                                                            >
                                                                Go To LinkedIn <IoLogoLinkedin className="text-xl text-[#0a66c2]" />
                                                            </a>
                                                        </td>
                                                        <td className="py-4 px-4 align-top whitespace-nowrap">{profile.city || "N/A"}</td>
                                                        <td className="py-4 px-4 align-top whitespace-nowrap">{profile.education_institution || "N/A"}</td>
                                                        <td className="py-4 px-4 align-top whitespace-nowrap">
                                                            <a
                                                                href={profile.url || "N/A"}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-[#ff5c35] border border-[#ff5c35] px-2 py-[2px] rounded-[5px] flex items-center text-sm gap-1 whitespace-nowrap"
                                                            >
                                                                Go To LinkedIn <IoLogoLinkedin className="text-xl text-[#0a66c2]" />
                                                            </a>
                                                        </td>
                                                        <td className="py-4 px-4 align-top whitespace-nowrap">{profile.skill?.slice(0, 2).join(", ") || "N/A"}</td>
                                                        {/* <td className="py-4 px-4 align-top">{profile.status || "-"}</td>
                            <td className="py-4 px-4 align-top">{profile.owner || "-"}</td> */}
                                                        <td className="py-4 flex gap-3 px-4 align-top whitespace-nowrap">
                                                            <button
                                                                onClick={() => {
                                                                    setShowingProfile(true);
                                                                    setShowingProfileData(profile);
                                                                }}
                                                                className="text-[#ff5c35] border border-[#ff5c35] hover:bg-[#ff5c35] hover:text-white px-2 py-[2px] rounded-[5px] flex items-center text-sm gap-1 whitespace-nowrap relative transition"
                                                            >
                                                                View
                                                                <i className="fa-solid fa-user"></i>
                                                            </button>
                                                            <button
                                                                onClick={() => deleteProfile(profile.id)}
                                                                className="flex items-center justify-center w-8 h-8 rounded-full text-[#dc2626] bg-[#fee2e2] hover:bg-[#dc2626] hover:text-white transition"
                                                                title="Delete Campaign"
                                                            >
                                                                <i className="fa-solid fa-trash"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SaveProfilesTable;
