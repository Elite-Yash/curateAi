import { FaLightbulb } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { GiStarFormation } from "react-icons/gi";
import { HiOutlineLightBulb } from "react-icons/hi2";
import { MdOutlineWifiTetheringErrorRounded } from "react-icons/md";

import {
  FiEye,
  FiUsers,
  FiTrendingUp,
  FiMessageSquare,
  FiArrowUpRight,
  FiArrowDownRight,
} from "react-icons/fi";

const Home = () => {
  return (
    <>
      <div className="c-padding-r pt-24 h-screen relative pl-[280px] pr-[30px]">
        {/* EVA Command Center Card */}
        <div className="flex items-center justify-between p-6 mb-4 bg-white rounded-2xl shadow-md g-box">
          {/* Left Section */}
          <div className="flex items-start gap-4">
            {/* Logo */}
            <div className="flex items-center justify-center w-12 h-12  border-[#2563eb] border-[2px] rounded-full text-white">
              <img src="f-logo.png" />
            </div>

            {/* Text Content */}
            <div>
              <div className="text-2xl font-bold text-slate-900">
                EVA Command Center
              </div>
              <div className="text-base text-slate-600 text-[#717c8c] ">
                Good morning! Ready to boost your LinkedIn presence?
              </div>

              {/* Status Badges */}
              <div className="flex gap-2 mt-3">
                <span className="flex items-center px-3 py-1 text-xs font-bold text-green-700 bg-[#dcfce7] rounded-md cursor-pointer">
                  <GoDotFill className="w-6 h-4 rounded-full text-green" />
                  LinkedIn Connected
                </span>
                <span className="flex items-center gap-2 px-3 py-1 text-xs font-bold text-blue-700 bg-[#bfdbfe] rounded-md cursor-pointer">
                  ⚡ AI Ready
                </span>
              </div>
            </div>
          </div>

          {/* Right Icon */}
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 text-[#2563eb]">
            <FaLightbulb size={32} />
          </div>
        </div>

        <div className="flex gap-4">
          {/* Left Side (Recent Activity + Performance) */}
          <div className="w-full lg:w-2/3 flex flex-col gap-4">
            {/* Recent Activity Section */}
            <div className="bg-white shadow-md rounded-xl p-5 w-full g-box">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FaRegClock className="text-[#4b5563] text-xl" />
                  <div className="text-xl font-bold text-slate-900">
                    Recent Activity
                  </div>
                </div>
                <button className="text-sm text-blue-600 hover:underline">
                  View All
                </button>
              </div>

              {/* Empty State */}
              <div className="flex flex-col items-center justify-center py-10">
                <div className="text-[#9ca3af] text-xl">No recent activity</div>
                <div className="text-[#9ca3af] text-sm mb-1">
                  Start generating content to see your activity here..
                </div>
              </div>
            </div>

            {/* This Week's Performance Section */}
            <div className="rounded-xl border text-card-foreground border-none shadow-lg bg-white/80 backdrop-blur-sm g-box">
              {/* Header */}
              <div className="flex flex-col space-y-1.5 p-6 pb-4">
                <div className="font-semibold leading-none tracking-tight flex text-xl items-center gap-2">
                  <FiTrendingUp className="w-5 h-5 text-slate-600" />
                  This Week&apos;s Performance
                </div>
              </div>

              {/* Cards Grid */}
              <div className="p-6 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Profile Views */}
                  <div className="p-4 bg-[#f0f8ff] rounded-xl hover:bg-[#d7dbdf] transition-colors duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-blue-600">
                        <FiEye className="w-4 h-4" />
                      </div>
                      <div className="flex items-center gap-1 text-xs font-medium text-green">
                        <FiArrowUpRight className="w-3 h-3 text-green" /> +12%
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900 mb-1">
                        234
                      </div>
                      <div className="text-sm text-[#6b7280]">
                        Profile Views
                      </div>
                    </div>
                  </div>

                  {/* Connection Requests */}
                  <div className="p-4 bg-[#f0f8ff] rounded-xl hover:bg-[#d7dbdf] transition-colors duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-green">
                        <FiUsers className="w-4 h-4" />
                      </div>
                      <div className="flex items-center gap-1 text-xs font-medium text-green">
                        <FiArrowUpRight className="w-3 h-3 text-green" /> +5%
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900 mb-1">
                        18
                      </div>
                      <div className="text-sm text-[#6b7280]">
                        Connection Requests
                      </div>
                    </div>
                  </div>

                  {/* Post Engagement */}
                  <div className="p-4 bg-[#f0f8ff] rounded-xl hover:bg-[#d7dbdf] transition-colors duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-purple-600">
                        <FiTrendingUp className="w-4 h-4" />
                      </div>
                      <div className="flex items-center gap-1 text-xs font-medium text-green">
                        <FiArrowUpRight className="w-3 h-3 text-green" /> +23%
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900 mb-1">
                        89%
                      </div>
                      <div className="text-sm text-[#6b7280]">
                        Post Engagement
                      </div>
                    </div>
                  </div>

                  {/* Messages Sent */}
                  <div className="p-4 bg-[#f0f8ff] rounded-xl hover:bg-[#d7dbdf] transition-colors duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-orange-600">
                        <FiMessageSquare className="w-4 h-4" />
                      </div>
                      <div className="flex items-center gap-1 text-xs font-medium text-red">
                        <FiArrowDownRight className="w-3 h-3 text-red" /> -8%
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900 mb-1">
                        42
                      </div>
                      <div className="text-sm text-[#6b7280]">
                        Messages Sent
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side (baad me aur content aa sakta h) */}
          <div className="w-full lg:w-1/3 g-box">
            <div className="bg-white shadow-md rounded-xl p-5">
              {/* Heading */}
              <div className="flex items-center gap-2 mb-4">
                {/* Logo */}
                <div className="flex items-center justify-center w-12 h-12  border-[#2563eb] border-[2px] rounded-full text-white">
                  <img src="f-logo.png" />
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  AI Insights
                </div>
              </div>

              {/* Card 1 */}
              <div className="group bg-white border border-[#e3e9f1] rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition flex items-start gap-4">
                {/* Left Icon */}
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#bfdbfe]">
                  <FaRegClock className="text-[#2563eb] text-lg" />
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
                  <div className="text-sm text-[#6b7280] mt-1">
                    Your audience is most active in 2 hours
                  </div>
                  <a
                    href="#"
                    className="text-blue-600 text-sm font-medium mt-2 inline-flex items-center transform transition-transform duration-300 group-hover:translate-x-2"
                  >
                    Schedule Post <span className="ml-1">→</span>
                  </a>
                </div>
              </div>

              {/* Card 2 */}
              <div className="group bg-white border border-[#e3e9f1] rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="w-10 h-10 flex items-center justify-center rounded-full  bg-[#bfdbfe]">
                    <MdOutlineWifiTetheringErrorRounded className="text-[#2563eb] text-lg" />
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
                    <div className="text-sm text-[#6b7280] mt-1">
                      Add industry hashtags to increase reach by 40%
                    </div>
                    <a
                      href="#"
                      className="text-blue-600 text-sm font-medium mt-2 inline-flex items-center transform transition-transform duration-300 group-hover:translate-x-2"
                    >
                      See Hashtags <span className="ml-1">→</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="group bg-white border border-[#e3e9f1] rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition flex items-start gap-3">
                {/* Icon Left */}
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#bfdbfe] flex-shrink-0">
                  <HiOutlineLightBulb className="text-[#2563eb] text-lg" />
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
                  <div className="text-sm text-[#6b7280] mt-1">
                    5 mutual connections found in target companies
                  </div>
                  <a
                    href="#"
                    className="text-blue-600 text-sm font-medium mt-2 inline-flex items-center transform transition-transform duration-300 group-hover:translate-x-2"
                  >
                    View Profiles <span className="ml-1">→</span>
                  </a>
                </div>
              </div>

              {/* Footer link */}
              <div className="border-t border-[#e3e9f1] pt-3 mt-8">
                <a
                  href="#"
                  className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  <span className="">
                    <GiStarFormation className="text-xl ms-2" />
                  </span>{" "}
                  Get More Insights →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
