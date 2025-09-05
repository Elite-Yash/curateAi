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

    const generateConnectionRequest = async () => {
        if (!profileName.trim()) return;

        setIsGenerating(true);
        try {
            const systemPrompt = `You are a LinkedIn networking expert. Generate a personalized connection request message.
                                Target Profile:
                                - Name: ${profileName}
                                - Title: ${profileTitle || "Not specified"}
                                - Company: ${company || "Not specified"}
                                - Connection Reason: ${connectionReason}
                                - Additional Notes: ${personalNote || "None"}

                                Guidelines:
                                - Keep it under 300 characters (LinkedIn limit)
                                - Be personal and specific
                                - Mention something relevant about their background
                                - Clearly state why you want to connect
                                - Be professional but warm
                                - Avoid generic templates

                                Generate only the connection request message, no quotes or explanations.`;

            const result = "Hey " + profileName + ", I'd love to connect with you!";

            const truncatedResult = result.length > 300 ? result.substring(0, 297) + "..." : result;
            setGeneratedRequest(truncatedResult);

        } catch (error) {
            console.error("Error generating connection request:", error);
        } finally {
            setIsGenerating(false);
        }
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
                    <Users className="w-5 h-5 text-blue-600" />
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
                                className="w-full border border-[#cbd5e1] rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0080cc] focus:border-[#0080cc]"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#334155]">Job Title</label>
                            <input
                                placeholder="e.g., Senior Marketing Director"
                                value={profileTitle}
                                onChange={(e) => setProfileTitle(e.target.value)}
                                className="w-full border border-[#cbd5e1] rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0080cc] focus:border-[#0080cc]"
                            />  
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#334155]">Company</label>   
                            <input
                                placeholder="e.g., Microsoft"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                className="w-full border border-[#cbd5e1] rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0080cc] focus:border-[#0080cc]"
                            />
                        </div>
                    </div>

                    {/* Connection Reason */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[#334155]">Connection Reason</label>
                        <select
                            value={connectionReason}
                            onChange={(e) => setConnectionReason(e.target.value)}
                            className="w-full border border-[#cbd5e1] rounded-lg p-2 text-sm"
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
                        <textarea
                            placeholder="Any specific details about why you want to connect..."
                            value={personalNote}
                            onChange={(e) => setPersonalNote(e.target.value)}
                            className="w-full min-h-20 resize-none border border-[#cbd5e1] rounded-lg p-2 text-sm"
                        />
                    </div>

                    {/* Generate Button */}
                    <button
                        onClick={generateConnectionRequest}
                        disabled={!profileName.trim() || isGenerating}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isGenerating ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                Generating Request...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                Generate Connection Request
                            </>
                        )}
                    </button>

                    {/* Quick Tips */}
                    <div className="p-4 bg-[#eff6ff] rounded-lg">
                        <div className="font-semibold text-base text-[#1e3a8a] mb-2">
                            🤝 Connection Best Practices:
                        </div>
                        <ul className="text-sm text-[#1e40af] space-y-1">
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
                        <Send className="w-5 h-5 text-blue-600" />
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
                        <div className="p-4 border border-[#e2e8f0] rounded-lg bg-[#f8fafc]">
                            <p className="text-sm text-[#1e293b]">{generatedRequest}</p>
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
                            <button onClick={copyToClipboard} className="flex-1 flex items-center justify-center gap-2 text-sm font-medium rounded-lg border border-[#2563eb] text-[#2563eb] hover:bg-[#2563eb] hover:text-white transition">
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
                        <div className="w-16 h-16 bg-[#f1f5f9] rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-[#94a3b8]" />
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
