'use client'

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

// 백분위 데이터 (0~100 스케일에서 left% 로 그대로 매핑)
const POINTS = {
  // 합격 백분위가 낮을수록 고른기회로 유리하게 합격 가능 (좋은 선택)
  min: { value: 56.17, label: '경희대 한약학과', tag: '학과를 잘 고르면' },
  // 일반전형과 거의 같은 백분위 → 고른기회 메리트가 사라지는 선택
  max: { value: 88.5, label: '경희대 컴퓨터공학과', tag: '잘못 고르면 (일반전형과 비슷)' },
  normal: { value: 89.5, label: '일반전형 평균' },
};
const GAP = (POINTS.max.value - POINTS.min.value).toFixed(1); // 32.3

export default function WrongSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delayChildren: 0.3, staggerChildren: 0.3 } },
  };
  const lineVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  const boxVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 1.2 } },
  };

  return (
    <section className="bg-black py-16 md:py-20">
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="max-w-screen-lg mx-auto px-4 pl-[max(env(safe-area-inset-left),1rem)] pr-[max(env(safe-area-inset-right),1rem)]"
      >
        {/* 인트로 카피 */}
        <div className="text-left mr-2 mb-12 md:mb-20">
          <motion.p variants={lineVariants} className="text-gray-600 text-3xl md:text-5xl font-bold mb-4 md:mb-6">
            '같은 대학이면 성적 비슷하겠지'
          </motion.p>
          <motion.p variants={lineVariants} className="text-gray-400 text-3xl md:text-5xl font-bold mb-4 md:mb-6">
            '유리하니까 적당히 넣어야지'
          </motion.p>
          <motion.p variants={lineVariants} className="text-gray-200 text-3xl md:text-5xl font-bold mb-10 md:mb-16">
            라는 생각,
          </motion.p>
          <motion.h2 variants={lineVariants} className="text-white text-3xl md:text-5xl font-bold">
            고른기회에선 <span className="text-red-500">손해</span>입니다.
          </motion.h2>
        </div>

        {/* 범위 게이지 카드 */}
        <motion.div
          variants={boxVariants}
          className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-6 sm:p-10 md:p-14"
        >
          {/* 핵심 메시지: 격차 */}
          <div className="text-center mb-12 md:mb-16">
            <p className="text-gray-400 text-sm md:text-base font-medium mb-2">
              같은 <span className="text-white font-bold">경희대</span>인데, 학과에 따라
            </p>
            <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-none">
              백분위 <span className="text-orange-500">{GAP}점</span> 차이
            </p>
          </div>

          {/* 게이지 본체 */}
          <div className="relative pt-14 pb-8 md:pt-16 md:pb-10">
            {/* 일반전형 평균 마커 (트랙 위쪽, 아래 화살표) */}
            <Marker
              position={POINTS.normal.value}
              isInView={isInView}
              placement="top"
              color="text-gray-300"
            >
              <span className="text-gray-300 text-[11px] md:text-sm font-bold whitespace-nowrap">
                일반전형 평균 {POINTS.normal.value}
              </span>
            </Marker>

            {/* 트랙 */}
            <div className="relative h-2 md:h-2.5 rounded-full bg-white/10">
              {/* 격차 강조 band: 56 → 88.5 */}
              <motion.div
                className="absolute top-0 h-full rounded-full bg-gradient-to-r from-emerald-400 via-orange-500 to-red-500"
                style={{ left: `${POINTS.min.value}%` }}
                initial={{ width: 0 }}
                animate={isInView ? { width: `${POINTS.max.value - POINTS.min.value}%` } : { width: 0 }}
                transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
              />

              {/* 점: 최저 백분위 = 유리한 좋은 선택 */}
              <Dot position={POINTS.min.value} color="bg-emerald-400" ring="ring-emerald-400/30" isInView={isInView} />
              {/* 점: 최고 백분위 = 일반전형과 비슷한 잘못된 선택 */}
              <Dot position={POINTS.max.value} color="bg-red-500" ring="ring-red-500/30" isInView={isInView} delay={0.3} />
            </div>

            {/* 점 아래 큰 숫자 (트랙 바로 아래 전용 레이어) */}
            <div className="relative h-10 md:h-12 mt-3">
              <BottomValue position={POINTS.min.value} className="text-emerald-300" />
              <BottomValue position={POINTS.max.value} className="text-red-400" />
            </div>

            {/* 0 / 100 축 라벨 */}
            <div className="flex justify-between text-[10px] md:text-xs text-gray-600 font-semibold">
              <span>백분위 0</span>
              <span>100</span>
            </div>
          </div>

          {/* 범례: 대학·학과명은 별도 행으로 분리해 가독성 확보 */}
          <div className="flex flex-col sm:flex-row sm:justify-center gap-3 sm:gap-10 mb-10 md:mb-12">
            <LegendItem dotClass="bg-emerald-400" value={POINTS.min.value} valueClass="text-emerald-300" label={POINTS.min.label} tag={POINTS.min.tag} />
            <LegendItem dotClass="bg-red-500" value={POINTS.max.value} valueClass="text-red-400" label={POINTS.max.label} tag={POINTS.max.tag} />
          </div>

          {/* 결론 한 줄 */}
          <p className="text-center text-gray-300 text-sm md:text-lg font-medium border-t border-white/5 pt-8 md:pt-10">
            잘못 고른 학과는 <span className="text-red-400 font-bold">일반전형과 다를 바 없는 백분위</span>.
            <br className="hidden sm:block" />
            <span className="text-white font-bold"> 학과 선택이 곧 고른기회의 합격을 가릅니다.</span>
          </p>

          <p className="text-center mt-6 text-gray-600 text-[11px] md:text-xs">
            * 합격자 상위 80% 기준, 기회균형 정시 전형 기준
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* 트랙 위의 점 — transform(translate)로 정확히 중앙 정렬해야 하므로 framer-motion 미사용
   (motion의 scale/transform이 Tailwind translate를 덮어쓰는 충돌 방지) */
function Dot({ position, color, ring }) {
  return (
    <div
      className={`absolute top-1/2 w-5 h-5 md:w-6 md:h-6 -translate-x-1/2 -translate-y-1/2 rounded-full ${color} ring-4 ${ring}`}
      style={{ left: `${position}%` }}
    />
  );
}

/* 트랙 위쪽 마커 (일반전형) — 우측 정렬(-translate-x-full)로 카드 밖 넘침 방지.
   translate 충돌 방지를 위해 framer-motion 미사용 */
function Marker({ position, children, color }) {
  return (
    <div
      className="absolute top-0 flex flex-col items-end -translate-x-full"
      style={{ left: `${position}%` }}
    >
      {children}
      <span className={`text-base leading-none ${color} pr-1`}>▾</span>
    </div>
  );
}

/* 점 아래 큰 숫자 (트랙 위에 중앙 정렬) */
function BottomValue({ position, className }) {
  return (
    <div
      className="absolute top-0 -translate-x-1/2 text-center"
      style={{ left: `${position}%` }}
    >
      <span className={`text-xl md:text-3xl font-extrabold leading-none ${className}`}>
        {position}
      </span>
    </div>
  );
}

/* 하단 범례 항목 */
function LegendItem({ dotClass, value, valueClass, label, tag }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`w-3 h-3 rounded-full shrink-0 ${dotClass}`} />
      <div className="text-left">
        <p className="text-gray-500 text-[11px] md:text-xs font-medium">{tag}</p>
        <p className="text-gray-200 text-sm md:text-base font-bold">
          {label} <span className={valueClass}>{value}</span>
        </p>
      </div>
    </div>
  );
}
