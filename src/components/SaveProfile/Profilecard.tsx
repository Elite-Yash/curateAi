import Loader from "../Loader/Loader";
import { getImage } from "../../common/utils/logoUtils";
import { IoLogoLinkedin } from "react-icons/io5";
import { CiMail } from "react-icons/ci";
import { LuBuilding2 } from "react-icons/lu";
import { MdOutlineExplore } from "react-icons/md";
import { Clock, Star, Users } from "lucide-react";

// Define Profile type
type Profile = {
  id: string | undefined;
  profile?: string;
  name?: string;
  email?: string;
  position?: string;
  organization?: string;
  url?: string;
  created_at?: string | Date;
};

// Card props type
type ProfileCardType = {
  profiles: Profile[];
  load: boolean;
  deleteProfile: (id: number) => void;
  toggleStar: (id: number) => void;
  TabButton: "all" | "starred" | "recent"; // restrict string values
  starredIds: number[];
};

const Profilecard = ({
  profiles,
  load,
  deleteProfile,
  toggleStar,
  TabButton,
  starredIds,
}: ProfileCardType) => {
  return (
    <div
      className={`w-full ${profiles.length > 0
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        : "flex h-full justify-center items-center"
        }`}
    >
      {load ? (
        <div className="w-full flex justify-center items-center p-6">
          <Loader />
        </div>
      ) : profiles.length > 0 ? (
        profiles.map((profile: any, index: any) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md p-4 relative g-box flex flex-col"
          >
            {/* --- Actions (Delete + Star) --- */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 text-base text-[#ff5c35]">
              <span
                onClick={() => deleteProfile(profile.id)}
                className="cursor-pointer ms-0.5"
              >
                <i className="fa-solid fa-trash text-red"></i>
              </span>
              <span
                onClick={() => toggleStar(profile.id)}
                className="cursor-pointer"
              >
                <i
                  className={`fa-star ${starredIds.includes(profile.id) ? "fa-solid" : "fa-regular"
                    }`}
                ></i>
              </span>
            </div>

            {/* --- Image + Name + Position --- */}
            <div className="flex items-center gap-4">
              {profile.profile?.startsWith("data:image") ? (
                <span className="relative s-logo border-[2.5px] border-solid p-[3px] rounded-full border-[#ff5c35] w-18 h-18 flex items-center justify-center overflow-hidden">
                  <img src={getImage("userprofile")} alt="img" className="w-20 rounded-full" />
                </span>
              ) : (
                <span className="w-18 h-18 rounded-full p-[3px] border-[2.5px] border-solid border-[#ff5c35]">
                  <img
                    className="w-full h-full rounded-full object-cover"
                    src={profile.profile}
                    alt="profile"
                  />
                </span>
              )}

              {/* Name + Position */}
              <div className="flex flex-col">
                <span className="font-medium text-lg text-[#00517C]">
                  {profile.name || "N/A"}
                </span>
                <span className="text-sm text-gray-600">
                  {profile.position
                    ? profile.position.length > 25
                      ? profile.position.substring(0, 25) + "..."
                      : profile.position
                    : "N/A"}
                </span>
              </div>
            </div>

            {/* --- Other Details --- */}
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium text-lg text-graydark">
                  <CiMail />
                </span>{" "}
                {profile.email || "Email not available"}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-lg text-graydark">
                  <LuBuilding2 />
                </span>{" "}
                {profile.organization
                  ? profile.organization.length > 25
                    ? profile.organization.substring(0, 25) + "..."
                    : profile.organization
                  : "Organization not available"}
              </div>

              {/* URL */}
              <div className="flex items-center gap-2">
                <span className="font-medium text-xl text-graydark">
                  <MdOutlineExplore />
                </span>{" "}
                {profile.url ? (
                  <a
                    href={profile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[#ff5c35] hover:text-[#003ab6] text-base"
                  >
                    <button className="text-[#ff5c35] border border-[#ff5c35] ps-1 pe-1 rounded-[5px] items-center text-sm gap-1 flex">
                      Go To Linkedin Profile
                      <IoLogoLinkedin className="text-xl text-[#0a66c2]" />
                    </button>
                  </a>
                ) : (
                  "N/A"
                )}
              </div>
              <div className="!mt-[12px] !pt-[8px] border-t-[1px] border-[#b7b9bf] text-[#717c8c]">
                <span className="font-medium">Added</span>{" "}
                {profile.created_at
                  ? new Date(profile.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })
                  : "N/A"}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center text-center py-20">
          {/* All Tab */}
          {TabButton === "all" && (
            <div className="flex flex-col items-center text-center py-12">
              <div className="w-20 h-20 rounded-full bg-[#ff5c350f] flex items-center justify-center mb-2">
                <Users className="w-8 h-8 text-[#ff5c35]" />
              </div>
              <div className="text-lg font-medium text-[#64748b] mb-2">
                No profiles saved yet
              </div>
              <div className="text-sm text-[#92a0b5] max-w-md">
                Start adding profiles to see them here
              </div>
            </div>
          )}

          {/* Starred Tab */}
          {TabButton === "starred" && (
            <div className="flex flex-col items-center text-center py-12">
              <div className="w-20 h-20 rounded-full bg-[#ff5c350f] flex items-center justify-center mb-2">
                <Star className="w-8 h-8 text-[#ff5c35]" />
              </div>
              <div className="text-lg font-medium text-[#64748b] mb-2">
                No starred profiles yet
              </div>
              <div className="text-sm text-[#92a0b5] max-w-md">
                Mark profiles as starred to see them here
              </div>
            </div>
          )}

          {/* Recent Tab */}
          {TabButton === "recent" && (
            <div className="flex flex-col items-center text-center py-12">
              <div className="w-20 h-20 rounded-full bg-[#ff5c350f] flex items-center justify-center mb-2">
                <Clock className="w-8 h-8 text-[#ff5c35]" />
              </div>
              <div className="text-lg font-medium text-[#64748b] mb-2">
                No recent profiles yet
              </div>
              <div className="text-sm text-[#92a0b5] max-w-md">
                Recently saved profiles will appear here
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default Profilecard;
