'use client'  // 클라이언트 컴포넌트로 선언

import home from "@/components/home.svg"
import Image from "next/image";
import { useState, useEffect } from "react";

// 모의지원 서비스 오픈 예정일
const OPEN_DATE = new Date("2026-11-22T00:00:00");

const Hero = () => {
  const [remain, setRemain] = useState(null);

  useEffect(() => {
    const calc = () => {
      const diff = OPEN_DATE.getTime() - Date.now();
      if (diff <= 0) {
        setRemain({ d: 0, h: 0, m: 0, s: 0, open: true });
        return;
      }
      setRemain({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
        open: false,
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
    <section className="bg-white break-keep max-sm:overflow-hidden relative">
      <div className="max-w-screen-xl px-4 pt-16 mx-auto text-center lg:pt-40 lg:px-6">
        
      {/* [비활성화] 2026학년도 정시 컨설팅 모집 중 배지 - 나중에 복구 시 주석 해제
      <a href="https://forms.gle/XucNLYhTMWuHz4Tj6" target="_blank" rel="noopener noreferrer">
    <button
        class="inline-flex justify-between items-center p-1 sm:pr-2 mb-12 text-gray-700 bg-gray-100 rounded-full dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 duration-300"
    >
        <span class="sm:text-xs text-xxs bg-orange-600 rounded-full text-white sm:px-4 sm:py-1.5 px-3 py-1 mr-3 font-semibold">클릭</span>
        <span class="sm:text-sm text-xs font-semibold tracking-tight mr-3">2026학년도 정시 컨설팅 모집 중!! </span>
    </button>
</a>
      */}

        <h1 className="font-bold text-4xl sm:text-6xl text-black break-keep">
          고른기회 전형
        </h1>
        <h1 className="font-bold text-4xl sm:text-6xl text-orange-500 m-5 break-keep">
          모의지원 서비스
        </h1>
        <p className="text-lg sm:text-2xl text-gray-400 px-4 py-5 font-bold break-keep">
          전국 최초 <span className="underline underline-offset-4 decoration-4 decoration-orange-500 text-black">성적표 인증</span> 기반
        </p>
        {/* 모의지원 서비스 오픈 전 — 카운트다운 + 비활성화 버튼 */}
        <div className="mt-10 mb-24 flex flex-col items-center gap-5">
          <p className="text-sm font-bold text-gray-500">모의지원 서비스 오픈까지</p>

          {remain && !remain.open ? (
            <div className="flex gap-2 sm:gap-3">
              {[
                { label: "일", value: remain.d },
                { label: "시간", value: remain.h },
                { label: "분", value: remain.m },
                { label: "초", value: remain.s },
              ].map((u) => (
                <div
                  key={u.label}
                  className="flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-black text-white"
                >
                  <span className="text-xl sm:text-2xl font-extrabold tabular-nums">
                    {String(u.value).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] sm:text-xs text-gray-400 mt-0.5">{u.label}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-16 sm:h-20 flex items-center">
              <span className="text-lg font-bold text-orange-500">곧 오픈 예정입니다</span>
            </div>
          )}

          {/* 서비스 미운영 — 비활성화 버튼 */}
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="rounded-2xl px-6 py-3 text-lg font-bold bg-gray-200 text-gray-400 cursor-not-allowed"
          >
            11/22 오픈 예정
          </button>
        </div>
      </div>
      <div className="flex justify-center w-full drop-shadow-xl	p-10">
      <Image src={home} alt="home" className="w-2/3" style={{ boxShadow: '0 -4px 10px rgba(0, 0, 0, 0.25)' }} /></div>
      </section>
    </div>
  );
};

export default Hero;
