import { useEffect, useState, useCallback } from "react";
import { apiService } from "../../common/config/apiService";
import { getImage } from "../../common/utils/logoUtils";
import Loader from "../Loader/Loader";
import Swal from "sweetalert2";
import { IoLogoLinkedin } from "react-icons/io5";
import { FaMessage } from "react-icons/fa6";
import { FaCommentSlash } from "react-icons/fa";


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
      confirmButtonColor: "#2563eb",
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
                confirmButtonColor: "#2563eb",
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
          confirmButtonColor: "#2563eb",
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
      <div className="c-padding-r pt-12 h-screen relative pl-[390px] pr-[110px]">
        {/* <div className="g-box-title g-box bg-white p-4 mb-4 z-10">
          <h4 className="font-medium text-lg text-gray-800">
            Comments Section{" "}
          </h4>
        </div> */}

          <div className="flex flex-wrap items-center justify-between bg-white z-10 mb-4 g-box p-4 rounded-lg shadow-sm g-box">
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green to-green rounded-2xl flex items-center justify-center">
                            <FaMessage className="w-6 h-6 text-white" />
                        </div>

                        <div>
                            <div className="text-2xl font-bold text-slate-900">Comments Section</div>
                            <div className="text-sm text-[#717c8c]">
                               Smart AI suggestions for your LinkedIn replies
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


        <div className="flex justify-between gap-5 w-full">
          <div className="rounded-2xl w-full">
            <div className="bg-[#f5f8fc]">
              {load ? (
                <div className="flex justify-center items-center py-10">
                  <Loader />
                </div>
              ) : commentsData.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[795px] overflow-auto scrollbar-hide">
                  {commentsData.map((comment, index) => {
                    const fullComment = comment?.comment || "N/A";
                    return (
                      <div
                        key={index}
                        className="bg-white rounded-2xl shadow-md p-4 relative g-box"
                      >
                        {/* Icon + Heading */}
                        <div className="flex items-center gap-3 justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#E6F0FA] text-[#2563eb]">
                              <i className="fa-regular fa-comment text-lg"></i>
                            </div>
                            <div className="g-box-title sticky top-0 bg-white">
                              <h4 className="font-medium">
                                {" "}
                                {comment.comment_type || "Comments"}{" "}
                              </h4>
                            </div>
                          </div>
                          <button
                            onClick={() => deleteComment(comment?.id)}
                            className=" w-10 h-10 flex items-center justify-center rounded-full text-base cursor-pointer text-[#2563eb] hover:text-[#003ab6] ms-0.5"
                            title="Delete Comment"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>

                        {/* Comment Text */}
                        <p className="text-sm text-gray-600 leading-relaxed mb-2">
                          {fullComment.length > 120
                            ? fullComment.slice(0, 120) + "..."
                            : fullComment}
                          {fullComment.length > 120 && (
                            <button
                              onClick={() => openModal(comment)}
                              className="text-[#2563eb] hover:text-[#003ab6] text-sm font-medium hover:underline w-fit"
                            >
                              Read More
                            </button>
                          )}
                        </p>

                        {/* Link */}
                        <div className="flex items-center gap-2">
                          <a
                            href={comment.post_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-[#2563eb] hover:text-[#003ab6] truncate"
                          >
                            <i className="fa-solid fa-location-dot text-xs"></i>
                            {comment.post_url
                              ? comment.post_url.length > 40
                                ? comment.post_url.substring(0, 40) + "..."
                                : comment.post_url
                              : "N/A"}
                            <IoLogoLinkedin className="text-xl text-[#2563eb]" />
                          </a>
                        </div>

                        {/* Footer - Date + Delete */}
                        <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                          <span>
                            {new Date(comment.created_at).toLocaleDateString(
                              "en-GB"
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                 <div className="text-center py-12">
                        <div className="w-16 h-16 bg-[#f1f5f9] rounded-full flex items-center justify-center mx-auto mb-2">
                            <FaCommentSlash className="w-8 h-8 text-[#94a3b8]" />
                        </div>
                        <p className="text-[#64748b] font-medium !text-xl mb-2">
                              No comments found
                        </p>
                        <div className="!text-base text-[#94a3b8]">
                             Be the first to share your thoughts
                        </div>
                    </div>

              )}
            </div>
          </div>
        </div>

        {/* Modal (Same as before) */}
        {modalData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg max-w-full shadow-lg overflow-auto w-[1000px] max-h-[85vh] max-[1050px]:w-[95%]">
              <div className="sticky top-0 bg-white header-top p-9 py-2 flex justify-between item-center">
                <span className="relative s-logo border-[2.5px] border-solid rounded-full border-[#2563eb] w-12">
                  <img src={getImage("fLogo")} alt="img"/>
                </span>
                <h4 className="popup-title font-semibold text-xl leading-10">
                  Entire Comment
                </h4>
                <span
                  onClick={closeModal}
                  role="button"
                  aria-label="Close modal"
                  className="close-box w-6 h-6 bg-no-repeat bg-center cursor-pointer"
                >
                  <img
                    src={getImage("close")}
                    alt="img"
                    className="w-8 h-8 rounded-full m-2.5"
                  />
                </span>
              </div>
              <div className="p-6">
                <p
                  className="text-gray-700 mt-2.5"
                  dangerouslySetInnerHTML={{
                    __html: modalData.comment.replace(/\n/g, "<br />"),
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Comments;
