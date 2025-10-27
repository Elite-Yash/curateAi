import { useEffect, useState, useCallback } from "react";
import { apiService } from "../../common/config/apiService";
import Loader from "../Loader/Loader";
import Swal from "sweetalert2";
import { IoLogoLinkedin } from "react-icons/io5";
import { FaMessage } from "react-icons/fa6";
import { FaCommentSlash } from "react-icons/fa";
import { History } from "lucide-react";
import CommentModal from "./CommentModal";

interface Comment {
  id: string;
  comment: string;
  post_url: string;
  comment_type: string;
  created_at: string;
}

const Comments = () => {
  const [commentsData, setCommentsData] = useState<Comment[]>([]);
  const [modalData, setModalData] = useState<Comment | null>(null);
  const [load, setLoad] = useState(true);

  const fetchComments = useCallback(async () => {
    try {
      if (!chrome?.runtime?.sendMessage) {
        throw new Error("Chrome API is not available.");
      }

      const requestUrl = apiService.EndPoint.getComments;

      // Make the API request to fetch comments
      await apiService.commonAPIRequest(
        requestUrl,
        apiService.Method.get,
        undefined, // No query parameters
        {}, // No request body
        (result: any) => {
          if (result?.status === 200 && Array.isArray(result?.data.data)) {
            setCommentsData(result.data.data);
          } else {
            setCommentsData([]);
            throw new Error(result?.message || "Failed to fetch comments.");
          }
        }
      );
    } catch (err) {
      console.error("An unexpected error occurred:", err);
    } finally {
      setLoad(false);
    }
  }, []);

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

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Open modal with full comment
  const openModal = (comment: any) => {
    setModalData(comment);
  };

  // Close modal
  const closeModal = () => {
    setModalData(null);
  };

  return (
    <>
      <div className="c-padding-r py-[24px] relative pl-[320px] pr-[24px]">
        <div className="flex flex-wrap items-center justify-between bg-white z-10 mb-6 g-box p-4 rounded-lg g-box">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r bg-[#ff5c35] rounded-2xl flex items-center justify-center">
                <FaMessage className="w-6 h-6 text-white" />
              </div>

              <div>
                <div className="text-2xl font-bold text-slate-900">
                  AI-Powered Comments
                </div>
                <div className="text-sm text-[#717c8c]">
                  Generate smart, personalized replies for LinkedIn posts
                  directly from your feed. Keep track of all your past comments
                  here and reuse them anytime.
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green rounded-full"></div>
              <span className="text-sm text-slate-600">
                {commentsData.length} new smart comments available
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl g-box">
          {/* Header with Tabs */}
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-2 font-semibold text-base">
              <History className="w-5 h-5 text-[#ff5c35]" />
              Comments Section
            </div>
          </div>
          <div className="p-2.5 pt-0">
            <div className={`overflow-auto flex-1 relative border rounded-lg border-[#e0eaf3] ${commentsData.length === 0 ? "h-[439px]" : "max-h-[439px]"}`}>
              <table className={`w-full text-left border-collapse ${commentsData.length === 0 ? "" : "min-w-[1450px]"}`}>
                {/* Table Header */}
                <thead className="sticky top-0 !bg-[#fbf7f8] z-10">
                  <tr className="font-semibold text-[14px]">
                    <th className={` ${commentsData.length === 0 ? "" : "w-[400px] p-0"}`}>
                      <div className="py-3 px-4 border-b border-[#e1eaf4]">Comment Preview</div>
                    </th>
                    <th className={` ${commentsData.length === 0 ? "" : "w-[400px] p-0"}`}>
                      <div className="py-3 px-4 border-b border-[#e1eaf4]">Title</div>
                    </th>
                    <th className={` whitespace-nowrap ${commentsData.length === 0 ? "" : "w-[180px] p-0"}`}>
                      <div className="py-3 px-4 border-b border-[#e1eaf4]">Motive</div>
                    </th>
                    <th className="p-0"><div className="py-3 px-4 border-b border-[#e1eaf4] ">Tone</div></th>
                    <th className="p-0"><div className="py-3 px-4 border-b border-[#e1eaf4] ">Status</div></th>
                    <th className={` whitespace-nowrap ${commentsData.length === 0 ? "" : "w-[180px] p-0"}`}>
                      <div className="py-3 px-4 border-b border-[#e1eaf4] ">URL</div>
                    </th>
                    <th className="p-0 whitespace-nowrap"><div className="py-3 px-4 border-b border-[#e1eaf4] ">Date</div></th>
                    <th className="p-0"><div className="py-3 px-4 border-b border-[#e1eaf4] ">Actions</div></th>

                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {load ? (
                    <tr>
                      <td colSpan={8} className="text-center py-10">
                        <Loader />
                      </td>
                    </tr>
                  ) : commentsData.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-16">
                        <div className="text-center bg-white">
                          <div className="w-16 h-16 bg-[#f1f5f9] rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaCommentSlash className="w-8 h-8 text-[#94a3b8]" />
                          </div>
                          <p className="text-[#64748b] font-medium !text-xl mb-2">
                            No comments found
                          </p>
                          <div className="!text-base text-[#94a3b8]">
                            Be the first to share your thoughts
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    commentsData.slice()
                      .sort(
                        (a, b) =>
                          new Date(b.created_at).getTime() -
                          new Date(a.created_at).getTime()
                      ).map((comment: any, index: any) => {
                        const fullComment = comment?.comment || "N/A";
                        const genarate_title = comment?.genarate_title || "N/A";
                        const isEven = index % 2 === 1;
                        return (
                          <tr
                            key={comment.id}
                            className={`text-sm ${isEven ? "bg-[#fff5f380]" : "bg-[#fff]"}`}
                          >
                            {/* Comment Preview */}
                            <td className="py-4 px-4 align-top w-[400px]">
                              {fullComment.length > 90
                                ? fullComment.slice(0, 90) + "..."
                                : fullComment}
                              {fullComment.length > 90 && (
                                <button
                                  onClick={() => openModal(fullComment)}
                                  className="ml-1 text-sm text-[#ff5c35] hover:underline"
                                >
                                  Read More
                                </button>
                              )}
                            </td>
                            {/* Title */}
                            <td className="py-4 px-4 align-top w-[400px]">
                              {genarate_title.length > 90
                                ? genarate_title.slice(0, 90) + "..."
                                : genarate_title}
                              {genarate_title.length > 90 && (
                                <button
                                  onClick={() => openModal(genarate_title)}
                                  className="ml-1 text-sm text-[#ff5c35] hover:underline"
                                >
                                  Read More
                                </button>
                              )}
                            </td>
                            {/* Motive */}
                            <td className="py-4 px-4 align-top capitalize whitespace-nowrap">
                              {comment.motive ?? "N/A"}
                            </td>
                            {/* Tone */}
                            <td className="py-4 px-4 align-top capitalize">
                              {comment.tone ?? "N/A"}
                            </td>
                            {/* Status */}
                            <td className="py-4 px-4 align-top capitalize">
                              {comment.status ?? "N/A"}
                            </td>
                            {/* URL */}
                            <td className="py-4 px-4 align-top w-[180px]">
                              {comment.status === "published" ? (
                                comment.post_url ? (
                                  <a
                                    href={comment.post_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <button className="text-[#ff5c35] border border-[#ff5c35] px-2 py-[2px] rounded-[5px] flex items-center text-sm gap-1 whitespace-nowrap">
                                      Go To LinkedIn
                                      <IoLogoLinkedin className="text-xl text-[#0a66c2]" />
                                    </button>
                                  </a>
                                ) : (
                                  "N/A"
                                )
                              ) : "N/A"}
                            </td>
                            {/* Date */}
                            <td className="py-4 px-4 align-top text-gray-600 whitespace-nowrap">
                              {comment.created_at
                                ? new Date(comment.created_at).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "2-digit",
                                  year: "numeric",
                                })
                                : "N/A"}
                            </td>
                            {/* Actions */}
                            <td className="py-4 px-4 align-top">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => deleteComment(comment.id)}
                                  className="flex items-center justify-center w-8 h-8 rounded-full text-[#dc2626] bg-[#fee2e2] hover:bg-[#dc2626] hover:text-white transition"
                                  title="Delete Comment"
                                >
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal (Same as before) */}
        <CommentModal
          show={!!modalData}
          onClose={closeModal}
          data={modalData}
        />
      </div>
    </>
  );
};

export default Comments;
