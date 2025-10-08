import { FileText, Sparkles } from "lucide-react";
import { useState } from "react";
import Createform from "./createform";
import Listpage from "./listpage";
import { ImConnection } from "react-icons/im";

const ConnectionAssistant = () => {
  const [activeTab, setActiveTab] = useState("createform");

  return (
    <div className="c-padding-r py-[24px] relative pl-[320px] pr-[24px]">
      {/*Headng */}
      <div className="flex flex-wrap items-center justify-between bg-white z-10 mb-6 g-box p-4 rounded-lg shadow-sm g-box">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r bg-[#ff5c35] rounded-2xl flex items-center justify-center">
              <ImConnection className="w-6 h-6 text-white"/>
            </div>

            <div className="w-[1090px]">
              <div className="text-2xl font-bold ">Connection Assistant</div>
              <div className="text-sm text-[#717c8c]">
                Send personalized LinkedIn connection requests powered by AI. Simply open a LinkedIn search or profile page, and this tool will help you craft tailored messages to grow your network effortlessly.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-6">
        {/* Tab Buttons */}
        <div
          className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm overflow-hidden p-[5px] g-box !rounded-[10px] gap-[5px]"
        >
          <button
            onClick={() => setActiveTab("createform")}
            className={`flex items-center justify-center gap-2 !py-2 text-sm transition 
              ${activeTab === "createform"
                ? "bg-[#ff5c350f] text-[#ff5c35] rounded-sm !font-semibold"
                : "text-[#737373] hover:bg-[#ff5c350f] font-medium"
              }`}
          >
            <FileText className="w-4 h-4" />
            Create form
          </button>

          <button
            onClick={() => setActiveTab("Listpage")}
            className={`flex items-center justify-center gap-2 !py-2 text-sm transition 
              ${activeTab === "Listpage"
                ? "bg-[#ff5c350f] text-[#ff5c35] rounded-sm !font-semibold"
                : "text-[#737373] hover:bg-[#ff5c350f] font-medium"
              }`}
          >
            <Sparkles className="w-4 h-4" />
            List page
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "createform" && (
          <div className="space-y-6">
            <Createform/>
          </div>
        )}

        {activeTab === "Listpage" && (
          <div className="space-y-6">
            <Listpage />
          </div>
        )}

      </div>
    </div>
  );
};

export default ConnectionAssistant;
