import React, { useState } from "react";
import {
    MessageSquare,
    Copy,
    RefreshCw,
    Send,
    Sparkles,
    User,
} from "lucide-react";


const MessageReplyGenerator = () => {
    const [originalMessage, setOriginalMessage] = useState("");
    const [context, setContext] = useState("");
    const [replyTone, setReplyTone] = useState("professional");
    const [replyType, setReplyType] = useState("follow_up");
    const [generatedReply, setGeneratedReply] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);



    // Fake API generator
    const generateReply = async () => {
        if (!originalMessage.trim()) return;
        setIsGenerating(true);
        setGeneratedReply("");

        setTimeout(() => {
            const fakeReply = `✨ (${replyType}) \nThanks for reaching out! I appreciate your message. Looking forward to connecting further. 🚀`;
            setGeneratedReply(fakeReply);
            setIsGenerating(false);
        }, 2000);
    };


    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedReply);
    };

    const replyTypes = [
        {
            value: "follow_up",
            label: "Follow-up Response",
        },
        {
            value: "thank_you",
            label: "Thank You Message",
        },
        {
            value: "introduction",
            label: "Introduction Reply",
        },
        {
            value: "meeting_request",
            label: "Meeting Request",
        },
        {
            value: "information_share",
            label: "Share Information",
        },
        {
            value: "polite_decline",
            label: "Polite Decline",
        },
    ];

    const toneOptions = [
        { value: "professional", label: "Professional" },
        { value: "friendly", label: "Friendly & Warm" },
        { value: "enthusiastic", label: "Enthusiastic" },
        { value: "consultative", label: "Consultative" },
        { value: "casual", label: "Casual" },
    ];

    return (
        <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="border-none shadow-lg bg-white/80 backdrop-blur-sm rounded-xl p-6 space-y-6 ">
                <div className="flex items-center gap-2 font-semibold text-base mb-6">
                    <MessageSquare className="w-5 h-5 text-[#00B247] " />
                    Generate Message Reply
                </div>

                <div className="space-y-6">
                    {/* Original Message */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                            Original Message
                        </label>
                        <textarea
                            placeholder="Paste the LinkedIn message you received..."
                            value={originalMessage}
                            onChange={(e) => setOriginalMessage(e.target.value)}
                            className="w-full min-h-24 resize-none border border-[#cbd5e1] rounded-lg p-2 text-sm focus:ring-1 focus:ring-blue-500"
                        />
                    </div>


                    {/* Additional Context */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                            Additional Context (Optional)
                        </label>
                        <textarea
                            placeholder="Any additional information about the sender..."
                            value={context}
                            onChange={(e) => setContext(e.target.value)}
                            className="w-full min-h-24 resize-none border border-[#cbd5e1] rounded-lg p-2 text-sm focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    {/* Reply Purpose */}
                    <div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                                Reply Purpose
                            </label>
                            <select
                                value={replyType}
                                onChange={(e) => setReplyType(e.target.value)}
                                className="w-full border border-[#cbd5e1] rounded-lg p-2 text-sm"
                            >
                                {replyTypes.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {replyTypes.slice(0, 4).map((type) => (
                                <span
                                    key={type.value}
                                    onClick={() => setReplyType(type.value)}
                                    className={`px-3 py-1 rounded-xl text-xs font-medium transition cursor-pointer ${replyType === type.value
                                        ? "bg-green text-white"
                                        : "bg-[#f1f5f9] text-[#334155] hover:bg-[#e2e8f0]"
                                        }`}
                                >
                                    {type.label}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Reply Tone */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                            Post Type
                        </label>
                        <select
                            value={replyTone}
                            onChange={(e) => setReplyTone(e.target.value)}
                            className="w-full border border-[#cbd5e1] rounded-lg p-2 text-sm"
                        >
                            {toneOptions.map((tone) => (
                                <option key={tone.value} value={tone.value}>
                                    {tone.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Generate Button */}
                    {/* Generate Button */}
                    <button
                        onClick={generateReply}
                        disabled={!originalMessage.trim() || isGenerating}
                        className={`w-full flex items-center justify-center gap-2 
            bg-green hover:bg-[#008234] 
            disabled:bg-gray-300 disabled:cursor-not-allowed
            text-white font-medium px-4 py-2 rounded-lg 
              transition duration-200`}
                    >
                        {isGenerating ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                Generating Reply...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                Generate Reply
                            </>
                        )}
                    </button>


                    {/* Tips */}
                    <div className="p-4 bg-[#f0fdf4] rounded-lg">
                        <div className="font-semibold text-base text-[#14532d] mb-2">
                            💡 Tips for better posts:
                        </div>
                        <ul className="text-sm text-[#166534] space-y-1">
                            <li>• Add personal insights or experiences</li>
                            <li>• Ask thoughtful follow-up questions</li>
                            <li>• Tag relevant people when appropriate</li>
                            <li>• Keep comments concise but meaningful</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Output Section */}
            <div className="border-none shadow-lg bg-white/80 backdrop-blur-sm rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 first-line: font-semibold text-base">
                        <Send className="w-5 h-5 text-[#16a34a]" />
                        Generated Reply
                    </div>
                    {generatedReply && (
                        <div className="flex items-center gap-2">
                            <button onClick={generateReply} className="p-2 hover:bg-slate-100 rounded">
                                <RefreshCw className="w-4 h-4" />
                            </button>
                            <button onClick={copyToClipboard} className="p-2 hover:bg-slate-100 rounded">
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {generatedReply ? (
                    <div className="space-y-4">
                        <div className="p-4 border border-[#cbd5e1] rounded-lg bg-slate-50">
                            <div className="flex items-start gap-3 mb-3">
                                <div className="w-8 h-8 bg-[#edfdf2] rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-green" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className="font-medium text-sm">You</span>
                                        <span className="text-xs text-slate-500">• Draft</span>
                                    </div>
                                </div>
                            </div>
                            <div className="">
                                <div className="whitespace-pre-wrap text-sm text-[#1e293b]">
                                    {generatedReply}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-500">
                            <div className="flex items-center gap-4">
                                <span>{generatedReply.length} characters</span>
                                <span>{generatedReply.split(" ").length} words</span>
                                <span>{replyTone} tone</span>
                            </div>
                            <span className="px-3 py-1 rounded-full border border-[#2563eb] text-[#2563eb] hover:bg-[#2563eb] hover:text-white transition">
                                Ready to send
                            </span>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={copyToClipboard}
                                className="flex-1 px-4 py-2  border text-sm font-medium rounded-lg border-[#2563eb] text-[#2563eb] hover:bg-[#2563eb] hover:text-white transition flex items-center justify-center"
                            >
                                <Copy className="w-4 h-4 mr-2" />
                                Copy Reply
                            </button>
                            <button className="flex-1 px-4 py-2 rounded-lg  bg-green hover:bg-[#008234] text-white flex items-center justify-center">
                                <Send className="w-4 h-4 mr-2" />
                                Open LinkedIn
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-[#f1f5f9] rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="w-8 h-8 text-[#94a3b8]" />
                        </div>
                        <p className="text-[#64748b] font-medium !text-xl mb-2">
                            No reply generated yet
                        </p>
                        <div className="!text-base text-[#94a3b8]">
                            Paste the original message and choose your reply style to get
                            started
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MessageReplyGenerator