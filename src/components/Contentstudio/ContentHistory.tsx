import React, { useCallback, useEffect, useState } from "react";
import { FileText, History, MessageSquare } from "lucide-react";
import { FiTrendingUp } from "react-icons/fi";
import { apiService } from "../../common/config/apiService";
import { getImage } from "../../common/utils/logoUtils";
import { CiCalendar } from "react-icons/ci";
import Loader from "../Loader/Loader";
import Swal from "sweetalert2";

const ContentHistory: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<"all" | "post" | "comment">("all");
  const [commentsData, setCommentsData] = useState<any[]>([]);
  const [filteredContent, setFilteredContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState<any | null>(null);
  const [postsGenerated, setPostsGenerated] = useState(0);
  const [commentsGenerated, setCommentsGenerated] = useState(0);
  const [actuallyUsed, setActuallyUsed] = useState(0);
  const [perWeekAvg, setPerWeekAvg] = useState(0);

  useEffect(() => {
    // Count posts and comments
    const posts = commentsData.filter((c) => c.comment_type === "create-post").length;
    setPostsGenerated(posts);

    // Actually Used example: total of posts + comments (or your own logic)
    setActuallyUsed(posts);

    // Per Week Avg example: divide by number of weeks since first entry
    if (commentsData.length > 0) {
      const sorted = [...commentsData].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      const firstDate = new Date(sorted[0].created_at);
      const lastDate = new Date(sorted[sorted.length - 1].created_at);
      const weeks = Math.max(1, Math.ceil((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24 * 7)));
      setPerWeekAvg(Math.round((posts) / weeks));
    } else {
      setPerWeekAvg(0);
    }
  },
    [commentsData]);

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
      if (activeFilter === "all") return type === "create-post";
      if (activeFilter === "post") return type === "create-post";
      return true;
    });
    setFilteredContent(filtered);
  }, [commentsData, activeFilter]);


  const deleteComment = async (commentId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff5c35",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        if (!chrome?.runtime?.sendMessage) {
          throw new Error("Chrome API is not available.");
        }

        const deleteUrl = apiService.EndPoint.deleteComments.replace(
          ":id",
          commentId
        );

        await apiService.commonAPIRequest(
          deleteUrl,
          apiService.Method.delete,
          undefined, // No query parameters
          {}, // No request body
          (result: any) => {
            if (
              result?.status === 200 &&
              result?.data.message === "Comment deleted successfully"
            ) {
              fetchComments();
              // Show success message
              Swal.fire({
                title: "Deleted!",
                text: "Your comment has been deleted.",
                icon: "success",
                confirmButtonColor: "#ff5c35",
              });
            } else {
              throw new Error(result?.message || "Failed to delete comment.");
            }
          }
        );
      } catch (err) {
        console.error("Error deleting comment:", err);
        Swal.fire({
          title: "Error!",
          text: "Something went wrong while deleting the comment.",
          icon: "error",
          confirmButtonColor: "#ff5c35",
        });
      }
    }
  };


  const closeModal = () => setModalData(null);

  return (
    <>
      {/* Stat Boxes */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        {/* Box 1 */}
        <div className="p-4 bg-white rounded-xl g-box shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#ff5c350f]">
            <FileText className="text-[#ff5c35]" />
          </div>
          <div>
            <div className="text-xl font-bold text-[#0f172a]">{postsGenerated}</div>
            <div className="text-sm text-gray-600">Posts Generated</div>
          </div>
        </div>

        {/* Box 2 */}
        <div className="p-4 bg-white rounded-xl g-box shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#ff5c350f]">
            <MessageSquare className="text-[#ff5c35]" />
          </div>
          <div>
            <div className="text-xl font-bold text-[#0f172a]">{commentsGenerated}</div>
            <div className="text-sm text-gray-600">Posts Published</div>
          </div>
        </div>

        {/* Box 3 */}
        <div className="p-4 bg-white rounded-xl g-box shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#ff5c350f]">
            <CiCalendar className="text-[#ff5c35] text-xl" />
          </div>
          <div>
            <div className="text-xl font-bold text-[#0f172a]">{perWeekAvg}</div>
            <div className="text-sm text-gray-600">Avg. Posts Per Week</div>
          </div>
        </div>

        {/* Box 4 */}
        <div className="p-4 bg-white rounded-xl g-box shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#ff5c350f]">
            <FiTrendingUp className="text-[#ff5c35] text-xl" />
          </div>
          <div>
            <div className="text-xl font-bold text-[#0f172a]">0</div>
            <div className="text-sm text-gray-600">Most Used Tone</div>
          </div>
        </div>


      </div>

      {/* Generated Content */}
      <div className="bg-white rounded-xl g-box">
        {/* Header with Tabs */}
        <div className="flex items-center justify-between p-5">
          <div className="flex items-center gap-2 font-semibold text-base">
            <History className="w-5 h-5 text-[#ff5c35]" />
            Generated Posts
          </div>
          {/* <div className="flex items-center bg-[#ff5c350f] rounded-lg text-sm text-[#737373] font-medium overflow-hidden !p-[5px]">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-1 ${activeFilter === "all" ? "bg-[#ff5c35] text-[#fff] rounded-lg" : ""}`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter("post")}
              className={`px-4 py-1 ${activeFilter === "post" ? "bg-[#ff5c35] text-[#fff] rounded-lg" : ""}`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveFilter("comment")}
              className={`px-4 py-1 ${activeFilter === "comment" ? "bg-[#ff5c35] text-[#fff] rounded-lg" : ""}`}
            >
              Comments
            </button>
          </div> */}
        </div>

        <div className="p-2.5 pt-0">
          <div className="border rounded-lg border-[#e0eaf3] ">
            {/* Table Header */}
            <div
              className="grid gap-4 py-2 font-semibold bg-[#fff5f380] border-b border-[#e1eaf4] rounded-t-lg p-4"
              style={{
                gridTemplateColumns: "300px 120px 120px 120px 120px 120px 120px",
              }}
            >
              <div className="text-[14px]">Message</div>
              <div className="text-[14px]">Motive</div>
              <div className="text-[14px]">Tone</div>
              <div className="text-[14px]">Language</div>
              <div className="text-[14px]">Status</div>
              {/* <div className="text-[14px]">URL</div> */}
              <div className="text-[14px]">Date</div>
              <div className="text-[14px]">Actions</div>
            </div>

            {/* Rows */}
            {loading ? (
              <div className="text-center py-12"><Loader /></div>
            ) : filteredContent.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[#ff5c350f] rounded-full flex items-center justify-center mx-auto mb-4">
                  <History className="w-8 h-8 text-[#ff5c35]" />
                </div>
                <p className="text-[#64748b] font-medium !text-xl mb-2">
                  No Posts History yet
                </p>
              </div>
            ) : (
              <div className="!border-[#e0eaf3] border-b h-125 overflow-auto">
                {filteredContent
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                  )
                  .map((c: any) => (
                    <div
                      key={c.id}
                      className="py-4 px-4 odd:bg-[#fff] even:bg-[#fff5f380] grid gap-4 items-start"
                      style={{
                        gridTemplateColumns:
                          "300px 120px 120px 120px 120px 120px 120px",
                      }}
                    >
                      {/* Message */}
                      <div className="text-sm text-gray-800">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: escapeHtml(truncate(c.comment, 90)).replace(
                              /\n/g,
                              "<br />"
                            ),
                          }}
                        />
                        {c.comment && c.comment.length > 90 && (
                          <button
                            onClick={() => setModalData(c)}
                            className="mt-2 inline-block text-sm text-[#ff5c35] hover:underline"
                          >
                            Read More
                          </button>
                        )}
                      </div>

                      {/* Motive */}
                      <div className="text-sm capitalize">
                        {c.motive ?? "N/A"}
                      </div>

                      {/* Tone */}
                      <div className="text-sm capitalize">
                        {c.tone ?? "N/A"}
                      </div>

                      {/* Language */}
                      <div className="text-sm capitalize">
                        {c.language ?? "N/A"}
                      </div>

                      {/* Status */}
                      <div className="text-sm capitalize">
                        {c.status ?? "N/A"}
                      </div>

                      {/* Post URL */}
                      {/* <div>
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
              </div> */}

                      {/* Date */}
                      <div className="text-sm text-gray-600">
                        {formatDate(c.created_at)}
                      </div>

                      {/* Actions */}
                      <div className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          {/* Edit */}
                          {/* <button
                    className="flex items-center justify-center w-8 h-8 rounded-full text-[#ff5c35] bg-[#fee2e2] hover:bg-[#ff5c35] hover:text-white transition"
                    title="Edit Post"
                  >
                    <i className="fa-solid fa-edit"></i>
                  </button> */}

                          {/* Delete */}
                          <button
                            onClick={() => deleteComment(c?.id)}
                            className="flex items-center justify-center w-8 h-8 rounded-full text-[#dc2626] bg-[#fee2e2] hover:bg-[#dc2626] hover:text-white transition"
                            title="Delete Post"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg max-w-full shadow-lg overflow-auto w-[1000px] max-h-[85vh] max-[1050px]:w-[95%]">
            <div className="sticky top-0 bg-white header-top p-9 py-2 flex justify-between item-center">
              <span className="relative s-logo border-[2.5px] border-solid rounded-full border-[#ff5c35] w-12">
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
              <p className="mt-2.5" dangerouslySetInnerHTML={{ __html: escapeHtml(String(modalData.comment ?? "")).replace(/\n/g, "<br />") }} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContentHistory;
