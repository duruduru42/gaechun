'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  const apply = () => {
    setIsOpen(false);
    router.push('/program');
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

        {/* 배너 (CSS — 모든 해상도에서 선명) */}
        <div className="relative overflow-hidden rounded-3xl bg-[#0d0d0d] border border-white/10 px-7 py-9 text-center shadow-2xl">
          {/* 배경 글로우 */}
          <div className="pointer-events-none absolute -top-12 -left-12 w-36 h-36 rounded-full bg-orange-600/20 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 -right-12 w-36 h-36 rounded-full bg-red-600/20 blur-2xl" />

          {/* 번개 액센트 */}
          <span className="pointer-events-none absolute top-7 left-4 text-red-500/80 text-xl rotate-12 select-none">⚡</span>
          <span className="pointer-events-none absolute top-12 right-4 text-orange-500/80 text-xl -rotate-12 select-none">⚡</span>

          {/* 타이틀 */}
          <h2 className="relative font-black italic leading-[1.05] tracking-tight">
            <span className="block text-3xl bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              수시 컨설팅
            </span>
            <span className="block text-5xl mt-1 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              OPEN
            </span>
          </h2>

          {/* 가격 카드 */}
          <div className="relative mt-7 space-y-3">
            <PriceCard label="수시 컨설팅" price="450,000원" />
            <PriceCard label="파이널 점검 컨설팅" price="950,000원" />
          </div>

          {/* 신청 기간 */}
          <p className="relative mt-5 text-xs font-semibold text-gray-400">
            신청 기간 : 6/1 ~ 8/31
          </p>

          {/* CTA */}
          <button
            type="button"
            onClick={apply}
            className="
              relative mt-5 w-full rounded-xl
              bg-gradient-to-r from-orange-500 to-red-500
              py-3.5 text-base font-black text-white
              shadow-lg shadow-red-500/30
              hover:brightness-110 active:scale-[0.98]
              transition
            "
          >
            신청하기
          </button>
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
