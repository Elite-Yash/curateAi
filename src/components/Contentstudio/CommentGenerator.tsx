import { useState } from "react";
import {
  MessageCircle,
  Copy,
  RefreshCw,
  Sparkles,
  User,
  Link as LinkIcon,
  ThumbsUp,
} from "lucide-react";

const CommentGenerator = () => {
  const [postContext, setPostContext] = useState("");
  const [commentType, setCommentType] = useState("supportive");
  const [generatedComment, setGeneratedComment] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const commentTypes = [
    { value: "supportive", label: "Supportive & Encouraging" },
    { value: "insightful", label: "Add Insight/Perspective" },
    { value: "question", label: "Ask Follow-up Question" },
    { value: "sharing", label: "Share Experience" },
    { value: "congratulatory", label: "Congratulate/Celebrate" },
  ];

  // Fake API generator
  const generateComment = async () => {
    if (!postContext.trim()) return;
    setIsGenerating(true);
    setGeneratedComment("");

    setTimeout(() => {
      const fakeComment = `✨ (${
        commentTypes.find((c) => c.value === commentType)?.label
      }) \nReally thoughtful post! I appreciate your perspective on this. What do you think about its impact in the next few years? 🚀`;
      setGeneratedComment(fakeComment);
      setIsGenerating(false);
    }, 2000);
  };

  const copyToClipboard = () => {
    if (generatedComment) {
      navigator.clipboard.writeText(generatedComment);
      alert(" Comment copied!");
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Input Section */}
      <div className="shadow-lg bg-white rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-2 font-semibold text-base">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          Generate LinkedIn Comment
        </div>

        {/* Post Context */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#334155]">
            Original Post Content
          </label>
          <textarea
            placeholder="Paste the LinkedIn post you want to comment on..."
            value={postContext}
            onChange={(e) => setPostContext(e.target.value)}
            className="w-full min-h-32 resize-none border border-[#cbd5e1] rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
          <div className="text-sm text-[#8c97a9] mt-0">
            💡 Include the full message for better context understanding
          </div>
        </div>

        {/* Comment Type */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#334155]">
            Comment Style
          </label>
          <select
            value={commentType}
            onChange={(e) => setCommentType(e.target.value)}
            className="w-full border border-[#cbd5e1] rounded-xl p-2 text-sm"
          >
            {commentTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          <div className="flex flex-wrap gap-2">
            {commentTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setCommentType(type.value)}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition ${
                  commentType === type.value
                    ? "bg-[#2563eb] text-white"
                    : "bg-[#f1f5f9] text-[#334155] hover:bg-[#e2e8f0]"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateComment}
          disabled={!postContext.trim() || isGenerating}
          className="w-full flex items-center justify-center gap-2  bg-[#2563eb] text-white font-medium py-2 px-4 rounded-lg transition"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Generating Comment...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Comment
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

      {/* Output Section */}
      <div className="shadow-lg bg-white rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 first-line: font-semibold text-base">
            <MessageCircle className="w-5 h-5 text-green-600 text-[#16a34a]" />
            Generated Comment
          </div>
          {generatedComment && (
            <div className="flex items-center gap-2">
              <button
                onClick={generateComment}
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

        {generatedComment ? (
          <div className="space-y-4">
            {/* Comment Preview */}
            <div className="p-4 border border-[#e2e8f0] rounded-lg bg-[#f8fafc]">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="font-medium text-sm">You</span>
                    <span className="text-xs text-[#f8fafc]0">• now</span>
                  </div>
                  <div className="py-2 rounded-lg bg-[#f8fafc] whitespace-pre-wrap text-sm text-[#1e293b]">
                    {generatedComment}
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-[#f8fafc]0">
                    <button className="flex items-center gap-1 hover:text-[#2563eb]">
                      <ThumbsUp className="w-3 h-3" />
                      Like
                    </button>
                    <button className="flex items-center gap-1 hover:text-[#2563eb]">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <span>{generatedComment.length} characters</span>
                <span>{generatedComment.split(" ").length} words</span>
              </div>
              <span className="px-2 py-1 border border-[#2563eb] text-[#2563eb] hover:bg-[#2563eb] hover:text-white transition rounded-lg cursor-pointer">
                Ready to comment
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={copyToClipboard}
                className="flex-1 flex items-center justify-center gap-2 border text-sm font-medium rounded-lg border-[#2563eb] text-[#2563eb] hover:bg-[#2563eb] hover:text-white transition"
              >
                <Copy className="w-4 h-4" />
                Copy Comment
              </button>
              <button className="flex-1 flex items-center justify-center rounded-lg gap-2 bg-[#2563eb] text-white py-2">
                <LinkIcon className="w-4 h-4" />
                Go to Post
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[#f1f5f9] rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-[#94a3b8]" />
            </div>
            <p className="text-[#64748b] font-medium !text-xl mb-2">
              No comment generated yet
            </p>
            <p className="!text-base text-[#94a3b8]">
              Paste a LinkedIn post and choose a comment style to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentGenerator;
