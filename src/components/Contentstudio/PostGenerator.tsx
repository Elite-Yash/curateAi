import { useState } from "react";
import {
  FileText,
  RefreshCw,
  Copy,
  Send,
  Sparkles,
  Wand2,
} from "lucide-react";

const PostGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [postType, setPostType] = useState("Industry Insight");
  const [selectedPersona, setSelectedPersona] = useState("Professional");
  const [generatedPost, setGeneratedPost] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Dummy API call simulation
  const generatePost = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGeneratedPost("");

    // Simulate API delay
    setTimeout(() => {
      const fakePost = `🚀 ${postType} in a ${selectedPersona} tone:\n\n${prompt}\n\n#AI #LinkedIn #Growth`;
      setGeneratedPost(fakePost);
      setIsGenerating(false);
    }, 2000);
  };

  const regeneratePost = () => {
    generatePost();
  };

  const copyToClipboard = () => {
    if (generatedPost) {
      navigator.clipboard.writeText(generatedPost);
      alert(" Post copied to clipboard!");
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Input Section */}
      <div className="border-none shadow-lg bg-white/80 backdrop-blur-sm rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-2 font-semibold text-base">
          <Wand2 className="w-5 h-5 text-blue-600" />
          Generate LinkedIn Post
        </div>

        {/* Post Topic */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#334155]">
            What do you want to post about?
          </label>
          <textarea
            placeholder="e.g., Share insights about remote work trends, celebrate a team achievement, ask for career advice..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full min-h-24 resize-none border border-[#cbd5e1] rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Post Type */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#334155]">
            Post Type
          </label>
          <select
            value={postType}
            onChange={(e) => setPostType(e.target.value)}
            className="w-full border border-[#cbd5e1] rounded-lg p-2 text-sm"
          >
            <option>Industry Insight</option>
            <option>Personal Story</option>
            <option>Team Update</option>
            <option>Career Advice</option>
          </select>
        </div>

        {/* Persona Selection */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#334155]">
            Writing Style
          </label>
          <select
            value={selectedPersona}
            onChange={(e) => setSelectedPersona(e.target.value)}
            className="w-full border border-[#cbd5e1] rounded-lg p-2 text-sm"
          >
            <option value="Professional">Professional</option>
            <option value="Casual & Friendly">Casual & Friendly</option>
            <option value="Expert/Authoritative">Expert/Authoritative</option>
          </select>
        </div>

        {/* Generate Button */}
        <button
          onClick={generatePost}
          disabled={!prompt.trim() || isGenerating}
          className="w-full flex items-center justify-center gap-2  bg-[#2563eb] text-white font-medium py-2 px-4 rounded-lg transition"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Post
            </>
          )}
        </button>

        {/* Quick Tips */}
        <div className="p-4 bg-[#eff6ff] rounded-lg">
          <h4 className="font-semibold text-[#1e3a8a] mb-2">
            💡 Tips for better posts:
          </h4>
          <ul className="text-sm text-[#1e40af] space-y-1">
            <li>• Be specific about your topic</li>
            <li>• Include personal experiences</li>
            <li>• Ask questions to encourage engagement</li>
            <li>• Post when your audience is active</li>
          </ul>
        </div>
      </div>

      {/* Output Section */}
      <div className="border-none shadow-lg bg-white/80 backdrop-blur-sm rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 first-line: font-semibold text-base">
            <FileText className="w-5 h-5 text-[#16a34a]" />
            Generated Post
          </div>
          {generatedPost && (
            <div className="flex items-center gap-2">
              <button
                onClick={regeneratePost}
                className="p-2 rounded-lg hover:bg-[#f1f5f9]"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={copyToClipboard}
                className="p-2 rounded-lg hover:bg-[#f1f5f9]"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {generatedPost ? (
          <div className="space-y-4">
            {/* Post Preview */}
            <div className="p-4 border border-[#e2e8f0] rounded-lg bg-[#f8fafc] whitespace-pre-wrap text-sm text-[#1e293b]">
              {generatedPost}
            </div>

            {/* Post Stats */}
            <div className="flex items-center justify-between text-xs text-[##64748b]">
              <div className="flex items-center gap-4">
                <span>{generatedPost.length} characters</span>
                <span>{generatedPost.split("\n").length} lines</span>
                <span>
                  {(generatedPost.match(/#\w+/g) || []).length} hashtags
                </span>
              </div>
              <span className="px-2 py-1 border border-green-200 text-green-600 rounded-lg">
                Ready to post
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={copyToClipboard}
                className="flex-1 flex items-center justify-center gap-2 border border-[#cbd5e1] rounded-lg py-2 hover:bg-[#f8fafc]"
              >
                <Copy className="w-4 h-4" />
                Copy Post
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2">
                <Send className="w-4 h-4" />
                Open LinkedIn
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[#f1f5f9] rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-[#94a3b8]" />
            </div>
            <p className="text-[#64748b] font-medium mb-2">
              No post generated yet
            </p>
            <div className="text-sm text-[#94a3b8]">
              Fill out the form and click "Generate Post" to get started
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostGenerator;
