import { useEffect, useState } from "react";
import { PiLinkSimpleBold } from "react-icons/pi";
import ImportConnection from "./ImportConnection";
import Swal from "sweetalert2";

const groups = [
  { id: 1, name: "Group 1" },
  { id: 2, name: "Group 2" },
  { id: 3, name: "Group 3" },
  { id: 4, name: "Group 4" },
  { id: 5, name: "Group 5" },
];

interface ProfileData {
  name: string;
  position: string;
  city?: string;
  email?: string;
  phone?: string;
}


const LinkedinConnection = () => {
  const [activeTab, setActiveTab] = useState<"main" | "import">("main");
  const [activeGroup, setActiveGroup] = useState<number>(1);
  const [connections, setConnections] = useState<ProfileData[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const handleImportClick = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to import your LinkedIn connections?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff5c35",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Import!",
    }).then((result) => {
      if (result.isConfirmed) {
        chrome.runtime.sendMessage({ type: "START_SCRAPING" });
      }
    });
  };


  useEffect(() => {
    const listener = (message: any) => {
      if (message.type === "SHOW_ALERT") {
        Swal.fire({
          icon: "info",
          title: "Notice",
          text: message.message,
          confirmButtonColor: "#ff5c35",
        });
      }

      // ✅ When one profile is scraped, show ImportConnection tab
      if (message.type === "LIVE_PROFILE_SCRAPED") {
        setActiveTab("import");
        setConnections((prev) => [...prev, message.data]);

        // ✅ Add this new part for live progress bar
        const progress = Math.round((message.current / message.total) * 100);
        setProgress(progress);
      }

      // ✅ When all done
      if (message.type === "SCRAPING_COMPLETE") {
        Swal.fire({
          icon: "success",
          title: "Scraping Complete!",
          text: "All profiles scraped successfully.",
          confirmButtonColor: "#ff5c35",
        });
      }
    };

    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, []);


  return (
    <div className="c-padding-r py-[24px] relative pl-[320px] pr-[24px]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between bg-white z-10 mb-6 g-box p-4 rounded-lg shadow-sm">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#ff5c35] rounded-2xl flex items-center justify-center">
              <PiLinkSimpleBold className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">
                My LinkedIn Connection
              </div>
              <div className="text-sm text-[#717c8c]">
                View, organize, and manage all your LinkedIn connections in one
                smart workspace powered by AI.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-slate-600">
              {connections.length} LinkedIn Connection Ready
            </span>
          </div>
        </div>
      </div>

      {/* Group Tabs - New Design */}
      <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(0,1fr))] bg-white/80 backdrop-blur-sm overflow-hidden p-[5px] g-box rounded-[10px] gap-[5px] sticky top-0 z-20 mb-6">
        {groups.map((group) => (
          <button
            key={group.id}
            onClick={() => setActiveGroup(group.id)}
            className={`flex items-center justify-center gap-2 py-2 text-sm transition
        ${activeGroup === group.id
                ? "bg-[#ff5c350f] text-[#ff5c35] rounded-sm font-semibold"
                : "text-[#737373] hover:bg-[#ff5c350f] font-medium"
              }`}
          >
            {group.name}
          </button>
        ))}
      </div>



      {/* Body Section */}
      <div className="space-y-6">
        <div className="w-full min-h-[443px] bg-white g-box rounded-lg shadow-sm flex flex-col items-center p-6 relative">
          {activeTab === "main" ?
            <div className="w-full flex justify-end items-center">
              <button onClick={() => setActiveTab("import")} className="flex items-center float-end border gap-2  px-4 py-2 text-sm font-medium rounded-lg border-[#ff5c35] text-white bg-[#ff5c35] hover:text-[#ff5c35] hover:bg-white transition">
                Show Your Connection
              </button>
            </div> : <></>
          }

          <div className="">
            {/* Main or Import Section */}
            {activeTab === "main" ? (

              <div className="flex flex-col items-center justify-center gap-6 mt-6">
                <p className="text-2xl font-normal text-center text-slate-700">
                  You have 500 connections in LinkedIn, it will take approx 5 days
                  to import all.
                </p>

                <button
                  onClick={handleImportClick}
                  className="flex flex-col items-center justify-center border border-dashed border-[#ff5c35] w-[450px] rounded-xl px-8 py-6 hover:bg-[#ff5c35]/5 transition"
                >
                  <div className="w-12 h-12 bg-[#ff5c35]/10 text-[#ff5c35] rounded-full flex items-center justify-center mb-3">
                    <PiLinkSimpleBold className="w-6 h-6" />
                  </div>
                  <span className="text-base font-bold">Import Connections</span>
                </button>
              </div>
            ) : (
              <ImportConnection onClose={() => setActiveTab("main")}
                connections={connections}
                progress={progress}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedinConnection;
