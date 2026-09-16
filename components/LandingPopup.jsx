'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// '오늘 하루 보지 않기' 저장 키
const STORAGE_KEY = 'gcd-popup-hidden-date';

// 정시 컨설팅 신청 시작일 (month는 0-indexed → 9 = 10월)
const OPEN_AT = new Date(2026, 9, 1);

const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// 오늘 0시 기준 남은 일수 (양수: 오픈 전, 0: 오늘 오픈, 음수: 접수 중)
const daysUntilOpen = () => {
  const n = new Date();
  const today = new Date(n.getFullYear(), n.getMonth(), n.getDate());
  return Math.round((OPEN_AT - today) / 86400000);
};

export default function LandingPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [dday, setDday] = useState(null);
  const router = useRouter();

  useEffect(() => {
    let hidden = false;
    try {
      hidden = localStorage.getItem(STORAGE_KEY) === todayKey();
    } catch {
      // 프라이빗 모드 등에서 접근 불가 시 그냥 노출
    }
    if (!hidden) {
      setDday(daysUntilOpen());
      setIsOpen(true);
    }
  }, []);

  if (!isOpen) return null;

  const beforeOpen = dday > 0;

  const goProgram = () => {
    setIsOpen(false);
    router.push('/program');
  };

  const hideToday = () => {
    try {
      localStorage.setItem(STORAGE_KEY, todayKey());
    } catch {
      // 저장 실패해도 닫기는 동작
    }
    setIsOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
      onClick={() => setIsOpen(false)} // 바깥(딤) 클릭 시 닫기
    >
      <div
        className="relative w-full max-w-[320px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="팝업 닫기"
          className="absolute -top-3 -right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white text-gray-800 text-xl shadow-lg hover:bg-gray-100"
        >
          ×
        </button>

        <div className="relative overflow-hidden rounded-3xl bg-[#0d0d0d] border border-white/10 px-7 pt-8 pb-5 text-center shadow-2xl">
          {/* 배경 글로우 */}
          <div className="pointer-events-none absolute -top-12 -left-12 w-36 h-36 rounded-full bg-orange-600/20 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 -right-12 w-36 h-36 rounded-full bg-red-600/20 blur-2xl" />

          {/* D-day 배지 — '아직 시작 전'임을 가장 먼저 전달 */}
          <div className="relative inline-flex items-center gap-1.5 rounded-full border border-orange-500/40 bg-orange-500/10 px-3.5 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
            <span className="text-xs font-black tracking-wide text-orange-300">
              {beforeOpen ? `오픈까지 D-${dday}` : dday === 0 ? '오늘 오픈' : '신청 접수 중'}
            </span>
          </div>

          {/* 타이틀 — 날짜가 주인공 */}
          <p className="relative mt-4 text-sm font-bold tracking-tight text-gray-400">
            정시 컨설팅
          </p>
          <h2 className="relative mt-1 font-black leading-[1.05] tracking-tight">
            <span className="block text-[2.75rem] bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              10월 1일
            </span>
            <span className="mt-1 block text-2xl text-white">신청 시작</span>
          </h2>

          {/* 가격 카드 */}
          <div className="relative mt-6 space-y-3">
            <PriceCard label="정시 컨설팅" price="450,000원" />
            <PriceCard label="프리미엄 컨설팅" price="600,000원" />
          </div>

          {/* CTA — 접수 전에는 '안내 보기', 시작 후 '신청하기' */}
          <button
            type="button"
            onClick={goProgram}
            className="
              relative mt-5 w-full rounded-xl
              bg-gradient-to-r from-orange-500 to-red-500
              py-3.5 text-base font-black text-white
              shadow-lg shadow-red-500/30
              hover:brightness-110 active:scale-[0.98]
              transition
            "
          >
            {beforeOpen ? '컨설팅 안내 보기' : '신청하기'}
          </button>

          {/* 하단 옵션 */}
          <div className="relative mt-4 flex items-center justify-between border-t border-white/10 pt-3">
            <button
              type="button"
              onClick={hideToday}
              className="text-xs font-semibold text-gray-500 hover:text-gray-300 transition"
            >
              오늘 하루 보지 않기
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold text-gray-500 hover:text-gray-300 transition"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PriceCard({ label, price }) {
  return (
    <div className="rounded-2xl bg-black/50 border border-white/10 py-3.5">
      <p className="text-[13px] font-bold text-orange-400 mb-1">{label}</p>
      <p className="text-2xl font-black text-white tracking-tight">{price}</p>
    </div>
  );
}
