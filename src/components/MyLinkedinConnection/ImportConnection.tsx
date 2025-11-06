import React, { useState } from "react";
import { IoLogoLinkedin } from "react-icons/io5";
import { PiLinkSimpleBold } from "react-icons/pi";
import { getImage } from "../../common/utils/logoUtils";

interface ImportConnectionProps {
  onClose: () => void;
  connections: any[];
  progress: number;
}

// 🔹 Small helper component for "Read more" functionality
const OccupationText = ({ text }: { text: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return <span>N/A</span>;

  const words = text.split(" ");
  const shortText = words.slice(0, 3).join(" ");

  return (
    <div className="text-sm capitalize col-span-2 font-medium">
      {isExpanded ? text : shortText + (words.length > 3 ? "..." : "")}
      {words.length > 3 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-2 text-[#ff5c35] underline hover:text-[#e44a28]"
        >
          {isExpanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
};

const ImportConnection: React.FC<ImportConnectionProps> = ({
  onClose,
  connections,
  progress,
}) => {
          console.log("  ~ ImportConnection ~ connections:", connections)
  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full h-full">
      <div className="flex items-center justify-between w-full gap-3">
        {/* Content */}
        <p className="text-sm font-medium text-center">
          Your connection is in process, you may check the already imported
          connections from Save profile section, Linkedin workspace
        </p>
        {/* Back Button */}
        <div
          onClick={onClose}
          className="flex items-center border gap-2 px-4 py-2 text-sm font-medium rounded-lg border-[#ff5c35] text-white bg-[#ff5c35] hover:text-[#ff5c35] hover:bg-white transition cursor-pointer"
        >
          <i className="fa-solid fa-turn-up -rotate-90"></i>
        </div>
      </div>

      {/* Progress Bar */}
      {/* <div className="w-[80%] h-5 rounded-full overflow-hidden bg-[#ff5c35]/10">
        <div
          className="bg-[#ff5c35] h-full text-xs text-center text-black flex items-center justify-center animate-fill"
          style={{ width: `${progress}%` }}
        >
          <p className="!text-[13px] text-black whitespace-nowrap w-full font-semibold px-1">
            {progress}% Completed
          </p>
        </div>
      </div> */}
      <div className="relative w-[80%] h-5 rounded-full overflow-hidden bg-[#ff5c35]/10">
        {/* Fill Bar */}
        <div
          className="bg-[#ff5c35] h-full text-xs text-center text-black flex items-center justify-center animate-fill transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        >
          <p className="!text-[13px] text-black whitespace-nowrap w-full font-semibold px-1">
            {progress}% Completed
          </p>
        </div>

        {/* Moving Icon */}
        <div
          className="absolute top-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out"
          style={{ left: `calc(${progress}% - 15px)` }} // icon ke center ko align karega
        >
          <img
            src={getImage("fLogo")}
            alt="img"
            className="w-6 h-6 object-contain drop-shadow-md"
          />
        </div>

      </div>


      <div className="w-full">
        <div className="border rounded-lg border-[#e0eaf3]">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 py-2 font-semibold bg-[#fff5f380] border-b border-[#e1eaf4] rounded-t-lg p-4">
            <div className="text-[14px] col-span-2">Name</div>
            <div className="text-[14px] col-span-3">Email</div>
            <div className="text-[14px] col-span-1">Phone No</div>
            <div className="text-[14px] col-span-2">City</div>
            <div className="text-[14px] col-span-2">Position</div>
            <div className="text-[14px] col-span-2">Profile Link</div>
          </div>

          {connections.length > 0 ? (
            <div className="!border-[#e0eaf3] max-h-125 !h-auto overflow-auto">
              {connections.map((item, index) => {
                return <div
                  key={index}
                  className="py-4 px-4 even:bg-[#fff5f380] grid grid-cols-12 gap-4 items-start"
                >
                  <div
                    className={`text-sm capitalize col-span-2 font-semibold ${item.type === "profile"
                        ? "text-blue-500"
                        : "text-[#ff5c35]"
                      }`}
                  >
                    {item.name || "N/A"}
                  </div>

                  <div className="text-sm capitalize col-span-3 font-medium">
                    {item.email || "N/A"}
                  </div>

                  <div className="text-sm capitalize col-span-1 font-medium">
                    {item.phone || "N/A"}
                  </div>

                  <div className="text-sm capitalize col-span-2 font-medium">
                    {item.city || "N/A"}
                  </div>

                  {/* ✅ Occupation Column with Read More / Show Less */}
                  <OccupationText text={item.position || ""} />

                  <div className="text-sm capitalize col-span-2 truncate">
                    <a
                      href={item.navigationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button className="text-[#ff5c35] border border-[#ff5c35] px-2 py-[2px] rounded-[5px] flex items-center text-sm gap-1 whitespace-nowrap">
                        Go To LinkedIn
                        <IoLogoLinkedin className="text-xl text-[#0a66c2]" />
                      </button>
                    </a>
                  </div>
                </div>;
              })}
            </div>
          ) : (
            // Empty state
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-[#ff5c350f] rounded-full flex items-center justify-center mx-auto mb-4">
                <PiLinkSimpleBold className="w-8 h-8 text-[#ff5c35]" />
              </div>
              <p className="text-[#64748b] font-medium !text-xl mb-2">
                No Import Connection yet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportConnection;
