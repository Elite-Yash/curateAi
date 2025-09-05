import { FileText, MessageCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import PostGenerator from "./PostGenerator";
import CommentGenerator from "./CommentGenerator";
import ContentHistory from "./ContentHistory";

const Contentstudio = () => {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="c-padding-r py-12 relative pl-[390px] pr-[110px]">
        {/*Headng */}
           <div className="flex flex-wrap items-center justify-between bg-white z-10 mb-4 g-box p-4 rounded-lg shadow-sm g-box">
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center">
                            <FileText className="w-6 h-6 text-white" />
                        </div>

                        <div>
                            <div className="text-2xl font-bold text-slate-900">Content Studio</div>
                            <div className="text-sm text-[#717c8c]">
                                Manage your LinkedIn contacts and prospects
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green rounded-full"></div>
                        <span className="text-sm text-slate-600">
                            AI Content Generator Ready
                        </span>
                    </div>
                </div>
            </div>

      {/* Tabs */}
      <div className="space-y-6">
        {/* Tab Buttons */}
        <div
          className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm overflow-hidden p-[5px] shadow-4 !rounded-[10px]"
          style={{ border: "0.5px solid #d1d5db" }}
        >
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex items-center justify-center gap-2 !py-1 text-sm transition 
              ${
                activeTab === "posts"
                  ? "bg-[#eff6ff] text-[#1d4ed8] rounded-sm shadow-3 !font-semibold"
                  : "text-[#737373] hover:bg-[#f8fafc] font-medium"
              }`}
          >
            <FileText className="w-4 h-4" />
            Posts
          </button>

          <button
            onClick={() => setActiveTab("comments")}
            className={`flex items-center justify-center gap-2 !py-1 text-sm transition 
              ${
                activeTab === "comments"
                  ? "bg-[#eff6ff] text-[#1d4ed8] rounded-sm shadow-3 !font-semibold"
                  : "text-[#737373] hover:bg-[#f8fafc] font-medium"
              }`}
          >
            <MessageCircle className="w-4 h-4" />
            Comments
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center justify-center gap-2 !py-1 text-sm transition 
              ${
                activeTab === "history"
                  ? "bg-[#eff6ff] text-[#1d4ed8] rounded-sm shadow-3 !font-semibold"
                  : "text-[#737373] hover:bg-[#f8fafc] font-medium"
              }`}
          >
            <Sparkles className="w-4 h-4" />
            History
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "posts" && (
          <div className="space-y-6">
            <PostGenerator />
          </div>
        )}

        {activeTab === "comments" && (
          <div className="space-y-6">
            <CommentGenerator />
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-6">
            <ContentHistory />
          </div>
        )}
      </div>
    </div>
  );
};

export default Contentstudio;
