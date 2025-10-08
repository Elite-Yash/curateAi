import { FileText, MessageCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import PostGenerator from "./PostGenerator";
import CommentGenerator from "./CommentGenerator";
import ContentHistory from "./ContentHistory";

const Contentstudio = () => {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="c-padding-r py-[24px] relative pl-[320px] pr-[24px]">
      {/*Headng */}
      <div className="flex flex-wrap items-center justify-between bg-white z-10 mb-6 g-box p-4 rounded-lg shadow-sm g-box">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r bg-blue-700 rounded-2xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>

            <div>
              <div className="text-2xl font-bold text-slate-900">Create Post</div>
              <div className="text-sm text-[#717c8c]">
                Craft new LinkedIn posts instantly and share them with your network. Save time, stay consistent, and grow your presence
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-6">
        {/* Tab Buttons */}
        <div
          className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm overflow-hidden p-[5px] g-box !rounded-[10px] gap-[5px]"
        >
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex items-center justify-center gap-2 !py-2 text-sm transition 
              ${activeTab === "posts"
                ? "bg-[#ff5c350f] text-[#ff5c35] rounded-sm !font-semibold"
                : "text-[#737373] hover:bg-[#ff5c350f] font-medium"
              }`}
          >
            <FileText className="w-4 h-4" />
            Create Post
          </button>

          <button
            onClick={() => setActiveTab("comments")}
            className={`flex items-center justify-center gap-2 !py-2 text-sm  transition 
              ${activeTab === "comments"
                ? "bg-[#ff5c350f] text-[#ff5c35] rounded-sm !font-semibold"
                : "text-[#737373] hover:bg-[#ff5c350f] font-medium"
              }`}
          >
            <MessageCircle className="w-4 h-4" />
            Post Ideas
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center justify-center gap-2 !py-2 text-sm transition 
              ${activeTab === "history"
                ? "bg-[#ff5c350f] text-[#ff5c35] rounded-sm !font-semibold"
                : "text-[#737373] hover:bg-[#ff5c350f] font-medium"
              }`}
          >
            <Sparkles className="w-4 h-4" />
            Post History
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "posts" && (
          <div className="space-y-6">
            <PostGenerator popupTriggeredFrom={'create-post'} />
          </div>
        )}

        {activeTab === "comments" && (
          <div className="space-y-6">
            {/* <CommentGenerator popupTriggeredFrom={'comment'} /> */}
            <CommentGenerator/>
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
