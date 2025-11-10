import {
  FaRegFileAlt,
  FaRegCommentAlt,
  FaUsers,
  FaArrowRight,
} from "react-icons/fa";
import { FaMessage, FaRegClock } from "react-icons/fa6";
import { GiStarFormation } from "react-icons/gi";
import { HiOutlineLightBulb } from "react-icons/hi2";
import { MdOutlineWifiTetheringErrorRounded } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";

import {
  FiEye,
  FiUsers,
  FiTrendingUp,
  FiMessageSquare,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { LuLightbulb } from "react-icons/lu";
import { useCallback, useEffect, useState } from "react";
import { apiService } from "../../common/config/apiService";
import RecentActityTable from "./RecentActivityTable";

const actions = [
  {
    title: "Create Post",
    description: "Create Posts on LinkedIn content",
    icon: FaRegFileAlt,
    color: "from-blue-500 to-blue-600",
    link: "create-post",
  },
  {
    title: "Message Reply",
    description: "AI-powered message responses",
    icon: FaRegCommentAlt,
    color: "from-pink-500 to-pink-600",
    link: "message-assistant",
  },
  {
    title: "My Personas",
    description: "Create and manage your ideal customer personas",
    icon: FaUsers,
    color: "from-purple-500 to-purple-600",
    link: "personas",
  },
  {
    title: "Message Campaign",
    description: "Automation Linkedin DMs",
    icon: FaMessage,
    color: "from-orange-500 to-orange-600",
    link: "message-campaign",
  },
];


const Home = () => {
  const [commentsData, setCommentsData] = useState<any[]>([]);
  const [profilesData, setProfilesData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const navigate = useNavigate();

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
    }
  }, []);

  const fetchProfiles = useCallback(async () => {
    try {
      if (!chrome?.runtime?.sendMessage) {
        throw new Error("Chrome API is not available.");
      }

      const requestUrl = `${apiService.EndPoint.getProfiles}`;

      await apiService.commonAPIRequest(
        requestUrl,
        apiService.Method.get,
        undefined,
        {},
        (response: any) => {
          if (response?.status === 200 && response?.data?.data.profiles) {
            setProfilesData(response?.data?.data.profiles || []);
          } else {
            console.error(response?.message || "Failed to fetch profiles.");
          }
        }
      );
    } catch (err) {
      console.error("An unexpected error occurred:", err);
    }
  }, []);


  useEffect(() => {
    fetchComments();
    fetchProfiles();
  }, [fetchComments]);

  const getLast7Data = (data: any[], type?: string) => {
    const now = new Date();
    return data.filter((item) => {
      const diffHours =
        (now.getTime() - new Date(item.created_at).getTime()) / (1000 * 60 * 60);
      return diffHours <= 24 * 7 && (!type || item.comment_type === type);
    }).length;
  };


  // ✅ Merge & Filter data (same logic)
  const mergedData = [
    ...commentsData.map((item) => ({
      type: "comment",
      comment_type: item.comment_type || "Post",
      title: item.genarate_title || "Untitled",
      details: item.comment || "—",
      date: new Date(item.created_at),
      LinkedinUrl: item.post_url || "N/A",
      status: item.status || "N/A",
    })),
    ...profilesData.map((profile) => ({
      type: "profile",
      comment_type: "Saved Profile",
      title: `${profile.first_name} ${profile.last_name}`,
      details: `${profile.position} @ ${profile.organization}`,
      date: new Date(profile.created_at),
      LinkedinUrl: profile.url || "N/A",
    })),
  ]
    .filter((item) => {
      const now = new Date();
      const diffHours =
        (now.getTime() - item.date.getTime()) / (1000 * 60 * 60);
      return diffHours <= 24;
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());



  return (
    <>
      <div className="c-padding-r py-[24px] relative pl-[320px] pr-[24px]">
        {/* EVA Command Center div */}
        <div className="flex items-center justify-between p-5 mb-6 bg-white rounded-2xl shadow-md g-box">
          {/* Left Section */}
          <div className="flex items-start gap-4">
            {/* Logo */}
            <div className="flex items-center justify-center w-12 h-12 border-[#ff5c35] border-[2px] rounded-full text-white">
              <img src="f-logo.png" />
            </div>

            {/* Text Content */}
            <div>
              <div className="text-2xl font-bold ">
                EVA Command Center
              </div>
              <div className="text-base text-[#475569] ">
                Good morning! Ready to boost your LinkedIn presence?
              </div>
            </div>
          </div>

          {/* Right Icon */}
          <div className="flex items-center justify-center w-32 h-32 rounded-full bg-[#ff5c350f] text-[#ff5c35]">
            <LuLightbulb size={32} className="w-16 h-16" />
          </div>
        </div>

        <div className="shadow-lg bg-white rounded-2xl p-6 mb-6 g-box">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-blue-600 text-lg">⚡</span>
              <div className="text-xl font-bold ">Quick Actions</div>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {actions.map((action, index) => (
              <Link key={index} to={action.link}>
                <div className="p-6 border border-[#e2e8f0] rounded-xl hover:shadow-md transition-all duration-200 flex flex-col items-center gap-4 group h-full">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <action.icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Text */}
                  <div className="text-center">
                    <div className="font-medium ">
                      {action.title}
                    </div>
                    <div className="text-sm text-[#64748b]">
                      {action.description}
                    </div>
                  </div>

                  {/* Arrow */}
                  <FaArrowRight className="w-4 h-4 text-[#64748b] group-hover:text-[#ff5c35] group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex gap-6 ">
          {/* Left Side (Recent Activity + Performance) */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            {/* Recent Activity Section */}

            <div className="bg-white rounded-xl g-box">
              {/* Header */}
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-2 font-semibold text-base">
                  <FaRegClock className="w-5 h-5 text-[#ff5c35]" />
                  Recent Activity
                </div>

                <div className="flex justify-end items-center">
                  <button onClick={() => setIsModalOpen(true)} className="flex items-center float-end border gap-2 px-4 py-2 text-sm font-medium rounded-lg border-[#ff5c35] text-white bg-[#ff5c35] hover:text-[#ff5c35] hover:bg-white transition">
                    Show Your Full View
                  </button>
                </div>

              </div>

              <div className="p-2.5 pt-0">
                <div className="border rounded-lg border-[#e0eaf3]">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 py-2 font-semibold bg-[#fff5f380] border-b border-[#e1eaf4] rounded-t-lg p-4">
                    <div className="text-[14px] col-span-3">Type</div>
                    <div className="text-[14px] col-span-3">Title / Name</div>
                    <div className="text-[14px] col-span-6">Details</div>
                  </div>

                  {/* // ✅ Show recent or empty message */}
                  {mergedData.length > 0 ? (
                    <div className="!border-[#e0eaf3] max-h-125 !h-auto overflow-auto">
                      {mergedData.map((item, index) => (
                        <div
                          key={index}
                          className="py-4 px-4 even:bg-[#fff5f380] grid grid-cols-12 gap-4 items-start"
                        >
                          <div
                            className={`text-sm capitalize col-span-3 font-semibold ${item.type === "profile" ? "text-blue-500" : "text-[#ff5c35]"
                              }`}
                          >
                            {item.comment_type}
                          </div>
                          <div className="text-sm capitalize col-span-3 font-medium ">
                            {item.title}
                          </div>
                          <div className="text-sm capitalize col-span-6 truncate">
                            {item.details}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Empty state
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-[#ff5c350f] rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaRegClock className="w-8 h-8 text-[#ff5c35]" />
                      </div>
                      <p className="text-[#64748b] font-medium !text-xl mb-2">
                        No Recent Activity yet
                      </p>
                    </div>
                  )
                  }
                </div>
              </div>

            </div>



            {/* This Week's Performance Section */}
            <div className="rounded-xl border text-div-foreground border-none shadow-lg bg-white/80 backdrop-blur-sm g-box">
              {/* Header */}
              <div className="flex flex-col space-y-1.5 p-6 pb-4">
                <div className="font-semibold leading-none tracking-tight flex text-xl items-center gap-2">
                  <FiTrendingUp className="w-5 h-5" />
                  This Week's Performance
                </div>
              </div>

              {/* divs Grid */}
              <div className="p-6 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Profile Views */}
                  <div className="p-4 bg-[#f4f7fc] rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#ff5c35]">
                        <FiEye className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold mb-1">
                        {getLast7Data(profilesData)}
                      </div>
                      <div className="text-sm text-[#64748b]">
                        Profile Saved
                      </div>
                    </div>
                  </div>

                  {/* Connection Requests */}
                  <div className="p-4 bg-[#f4f7fc] rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#ff5c35]">
                        <FiUsers className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold mb-1">
                        0
                      </div>
                      <div className="text-sm text-[#64748b]">
                        Connection Requests
                      </div>
                    </div>
                  </div>

                  {/* Post Engagement */}
                  <div className="p-4 bg-[#f4f7fc] rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#ff5c35]">
                        <FiTrendingUp className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold mb-1">
                        {getLast7Data(commentsData, "create-post")}
                      </div>
                      <div className="text-sm text-[#64748b]">
                        Create Post Generated
                      </div>
                    </div>
                  </div>

                  {/* Messages Sent */}
                  <div className="p-4 bg-[#f4f7fc] rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#ff5c35]">
                        <FiMessageSquare className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold mb-1">
                        {getLast7Data(commentsData, "message-reply")}
                      </div>
                      <div className="text-sm text-[#64748b]">
                        Message-reply Generated
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}

          <div className="w-full lg:w-1/3 space-y-6">
            <div className="bg-white shadow-md rounded-xl p-5 g-box">
              {/* Heading */}
              <div className="flex items-center gap-2 mb-4">
                {/* Logo */}
                <div className="flex items-center justify-center w-12 h-12  border-[#ff5c35] border-[2px] rounded-full text-white">
                  <img src="f-logo.png" />
                </div>
                <div className="text-2xl font-bold">
                  AI Insights
                </div>
              </div>

              {/* div 1 */}
              <div className="group bg-white border border-[#e3e9f1] rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition flex items-start gap-4 ">
                {/* Left Icon */}
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#ff5c350f]">
                  <FaRegClock className="text-[#ff5c35] text-lg" />
                </div>

                {/* Right Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-gray-800 text-base">
                      Prime Posting Time
                    </div>
                    <span className="text-xs border bg-[#fecaca] border-[#fecaca] px-2 py-1 rounded-md font-medium">
                      high
                    </span>
                  </div>
                  <div className="text-sm text-[#64748b] mb-3 blur-[1px]">
                    Your audience is most active in 2 hours
                  </div>
                  <a
                    href="#"
                    className="blur-[1px] text-[#ff5d35] text-sm font-medium mt-2 inline-flex items-center transform transition-transform duration-300 group-hover:translate-x-2 "
                  >
                    Schedule Post <span className="ml-1">→</span>
                  </a>
                  <span className="float-end font-semibold text-sm text-[#ff5d35] mt-2">Coming soon</span>
                </div>
              </div>

              {/* div 2 */}
              <div className="group bg-white border border-[#e3e9f1] rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="w-10 h-10 flex items-center justify-center rounded-full  bg-[#ff5c350f]">
                    <MdOutlineWifiTetheringErrorRounded className="text-[#ff5c35] text-lg" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-gray-800 text-base">
                        Engagement Boost
                      </div>
                      <span className="text-xs bg-yellow-100 border-yellow-100 text-yellow-700 border px-2 py-1 rounded-md font-medium">
                        medium
                      </span>
                    </div>
                    <div className="text-sm text-[#64748b] mb-3 blur-[1px]">
                      Add industry hashtags to increase reach by 40%
                    </div>
                    <a
                      href="#"
                      className="blur-[1px] text-[#ff5d35] text-sm font-medium mt-2 inline-flex items-center transform transition-transform duration-300 group-hover:translate-x-2"
                    >
                      See Hashtags <span className="ml-1">→</span>
                    </a>
                    <span className="float-end font-semibold text-sm text-[#ff5d35] mt-2">Coming soon</span>
                  </div>
                </div>
              </div>

              {/* div 3 */}
              <div className="group bg-white border border-[#e3e9f1] rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition flex items-start gap-3">
                {/* Icon Left */}
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#ff5c350f] flex-shrink-0">
                  <HiOutlineLightBulb className="text-[#ff5c35] text-lg" />
                </div>

                {/* Right Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-gray-800 text-base">
                      Network Expansion
                    </div>
                    <span className="text-xs bg-blue-100 border border-blue-100 text-blue-600 px-2 py-1 rounded-md font-medium">
                      low
                    </span>
                  </div>
                  <div className="text-sm text-[#64748b] mb-3 blur-[1px]">
                    5 mutual connections found in target companies
                  </div>
                  <a
                    href="#"
                    className="blur-[1px] text-[#ff5d35] text-sm font-medium mt-2 inline-flex items-center transform transition-transform duration-300 group-hover:translate-x-2"
                  >
                    View Profiles <span className="ml-1">→</span>
                  </a>
                  <span className="float-end font-semibold text-sm text-[#ff5d35] mt-2">Coming soon</span>
                </div>
              </div>

              {/* Footer link */}
              <div className="border-t border-[#e3e9f1] pt-3 mt-8">
                <a
                  href="#"
                  className="flex items-center text-sm font-medium text-[#475569] hover:text-[#0f172a] py-[10px] px-[16px] hover:bg-[#f5f5f5]"
                >
                  <span className="">
                    <GiStarFormation className="text-xl me-2" />
                  </span>
                  Get More Insights <FaArrowRight className="ml-auto" />

                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Modal Component */}
      <RecentActityTable
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mergedData={mergedData}
      />

    </>
  );
};

export default Home;
