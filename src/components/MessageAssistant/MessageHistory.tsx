import { History, MessageSquare, Users } from "lucide-react";
import { FiTrendingUp } from "react-icons/fi";
import { CiCalendar } from "react-icons/ci";
import { useCallback, useEffect, useState } from "react";
import { apiService } from "../../common/config/apiService";
import { getImage } from "../../common/utils/logoUtils";
import { IoLogoLinkedin } from "react-icons/io5";
import Loader from "../Loader/Loader";

const MessageHistory = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [commentsData, setCommentsData] = useState<any[]>([]);
  const [filteredContent, setFilteredContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState<any | null>(null);

  // Stats
  const [repliesGenerated, setRepliesGenerated] = useState(0);
  const [actuallyUsed, setActuallyUsed] = useState(0);
  const [perWeekAvg, setPerWeekAvg] = useState(0);

  // Count stats
  useEffect(() => {
    const replies = commentsData.filter(
      (c) => c.comment_type === "comment-reply"
    ).length;
    setRepliesGenerated(replies);
    setActuallyUsed(replies);

    if (commentsData.length > 0) {
      const sorted = [...commentsData].sort(
        (a, b) =>
          new Date(a.created_at).getTime() -
          new Date(b.created_at).getTime()
      );
      const firstDate = new Date(sorted[0].created_at);
      const lastDate = new Date(
        sorted[sorted.length - 1].created_at
      );
      const weeks = Math.max(
        1,
        Math.ceil(
          (lastDate.getTime() - firstDate.getTime()) /
          (1000 * 60 * 60 * 24 * 7)
        )
      );
      setPerWeekAvg(Math.round(replies / weeks));
    } else {
      setPerWeekAvg(0);
    }
  }, [commentsData]);

  // Helpers
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
    return d.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // API
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
          const arr = Array.isArray(result?.data?.data)
            ? result.data.data
            : [];
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

  // Filter
  useEffect(() => {
    const filtered = commentsData.filter((item) => {
      const type = String(item?.comment_type ?? "").toLowerCase();
      if (activeFilter === "all") return type === "comment-reply";
      if (activeFilter === "reply") return type === "comment-reply";
      return true;
    });
    setFilteredContent(filtered);
  }, [commentsData, activeFilter]);

  const closeModal = () => setModalData(null);

  return (
    <>
      {/* Stat Boxes */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        {/* Replies */}
        <div className="p-4 bg-white rounded-xl g-box shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#ff5c350f]">
            <MessageSquare className="text-[#ff5c35]" />
          </div>
          <div>
            <div className="text-xl font-bold text-[#0f172a]">
              {repliesGenerated}
            </div>
            <div className="text-sm text-gray-600">Message Replies</div>
          </div>
        </div>

        {/* Placeholder (Connection Requests if needed) */}
        <div className="p-4 bg-white rounded-xl g-box shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#ff5c350f]">
            <Users className="text-[#ff5c35]" />
          </div>
          <div>
            <div className="text-xl font-bold text-[#0f172a]">0</div>
            <div className="text-sm text-gray-600">Connection Requests</div>
          </div>
        </div>

        {/* Actually Sent */}
        <div className="p-4 bg-white rounded-xl g-box shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#ff5c350f]">
            <FiTrendingUp className="text-[#ff5c35] text-xl" />
          </div>
          <div>
            <div className="text-xl font-bold text-[#0f172a]">
              {actuallyUsed}
            </div>
            <div className="text-sm text-gray-600">Actually Sent</div>
          </div>
        </div>

        {/* Per Week Avg */}
        <div className="p-4 bg-white rounded-xl g-box shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#ff5c350f]">
            <CiCalendar className="text-[#ff5c35] text-xl" />
          </div>
          <div>
            <div className="text-xl font-bold text-[#0f172a]">
              {perWeekAvg}
            </div>
            <div className="text-sm text-gray-600">Per Week Avg</div>
          </div>
        </div>
      </div>

      {/* Generated Content */}
      <div className="bg-white rounded-xl g-box">
        {/* Header with Tabs */}
        <div className="flex items-center justify-between p-5">
          <div className="flex items-center gap-2 font-semibold text-base">
            <History className="w-5 h-5 text-[#ff5c35]" /> Generated Content
          </div>

          <div className="flex items-center bg-[#ff5c350f] rounded-lg text-sm text-[#737373] font-medium overflow-hidden p-[5px]">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-1 ${activeFilter === "all"
                ? "bg-[#ff5c35] text-[#fff] rounded-lg"
                : ""
                }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter("reply")}
              className={`px-4 py-1 ${activeFilter === "reply"
                ? "bg-[#ff5c35] text-[#fff] rounded-lg"
                : ""
                }`}
            >
              Replies
            </button>
          </div>
        </div>


        <div className="p-2.5 pt-0">
          <div className="border rounded-lg border-[#e0eaf3]">
            {/* Table Header */}
            <div
              className="grid gap-4 py-2 font-semibold bg-[#fff5f380]  border-b border-[#e1eaf4] rounded-t-lg p-4"
              style={{
                gridTemplateColumns: "140px 1fr 300px 120px",
              }}
            >
              <div className="text-[14px]">Message Type</div>
              <div className="text-[14px]">comment Reply</div>
              <div className="text-[14px]">Post URL</div>
              <div className="text-[14px]">Date</div>
            </div>

            {/* Rows */}
            {loading ? (
              <div className="text-center py-12"><Loader />.</div>
            ) : filteredContent.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[#ff5c350f] rounded-full flex items-center justify-center mx-auto mb-4">
                  <History className="w-8 h-8 text-[#ff5c35]" />
                </div>
                <p className="text-[#64748b] font-medium !text-xl mb-2">
                  No content history yet
                </p>
              </div>

            ) : (
              <div className="!border-[#e0eaf3] border-b h-125 overflow-auto">
                {filteredContent.slice().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((c: any) => (
                  <div
                    key={c.id}
                    className="py-4 px-4 odd:bg-[#fff] even:bg-[#fff5f380]"
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "140px 1fr 300px 120px",
                      gap: "1rem",
                      alignItems: "start",
                    }}
                  >
                    {/* Message Type */}
                    <div className="text-sm text-gray-700 capitalize">
                      {String(c.comment_type ?? "N/A").replace(/-/g, " ")}
                    </div>

                    {/* Reply */}
                    <div className="text-sm text-gray-800">
                      <div dangerouslySetInnerHTML={{ __html: escapeHtml(truncate(c.comment, 90)).replace(/\n/g, "<br />") }} />
                      {c.comment && c.comment.length > 90 && (
                        <button onClick={() => setModalData(c)} className="mt-2 inline-block text-sm text-[#ff5c35] hover:underline">
                          Read More
                        </button>
                      )}
                    </div>

                    {/* Post URL */}
                    <div>
                      <div className="flex items-center gap-2">
                        {c.post_url ? (
                          <a
                            href={c.post_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <button className="text-[#ff5c35] border border-[#ff5c35] ps-1 pe-1 rounded-[5px] items-center text-sm gap-1 flex">
                              Go To LinkedIn
                              <IoLogoLinkedin className="text-xl text-[#0a66c2]" />
                            </button>
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </div>
                    </div>

                    {/* Date */}
                    <div className="text-sm text-gray-600">
                      {formatDate(c.created_at)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Modal */}
      {modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 !m-0">
          <div className="bg-white rounded-lg max-w-full shadow-lg overflow-auto w-[1000px] max-h-[85vh] max-[1050px]:w-[95%]">
            {/* Header */}
            <div className="sticky top-0 bg-white header-top p-6 py-2 flex justify-between items-center border-b">
              <span className="relative s-logo border-[2.5px] border-solid rounded-full border-[#ff5c35] w-12 h-12 flex items-center justify-center overflow-hidden">
                {getImage("fLogo") ? (
                  <img
                    src={getImage("fLogo")}
                    alt="img"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[#ff5c35] font-bold text-lg">
                    R
                  </span>
                )}
              </span>
              <h4 className="popup-title font-semibold text-xl leading-10 text-gray-800">
                Entire Reply
              </h4>
              <span
                onClick={closeModal}
                role="button"
                aria-label="Close modal"
                className="close-box w-8 h-8 flex items-center justify-center cursor-pointer rounded-full hover:bg-gray-200"
              >
                {getImage("close") ? (
                  <img
                    src={getImage("close")}
                    alt="close"
                    className="w-6 h-6"
                  />
                ) : (
                  <button
                    onClick={closeModal}
                    aria-label="close"
                    className="text-gray-600 hover:text-gray-900 text-lg"
                  >
                    ✕
                  </button>
                )}
              </span>
            </div>

            {/* Body */}
            <div className="p-6">
              <p
                className="text-gray-700 whitespace-pre-line leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: escapeHtml(
                    String(modalData.comment ?? "")
                  ).replace(/\n/g, "<br />"),
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageHistory;
