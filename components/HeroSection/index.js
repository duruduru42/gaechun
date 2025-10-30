'use client'

import Image from "next/image";
import studentImage from "@/components/home_student.svg";

export default function HeroSection() {
  return (
    <section className="bg-gray-50 min-h-[calc(100vh-4rem)] pt-12 md:pt-6">
      <div
        className="
          max-w-screen-lg mx-auto
          flex flex-col md:flex-row
          items-center md:items-center
          justify-center md:justify-between
          gap-8 md:gap-0
          px-4 sm:px-6
          min-h-[70vh] md:min-h-screen
        "
      >
        {/* 텍스트 섹션 */}
        <div className="flex-1 text-left">
          <h1
            className="
              text-3xl sm:text-4xl md:text-5xl
              font-extrabold
              leading-tight md:leading-snug
              text-gray-900
            "
          >
            고른기회 전형<br />
            유일 성공 공식,<br />
            <span className="underline underline-offset-4 decoration-4 md:decoration-4 decoration-orange-500 text-black">
              개천용 입시 컨설팅
            </span>
          </h1>

          <p
            className="
              mt-6 md:mt-12
              text-base sm:text-lg md:text-xl
              text-gray-600 md:text-gray-400
              font-medium md:font-bold
            "
          >
            농어촌, 기초생활수급자 및 차상위, <br className="hidden md:block" />
            국가보훈, 특성화고 등 <br className="hidden md:block" />
            고른기회 모든 전형을 함께합니다.
          </p>

          <a href="/program" className="block md:inline-block">
            <button
              className="
                mt-8 md:mt-12
                px-4 py-3
                text-sm
                bg-orange-500 text-white font-semibold
                rounded-md shadow-md
                hover:bg-orange-600
                transition duration-200
              "
            >
              상담 신청하기
            </button>
          </a>
        </div>

        {/* 이미지 섹션 */}
        <div className="flex-1 relative flex justify-center">
          <div
            className="
              relative
              w-60 sm:w-72 md:w-96
              aspect-[3/4]
              rounded-full overflow-hidden
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
