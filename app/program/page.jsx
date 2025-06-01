"use client";

import React from "react";
import Footer from "../../components/Footer";
import { TypeAnimation } from 'react-type-animation';
import StudentImage from "../../components/학생사진.svg";
import ConsultingTabs from "../../components/ConsultingTabs";



export default function ProgramPage() {
  return (
    <div className="min-h-screen relative bg-white">
      {/* 상단 텍스트 */}
      <section className="bg-white break-keep max-sm:overflow-hidden relative h-[35vh]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 h-full"
          style={{ backgroundImage: `url(${StudentImage.src})` }}
        />
        <div className="max-w-screen-xl px-4 pt-16 mx-auto text-center lg:pt-20 lg:px-6 relative z-10 h-full flex flex-col justify-center">
          <div className="text-4xl font-extrabold mb-4">
            <TypeAnimation
              sequence={[
                '기회는 준비된 자에게 옵니다.',
                1000,
                '고른기회 전형의 최적 해답, 지금 시작하세요.',
                1000,
              ]}
              wrapper="span"
              speed={40}
              repeat={Infinity}
            />
          </div>

        </div>
      </section>

      <ConsultingTabs />
      <Footer />
    </div>
  );
}
