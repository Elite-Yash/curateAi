import React from "react";
import { FaRegClock } from "react-icons/fa";
import { getImage } from "../../common/utils/logoUtils";
import { IoLogoLinkedin } from "react-icons/io5";

// Props type define karo
interface ActivityModalProps {
    open: boolean;
    onClose: () => void;
    mergedData: {
        type: string;
        comment_type: string;
        title: string;
        details: string;
        LinkedinUrl: string;
        status?: string;
        date: Date;
    }[];
}


const RecentActityTable: React.FC<ActivityModalProps> = ({ open, onClose, mergedData }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-[90%] max-h-[90vh] overflow-auto relative">
                {/* Modal Header */}
                <div className="relative p-9 py-4 flex items-center">
                    <div className="flex">
                        <span className="relative p-logo border-[2.5px] border-solid rounded-full border-[#ff5c35] w-12 h-12 flex items-center justify-center">
                            <img src={getImage("fLogo")} alt="img" className="w-10 h-10" />
                        </span>
                        <h4 className="popup-title font-semibold text-xl leading-10 ml-2.5 mt-1">
                            Recent Activity
                        </h4>
                    </div>
                    <span
                        onClick={onClose}
                        className="close-box w-6 h-6 bg-no-repeat bg-center cursor-pointer float-end ml-auto"
                    >
                        <img
                            src={getImage("close")}
                            alt="img"
                            className="w-full h-full rounded-full"
                        />
                    </span>
                </div>


                {/* ✅ Table */}
                <div className="p-3 pt-0">
                    <div className="border rounded-lg border-[#e0eaf3]">
                        <div className="grid grid-cols-12 gap-4 py-2 font-semibold bg-[#fff5f380] border-b border-[#e1eaf4] rounded-t-lg p-4">
                            <div className="text-[14px] col-span-1">Type</div>
                            <div className="text-[14px] col-span-3">Title / Name</div>
                            <div className="text-[14px] col-span-6">Details</div>
                            <div className="text-[14px] col-span-2">LinkedinUrl</div>
                        </div>

                        {mergedData && mergedData.length > 0 ? (
                            <div className="!border-[#e0eaf3] max-h-[70vh] overflow-auto h-[70vh]">
                                {mergedData.map((item, index) => (
                                    <div
                                        key={index}
                                        className="py-4 px-4 even:bg-[#fff5f380] grid grid-cols-12 gap-4 items-start"
                                    >
                                        <div
                                            className={`text-sm capitalize col-span-1 font-semibold ${item.type === "profile"
                                                ? "text-blue-500"
                                                : "text-[#ff5c35]"
                                                }`}
                                        >
                                            {item.comment_type}
                                        </div>
                                        <div className="text-sm capitalize col-span-3 font-medium ">
                                            {item.title}
                                        </div>
                                        <div className="text-sm capitalize col-span-6">
                                            {item.details}
                                        </div>
                                        <div className="text-sm capitalize col-span-2 truncate">
                                            {item.type === "comment" ? (
                                                item.status === "published" && item.LinkedinUrl ? (
                                                    <a
                                                        href={item.LinkedinUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <button className="text-[#ff5c35] border border-[#ff5c35] px-2 py-[2px] rounded-[5px] flex items-center text-sm gap-1 whitespace-nowrap">
                                                            Go To LinkedIn
                                                            <IoLogoLinkedin className="text-xl text-[#0a66c2]" />
                                                        </button>
                                                    </a>
                                                ) : (
                                                    "N/A"
                                                )
                                            ) : item.type === "profile" ? (
                                                item.LinkedinUrl ? (
                                                    <a
                                                        href={item.LinkedinUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <button className="text-[#ff5c35] border border-[#ff5c35] px-2 py-[2px] rounded-[5px] flex items-center text-sm gap-1 whitespace-nowrap">
                                                            Go To LinkedIn
                                                            <IoLogoLinkedin className="text-xl text-[#0a66c2]" />
                                                        </button>
                                                    </a>
                                                ) : (
                                                    "N/A"
                                                )
                                            ) : (
                                                "N/A"
                                            )}
                                        </div>

                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-48 h-[70vh]">
                                <div className="w-16 h-16 bg-[#ff5c350f] rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FaRegClock className="w-8 h-8 text-[#ff5c35]" />
                                </div>
                                <p className="text-[#64748b] font-medium !text-xl mb-2">
                                    No Recent Activity yet
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecentActityTable;
