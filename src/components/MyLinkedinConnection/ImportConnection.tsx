import React from "react";

interface ImportConnectionProps {
  onClose: () => void;
}

const ImportConnection: React.FC<ImportConnectionProps> = ({ onClose }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full h-full p-4 ">
      {/* Back Button */}
      <button
        onClick={onClose}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-[#ff5c35] text-[#ff5c35] hover:bg-[#ff5c35] hover:text-white transition absolute top-[55px] right-[24px]"
      >
        <i className="fa-solid fa-arrow-left"></i>
        Back
      </button>

      {/* Content */}
      <p className="text-sm font-medium text-center">
        Your connection is in process, you may check the already imported connections from Save profile section, Linkedin workspace
      </p>

      {/* Progress Bar */}
      <div className="w-[80%] h-5 rounded-full overflow-hidden bg-[#ff5c35]/10">
        <div
          className="bg-[#ff5c35] h-full text-xs text-center text-white flex items-center justify-center animate-fill"
          style={{ width: "76%" }}
        >
          76%
        </div>
      </div>
    </div>
  );
};

export default ImportConnection;
