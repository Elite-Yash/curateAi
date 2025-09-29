import { FileText, Sparkles, MessageSquare, Users, Target } from "lucide-react";
import { useState } from "react";
import MessageReplyGenerator from "./MessageReplyGenerator";
import MessageHistory from "./MessageHistory";
import Connectionrequest from "./Connectionrequest";

const Messageassistant = () => {
    const [activeTab, setActiveTab] = useState("reply");

    return (
        <div className="c-padding-r py-[24px] relative pl-[320px] pr-[24px]">
            <div className="flex flex-wrap items-center justify-between bg-white z-10 mb-6 g-box p-4 rounded-lg  g-box">
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
            <div className="grid grid-cols-3 gap-6 mb-6 ">
                {/* Box 1 */}
                <div className="p-4 bg-white rounded-xl g-box shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#ff5c350f]">
                        <MessageSquare className="text-[#ff5c35]" />
                    </div>
                    <div>
                        <div className="text-xl font-bold text-[#0f172a]">0</div>
                        <div className="text-sm text-gray-600">Messages Generated</div>
                    </div>
                </div>

                {/* Box 2 */}
                <div className="p-4 bg-white rounded-xl g-box shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#ff5c350f]">
                        <Users className="text-[#ff5c35]" />
                    </div>
                    <div>
                        <div className="text-xl font-bold text-[#0f172a]">0</div>
                        <div className="text-sm text-gray-600">Connection Requests</div>
                    </div>
                </div>

                {/* Box 3 */}
                <div className="p-4 bg-white rounded-xl g-box shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#ff5c350f]">
                        <Target className="text-[#ff5c35]" />
                    </div>
                    <div>
                        <div className="text-xl font-bold text-[#0f172a]">0</div>
                        <div className="text-sm text-gray-600">Response Rate</div>
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
                        onClick={() => setActiveTab("reply")}
                        className={`flex items-center justify-center gap-2 !py-2 text-sm font-medium  
              ${activeTab === "reply"
                                ? "bg-[#ff5c350f] text-[#ff5c35] rounded-sm !font-semibold"
                                : "text-[#737373] hover:bg-[#ff5c350f] font-medium"
                            }`}
                    >
                        <FileText className="w-4 h-4" />
                        Reply Generater
                    </button>

                    <button
                        onClick={() => setActiveTab("connection")}
                        className={`flex items-center justify-center gap-2 !py-2 text-sm font-medium  
              ${activeTab === "connection"
                                ? "bg-[#ff5c350f] text-[#ff5c35] !font-semibold"
                                : "text-[#737373] hover:bg-[#ff5c350f] font-medium"
                            }`}
                    >
                        <MessageSquare className="w-4 h-4" />
                        Connection Requests
                    </button>

                    <button
                        onClick={() => setActiveTab("Message")}
                        className={`flex items-center justify-center gap-2 !py-2 text-sm font-medium  
              ${activeTab === "Message"
                                ? "bg-[#ff5c350f] text-[#ff5c35] !font-semibold"
                                : "text-[#737373] hover:bg-[#ff5c350f] font-medium"
                            }`}
                    >
                        <Sparkles className="w-4 h-4" />
                        Message History
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === "reply" && (
                    <div className="space-y-6">
                        <MessageReplyGenerator popupTriggeredFrom={'message-reply'} />
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
