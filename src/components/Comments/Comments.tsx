import { useEffect, useState, useCallback } from "react";
import { apiService } from "../../common/config/apiService";
import { getImage } from "../../common/utils/logoUtils";
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
              <div className="w-12 h-12 bg-gradient-to-r from-green to-green rounded-2xl flex items-center justify-center">
                <FaMessage className="w-6 h-6 text-white" />
              </div>

              <div>
                <div className="text-2xl font-bold text-slate-900">AI-Powered Comments</div>
                <div className="text-sm text-[#717c8c]">
                  Generate smart, personalized replies for LinkedIn posts directly from your feed. Keep track of all your past comments here and reuse them anytime.
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
            <div className="border rounded-lg border-[#e0eaf3] h-[500px] flex flex-col overflow-auto bg-[#fff]">
              {/* Table Header */}
              <div
                className="grid grid-cols-8 gap-4 py-2 font-semibold bg-[#fff5f380] border-b border-[#e1eaf4] rounded-t-lg p-4 flex-shrink-0"

              >
                <div className="text-[14px]">Comment Preview</div>
                <div className="text-[14px]">Title</div>
                <div className="text-[14px]">Motive</div>
                <div className="text-[14px]">Tone</div>
                {/* <div className="text-[14px]">Language</div> */}
                <div className="text-[14px]">Status</div>
                <div className="text-[14px]">URL</div>
                <div className="text-[14px]">Date</div>
                <div className="text-[14px]">Actions</div>
              </div>

              {/* Table Rows */}
              {load ? (
                <div className="text-center py-12">
                  <Loader />
                </div>
              ) : commentsData.length === 0 ? (
                <div className="text-center py-12 bg-white">
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
              ) : (
                <div className="!border-[#e0eaf3] border-b h-125 bg-white">
                  {commentsData
                    .slice()
                    .sort(
                      (a, b) =>
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime()
                    )
                    .map((comment: any, index) => {
                      const fullComment = comment?.comment || "N/A";
                      const genarateTitle = comment?.genarateTitle || "N/A";
                      return (
                        <div
                          key={index}
                          className="py-4  px-4 odd:bg-[#fff] even:bg-[#fff5f380] grid grid-cols-8 gap-4 items-start"

                        >
                          {/* Message */}
                          <div className="text-sm text-gray-800">
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
                          </div>

                          {/* Post title */}
                          <div className="text-sm text-gray-800">
                            {genarateTitle.length > 90
                              ? genarateTitle.slice(0, 90) + "..."
                              : genarateTitle}
                            {genarateTitle.length > 90 && (
                              <button
                                onClick={() => openModal(genarateTitle)}
                                className="ml-1 text-sm text-[#ff5c35] hover:underline"
                              >
                                Read More
                              </button>
                            )}
                          </div>

                          {/* Motive */}
                          <div className="text-sm capitalize">
                            {(comment as any).motive ?? "N/A"}
                          </div>

                          {/* Tone */}
                          <div className="text-sm capitalize">
                            {(comment as any).tone ?? "N/A"}
                          </div>

                          {/* Language */}
                          {/* <div className="text-sm capitalize">
                            {(comment as any).language ?? "N/A"}
                          </div> */}

                          {/* Status */}
                          <div className="text-sm capitalize">
                            {(comment as any).status ?? "N/A"}
                          </div>

                          {/* URL (commented for now) */}
                          {/* <div className="text-sm truncate flex items-center gap-1">
                  {comment.post_url ? (
                    <a
                      href={comment.post_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[#ff5c35] hover:underline"
                    >
                      {comment.post_url.length > 35
                        ? comment.post_url.substring(0, 35) + "..."
                        : comment.post_url}
                      {comment.post_url.includes("linkedin.com") && (
                        <IoLogoLinkedin className="text-xl text-[#0a66c2]" />
                      )}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </div> */}

                          <div>
                            <div className="flex items-center gap-2">
                              {comment.post_url ? (
                                <a
                                  href={comment.post_url}
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
                            {comment.created_at
                              ? new Date(comment.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                              })
                              : "N/A"}
                          </div>

                          {/* Actions */}
                          <div className="px-4 py-3 text-sm">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => deleteComment(comment?.id)}
                                className="flex items-center justify-center w-8 h-8 rounded-full text-[#dc2626] bg-[#fee2e2] hover:bg-[#dc2626] hover:text-white transition"
                                title="Delete Comment"
                              >
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal (Same as before) */}
        <CommentModal show={!!modalData} onClose={closeModal} data={modalData} />
      </div>
    </>
  );
};

export default Comments;
