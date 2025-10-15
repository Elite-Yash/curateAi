import { User } from "lucide-react";
import {
    FaPhoneAlt,
    FaEnvelope,
    FaGraduationCap,
    FaMapMarkerAlt,
    FaUserTie,
    FaLinkedin,
    FaTags,
    FaBuilding,
    FaCheckCircle,
} from "react-icons/fa";
import { getImage } from "../../common/utils/logoUtils";
import { IoLogoLinkedin } from "react-icons/io5";

const ProfileCardTable = ({ profile, onClose }: any) => {
    console.log("  ~ ProfileCardTable ~ profile:", profile)
    return (
        <>
            <>
                <div className="flex items-center justify-between p-5">
                    <div className="flex items-center gap-2 font-semibold text-base">
                        <User className="w-5 h-5 text-[#ff5c35]" />
                        Profile Details
                    </div>
                    <div onClick={onClose} className="flex items-center border gap-2  px-4 py-2 text-sm font-medium rounded-lg border-[#ff5c35] text-[#ff5c35] hover:bg-[#ff5c35] hover:text-white transition">
                        <i className="fa-solid fa-turn-up -rotate-90"></i>
                    </div>
                </div>

                <div className="p-2.5 pt-0">
                    <div className="overflow-auto flex-1 max-h-[500px] relative border rounded-lg border-[#e0eaf3]">
                        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-6">
                            {/* --- Image + Name + Job Position --- */}
                            <div className="flex items-center gap-6 border-b !pb-[20px] border-[#e0eaf3]">
                                <span className="w-24 h-24 rounded-full border-2 border-[#ff5c35] overflow-hidden flex-shrink-0">
                                    <img
                                        src={profile?.profile || getImage("userprofile")}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </span>

                                <div className="flex flex-col gap-2">
                                    <h2 className="text-2xl font-semibold text-[#00517C]">
                                        {profile?.first_name} {profile?.last_name}
                                    </h2>
                                    <p className="text-gray-600 text-base">
                                        {profile?.position || "N/A"}
                                    </p>
                                </div>

                                <div className="ml-auto">
                                    {profile?.url ? (
                                        <a
                                            href={profile.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#ff5c35] border border-[#ff5c35] px-2 py-[2px] rounded-[5px] flex items-center text-sm gap-1 whitespace-nowrap"
                                        >
                                            Go To LinkedIn <IoLogoLinkedin className="text-xl text-[#0a66c2]" />
                                        </a>
                                    ) : (
                                        "N/A"
                                    )}
                                </div>
                            </div>

                            {/* --- Contact & Professional Info --- */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                {/* Phone */}
                                <div className="flex items-center gap-2">
                                    <FaPhoneAlt className="text-[#ff5c35] w-4 h-4" />
                                    <span className="font-bold w-24">Phone:</span>
                                    <span>{profile.phone || "N/A"}</span>
                                </div>

                                {/* Email */}
                                <div className="flex items-center gap-2">
                                    <FaEnvelope className="text-[#ff5c35] w-4 h-4" />
                                    <span className="font-bold w-24">Email:</span>
                                    <span className="truncate">{profile.email || "N/A"}</span>
                                </div>

                                {/* City */}
                                <div className="flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-[#ff5c35] w-4 h-4" />
                                    <span className="font-bold w-24">City:</span>
                                    <span>{profile.city || "N/A"}</span>
                                </div>

                                {/* Education */}
                                <div className="flex items-center gap-2">
                                    <FaGraduationCap className="text-[#ff5c35] w-4 h-4" />
                                    <span className="font-bold w-24">institution:</span>
                                    <span>{profile.education_institution || "N/A"}</span>
                                </div>

                                {/* Organization */}
                                <div className="flex items-center gap-2">
                                    <FaBuilding className="text-[#ff5c35] w-4 h-4" />
                                    <span className="font-bold w-24">Organization:</span>
                                    <span>{profile.organization || "N/A"}</span>
                                </div>

                                {/* Organization url */}
                                <div className="flex items-center gap-2">
                                    <FaLinkedin className="text-[#ff5c35] w-4 h-4" />
                                    <span className="font-bold w-24 whitespace-nowrap">Organization Url:</span>
                                    {profile?.company_url ? (
                                        <a
                                            href={profile.company_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#ff5c35] ml-5 border border-[#ff5c35] px-2 py-[2px] rounded-[5px] flex items-center text-sm gap-1 whitespace-nowrap"
                                        >
                                            Go To LinkedIn <IoLogoLinkedin className="text-xl text-[#0a66c2]" />
                                        </a>
                                    ) : (
                                        "N/A"
                                    )}
                                </div>


                                {/* Status */}
                                {/* <div className="flex items-center gap-2">
                                    <FaCheckCircle className="text-[#ff5c35] w-4 h-4" />
                                    <span className="font-medium w-24">Status:</span>
                                    <span>{profile.status || "N/A"}</span>
                                </div> */}

                                {/* Tags */}
                                <div className="flex items-start gap-2 col-span-3 ">
                                    <FaTags className="text-[#ff5c35] w-4 h-4 mt-[2px]" />
                                    <span className="font-bold w-24">Skills:</span>
                                    <div className="flex flex-wrap gap-1 *:border *:border-[#e0eaf3] *:rounded-[16px] *:px-[10px] *:py-[5px]">
                                        {profile.skill && profile.skill.length > 0 ? (
                                            profile.skill.map((skill: string, index: number) => (
                                                <span
                                                    key={index}
                                                    className="text-sm px-2 py-1"
                                                >
                                                    {skill}
                                                </span>
                                            ))
                                        ) : (
                                            <span>N/A</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>

        </>
    );
};

export default ProfileCardTable;
