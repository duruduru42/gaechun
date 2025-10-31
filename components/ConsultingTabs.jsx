import React, { useState } from "react";
import Ipsi1 from "../components/Ipsi1";
import Ipsi2 from "../components/Ipsi2";
import Ipsi3 from "../components/Ipsi3";

const tabData = [
  {
    label: "정시컨설팅",
    content: (
      <div className="py-8 text-lg text-gray-700">
        <Ipsi3 />
      </div>
    ),
  },
  {
    label: "생기부컨설팅",
    content: (
      <div className="py-8 text-lg text-gray-700">
        <Ipsi1 />
      </div>
    ),
  },
  {
    label: "수시컨설팅",
    content: (
      <div className="py-8 text-lg text-gray-700">
        <Ipsi2 />
      </div>
    ),
  },
];

export default function ConsultingTabs() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      {/* 탭 헤더 */}
      <div
        className="w-screen pb-8 flex justify-center gap-6 md:gap-48 border-b border-gray-200 relative"
        style={{ marginLeft: "50%", transform: "translateX(-50%)" }}
      >
        {tabData.map((tab, idx) => (
          <React.Fragment key={tab.label}>
            <button
              onClick={() => setActiveTab(idx)}
              className={`relative text-sm md:text-xl font-semibold bg-transparent border-none outline-none transition-colors duration-200
                ${
                  activeTab === idx
                    ? "text-orange-500"
                    : "text-gray-700 hover:text-orange-400"
                }`}
              style={{ appearance: "none" }}
            >
              <span>{tab.label}</span>

              {/* 활성 탭 하단 바 */}
              {activeTab === idx && (
                <span className="absolute left-0 right-0 -bottom-1 h-0.5 bg-orange-500 rounded-full" />
              )}
            </button>

            {/* 버튼 사이 구분선 (모바일 포함 항상 보임) */}
            {idx < tabData.length - 1 && (
              <div className="w-px h-5 md:h-6 bg-gray-300 self-center" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      <div className="p-6">{tabData[activeTab].content}</div>
    </div>
  );
}
