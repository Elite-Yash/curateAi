import React from "react";
import { getImage } from "../../common/utils/logoUtils";

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
}


const ActivePlanModal: React.FC<ModalWrapperProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)] backdrop-blur-base">
      <div className="relative bg-[#ffffff] rounded-2xl shadow-2xl p-6 animate-fadeIn w-[31%]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="p-1 border-[2px] border-[#ff5c35] rounded-full">
              <img src={getImage("fLogo")} alt="logo" className="w-8 h-8" />
            </span>
            <h4 className="font-semibold text-lg text-[#1f2937]">
              Generate Message Reply Ask to Eva
            </h4>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f3f4f6] transition"
          >
            <img
              src={getImage("close")}
              alt="close"
              className="w-4 h-4"
            />
          </button>
        </div>

        {/* Alert Content */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex  mt-2">
            <div className="text-3xl font-bold text-[#dc2626]">!!Alert!!</div>
          </div>
          <p className="text-[#4b5563] leading-relaxed">
            Hey User, you don’t have an
            <span className="font-semibold text-[#dc2626]"> active plan</span> on Evarobo yet.
            Subscribe now and start enjoying all the amazing features!
          </p>
        </div>       
      </div>
    </div>
  );
};

export default ActivePlanModal;
