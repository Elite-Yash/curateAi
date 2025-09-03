import { FileText, Sparkles, MessageSquare, Users, Target } from "lucide-react";
import { useState } from "react";
import MessageReplyGenerator from "./MessageReplyGenerator";
import MessageHistory from "./MessageHistory";
import Connectionrequest from "./Connectionrequest";

const Messageassistant = () => {
    const [activeTab, setActiveTab] = useState("reply");

    return (
        <div className="c-padding-r pt-12 h-screen relative pl-[390px] pr-[110px]">
            <div className="flex flex-wrap items-center justify-between bg-white z-10 mb-4 g-box p-4 rounded-lg shadow-sm g-box">
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green to-green rounded-2xl flex items-center justify-center">
                            <MessageSquare className="w-6 h-6 text-white" />
                        </div>

                        <div>
                            <div className="text-2xl font-bold text-slate-900">Message Assistant</div>
                            <div className="text-sm text-[#717c8c]">
                                AI-powered messaging for LinkedIn conversations
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green rounded-full"></div>
                        <span className="text-sm text-slate-600">
                            Smart messaging ready
                        </span>
                    </div>
                </div>
            </div>

            {/* All Box */}
            <div className="grid grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-[#e3e9f1] shadow-sm mb-4 g-box ">
                {/* Box 1 */}
                <div
                    className="p-4 bg-[#f0f8ff] rounded-xl hover:bg-[#d7dbdf] shadow-sm flex items-center gap-3 cursor-pointer"
                >
                    <div className="w-10 h-10 flex items-center justify-center rounded-full  bg-[#bfdbfe]">
                        <MessageSquare className="text-[#2563eb] text-lg" />
                    </div>
                    <div>
                        <div className="text-xl font-bold text-slate-900">
                            47
                        </div>
                        <div className="text-sm text-gray-600">Messages Generated</div>
                    </div>
                </div>

                {/* Box 2 */}
                <div className="p-4 bg-[#f0f8ff] rounded-xl hover:bg-[#d7dbdf] shadow-sm flex items-center gap-3 cursor-pointer">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#edfdf2]">
                        <Users className="text-green text-lg" />
                    </div>
                    <div>
                        <div className="text-xl font-bold text-slate-900">23</div>
                        <div className="text-sm text-gray-600">Connection Requests</div>
                    </div>
                </div>

                {/* Box 3 */}
                <div
                    className="p-4 bg-[#f0f8ff] rounded-xl hover:bg-[#d7dbdf] shadow-sm flex items-center gap-3 cursor-pointer"
                >
                    <div className="w-10 h-10 flex items-center justify-center rounded-full  bg-[#fefce8]">
                        <Target className="text-yellow-400 text-lg" />
                    </div>
                    <div>
                        <div className="text-xl font-bold text-slate-900">
                            89%
                        </div>
                        <div className="text-sm text-gray-600">Response Rate</div>
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
                        onClick={() => setActiveTab("reply")}
                        className={`flex items-center justify-center gap-2 !py-1 text-sm font-medium  
              ${activeTab === "reply"
                                ? "bg-[#f0fdf4] text-[#238848] rounded-sm shadow-3 !font-semibold"
                                : "text-[#737373] hover:bg-[#f8fafc] font-medium"
                            }`}
                    >
                        <FileText className="w-4 h-4" />
                        Reply Generater
                    </button>

                    <button
                        onClick={() => setActiveTab("connection")}
                        className={`flex items-center justify-center gap-2 !py-1 text-sm font-medium  
              ${activeTab === "connection"
                                ? "bg-[#f0fdf4] text-[#238848] rounded-sm shadow-3 !font-semibold"
                                : "text-[#737373] hover:bg-[#f8fafc] font-medium"
                            }`}
                    >
                        <MessageSquare className="w-4 h-4" />
                        Connection Requests
                    </button>

                    <button
                        onClick={() => setActiveTab("Message")}
                        className={`flex items-center justify-center gap-2 !py-1 text-sm font-medium  
              ${activeTab === "Message"
                                ? "bg-[#f0fdf4] text-[#238848] rounded-sm shadow-3 !font-semibold"
                                : "text-[#737373] hover:bg-[#f8fafc] font-medium"
                            }`}
                    >
                        <Sparkles className="w-4 h-4" />
                        Message Message
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === "reply" && (
                    <div className="space-y-6">
                        <MessageReplyGenerator />
                    </div>
                )}

                {activeTab === "connection" && (
                    <div className="space-y-6">
                        <Connectionrequest />
                    </div>
                )}

                {activeTab === "Message" && (
                    <div className="space-y-6">
                        <MessageHistory />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messageassistant;
