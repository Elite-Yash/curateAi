import React from "react";
import { getImage } from "../../common/utils/logoUtils";

interface CommentModalProps {
    show: boolean;
    onClose: () => void;
    data?: any | null;
}

const CommentModal: React.FC<CommentModalProps> = ({ show, onClose, data }) => {
    if (!show || !data) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 !m-0">
            <div className="bg-white rounded-lg max-w-full shadow-lg overflow-auto w-[1000px] max-h-[85vh] max-[1050px]:w-[95%] ">
                {/* Header */}
                <div className="sticky top-0 bg-white header-top p-9 py-2 flex justify-between items-center">
                    <span className="relative s-logo border-[2.5px] border-solid rounded-full border-[#ff5c35] w-12">
                        <img src={getImage("fLogo")} alt="logo" />
                    </span>

                    <h4 className="popup-title font-semibold text-xl leading-10">
                        Entire Comment
                    </h4>

                    <span
                        onClick={onClose}
                        role="button"
                        aria-label="Close modal"
                        className="close-box w-6 h-6 bg-no-repeat bg-center cursor-pointer"
                    >
                        <img
                            src={getImage("close")}
                            alt="close"
                            className="w-8 h-8 rounded-full m-2.5"
                        />
                    </span>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p
                        className="text-gray-700 mt-2.5"
                        dangerouslySetInnerHTML={{
                            __html:
                                data
                                    ?.replace(/</g, "&lt;")
                                    ?.replace(/>/g, "&gt;")
                                    ?.replace(/\n/g, "<br />") || "",
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default CommentModal;
