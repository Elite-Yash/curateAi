import { FileText, MessageCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import PostGenerator from "./PostGenerator";
import CommentGenerator from "./CommentGenerator";
import ContentHistory from "./ContentHistory";

const Contentstudio = () => {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="c-padding-r pt-12 h-screen relative pl-[390px] pr-[110px]">
      <div className="flex items-center justify-between bg-white z-10 mb-4 g-box p-4 rounded-lg shadow-sm">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>

          <div className="flex flex-col">
            <div className="text-2xl font-bold text-slate-900">Content Studio</div>
            <div className="text-sm text-[#717c8c]">
              Create engaging LinkedIn content with AI
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-slate-600">
                AI Content Generator Ready
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-6">
        {/* Tab Buttons */}
        <div className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm rounded-lg overflow-hidden">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex items-center justify-center gap-2 py-3 text-sm font-medium transition 
              ${
                activeTab === "posts"
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
          >
            <FileText className="w-4 h-4" />
            Posts
          </button>

          <button
            onClick={() => setActiveTab("comments")}
            className={`flex items-center justify-center gap-2 py-3 text-sm font-medium transition 
              ${
                activeTab === "comments"
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
          >
            <MessageCircle className="w-4 h-4" />
            Comments
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center justify-center gap-2 py-3 text-sm font-medium transition 
              ${
                activeTab === "history"
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50"
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
