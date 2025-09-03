import { Tooltip } from "flowbite-react";
import { LuUser } from "react-icons/lu";
import React, { useEffect, useState } from "react";
import { FaUser, FaMicrophone, FaFeatherAlt, FaSmile } from "react-icons/fa";

const Personas = () => {
  const [personasData, setPersonasData] = useState([]);

  useEffect(() => {
    const dummyData = [
      {
        title: "Professional",
        subtitle: "Formal, business-focused communication",
        tone: { text: "professional", color: "text-blue-600", bg: "bg-blue-100" },
        style: { text: "formal", color: "text-gray-700", bg: "bg-gray-100" },
        emojis: { text: "minimal", color: "text-gray-700", bg: "bg-gray-100" },
        defaultTag: true,
      },
      {
        title: "Casual & Friendly",
        subtitle: "Relaxed, approachable communication style",
        tone: { text: "casual", color: "text-green-600", bg: "bg-green-100" },
        style: { text: "conversational", color: "text-pink-600", bg: "bg-pink-100" },
        emojis: { text: "moderate", color: "text-gray-700", bg: "bg-gray-100" },
      },
      {
        title: "Sales Expert",
        subtitle: "Consultative sales approach with expertise",
        tone: { text: "consultative", color: "text-blue-600", bg: "bg-blue-100" },
        style: { text: "detailed", color: "text-green-600", bg: "bg-green-100" },
        emojis: { text: "minimal", color: "text-gray-700", bg: "bg-gray-100" },
      },
    ];
    setPersonasData(dummyData);
  }, []);

  return (
    <div className="c-padding-r pt-12 h-screen relative pl-[390px] pr-[110px]">

      <div className="flex items-center justify-between bg-white z-10 mb-4 g-box p-4 rounded-lg shadow-sm">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center">
            <LuUser className="w-6 h-6 text-white" />
          </div>

          {/* Texts */}
          <div className="flex flex-col">
            <div className="text-2xl font-bold text-slate-900">Personas</div>
            <div className="text-sm text-[#717c8c]">
              Define your communication styles for consistent AI-powered interactions
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-slate-600">5 profiles saved</span>
            </div>
          </div>
        </div>

        {/* Right Side: Button */}

        <div className="flex flex-wrap items-center gap-3 mt-3 md:mt-0">
          {/* <Tooltip
            content="Add new Personas"
            placement="bottom"
            className="custom-tooltip c-bottom-t ex !w-auto"
          > */}
          <button
            // onClick={connectToCRM}
            className="flex items-center gap-2 border  px-4 py-2 text-sm font-medium rounded-lg border-[#2563eb] text-[#2563eb] hover:bg-[#2563eb] hover:text-white transition"
          >
            <i className="fa-solid fa-globe"></i>
            <span>+ Add new Personas</span>
          </button>
          {/* </Tooltip> */}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {personasData.map((persona, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-xl p-6 flex flex-col gap-4 hover:shadow-lg transition"
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <FaUser className="text-purple-600" />
                </div>
                <div className="font-semibold text-gray-800 text-base">
                  {persona.title}
                </div>
              </div>
            </div>

            {/* Subtitle */}
            <div className="text-sm text-[#6b7280]">{persona.subtitle}</div>

            {/* Attributes */}
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2">
                <FaMicrophone className="text-gray-400" />
                <span className="font-medium">Tone:</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${persona.tone.color} ${persona.tone.bg}`}
                >
                  {persona.tone.text}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaFeatherAlt className="text-gray-400" />
                <span className="font-medium">Style:</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${persona.style.color} ${persona.style.bg}`}
                >
                  {persona.style.text}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaSmile className="text-gray-400" />
                <span className="font-medium">Emojis:</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${persona.emojis.color} ${persona.emojis.bg}`}
                >
                  {persona.emojis.text}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

  );
};

export default Personas;
