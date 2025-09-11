import { useEffect, useState } from "react";
import CampaignModal from "../CampaignModal/CampaignModal";
import { IoSearchOutline } from "react-icons/io5";
import { Tooltip } from "flowbite-react";
import { MdCampaign } from "react-icons/md";
import Swal from "sweetalert2";
import { apiService } from "../../common/config/apiService";

const MessageCampaignTable = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editableCampaign, setEditableCampaign] = useState(null);
  const [typeValue, setTypeValue] = useState("message"); // Add this state

  // Fetch campaigns on component mount
  useEffect(() => {
    fetchCampaigns();
  }, []);

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
          // else {
          //   console.error("Failed to fetch campaigns:", response?.data?.message);
          //   Swal.fire({
          //     title: "Error!",
          //     text: response?.data?.message || "Failed to fetch campaigns",
          //     icon: "error",
          //     confirmButtonColor: "#2563eb",
          //   });
          // }
        }
      );
    } catch (err) {
      console.error("Error fetching campaigns:", err);
      Swal.fire({
        title: "Error!",
        text: "An unexpected error occurred while fetching campaigns.",
        icon: "error",
        confirmButtonColor: "#2563eb",
      });
    }
  };

  const deleteCampaign = async (id: any) => {
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
                confirmButtonColor: "#2563eb",
              }).then(() => {
                fetchCampaigns();
              });;
            } else {
              Swal.fire({
                title: "Error!",
                text: response?.data?.message || "Failed to delete campaign.",
                icon: "error",
                confirmButtonColor: "#2563eb",
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
          confirmButtonColor: "#2563eb",
        });
      }
    }
  };

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditCampaign = (campaign) => {
    setEditableCampaign(campaign);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditableCampaign(null);
    fetchCampaigns();
  };

  const handleCampaignCreated = () => {
    fetchCampaigns(); // Refresh the campaigns list
  };

  const resetEditableCampaign = () => {
    setEditableCampaign(null);
  };

  return (
    <div className="c-padding-r py-12 h-screen relative pl-[390px] pr-[110px]">
      <div className="flex items-center justify-between bg-white z-10 mb-4 g-box p-4 rounded-lg shadow-sm">
        {/* Left Side: Title */}
        <div className="mb-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r bg-[#2563eb] rounded-2xl flex items-center justify-center">
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
          <div className="flex items-center bg-white shadow-sm rounded-xl px-3 py-2 w-100 transition border border-[#2563eb] h-[38px]">
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
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 border px-4 py-2 text-sm font-medium rounded-lg border-[#2563eb] text-[#2563eb] hover:bg-[#2563eb] hover:text-white transition"
          >
            <MdCampaign className='text-xl' />
            <span>Add Campaign</span>
          </button>
          {/* </Tooltip> */}
        </div>
      </div>

      <div className="flex justify-between gap-5 w-full">
        <div className="rounded-2xl w-full">
          <div className="p-5 g-box g-box-table">
            <div className="d-table h-connect-table !w-full max-h-[700px] overflow-auto">
              <table className="w-full overflow-auto g-table">
                <thead className="sticky top-0">
                  <tr>
                    <th className="font-light text-base px-4 color00517C py-3 text-left">
                      <span className="text-base uppercase font-semibold whitespace-nowrap">
                        Name
                      </span>
                    </th>
                    <th className="font-light text-base px-4 color00517C py-3 text-left">
                      <span className="text-base uppercase font-semibold whitespace-nowrap">
                        URL
                      </span>
                    </th>
                    <th className="font-light text-base px-4 color00517C py-3 text-left">
                      <span className="text-base uppercase font-semibold whitespace-nowrap">
                        Type
                      </span>
                    </th>
                    <th className="font-light text-base px-4 color00517C py-3 text-left">
                      <span className="text-base uppercase font-semibold whitespace-nowrap">
                        Status
                      </span>
                    </th>
                    <th className="font-light text-base px-4 color00517C py-3 text-left">
                      <span className="text-base uppercase font-semibold whitespace-nowrap">
                        Created At
                      </span>
                    </th>
                    <th className="font-light text-base px-4 color00517C py-3 text-left">
                      <span className="text-base uppercase font-semibold whitespace-nowrap">
                        Max Connections
                      </span>
                    </th>
                    <th className="font-light text-base px-4 color00517C py-3 text-left">
                      <span className="text-base uppercase font-semibold whitespace-nowrap">
                        Actions
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCampaigns.length > 0 ? (
                    filteredCampaigns.map((campaign, index) => (
                      <tr key={index} className="hover:bg-[#f9fafb]">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {campaign.name || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {campaign.url ? (
                            <a href={campaign.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {campaign.url.length > 30 ? campaign.url.substring(0, 30) + '...' : campaign.url}
                            </a>
                          ) : "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {campaign.type || "N/A"}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${campaign.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                            }`}>
                            {campaign.status || 'inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {campaign.created_at
                            ? new Date(campaign.created_at).toLocaleDateString('en-GB')
                            : "N/A"
                          }
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {campaign.max_connections || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditCampaign(campaign)}
                              className="text-blue-600 hover:text-blue-800 transition p-1"
                              title="Edit Campaign"
                            >
                              <i className="fa-solid fa-edit"></i>
                            </button>
                            <button
                              onClick={() => deleteCampaign(campaign.id)}
                              className="text-red-600 hover:text-red-800 transition p-1"
                              title="Delete Campaign"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                    <td colSpan={7}>
                              <div className="flex flex-col items-center text-center py-12 h-[600px] max-h-[600px] justify-center">
            <div className="w-20 h-20 rounded-full bg-[#f1f5f9] flex items-center justify-center mb-2">
              <MdCampaign className="w-8 h-8 text-[#94a3b8]" />
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