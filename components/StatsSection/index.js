'use client'

import { useEffect, useRef, useState } from 'react';
import StudentGraph from "@/components/ui/graph.jsx";

const STATS = [
  { label: '누적 상담 학생수', value: 1600 },
  { label: '누적 합격 학생수', value: 1200 },
  { label: '매년 실표본 수 (상담 학생 수)', value: 400 },
];

function CountUp({ to, duration = 1.6, className }) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf;
    let started = false;

    const run = () => {
      if (started) return;
      started = true;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / (duration * 1000), 1);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        setVal(Math.round(to * eased));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    // 스크롤 이벤트/IntersectionObserver가 중첩 스크롤 컨테이너에서 불안정하므로
    // 짧은 폴링으로 가시성 확인 (트리거되면 즉시 정지) — 환경 독립적으로 확실히 동작
    let intervalId;
    const check = () => {
      if (started) return;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.9 && r.bottom > 0) {
        run();
        clearInterval(intervalId);
      }
    };
    intervalId = setInterval(check, 120);
    check();

    return () => {
      clearInterval(intervalId);
      cancelAnimationFrame(raf);
    };
  }, [to, duration]);

  return (
    <span ref={ref} className={className}>
      {val.toLocaleString()}
    </span>
  );
}

export default function StatsSection() {
  return (
    <section className="relative bg-black text-white">
      <div className="max-w-screen-lg mx-auto px-4 py-20 md:py-40">
        {/* Section Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-snug md:leading-normal mb-14 md:mb-24">
          진정한 고른기회 실현을 위해<br />
          다년 간 많은 학생들을 상담하고 있습니다.
        </h2>

        {/* Statistics — 3열 균등 + 구분선 */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {STATS.map((s, i) => (
            <div key={s.label} className={`py-6 md:py-0 ${i === 0 ? 'md:pr-8' : 'md:px-8'}`}>
              <p className="text-sm md:text-base text-gray-400 mb-3">{s.label}</p>
              <h3 className="text-5xl md:text-6xl font-extrabold tracking-tight">
                <CountUp to={s.value} />
                <span className="text-gray-400">명</span>
                <span className="text-orange-500"> +</span>
              </h3>
            </div>
          ))}
        </div>

        {/* 그래프 */}
        <div className="mt-16 md:mt-24">
          <StudentGraph />
        </div>
      </div>
    </section>
  );
}
