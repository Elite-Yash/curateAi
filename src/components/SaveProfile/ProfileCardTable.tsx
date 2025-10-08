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
                            <div className="flex items-center gap-6">
                                <span className="w-24 h-24 rounded-full border-2 border-[#ff5c35] overflow-hidden flex-shrink-0">
                                    <img
                                        src={profile?.profile || getImage("userprofile")}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </span>

                                <div className="flex flex-col gap-1">
                                    <h2 className="text-2xl font-semibold text-[#00517C]">
                                        {profile?.firstName} {profile?.lastName}
                                    </h2>
                                    <p className="text-gray-600 text-base">
                                        {profile?.jobPosition || "N/A"}
                                    </p>
                                </div>
                            </div>

                            {/* --- Contact & Professional Info --- */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                {/* Phone */}
                                <div className="flex items-center gap-2">
                                    <FaPhoneAlt className="text-[#ff5c35] w-4 h-4" />
                                    <span className="font-medium w-24">Phone:</span>
                                    <span>{profile.phone || "N/A"}</span>
                                </div>

                                {/* Email */}
                                <div className="flex items-center gap-2">
                                    <FaEnvelope className="text-[#ff5c35] w-4 h-4" />
                                    <span className="font-medium w-24">Email:</span>
                                    <span className="truncate">{profile.email || "N/A"}</span>
                                </div>

                                {/* City */}
                                <div className="flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-[#ff5c35] w-4 h-4" />
                                    <span className="font-medium w-24">City:</span>
                                    <span>{profile.city || "N/A"}</span>
                                </div>

                                {/* Position */}
                                <div className="flex items-center gap-2">
                                    <FaUserTie className="text-[#ff5c35] w-4 h-4" />
                                    <span className="font-medium w-24">Position:</span>
                                    <span>{profile.jobPosition || "N/A"}</span>
                                </div>

                                {/* Education */}
                                <div className="flex items-center gap-2">
                                    <FaGraduationCap className="text-[#ff5c35] w-4 h-4" />
                                    <span className="font-medium w-24">Education:</span>
                                    <span>{profile.education || "N/A"}</span>
                                </div>

                                {/* Organization */}
                                <div className="flex items-center gap-2">
                                    <FaBuilding className="text-[#ff5c35] w-4 h-4" />
                                    <span className="font-medium w-24">Organization:</span>
                                    <span>{profile.organization || "N/A"}</span>
                                </div>

                                {/* LinkedIn */}
                                <div className="flex items-center gap-2">
                                    <FaLinkedin className="text-[#ff5c35] w-4 h-4" />
                                    <span className="font-medium w-24">LinkedIn:</span>
                                    {profile?.linkedin ? (
                                        <a
                                            href={profile.linkedin}
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

                                {/* Status */}
                                <div className="flex items-center gap-2">
                                    <FaCheckCircle className="text-[#ff5c35] w-4 h-4" />
                                    <span className="font-medium w-24">Status:</span>
                                    <span>{profile.status || "N/A"}</span>
                                </div>

                                {/* Tags */}
                                <div className="flex items-start gap-2">
                                    <FaTags className="text-[#ff5c35] w-4 h-4 mt-[2px]" />
                                    <span className="font-medium w-24">Tags:</span>
                                    <div className="flex flex-wrap gap-1">
                                        {profile.tags && profile.tags.length > 0 ? (
                                            profile.tags.map((tag: string, index: number) => (
                                                <span
                                                    key={index}
                                                    className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                                                >
                                                    {tag}
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
