import { useEffect, useState } from "react";
import CampaignModal from "../CampaignModal/CampaignModal";
import { IoSearchOutline } from "react-icons/io5";
import { MdCampaign } from "react-icons/md";
import Swal from "sweetalert2";
import { apiService } from "../../common/config/apiService";

const MessageCampaignTable = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editableCampaign, setEditableCampaign] = useState<Campaign | null>(null);
  const [typeValue, setTypeValue] = useState("message"); // Add this state
  const [campaignStatus, setCampaignStatus] = useState<{ [id: number]: boolean }>({});

  // Fetch campaigns on component mount
  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
      if (request.type === "campaignComplate") {
        const { campaignId } = request;
        endCampaignToLinkedIn(campaignId);
        return true;
      }
    });
  }, [])

  type Campaign = {
    id: number;
    name: string;
    url: string;
    type: string;
    message: string;
    status: string;
    max_connections: number;
    created_at: string;
  };


  const fetchCampaigns = async () => {
    try {
      await apiService.commonAPIRequest(
        apiService.EndPoint.getallcampaign,
        apiService.Method.get,
        undefined,
        {},
        (response: any) => {
          if (response?.status === 200 && response?.data?.statusCode === 200) {
            setCampaigns(response.data.data);
          }
        }
      );
    } catch (err) {
      console.error("Error fetching campaigns:", err);
      Swal.fire({
        title: "Error!",
        text: "An unexpected error occurred while fetching campaigns.",
        icon: "error",
        confirmButtonColor: "#ff5c35",
      });
    }
  };

  const deleteCampaign = async (id: any) => {
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
        const endpoint = apiService.EndPoint.deletecampaign.replace(':id', id);
        await apiService.commonAPIRequest(
          endpoint,
          apiService.Method.delete,
          undefined,
          {},
          (response: any) => {
            if (response?.data.message === 'Campaign deleted successfully' && response?.data?.statusCode === 200) {
              setCampaigns(prevCampaigns =>
                prevCampaigns.filter(campaign => campaign.id !== id)
              );
              Swal.fire({
                title: "Deleted!",
                text: "Campaign has been deleted.",
                icon: "success",
                confirmButtonColor: "#ff5c35",
              }).then(() => {
                fetchCampaigns();
              });;
            } else {
              Swal.fire({
                title: "Error!",
                text: response?.data?.message || "Failed to delete campaign.",
                icon: "error",
                confirmButtonColor: "#ff5c35",
              });
            }
          }
        );
      } catch (err) {
        console.error("Error deleting campaign:", err);
        Swal.fire({
          title: "Error!",
          text: "An unexpected error occurred while deleting campaign.",
          icon: "error",
          confirmButtonColor: "#ff5c35",
        });
      }
    }
  };

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditCampaign = (campaign: Campaign) => {
    setEditableCampaign(campaign);
    setIsModalOpen(true);
  };

  // const handleCloseModal = () => {
  //   setIsModalOpen(false);
  //   setEditableCampaign(null);
  //   fetchCampaigns();
  // };

  const handleCampaignCreated = () => {
    fetchCampaigns(); // Refresh the campaigns list
  };

  const resetEditableCampaign = () => {
    setEditableCampaign(null);
  };

  return (
    <div className="c-padding-r py-[24px] relative pl-[320px] pr-[24px]">
      <div className="flex items-center justify-between bg-white z-10 mb-6 g-box p-4 rounded-lg">
        {/* Left Side: Title */}
        <div className="mb-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r bg-[#ff5c35] rounded-2xl flex items-center justify-center">
              <i className="fas fa-envelope text-xl text-white"></i>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">
                Message Campaign
              </div>
              <div className="text-sm text-[#717c8c]">
                Create and manage AI-powered message campaigns with ease
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-sm text-slate-600">
              {campaigns.length} Campaign{campaigns.length !== 1 ? 's' : ''} available
            </span>
          </div>
        </div>

        {/* Right Side: Search + Buttons */}
        <div className="flex flex-wrap items-center gap-3 mt-3 md:mt-0">
          {/* Search Box */}
          <div className="flex items-center bg-white shadow-sm rounded-xl px-3 py-2 w-100 transition border border-[#ff5c35] h-[38px]">
            <IoSearchOutline className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search Campaign by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-2 text-sm border-none placeholder-gray-400 focus:outline-none focus:ring-0"
            />
          </div>

          {/* Add Campaign Button */}
          {/* <Tooltip
            content="Add Campaign"
            placement="bottom"
            className="custom-tooltip c-bottom-t ex !w-auto"
          > */}
          <button
            onClick={() => { console.log("Add Campaign button clicked!"); setIsModalOpen(true) }}
            className="flex items-center gap-2 border px-4 py-2 text-sm font-medium rounded-lg border-[#ff5c35] text-[#ff5c35] hover:bg-[#ff5c35] hover:text-white transition"
          >
            <MdCampaign className='text-xl' />
            <span>Add Campaign</span>
          </button>
          {/* </Tooltip> */}
        </div>
      </div>

      <div className="flex justify-between gap-6 w-full g-box">
        <div className="rounded-2xl w-full">
          <div className="p-5 g-box g-box-table">
            <div className="d-table h-connect-table !w-full ">
              <div className="overflow-hidden border rounded-lg border-[#e0eaf3]">
                <div className="overflow-y-auto max-h-[495px] rounded-lg w-full h-full">
                  <table className="w-full">
                    <thead className="sticky top-0 !bg-[#fbf7f8]">
                      <tr
                        className="border-b border-[#e1eaf4]"
                      >
                        <th className="font-semibold text-[14px] px-4 py-3 text-left text-gray-700">
                          Name
                        </th>
                        <th className="font-semibold text-[14px] px-4 py-3 text-left text-gray-700">
                          URL
                        </th>
                        <th className="font-semibold text-[14px] px-4 py-3 text-left text-gray-700">
                          Type
                        </th>
                        <th className="font-semibold text-[14px] px-4 py-3 text-left text-gray-700">
                          Status
                        </th>
                        <th className="font-semibold text-[14px] px-4 py-3 text-left text-gray-700">
                          Created At
                        </th>
                        <th className="font-semibold text-[14px] px-4 py-3 text-left text-gray-700">
                          Max Connections
                        </th>
                        <th className="font-semibold text-[14px] px-4 py-3 text-left text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredCampaigns.length > 0 ? (
                        filteredCampaigns.slice().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((campaign, index) => (
                          <tr
                            key={index}
                            className="py-4 px-4 odd:bg-[#fff] even:bg-[#fff5f380]"
                          >
                            {/* Name */}
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {campaign.name || "N/A"}
                            </td>

                            {/* URL */}
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {campaign.url ? (
                                <a
                                  href={campaign.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#ff5c35] hover:underline"
                                >
                                  {campaign.url.length > 30
                                    ? campaign.url.substring(0, 30) + "..."
                                    : campaign.url}
                                </a>
                              ) : (
                                "N/A"
                              )}
                            </td>

                            {/* Type */}
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {campaign.type || "N/A"}
                            </td>

                            {/* Status */}
                            <td className="px-4 py-3">
                              {campaign.status === "active" ? (
                                <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-[#fff5f380] text-[#ff5c35] ring-1 ring-inset ring-[#ff5c35]">
                                  <span className="w-2 h-2 rounded-full bg-[#ff5c35]"></span>
                                  Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-[#f9fafb] text-[#374151] ring-1 ring-inset ring-[#4B5563]">
                                  <span className="w-2 h-2 rounded-full bg-[#6B7280]"></span>
                                  Inactive
                                </span>
                              )}
                            </td>

                            {/* Created At */}
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {campaign.created_at
                                ? new Date(campaign.created_at).toLocaleDateString("en-GB")
                                : "N/A"}
                            </td>

                            {/* Max Connections */}
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {campaign.max_connections || "N/A"}
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-3 text-sm text-gray-700">
                              <div className="flex items-center gap-2">
                                {/* Edit */}
                                <button
                                  onClick={() => handleEditCampaign(campaign)}
                                  className="flex items-center justify-center w-8 h-8 rounded-full text-[#ff5c35] bg-[#fee2e2] hover:bg-[#ff5c35] hover:text-white transition"
                                  title="Edit Campaign"
                                >
                                  <i className="fa-solid fa-edit"></i>
                                </button>

                                {/* Delete */}
                                <button
                                  onClick={() => deleteCampaign(campaign.id)}
                                  className="flex items-center justify-center w-8 h-8 rounded-full text-[#dc2626] bg-[#fee2e2] hover:bg-[#dc2626] hover:text-white transition"
                                  title="Delete Campaign"
                                >
                                  <i className="fa-solid fa-trash"></i>
                                </button>

                                {/* Start/Stop Button */}
                                {!campaignStatus[campaign.id] ? (
                                  <button
                                    onClick={() => {
                                      startCampaignToLinkedIn(campaign, setCampaignStatus);
                                    }}
                                    id={`start-${campaign.id}`}
                                    className="flex items-center justify-center w-8 h-8 rounded-full text-[#16a34a] bg-[#d1fae5] hover:bg-[#16a34a] hover:text-white transition"
                                    title="Start Campaign"
                                  >
                                    <i className="fa-solid fa-play"></i>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      endCampaignToLinkedIn(campaign, setCampaignStatus);
                                    }}
                                    id={`end-${campaign.id}`}
                                    className="flex items-center justify-center w-8 h-8 rounded-full text-[#b45309] bg-[#fef3c7] hover:bg-[#b45309] hover:text-white transition"
                                    title="End Campaign"
                                  >
                                    <i className="fa-solid fa-stop"></i>
                                  </button>
                                )}

                              </div>
                            </td>

                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7}>
                            <div className="flex flex-col items-center text-center py-12 max-h-[450px] h-[447px] justify-center">
                              <div className="w-20 h-20 rounded-full bg-[#ff5c350f] flex items-center justify-center mb-2">
                                <MdCampaign className="w-8 h-8 text-[#ff5c35]" />
                              </div>

                              {/* Title */}
                              <div className="text-lg font-medium text-[#64748b] mb-2">
                                {searchTerm
                                  ? "No campaigns found matching your search"
                                  : "No campaigns available"}
                              </div>

                              {/* Subtitle */}
                              <div className="text-sm text-[#92a0b5] max-w-md">
                                {searchTerm
                                  ? "Try adjusting your search keywords or filters to find the right campaign."
                                  : "Create a new campaign to get started and manage your activities here."}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Campaign Modal */}
      {isModalOpen && (
        <CampaignModal
          isOpen={isModalOpen}
          closeModalPoupBox={() => setIsModalOpen(false)}
          onCampaignCreated={handleCampaignCreated}
          editableCampaigns={editableCampaign}
          resetEditableCampaign={resetEditableCampaign}
          typeValue={typeValue}
        />
      )}
    </div>
  );
};

