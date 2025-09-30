import React, { useState } from "react";
import Ipsi1 from "../components/Ipsi1";
import Ipsi2 from "../components/Ipsi2";
import Ipsi3 from "../components/Ipsi3";


const tabData = [
  {
    label: "생기부 컨설팅",
    content: (
      <div className="py-8 text-lg text-gray-700">
        <Ipsi1 />     
 </div>
    ),
  },
  {
    label: "수시 컨설팅",
    content: (
      <div className="py-8 text-lg text-gray-700">
        <Ipsi2 />     
            </div>
    ),
  },
  {
    label: "정시 컨설팅",
    content: (
      <div className="py-8 text-lg text-gray-700">
        <Ipsi3 />
     </div>
    ),
  },
];

export default function ConsultingTabs() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      <div className="w-screen flex justify-center gap-48 border-b border-gray-200 relative" style={{ marginLeft: '50%', transform: 'translateX(-50%)' }}>
        {tabData.map((tab, idx) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(idx)}
            className={`relative pb-2 text-lg font-semibold bg-transparent border-none outline-none transition-colors duration-200
              ${activeTab === idx ? 'text-orange-500' : 'text-gray-700 hover:text-orange-400'}`}
            style={{ appearance: 'none' }}
          >
            <span>{tab.label}</span>
            <span className={`ml-1 text-xs align-middle transition-colors duration-200 ${activeTab === idx ? 'text-orange-500' : 'text-transparent'}`}>▼</span>
            {activeTab === idx && (
              <span className="absolute left-0 right-0 -bottom-1 h-0.5 bg-orange-500 rounded-full" />
            )}
          </button>
        ))}
      </div>
      <div className="p-6">
        {tabData[activeTab].content}
      </div>
    </div>
  );
} 