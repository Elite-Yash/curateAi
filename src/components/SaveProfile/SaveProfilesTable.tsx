import { Users } from "lucide-react";
import { useState } from "react";
import { IoLogoLinkedin } from "react-icons/io5";
import ProfileCardTable from "./ProfileCardTable";
import { useParams } from "react-router-dom";

export interface Profile {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    jobPosition: string;
    city: string;
    education: string;
    linkedin: string;
    tags: string[];
    status: string;
    owner: string;
    profile?: string;
    name?: string;
    position?: string;
    organization?: string;
    url?: string;
}

const dummyProfiles: Profile[] = [
    {
        firstName: "Renuka",
        lastName: "P.",
        phone: "123-456-7890",//
        email: "renuka.p@example.com",
        jobPosition: "Data Scientist",
        city: "Bengaluru",//
        education: "B.Tech",//
        linkedin: "https://www.linkedin.com/in/renuka-p-998017281/?originalSubdomain=in",//
        tags: ["AI", "Frontend"],//
        status: "Active",//
        owner: "Nilay Soni",
        profile: "https://media.licdn.com/dms/image/v2/D5603AQHjpjPwQSkuig/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1688646887658?e=1762992000&v=beta&t=rP7avs6eWviPdWudQ0whAf_jaba8Cqa_SjFuOHqk9Ag",
        organization: "LeadSquared",
    },
];

const SaveProfilesTable = () => {
    const load = false; // simulate loading
    const [showingProfile, setShowingProfile] = useState(false);
    const [showingProfileData, setShowingProfileData] = useState<Profile | null>(null);
    // const { workspaceId, groupId } = useParams<{ workspaceId: string; groupId: string }>();

    return (
        <div className="c-padding-r py-[24px] relative pl-[320px] pr-[24px]">
            {/* Header Section */}
            <div className="flex flex-wrap items-center justify-between bg-white z-10 mb-4 g-box p-4 rounded-lg shadow-sm">
                <div className="mb-0">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">Saved Profiles</div>
                            <div className="text-sm text-[#717c8c]">
                                Manage your LinkedIn contacts and prospects
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl g-box">
                {/* Table Section */}
                {(showingProfile && showingProfileData) ? (
                    <>
                        <ProfileCardTable profile={showingProfileData} onClose={() => { setShowingProfile(false); setShowingProfileData(null) }} />
                    </>
                ) : (
                    <>
                        <div className="flex items-center justify-between p-5">
                            <div className="flex items-center gap-2 font-semibold text-base">
                                <Users className="w-5 h-5 text-[#ff5c35]" />
                                Profiles Table
                            </div>
                        </div>
                        <div className="p-2.5 pt-0">
                            <div className="overflow-auto flex-1 max-h-[439px] relative border rounded-lg border-[#e0eaf3]">
                                <table className="min-w-[1530px] w-full text-left border-collapse">
                                    <thead className="sticky top-0 !bg-[#fbf7f8] border-b border-[#e1eaf4] z-10">
                                        <tr className="font-semibold text-[14px]">
                                            <th className="py-3 px-4 w-[150px]">First Name</th>
                                            <th className="py-3 px-4 w-[150px]">Last Name</th>
                                            <th className="py-3 px-4 w-[150px]">Phone</th>
                                            <th className="py-3 px-4 w-[200px]">E-mail</th>
                                            <th className="py-3 px-4 w-[150px]">Job Position</th>
                                            <th className="py-3 px-4 w-[120px]">City</th>
                                            <th className="py-3 px-4 w-[120px]">Education</th>
                                            <th className="py-3 px-4 w-[180px]">LinkedIn</th>
                                            <th className="py-3 px-4 w-[150px]">Tags</th>
                                            <th className="py-3 px-4 w-[100px]">Status</th>
                                            <th className="py-3 px-4 w-[120px]">Owner</th>
                                            <th className="py-3 px-4 w-[120px]">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {load ? (
                                            <tr>
                                                <td colSpan={12} className="text-center py-12">
                                                    Loading...
                                                </td>
                                            </tr>
                                        ) : dummyProfiles.length === 0 ? (
                                            <tr>
                                                <td colSpan={12} className="text-center py-12">
                                                    <div className="w-16 h-16 bg-[#ff5c350f] rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <i className="fa-solid fa-user-plus text-sm text-[#ff5c35]"></i>
                                                    </div>
                                                    <p className="text-[#64748b] font-medium !text-xl mb-2">
                                                        No Posts History yet
                                                    </p>
                                                </td>
                                            </tr>
                                        ) : (
                                            dummyProfiles.map((profile: any, idx: any) => {
                                                const isEven = idx % 2 === 1;
                                                return (
                                                    <tr
                                                        key={idx}
                                                        className={`text-sm ${isEven ? "bg-[#fff5f380]" : "bg-[#fff]"
                                                            }`}
                                                    >
                                                        <td className="py-4 px-4 align-top">{profile.firstName}</td>
                                                        <td className="py-4 px-4 align-top">{profile.lastName}</td>
                                                        <td className="py-4 px-4 align-top">{profile.phone}</td>
                                                        <td className="py-4 px-4 align-top">{profile.email}</td>
                                                        <td className="py-4 px-4 align-top">{profile.jobPosition}</td>
                                                        <td className="py-4 px-4 align-top">{profile.city}</td>
                                                        <td className="py-4 px-4 align-top">{profile.education}</td>
                                                        <td className="py-4 px-4 align-top">
                                                            <a
                                                                href={profile.linkedin}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-[#ff5c35] border border-[#ff5c35] px-2 py-[2px] rounded-[5px] flex items-center text-sm gap-1 whitespace-nowrap"
                                                            >
                                                                Go To LinkedIn <IoLogoLinkedin className="text-xl text-[#0a66c2]" />
                                                            </a>
                                                        </td>
                                                        <td className="py-4 px-4 align-top">{profile.tags.join(", ")}</td>
                                                        <td className="py-4 px-4 align-top">{profile.status}</td>
                                                        <td className="py-4 px-4 align-top">{profile.owner}</td>
                                                        <td className="py-4 px-4 align-top">
                                                            <button
                                                                onClick={() => {
                                                                    setShowingProfile(true)
                                                                    setShowingProfileData(profile)
                                                                }}
                                                                className="text-[#ff5c35] border border-[#ff5c35] px-2 py-[2px] rounded-[5px] flex items-center text-sm gap-1 whitespace-nowrap relative">
                                                                View
                                                                <i className="fa-solid fa-user"></i>
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

