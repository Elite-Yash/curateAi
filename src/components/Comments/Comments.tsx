import { useEffect, useState, useCallback } from "react";
import { Endpoints, fetchAPI, Method } from "../../common/config/apiService";
import { API_URL } from "../../common/config/constMessage";
import { getImage } from "../../common/utils/logoUtils";
import Loader from "../Loader/Loader";

interface Comment {
  comment: string;
  post_url: string;
  comment_type: string;
  created_at: string;
}

const Comments = () => {
  const [commentsData, setCommentsData] = useState<Comment[]>([])
  const [modalData, setModalData] = useState<Comment | null>(null);
  const [load, setLoad] = useState(true)

  const fetchComments = useCallback(async () => {
    try {
      if (!chrome?.runtime?.sendMessage) {
        throw new Error("Chrome API is not available.");
      }

      const getAuthToken = () =>
        new Promise((resolve, reject) => {
          chrome.runtime.sendMessage({ type: "getCookies" }, (response) => {
            if (!response || !response.success || !response.token) {
              reject("Failed to retrieve auth token.");
            } else {
              resolve(response.token);
            }
          });
        });

      const authToken = await getAuthToken();
      if (!authToken) throw new Error("Authentication token is missing.");

      const requestUrl = `${API_URL}/${Endpoints.getComments}`;

      const result = await fetchAPI(requestUrl, {
        method: Method.get,
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (result.statusCode === 200 && Array.isArray(result.data)) {
        setCommentsData(result.data);
      } else {
        setCommentsData([]);
        throw new Error(result.message || "Failed to fetch comments.");
      }
    } catch (err) {
      console.error("An unexpected error occurred.");
    } finally {
      setLoad(false)
    }
  }, []);

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
    <div className="c-padding-r pt-24 h-screen relative pl-[280px] pr-[30px]">
      <div className="flex justify-between gap-5 w-full">
        <div className="rounded-2xl w-full">
          <div className="p-5 bg-white g-box g-box-table ">
            <div className="d-table h-connect-table !w-full">
              <div className="g-box-title">
                <h4 className="font-medium mb-3">Comments</h4>
              </div>
              <table className="w-full overflow-auto g-table Comments">
                <thead>
                  <tr>
                    <th className="font-light text-base px-4 color00517C py-3 text-left">
                      <span className="text-base uppercase font-semibold whitespace-nowrap">Comment</span>
                    </th>
                    <th className="font-light text-base px-4 color00517C py-3 text-left">
                      <span className="text-base uppercase font-semibold whitespace-nowrap">Url</span>
                    </th>
                    <th className="font-light text-base px-4 color00517C py-3 text-left">
                      <span className="text-base uppercase font-semibold whitespace-nowrap">Type</span>
                    </th>
                    <th className="font-light text-base px-4 color00517C py-3 text-left">
                      <span className="text-base uppercase font-semibold whitespace-nowrap">Created At</span>
                    </th>
                  </tr>
                </thead>

                {
                  load ?
                    <tbody>
                      <tr>
                        <td colSpan={4} className="p-4">
                          <Loader />
                        </td>
                      </tr>
                    </tbody>
                    :
                    <tbody>
                      {commentsData.length > 0 ? (
                        commentsData.map((comment, index) => {
                          const fullComment = comment?.comment || "N/A";
                          return (
                            <tr key={index}>
                              <td className="px-4 py-3">
                                {fullComment.length > 200
                                  ? fullComment.slice(0, 200) + "..."
                                  : fullComment}

                                {fullComment.length > 200 && (
                                  <button
                                    className="text-blue-500 ml-2"
                                    onClick={() => openModal(comment)}
                                  >
                                    Read More
                                  </button>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                {comment.post_url ? (
                                  <a
                                    href={comment.post_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-[#ff5c35]"
                                  >
                                    {comment.post_url.length > 29
                                      ? comment.post_url.substring(0, 29) + "..."
                                      : comment.post_url}
                                  </a>
                                ) : (
                                  "N/A"
                                )}
                              </td>
                              <td className="px-4 py-3">{comment.comment_type || "N/A"}</td>
                              <td className="px-4 py-3">
                                {new Date(comment.created_at).toLocaleDateString("en-GB") || "N/A"}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-4 py-3 text-center whitespace-nowrap">
                            No comments found
                          </td>
                        </tr>
                      )}
                    </tbody>
                }
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Popup */}
      {modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-auto h-auto  max-w-full shadow-lg my-0 mx-[30%]">
            <div className="relative header-top p-9 py-2 flex justify-between item-center">
              <span className="relative s-logo border-[2.5px] border-solid rounded-full border-[#ff5c35] w-12">
                <img src={getImage('fLogo')} alt="img" className="" />
              </span>
              <h4 className="popup-title font-semibold text-xl leading-10">Entire Comment</h4>
              <span
                onClick={closeModal}
                role="button"
                aria-label="Close modal"
                className="close-box w-6 h-6 bg-no-repeat bg-center cursor-pointer">
                <img src={getImage('close')} alt="img" className="w-3 h-3 rounded-full m-2.5" /></span>
            </div>
            <p className="text-gray-700 mt-2.5">{modalData.comment}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comments;
