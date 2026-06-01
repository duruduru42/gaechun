'use client'

import Image from "next/image";
import studentImage from "@/components/home_student.svg";

export default function HeroSection() {
  return (
    <section className="relative bg-gray-50 overflow-hidden">
      {/* 배경 액센트: 은은한 오렌지 글로우 (브랜드 컬러 강조) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 w-[28rem] h-[28rem] rounded-full bg-orange-200/40 blur-3xl"
      />

      <div
        className="
          relative
          max-w-screen-lg mx-auto
          flex flex-col md:flex-row
          items-center
          md:justify-between
          gap-10 md:gap-0
          px-4 sm:px-6
          py-16 md:py-0
          md:min-h-[calc(100vh-4rem)]
        "
      >
        {/* 텍스트 섹션 */}
        <div className="w-full md:flex-1 text-left">
          {/* 아이브로우 배지 */}
          <span
            className="
              inline-flex items-center gap-1.5
              rounded-full bg-orange-100 text-orange-700
              px-3.5 py-1.5
              text-xs sm:text-sm font-semibold
              ring-1 ring-orange-200/70
            "
          >
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            고른기회 전형 전문 컨설팅
          </span>

          <h1
            className="
              mt-5 md:mt-6
              text-[2rem] leading-[1.2] sm:text-4xl md:text-5xl
              font-extrabold
              md:leading-[1.25]
              text-gray-900
              tracking-tight
            "
          >
            고른기회 전형<br />
            유일 성공 공식,<br />
            <span className="relative inline-block text-gray-900">
              <span className="relative z-10">개천용 입시 컨설팅</span>
              {/* 밑줄을 하이라이트 형태로 다듬어 정돈된 느낌 부여 */}
              <span className="absolute left-0 bottom-1 z-0 h-3 w-full bg-orange-300/60 -rotate-1" />
            </span>
          </h1>

          <p
            className="
              mt-6 md:mt-8
              text-base sm:text-lg md:text-xl
              text-gray-600
              font-medium
              leading-relaxed
            "
          >
            농어촌, 기초생활수급자 및 차상위, <br className="hidden md:block" />
            국가보훈, 특성화고 등 <br className="hidden md:block" />
            고른기회 모든 전형을 함께합니다.
          </p>

          <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-3 sm:items-center">
            <a href="/program" className="block sm:inline-block">
              <button
                className="
                  group
                  inline-flex items-center justify-center gap-1.5
                  w-auto
                  px-4 py-2
                  text-sm font-semibold
                  bg-orange-500 text-white
                  rounded-lg shadow-md shadow-orange-500/25
                  hover:bg-orange-600 hover:shadow-orange-500/35
                  active:scale-[0.98]
                  transition-all duration-200
                "
              >
                상담 신청하기
                <span className="text-xs transition-transform duration-200 group-hover:translate-x-0.5">
                  →
                </span>
              </button>
            </a>

            {/* 신뢰 보조 라인 */}
            <p className="text-sm text-gray-500 font-medium sm:ml-2">
              누적 상담 <b className="text-gray-800">1,600명+</b> · 합격{" "}
              <b className="text-gray-800">1,200명+</b>
            </p>
          </div>
        </div>

        {/* 이미지 섹션 */}
        <div className="w-full md:flex-1 relative flex justify-center">
          {/* 이미지 뒤 소프트 블롭 — 어색한 타원 대신 정돈된 배경 */}
          <div
            aria-hidden
            className="absolute inset-0 m-auto w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-tr from-orange-100 to-orange-50"
          />
          <div
            className="
              relative
              w-60 sm:w-72 md:w-96
              aspect-[3/4]
              flex items-end justify-center
            "
          >
            <Image
              src={studentImage}
              alt="학생 사진과 학교 배경"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 70vw, 32rem"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