export default MessageCampaignTable;

export const startCampaignToLinkedIn = async (campaignData: any, setCampaignStatus?: any) => {
  const {
    max_connections: maxConnections,
    url,
    id: campaign_id,
    message,
    type: typeOfCampaign,
    name: campaignName,
  } = campaignData;

  try {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to start this campaign!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, proceed!',
      cancelButtonText: 'No, cancel!'
    });
    if (result.isConfirmed) {
      setCampaignStatus((prev: { [id: number]: boolean }) => ({ ...prev, [campaign_id]: true }));
      chrome.runtime.sendMessage(
        {
          type: "startCampaign",
          maxConnections,
          url,
          campaign_id,
          message,
          typeOfCampaign,
          campaignName,
        },
        (response: { status: string; isSameUrl: boolean }) => {
          console.log('Response from background script:', response);
        }
      );
    } else {
      Swal.fire('Cancelled', 'You cancelled the action.', 'info');
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

export const endCampaignToLinkedIn = async (campaign: any, setCampaignStatus?: any) => {
  try {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to stop this campaign!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, proceed!',
      cancelButtonText: 'No, cancel!'
    });
    if (result.isConfirmed) {
      setCampaignStatus((prev: { [id: number]: boolean }) => ({ ...prev, [campaign.id]: false }));
      chrome.runtime.sendMessage({ type: "stopCampaign" });
    } else {
      Swal.fire('Cancelled', 'You cancelled the action.', 'info');
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
};