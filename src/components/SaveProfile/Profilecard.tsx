import Loader from "../Loader/Loader";
import { getImage } from "../../common/utils/logoUtils";
import { IoPersonOutline, IoLogoLinkedin } from "react-icons/io5";

// Define Profile type
type Profile = {
  id: number;
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
      className={`w-full max-h-[565px] overflow-y-auto scrollbar-hide  ${
        profiles.length > 0
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          : "flex h-full justify-center items-center"
      }`}
    >
      {load ? (
        <div className="w-full flex justify-center items-center p-6">
          <Loader />
        </div>
      ) : profiles.length > 0 ? (
        profiles.map((profile, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md p-4 relative g-box"
          >
            {/* --- Actions (Delete + Star) --- */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 text-base text-[#2563eb]">
              <span
                onClick={() => deleteProfile(profile.id)}
                className="cursor-pointer hover:text-[#003ab6] ms-0.5"
              >
                <i className="fa-solid fa-trash"></i>
              </span>
              <span
                onClick={() => toggleStar(profile.id)}
                className="cursor-pointer hover:text-[#003ab6]"
              >
                <i
                  className={`fa-star ${
                    starredIds.includes(profile.id) ? "fa-solid" : "fa-regular"
                  }`}
                ></i>
              </span>
            </div>

            {/* --- Image + Info --- */}
            <div className="flex items-center gap-6">
              {profile.profile?.startsWith("data:image") ? (
                <span className="relative s-logo border-[2.5px] border-solid rounded-full border-[#2563eb] w-28 h-28 flex items-center justify-center overflow-hidden">
                  <img src={getImage("fLogo")} alt="img" className="w-22" />
                </span>
              ) : (
                <span className="rounded-full overflow-hidden w-28 h-28">
                  <img
                    className="object-cover h-full w-full"
                    src={profile.profile}
                    alt="profile"
                  />
                </span>
              )}

              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-[#00517C]">Name:</span>{" "}
                  {profile.name || "N/A"}
                </div>
                <div>
                  <span className="font-medium text-[#00517C]">Email:</span>{" "}
                  {profile.email || "N/A"}
                </div>
                <div>
                  <span className="font-medium text-[#00517C]">Position:</span>{" "}
                  {profile.position
                    ? profile.position.length > 25
                      ? profile.position.substring(0, 25) + "..."
                      : profile.position
                    : "N/A"}
                </div>
                <div>
                  <span className="font-medium text-[#00517C]">
                    Organization:
                  </span>{" "}
                  {profile.organization
                    ? profile.organization.length > 25
                      ? profile.organization.substring(0, 25) + "..."
                      : profile.organization
                    : "N/A"}
                </div>

                {/* <div className="flex items-center gap-2">
  <span className="font-medium text-[#00517C]">URL:</span>{" "}
  {profile.url ? (
    <a
      href={profile.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1 text-[#2563eb] hover:text-[#003ab6] underline text-base"
    >
      {profile.url.length > 25
        ? profile.url.substring(0, 25) + "..."
        : profile.url}
      <IoLogoLinkedin className="text-xl text-[#2563eb]" />
    </a>
  ) : (
    "N/A"
  )}
</div> */}
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#00517C]">URL:</span>{" "}
                  {profile.url ? (
                    <a
                      href={profile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[#2563eb] hover:text-[#003ab6] text-base"
                    >
                      <button className="text-[#2563eb] hover:text-[#003ab6] border border-[#2563eb] gap-2  ps-1 pe-1 rounded-sm flex">
                        Go To Linkedin
                        <IoLogoLinkedin className="text-xl text-[#2563eb] mt-0.5" />
                      </button>
                    </a>
                  ) : (
                    "N/A"
                  )}
                </div>

                <div>
                  <span className="font-medium text-[#00517C]">
                    Created At:
                  </span>{" "}
                  {profile.created_at
                    ? new Date(profile.created_at).toLocaleDateString("en-GB")
                    : "N/A"}
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center text-center py-20 ">
          <div className="w-20 h-20 rounded-full bg-[#9ca3af] flex items-center justify-center">
            <IoPersonOutline className="w-10 h-10 text-gray-400 " />
          </div>
          {TabButton === "all" ? (
            <div className="text-lg font-medium text-slate-900 mb-1">
              No profiles saved yet
            </div>
          ) : null}

          {TabButton === "starred" ? (
            <div className="text-lg font-medium text-slate-900 mb-1 mt-4">
              No starred profiles yet
            </div>
          ) : null}
          {TabButton === "recent" ? (
            <div className="text-lg font-medium text-slate-900 mb-1 mt-4">
              No Recent profiles yet
            </div>
          ) : null}

          <div className="text-sm text-[#92a0b5] max-w-md">
            Start building your network by saving LinkedIn profiles you want to
            connect with.
          </div>
        </div>
      )}
    </div>
  );
};

export default Profilecard;
