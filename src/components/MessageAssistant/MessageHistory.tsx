import { FileText, History, MessageSquare } from "lucide-react";
import { FiTrendingUp } from "react-icons/fi";
import { CiCalendar } from "react-icons/ci";
import { useState } from "react";

const MessageHistory = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  // placeholder empty list
  const filteredContent = [];

  return (
    <>
      {/* Stat Boxes */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {/* Box 1 */}
        <div className="p-4 bg-white rounded-xl border border-[#e3e9f1] shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#bfdbfe]">
            <FileText className="text-[#2563eb]" />
          </div>
          <div>
            <div className="text-xl font-bold text-[#0f172a]">0</div>
            <div className="text-sm text-gray-600">Posts Generated</div>
          </div>
        </div>

        {/* Box 2 */}
        <div className="p-4 bg-white rounded-xl border border-[#e3e9f1] shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#dcfce7]">
            <MessageSquare className="text-green-600" />
          </div>
          <div>
            <div className="text-xl font-bold text-[#0f172a]">0</div>
            <div className="text-sm text-gray-600">Comments Generated</div>
          </div>
        </div>

        {/* Box 3 */}
        <div className="p-4 bg-white rounded-xl border border-[#e3e9f1] shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#fefce8]">
            <FiTrendingUp className="text-yellow-400" />
          </div>
          <div>
            <div className="text-xl font-bold text-[#0f172a]">0</div>
            <div className="text-sm text-gray-600">Actually Used</div>
          </div>
        </div>

        {/* Box 4 */}
        <div className="p-4 bg-white rounded-xl border border-[#e3e9f1] shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#eee7f5]">
            <CiCalendar className="text-[#9333ea]" />
          </div>
          <div>
            <div className="text-xl font-bold text-[#0f172a]">0</div>
            <div className="text-sm text-gray-600">Per Week Avg</div>
          </div>
        </div>
      </div>  

      {/* Generated Content */}
      <div className="bg-white rounded-xl border border-[#e3e9f1] shadow-sm p-6">
        {/* Header with Tabs */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 font-semibold text-base">
            <History className="w-5 h-5 text-slate-600" />
            Generated Content
          </div>
          <div className="flex items-center bg-[#f1f5f9] rounded-lg text-sm text-[#737373] font-medium overflow-hidden !p-[5px]">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-1 ${
                activeFilter === "all" ? "bg-white shadow-sm rounded-lg" : ""
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter("post")}
              className={`px-4 py-1 ${
                activeFilter === "post" ? "bg-white shadow-sm rounded-lg" : ""
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveFilter("comment")}
              className={`px-4 py-1 ${
                activeFilter === "comment"
                  ? "bg-white shadow-sm rounded-lg"
                  : ""
              }`}
            >
              Comments
            </button>
          </div>
        </div>

        {/* Empty State */}
        {filteredContent.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[#f1f5f9] rounded-full flex items-center justify-center mx-auto mb-4">
              <History className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-[#64748b] font-medium !text-xl mb-2">
              No content history yet
            </p>
            <p className="!text-base text-[#94a3b8] cursor-pointer">
              Generate some posts or comments to see them here
            </p>
          </div>
        ) : (
          <div className="space-y-3">{/* Render content here */}</div>
        )}
      </div>
    </>
  );
};

export default MessageHistory;
