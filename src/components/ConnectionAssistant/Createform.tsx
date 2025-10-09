import { Sparkles } from 'lucide-react';
import React, { useState } from 'react';

const Createform = () => {
    const [isMessageActive, setIsMessageActive] = useState(false);
    return (
        <>
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="border-none g-box bg-white/80 backdrop-blur-sm rounded-xl p-6 space-y-6">
                    <div className="relative">
                        <label
                            htmlFor="url"
                            className="block text-sm font-medium ms-1"
                        >
                            LinkedIn Search URL
                        </label>
                        <input
                            type="url"
                            id="url"
                            placeholder="https://www.linkedin.com/search"
                            className="block w-full rounded-md border-[#d1d5db] shadow-sm focus:ring-[#ff5c35] focus:border-[#ff5c35] p-2"
                        />
                    </div>

                    {/* Prompt Topic */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold ms-1">
                            AI Message Preview
                        </label>
                        <div className={`rounded-lg overflow-hidden border ${isMessageActive ? "active" : "border-[#e2e8f0]"
                            } custom_textarea relative !mt-0`}>
                            <textarea
                                onFocus={() => setIsMessageActive(true)}
                                onBlur={() => setIsMessageActive(false)}
                                placeholder="e.g., Share insights about remote work trends, celebrate a team achievement..."
                                className="w-full min-h-24 p-2 outline-none text-sm resize-none focus:ring-0 border-0 h-[211px]"
                            />
                        </div>
                    </div>
                    {/*  Button */}
                    <button
                        className="w-full flex items-center justify-center gap-2 bg-[#ff5c35] text-white font-medium py-2 px-4 rounded-lg transition">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm">Send</span>
                    </button>

                </div>

                <div className="border-none g-box  bg-white/80 backdrop-blur-sm rounded-xl p-6">
                    {/* Quick Tips */}
                    <div className="p-4 bg-[#ff5c350f] rounded-lg">
                        <div className="font-semibold text-base mb-2">
                            💡 Pro Tip for Sending Connection Requests:
                        </div>
                        <ul className="text-sm space-y-1">
                            <li>• Keep your message short (2–3 sentences max)</li>
                            <li>• Mention something specific from their profile (role, company, or achievement)</li>
                            <li>• Avoid generic phrases like “Let’s connect”</li>
                            <li>• Add a friendly closing (e.g., “Looking forward to learning from your posts”)</li>
                            <li>• Personalization increases acceptance rates by 3x 🚀</li>
                        </ul>
                    </div>

                </div>
            </div>
        </>
    );
};

export default Createform;
