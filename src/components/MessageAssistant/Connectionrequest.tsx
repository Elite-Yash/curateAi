import { useState } from "react";
import {
    Users,
    Copy,
    RefreshCw,
    Send,
    Sparkles
} from "lucide-react";

const Connectionrequest = () => {
    const [profileName, setProfileName] = useState("");
    const [profileTitle, setProfileTitle] = useState("");
    const [company, setCompany] = useState("");
    const [connectionReason, setConnectionReason] = useState("networking");
    const [personalNote, setPersonalNote] = useState("");
    const [generatedRequest, setGeneratedRequest] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isPersonalNoteActive, setIsPersonalNoteActive] = useState(false);


    const generateConnectionRequest = async () => {
        if (!profileName.trim()) return;
        setIsGenerating(true);
        setGeneratedRequest("");

        setTimeout(() => {
            const fakeRequest = `👋 Hi ${profileName}, I came across your profile and was impressed by your work at ${company || "your company"}. I'd love to connect and learn more about your journey! 🚀`;

            const truncatedResult =
                fakeRequest.length > 300 ? fakeRequest.substring(0, 297) + "..." : fakeRequest;

            setGeneratedRequest(truncatedResult);
            setIsGenerating(false);
        }, 2000);
    };


    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedRequest);
    };

    const connectionReasons = [
        { value: "networking", label: "General Networking" },
        { value: "industry_expert", label: "Industry Expert" },
        { value: "potential_client", label: "Potential Client" },
        { value: "job_opportunity", label: "Job Opportunity" },
        { value: "collaboration", label: "Collaboration" },
        { value: "shared_interest", label: "Shared Interest" }
    ];

    return (
        <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="border-none shadow-lg bg-white/80 backdrop-blur-sm p-6 rounded-lg">
                <div className="flex items-center gap-2 first-line: font-semibold text-base mb-6">
                    <Users className="w-5 h-5 text-[#ff5c35]" />
                    Generated Connection Request
                </div>

                <div className="space-y-6">
                    {/* Profile Information */}
                    <div className="space-y-4">
                        {/* <h5 className="font-medium text-c">Target Profile Information</h5> */}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#334155]">Name *</label>
                            <input
                                placeholder="e.g., Sarah Johnson"
                                value={profileName}
                                onChange={(e) => setProfileName(e.target.value)}
                                className="w-full border border-[#e2e8f0] rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff5c35] focus:border-[#ff5c35]"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#334155]">Job Title</label>
                            <input
                                placeholder="e.g., Senior Marketing Director"
                                value={profileTitle}
                                onChange={(e) => setProfileTitle(e.target.value)}
                                className="w-full border border-[#e2e8f0] rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff5c35] focus:border-[#ff5c35]"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#334155]">Company</label>
                            <input
                                placeholder="e.g., Microsoft"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                className="w-full border border-[#e2e8f0] rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff5c35] focus:border-[#ff5c35]"
                            />
                        </div>
                    </div>

                    {/* Connection Reason */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[#334155]">Connection Reason</label>
                        <select
                            value={connectionReason}
                            onChange={(e) => setConnectionReason(e.target.value)}
                            className="w-full border border-[#e2e8f0] rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff5c35] focus:border-[#ff5c35]"
                        >
                            {connectionReasons.map((reason) => (
                                <option key={reason.value} value={reason.value}>
                                    {reason.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Personal Note */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[#334155]">Personal Note (Optional)</label>
                        <div
                            className={`rounded-lg overflow-hidden border ${isPersonalNoteActive ? "active" : "border-[#e2e8f0]"
                                } custom_textarea`}
                        >
                            <textarea
                                placeholder="Any specific details about why you want to connect..."
                                value={personalNote}
                                onChange={(e) => setPersonalNote(e.target.value)}
                                onFocus={() => setIsPersonalNoteActive(true)}
                                onBlur={() => setIsPersonalNoteActive(false)}
                                className="w-full min-h-24 h-full p-2 outline-none text-sm resize-none focus:ring-0 border-0"
                            />
                        </div>
                    </div>

                    {/* Generate Button */}
                    <button
                        onClick={generateConnectionRequest}
                        disabled={!profileName.trim() || isGenerating}
                        className="w-full flex items-center justify-center gap-2 bg-[#ff5c35] text-white rounded-lg py-2 +"
                    >
                        {isGenerating ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                <span className="text-sm">Generating Request...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4"/>
                                <span className="text-sm">Generate Connection Request</span>
                            </>
                        )}
                    </button>
                    {/* Quick Tips */}
                    <div className="p-4 bg-[#ff5c350f] rounded-lg">
                        <div className="font-semibold  text-base mb-2">
                            🤝 Connection Best Practices:
                        </div>
                        <ul className="text-sm space-y-1">
                            <li>• Always personalize your message</li>
                            <li>• Mention mutual connections if any</li>
                            <li>• Be clear about why you want to connect</li>
                            <li>• Keep it under 300 characters</li>
                        </ul>
                    </div>

                </div>
            </div>

            {/* Output Section */}
            <div className="border-none shadow-lg bg-white/80 backdrop-blur-sm p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 first-line: font-semibold text-base">
                        <Send className="w-5 h-5 text-[#ff5c35]" />
                        Generated Connection Request
                    </div>
                    {generatedRequest && (
                        <div className="flex items-center gap-2">
                            <button onClick={generateConnectionRequest} className="p-2 rounded hover:bg-[#f1f5f9]">
                                <RefreshCw className="w-4 h-4" />
                            </button>
                            <button onClick={copyToClipboard} className="p-2 rounded hover:bg-[#f1f5f9]">
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {generatedRequest ? (
                    <div className="space-y-4">
                        {/* Connection Request Preview */}
                        <div className="p-4 border border-[#e2e8f0] rounded-lg bg-slate-50">
                            <div className="flex items-start gap-3 mb-3">
                                <div className="w-8 h-8 bg-[#bfdbfe] rounded-full flex items-center justify-center">
                                    <Send className="w-4 h-4 text-blue-600" />
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
                                    {generatedRequest}
                                </div>
                            </div>
                        </div>


                        {/* Stats */}
                        <div className="flex items-center justify-between text-xs text-[#64748b]">
                            <span>{generatedRequest.length}/300 characters</span>
                            <span className={generatedRequest.length > 300 ? "text-red-500 font-medium" : "text-green-600"}>
                                {generatedRequest.length <= 300 ? "✓ Within limit" : "⚠ Too long"}
                            </span>
                        </div>

                        {/* Warning */}
                        {generatedRequest.length > 280 && (
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                                ⚠ Approaching LinkedIn's 300-character limit. Consider shortening.
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button onClick={copyToClipboard} className="flex-1 flex items-center justify-center gap-2 text-sm font-medium rounded-lg border border-[#ff5c35] text-white bg-[#ff5c35] hover:text-[#ff5c35] hover:bg-white transition">
                                <Copy className="w-4 h-4" />
                                Copy Request
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700">
                                <Users className="w-4 h-4" />
                                Open Profile
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-[#ff5c350f] rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-[#ff5c35]" />
                        </div>
                        <p className="text-[#64748b] font-medium !text-xl mb-2">
                            No connection request generated yet
                        </p>
                        <div className="!text-base text-[#94a3b8]">
                            Fill in the profile details to generate a request
                        </div>
                    </div>


                )}
            </div>
        </div>
    );
}

export default Connectionrequest;
