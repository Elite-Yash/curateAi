import {
  FaLightbulb,
  FaRegFileAlt,
  FaRegCommentAlt,
  FaUsers,
  FaUser,
  FaArrowRight,
} from "react-icons/fa";
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
import { Link } from "react-router-dom";
// import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Target } from "lucide-react";
import { LuLightbulb } from "react-icons/lu";

const actions = [
  {
    title: "Generate Post",
    description: "Create engaging LinkedIn content",
    icon: FaRegFileAlt,
    color: "from-blue-500 to-blue-600",
    link: "content-studio",
  },
  {
    title: "Smart Reply",
    description: "AI-powered message responses",
    icon: FaRegCommentAlt,
    color: "from-pink-500 to-pink-600",
    link: "message-assistant",
  },
  {
    title: "Save Profile",
    description: "Add LinkedIn profiles to CRM",
    icon: FaUsers,
    color: "from-purple-500 to-purple-600",
    link: "save-profile",
  },
  {
    title: "Switch Persona",
    description: "Change communication style",
    icon: FaUser,
    color: "from-orange-500 to-orange-600",
    link: "personas",
  },
];

const Home = () => {
  return (
    <>
      <div className="c-padding-r py-12  h-screen relative pl-[390px] pr-[110px]">
        {/* EVA Command Center div */}
        <div className="flex items-center justify-between p-8 mb-6 bg-white rounded-2xl shadow-md g-box">
          {/* Left Section */}
          <div className="flex items-start gap-4">
            {/* Logo */}
            <div className="flex items-center justify-center w-12 h-12 border-[#2563eb] border-[2px] rounded-full text-white">
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
                <span className="flex items-center px-3 py-1 text-xs font-bold text-[#599870] bg-[#dcfce7] rounded-md cursor-pointer">
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
          <div className="flex items-center justify-center w-32 h-32 rounded-full bg-blue-100 text-[#2563eb]">
            <LuLightbulb size={32} className="w-16 h-16" />
          </div>
        </div>

        <div className="shadow-lg bg-white rounded-2xl p-6 mb-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-blue-600 text-lg">⚡</span>
              <div className="text-xl font-bold ">Quick Actions</div>
            </div>
            <span className="text-sm text-slate-500 cursor-pointer">
              Choose your next move
            </span>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-24">
            {actions.map((action, index) => (
              <Link key={index} to={action.link}>
                <div className="p-6 border border-[#e2e8f0] rounded-xl hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col items-center gap-4 group">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <action.icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Text */}
                  <div className="text-center">
                    <div className="font-medium text-slate-800">
                      {action.title}
                    </div>
                    <div className="text-sm text-[#6b7280]">
                      {action.description}
                    </div>
                  </div>

                  {/* Arrow */}
                  <FaArrowRight className="w-4 h-4 text-[#6b7280] group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex gap-6 ">
          {/* Left Side (Recent Activity + Performance) */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
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
              <div className="flex flex-col items-center justify-center py-18">
                <div className="text-[#9ca3af] text-xl">No recent activity</div>
                <div className="text-[#9ca3af] text-sm mb-1">
                  Start generating content to see your activity here..
                </div>
              </div>
            </div>

            {/* This Week's Performance Section */}
            <div className="rounded-xl border text-div-foreground border-none shadow-lg bg-white/80 backdrop-blur-sm g-box">
              {/* Header */}
              <div className="flex flex-col space-y-1.5 p-6 pb-4">
                <div className="font-semibold leading-none tracking-tight flex text-xl items-center gap-2">
                  <FiTrendingUp className="w-5 h-5 text-slate-600" />
                  This Week&apos;s Performance
                </div>
              </div>

              {/* divs Grid */}
              <div className="p-6 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Profile Views */}
                  <div className="p-4 bg-[#f0f8ff] rounded-xl hover:bg-[#d7dbdf] transition-colors duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-blue-600">
                        <FiEye className="w-4 h-4" />
                      </div>
                      <div className="flex items-center gap-1 text-xs font-medium text-green">
                        <FiArrowUpRight className="w-3 h-3 text-green" /> +0%
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900 mb-1">
                        0
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
                        <FiArrowUpRight className="w-3 h-3 text-green" /> +0%
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900 mb-1">
                        0
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
                        <FiArrowUpRight className="w-3 h-3 text-green" /> +0%
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900 mb-1">
                        0
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
                        <FiArrowDownRight className="w-3 h-3 text-red" /> -0%
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900 mb-1">
                        0
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

          {/* Right Side */}

          <div className="w-full lg:w-1/3 space-y-6">
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

              {/* div 1 */}
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
                  <div className="text-sm text-[#6b7280] mb-3">
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

              {/* div 2 */}
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
                    <div className="text-sm text-[#6b7280] mb-3">
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

              {/* div 3 */}
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
                  <div className="text-sm text-[#6b7280] mb-3">
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
                    <GiStarFormation className="text-xl me-2" />
                  </span>{" "}
                  Get More Insights →
                </a>
              </div>
            </div>

            {/* LinkedIn Tips */}
            {/* <Card className="border-none shadow-lg bg-gradient-to-br from-[#fffbeb] to-orange-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="w-5 h-5 text-amber-600" />
                  LinkedIn Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">
                    Post at optimal times
                  </p>
                  <p className="text-xs text-slate-500">
                    Tuesday-Thursday, 8-10 AM shows highest engagement
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">
                    Use relevant hashtags
                  </p>
                  <p className="text-xs text-slate-500">
                    3-5 industry hashtags boost visibility by 40%
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">
                    Engage authentically
                  </p>
                  <p className="text-xs text-slate-500">
                    Meaningful comments get 5x more responses
                  </p>
                </div>
              </CardContent>
            </Card> */}
            <div className="border-none shadow-lg bg-gradient-to-br rounded-xl p-5 from-[#fffbeb] to-orange-50">
              <div className="pb-3">
                <div className="flex items-center gap-2 text-lg">
                  <Target className="w-5 h-5 text-[#d97706]" />
                  LinkedIn Tips
                </div>
              </div>
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="font-semibold text-gray-800 text-base">
                    Post at optimal times
                  </div>
                  <div className="text-sm text-[#6b7280] mt-1">
                    Tuesday-Thursday, 8-10 AM shows highest engagement
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-semibold text-gray-800 text-base">
                    Use relevant hashtags
                  </div>
                  <div className="text-sm text-[#6b7280] mt-1">
                    3-5 industry hashtags boost visibility by 40%
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-semibold text-gray-800 text-base">
                    Engage authentically
                  </div>
                  <div className="text-sm text-[#6b7280] mt-1">
                    Meaningful comments get 5x more responses
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
