import React, { useCallback, useEffect, useState } from "react";
import { FileText, History, MessageSquare } from "lucide-react";
import { FiTrendingUp } from "react-icons/fi";
import { IoLogoLinkedin } from "react-icons/io";
import { apiService } from "../../common/config/apiService";
import { getImage } from "../../common/utils/logoUtils";
import { CiCalendar } from "react-icons/ci";

const ContentHistory: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<"all" | "post" | "comment">("all");
  const [commentsData, setCommentsData] = useState<any[]>([]);
  const [filteredContent, setFilteredContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState<any | null>(null);
  const [postsGenerated, setPostsGenerated] = useState(0);
  const [commentsGenerated, setCommentsGenerated] = useState(0);
  const [actuallyUsed, setActuallyUsed] = useState(0); // you can define your own logic
  const [perWeekAvg, setPerWeekAvg] = useState(0);

  useEffect(() => {
    // Count posts and comments
    const posts = commentsData.filter((c) => c.comment_type === "create-post").length;
    const comments = commentsData.filter((c) => c.comment_type === "comment").length;
    setPostsGenerated(posts);
    setCommentsGenerated(comments);

    // Actually Used example: total of posts + comments (or your own logic)
    setActuallyUsed(posts + comments);

    // Per Week Avg example: divide by number of weeks since first entry
    if (commentsData.length > 0) {
      const sorted = [...commentsData].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      const firstDate = new Date(sorted[0].created_at);
      const lastDate = new Date(sorted[sorted.length - 1].created_at);
      const weeks = Math.max(1, Math.ceil((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24 * 7)));
      setPerWeekAvg(Math.round((posts + comments) / weeks));
    } else {
      setPerWeekAvg(0);
    }
  }, [commentsData]);

  const escapeHtml = (text?: string) => {
    if (!text) return "";
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  };

  const truncate = (text?: string, len = 90) => {
    if (!text) return "N/A";
    if (text.length <= len) return text;
    return text.slice(0, len) + "...";
  };

  const formatDate = (iso?: string) => {
    if (!iso) return "N/A";
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
  };

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const requestUrl = apiService?.EndPoint?.getComments;
      await apiService.commonAPIRequest(
        requestUrl,
        apiService.Method.get,
        undefined,
        {},
        (result: any) => {
          const arr = Array.isArray(result?.data?.data) ? result.data.data : [];
          setCommentsData(arr);
        }
      );
    } catch (err) {
      console.error("Error fetching comments:", err);
      setCommentsData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  useEffect(() => {
    const filtered = commentsData.filter((item) => {
      const type = String(item?.comment_type ?? "").toLowerCase();
      if (activeFilter === "all") return type === "create-post" || type === "comment";
      if (activeFilter === "post") return type === "create-post";
      if (activeFilter === "comment") return type === "comment";
      return true;
    });
    setFilteredContent(filtered);
  }, [commentsData, activeFilter]);

  const closeModal = () => setModalData(null);

  return (
    <>
      {/* Stat Boxes */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {/* Box 1 */}
        <div className="p-4 bg-white rounded-xl border border-[#e3e9f1] shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#bfdbfe]">
            <FileText className="text-[#2563eb]" />
          </div>
          <div>
            <div className="text-xl font-bold text-[#0f172a]">{postsGenerated}</div>
            <div className="text-sm text-gray-600">Posts Generated</div>
          </div>
        </div>

        {/* Box 2 */}
        <div className="p-4 bg-white rounded-xl border border-[#e3e9f1] shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#dcfce7]">
            <MessageSquare className="text-green-600" />
          </div>
          <div>
            <div className="text-xl font-bold text-[#0f172a]">{commentsGenerated}</div>
            <div className="text-sm text-gray-600">Comments Generated</div>
          </div>
        </div>

        {/* Box 3 */}
        <div className="p-4 bg-white rounded-xl border border-[#e3e9f1] shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#fefce8]">
            <FiTrendingUp className="text-yellow-400 text-xl" />
          </div>
          <div>
            <div className="text-xl font-bold text-[#0f172a]">{actuallyUsed}</div>
            <div className="text-sm text-gray-600">Actually Used</div>
          </div>
        </div>

        {/* Box 4 */}
        <div className="p-4 bg-white rounded-xl border border-[#e3e9f1] shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#eee7f5]">
            <CiCalendar className="text-[#9333ea] text-xl" />
          </div>
          <div>
            <div className="text-xl font-bold text-[#0f172a]">{perWeekAvg}</div>
            <div className="text-sm text-gray-600">Per Week Avg</div>
          </div>
        </div>
      </div>

      {/* Generated Content */}
      <div className="bg-white rounded-xl border border-[#e3e9f1] shadow-sm p-6">
        {/* Header with Tabs */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 font-semibold text-base">
            <History className="w-5 h-5 text-[#475569]" />
            Generated Content
          </div>
          <div className="flex items-center bg-[#f1f5f9] rounded-lg text-sm text-[#737373] font-medium overflow-hidden !p-[5px]">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-1 ${activeFilter === "all" ? "bg-white shadow-sm rounded-lg" : ""}`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter("post")}
              className={`px-4 py-1 ${activeFilter === "post" ? "bg-white shadow-sm rounded-lg" : ""}`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveFilter("comment")}
              className={`px-4 py-1 ${activeFilter === "comment" ? "bg-white shadow-sm rounded-lg" : ""}`}
            >
              Comments
            </button>
          </div>
        </div>

        {/* Table Header */}
        <div
          className="grid gap-4 py-2 px-4 font-semibold bg-gray-100 rounded-t-lg"
          style={{ gridTemplateColumns: "140px 1fr 300px 120px" }}
        >
          <div className="text-[14px]">Message Type</div>
          <div className="text-[14px]">Message</div>
          <div className="text-[14px]">Post URL</div>
          <div className="text-[14px]">Date</div>
        </div>

        {/* Rows */}
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : filteredContent.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#64748b] font-medium !text-xl mb-2">No content history yet</p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredContent.map((c: any) => (
              <div
                key={c.id}
                className="py-4 px-4"
                style={{ display: "grid", gridTemplateColumns: "140px 1fr 300px 120px", gap: "1rem", alignItems: "start" }}
              >
                {/* Message Type */}
                <div className="text-sm text-gray-700 capitalize">{String(c.comment_type ?? "N/A").replace(/-/g, " ")}</div>

                {/* Message */}
                <div className="text-sm text-gray-800">
                  <div dangerouslySetInnerHTML={{ __html: escapeHtml(truncate(c.comment, 90)).replace(/\n/g, "<br />") }} />
                  {c.comment && c.comment.length > 90 && (
                    <button onClick={() => setModalData(c)} className="mt-2 inline-block text-sm text-[#2563eb] hover:underline">
                      Read More
                    </button>
                  )}
                </div>

                {/* Post URL */}
                <div>
                  <div className="flex items-center gap-2">
                    {c.post_url ? (
                      <a href={c.post_url} target="_blank" rel="noopener noreferrer">
                        <button className="text-[#2563eb] hover:text-[#003ab6] border border-[#2563eb] gap-2 ps-1 pe-1 rounded-sm flex">
                          Go To LinkedIn
                          <IoLogoLinkedin className="text-xl text-[#2563eb] mt-0.5" />
                        </button>
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </div>
                </div>

                {/* Date */}
                <div className="text-sm text-gray-600">{formatDate(c.created_at)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg max-w-full shadow-lg overflow-auto w-[1000px] max-h-[85vh] max-[1050px]:w-[95%]">
            <div className="sticky top-0 bg-white header-top p-9 py-2 flex justify-between item-center">
              <span className="relative s-logo border-[2.5px] border-solid rounded-full border-[#2563eb] w-12">
                {getImage("fLogo") ? <img src={getImage("fLogo")} alt="img" /> : null}
              </span>
              <h4 className="popup-title font-semibold text-xl leading-10">Entire Comment</h4>
              <span onClick={closeModal} role="button" aria-label="Close modal" className="close-box w-6 h-6 bg-no-repeat bg-center cursor-pointer">
                {getImage("close") ? (
                  <img src={getImage("close")} alt="img" className="w-8 h-8 rounded-full m-2.5" />
                ) : (
                  <button onClick={closeModal} aria-label="close" className="text-gray-600 hover:text-gray-900">✕</button>
                )}
              </span>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mt-2.5" dangerouslySetInnerHTML={{ __html: escapeHtml(String(modalData.comment ?? "")).replace(/\n/g, "<br />") }} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContentHistory;
