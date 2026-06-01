'use client'

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';

import KoreaLogo from '@/components/korea.svg';
import HanyangLogo from '@/components/hanyang.svg';
import KyungheeLogo from '@/components/kyunghee.svg';
import SeoulCityLogo from '@/components/서울시립대.svg';
import SeoulEduLogo from '@/components/seoul_edu.svg';
import ChungnamLogo from '@/components/chungnam.svg';
import SeoulLogo from '@/components/seoul.svg';
import YonseiLogo from '@/components/yonsei.svg';
import EwhaLogo from '@/components/ewha.svg';
import KunkookLogo from '@/components/kunkook.svg';

/* ============================================================
 *  편집 영역 1 — 합격 사례 데이터
 *  ※ 실제 사례만 입력하세요. featured: true 인 항목이 상단 후킹 카드로 노출됩니다.
 *  ※ 마퀴(하단 흐름)에는 전체 사례가 모두 사용됩니다. 많을수록 물량감이 삽니다.
 * ============================================================ */
const CASES = [
  { univ: '한양대', dept: '국어국문학과', percentile: 48.2, grade: 4.5, scores: '5·5·3·4·6', logo: HanyangLogo, featured: true },
  { univ: '고려대', dept: '바이오시스템학과', percentile: 68.3, grade: 3.5, scores: '3·4·3·3·5', logo: KoreaLogo, featured: true },
  { univ: '충남대', dept: '약학과', percentile: 64.7, grade: 4.3, scores: '4·4·4·4·6', logo: ChungnamLogo, featured: true },
  { univ: '경희대', dept: '산업디자인학과', percentile: 64, grade: 3.4, scores: '3·6·2·4·1', logo: KyungheeLogo },
  { univ: '서울시립대', dept: '행정학과', percentile: 68.8, grade: 3.8, scores: '2·6·4·4·2', logo: SeoulCityLogo },
  { univ: '서울교대', dept: '초등교육학과', percentile: 62.7, grade: 3.9, scores: '4·3·3·5·6', logo: SeoulEduLogo },
  // 👉 실제 합격 사례를 여기에 계속 추가하세요.
];

/* ============================================================
 *  편집 영역 2 — "표본은 왜 중요한가?" (문구 자유롭게 수정)
 * ============================================================ */
// 적은 모집인원이 만드는 3가지 문제
const SAMPLE_PROBLEMS = [
  {
    title: '입결 미공개',
    desc: '일부 대학은 입시 결과를 발표하지 않아, 전체 입결 데이터를 아는 것 자체가 불가능합니다.',
  },
  {
    title: '경향성 부재',
    desc: '모든 데이터를 안다 해도, 모집인원이 적어 의미 있는 경향성이 만들어지지 않습니다.',
  },
  {
    title: '심리적 불안',
    desc: '모집인원 1~2명인 모집단위는 그 자체로 큰 심리적 불안감을 줍니다.',
  },
];

// 군별 우선순위 (가/나/다 × 1·2·3지망 = 9개 모집단위)
const GROUPS = ['가군', '나군', '다군'];

// 후킹 카드: 입력한 합격 사례 6개 전부 노출
const featured = CASES;

/* ============================================================
 *  편집 영역 3 — 하단 마퀴(합격 대학) 노출 목록
 *  ※ 로고 보유 + 상위권 위주로 추림. 로고 없는 대학은 미포함.
 *  ※ 대학·학과는 보내주신 합격 대학 리스트 기준.
 * ============================================================ */
// 윗줄과 아랫줄에 서로 다른 대학을 배치(겹침 방지)
const MARQUEE_ROW_A = [
  { univ: '서울대', dept: '사회과학계열', logo: SeoulLogo },
  { univ: '연세대', dept: '경영학과', logo: YonseiLogo },
  { univ: '연세대', dept: '첨단컴퓨팅부', logo: YonseiLogo },
  { univ: '고려대', dept: '경제학과', logo: KoreaLogo },
  { univ: '고려대', dept: '간호대학', logo: KoreaLogo },
  { univ: '경희대', dept: '글로벌커뮤니케이션학부', logo: KyungheeLogo },
  { univ: '경희대', dept: '사학과', logo: KyungheeLogo },
];
const MARQUEE_ROW_B = [
  { univ: '한양대', dept: '도시공학과', logo: HanyangLogo },
  { univ: '한양대', dept: '산업공학과', logo: HanyangLogo },
  { univ: '이화여대', dept: '인문과학대학', logo: EwhaLogo },
  { univ: '서울시립대', dept: '경영학부', logo: SeoulCityLogo },
  { univ: '건국대', dept: '사회환경공학부', logo: KunkookLogo },
  { univ: '서울교대', dept: '초등교육과', logo: SeoulEduLogo },
  { univ: '충남대', dept: '약학과', logo: ChungnamLogo },
];

// 마퀴용: 끊김 없는 루프를 위해 각 줄을 2배로 복제
const rowA = [...MARQUEE_ROW_A, ...MARQUEE_ROW_A];
const rowB = [...MARQUEE_ROW_B, ...MARQUEE_ROW_B];

export default function WrongSection2() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="bg-black overflow-hidden">
      <div className="max-w-screen-lg mx-auto px-4 md:px-0 pt-20 md:pt-36">
        {/* 섹션 타이틀 */}
        <h2 className="text-3xl md:text-5xl leading-snug font-extrabold text-white mb-20 md:mb-32">
          <span className="text-gray-500">합격확률을 높이는 것은,</span>
          <br />
          철저한 표본분석입니다.
        </h2>

        {/* ─────────── 1단계: 후킹 — 전→후 카드 ─────────── */}
        <p className="text-orange-400 font-bold text-sm md:text-base mb-5 md:mb-6">
          낮은 성적, 표본분석으로 뒤집은 상향 합격
        </p>
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-16 md:mb-40">
          {featured.map((c, i) => (
            <motion.div
              key={`${c.univ}-${c.dept}`}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-gradient-to-b from-[#1c1c1c] to-[#141414] rounded-2xl border border-white/5 p-6 md:p-8"
            >
              {/* before: 낮은 성적 */}
              <p className="text-gray-500 text-xs md:text-sm font-semibold mb-2">지원 당시 성적</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl md:text-3xl font-extrabold text-gray-300">
                  백분위 {c.percentile}
                </span>
                <span className="text-sm md:text-base font-bold text-gray-500">· {c.grade}등급</span>
              </div>
              <p className="text-gray-600 text-[11px] md:text-xs mt-1">국·수·영·탐·탐 {c.scores}</p>

              {/* 화살표 (표본분석으로 전환) */}
              <div className="flex items-center gap-2 my-4 md:my-5">
                <span className="h-px flex-1 bg-white/10" />
                <span className="text-orange-400 text-[10px] md:text-xs font-bold whitespace-nowrap">
                  표본분석 ↓
                </span>
                <span className="h-px flex-1 bg-white/10" />
              </div>

              {/* after: 합격 대학 */}
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <Image src={c.logo} alt={c.univ} width={26} height={26} className="object-contain" />
                </span>
                <div>
                  <p className="text-lg md:text-xl font-extrabold text-white leading-tight">{c.univ}</p>
                  <p className="text-sm md:text-base text-orange-300 font-bold leading-tight">
                    {c.dept} 합격
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ─────────── 2단계: 표본은 왜 중요한가? ─────────── */}
        <div className="mb-16 md:mb-40">
          <p className="text-orange-400 font-bold text-sm md:text-base mb-4 md:mb-5">
            표본은 왜 중요한가?
          </p>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-4xl font-extrabold text-white leading-snug mb-6 md:mb-8"
          >
            고른기회 전형은 <span className="text-orange-400">모집인원이 너무 적어</span>
            <br />
            입결 데이터의 통계적 가치가 낮습니다.
          </motion.h3>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl">
            표본은 일정 크기 이상이어야 신뢰할 수 있습니다. 모집인원이 1~2명이라면
            지난 데이터로 앞으로를 예측하는 것은 사실상 불가능합니다.
          </p>

          {/* 3가지 문제 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mt-10 md:mt-14">
            {SAMPLE_PROBLEMS.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                className="bg-[#141414] rounded-2xl border border-white/5 p-6 md:p-7"
              >
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-red-500/10 text-red-400 font-extrabold mb-4">
                  ✕
                </span>
                <h4 className="text-white text-base md:text-lg font-bold mb-2">{p.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ─────────── 3단계: 개천용의 해법 ─────────── */}
        <div className="mb-16 md:mb-40">
          <p className="text-orange-400 font-bold text-sm md:text-base mb-4 md:mb-5">
            그래서, 개천용의 해법
          </p>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-4xl font-extrabold text-white leading-snug mb-8 md:mb-10"
          >
            학과를 정하지 않습니다.
            <br />
            <span className="text-orange-400">우선순위</span>를 받습니다.
          </motion.h3>

          <div className="bg-[#141414] rounded-2xl border border-white/5 p-6 md:p-10">
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8 md:mb-10">
              상담 때 학과를 확정하는 대신, <b className="text-white">가·나·다군별 우선순위 학과 3개</b>씩을
              받습니다. 그러면 총 <b className="text-orange-300">9개의 모집단위</b>가 만들어집니다.
            </p>

            {/* 가/나/다 × 3지망 = 9개 모집단위 */}
            <div className="grid grid-cols-3 gap-3 md:gap-5">
              {GROUPS.map((g) => (
                <div key={g} className="text-center">
                  <p className="text-white font-bold text-sm md:text-base mb-3">{g}</p>
                  <div className="space-y-2 md:space-y-3">
                    {[1, 2, 3].map((p) => (
                      <div
                        key={p}
                        className="rounded-xl border border-white/10 bg-white/[0.03] py-3 md:py-4 text-gray-400 text-xs md:text-sm font-semibold"
                      >
                        {p}지망
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* 배정 로직 */}
            <div className="mt-8 md:mt-10 flex items-start gap-3 rounded-xl bg-orange-500/10 border border-orange-500/20 p-5 md:p-6">
              <span className="text-orange-400 text-xl leading-none mt-0.5">↳</span>
              <p className="text-gray-200 text-sm md:text-base leading-relaxed">
                각 대학 <b className="text-white">환산점수로 순위를 매겨</b>, 성적이 높은 학생에게 학과를
                먼저 배정합니다. 이렇게 <b className="text-orange-300">확실한 실질 표본</b> 안에서 내 위치를
                확인하고, 높은 성적의 경쟁자를 피하는 것 — 이것이 컨설팅의 핵심입니다.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* ─────────── 3단계: 물량 — 합격생 마퀴 (전체 폭) ─────────── */}
      <div className="pt-16 md:pt-28 pb-20 md:pb-36 w-full overflow-hidden">
        <div className="max-w-screen-lg mx-auto px-4 md:px-0 mb-8 md:mb-10">
          <p className="text-orange-400 font-bold text-sm md:text-base mb-2">
            한두 명이 아닙니다
          </p>
          <p className="text-white text-2xl md:text-4xl font-extrabold">
            수많은 합격생이 증명합니다.
          </p>
        </div>

        <div className="marquee-group space-y-4 w-full overflow-hidden">
          <MarqueeRow items={rowA} duration="48s" />
          <MarqueeRow items={rowB} duration="60s" reverse />
        </div>
      </div>
    </section>
  );
}

function MarqueeRow({ items, duration, reverse = false }) {
  return (
    // 고정 높이 + overflow-hidden. 트랙은 absolute라 흐름에서 빠져 조상 폭에 영향 없음
    <div className="relative w-full overflow-hidden h-[52px] md:h-[60px]">
      {/* 좌우 페이드 마스크 */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-black to-transparent z-10" />

      <div
        className={`absolute top-0 left-0 flex items-center h-full gap-3 md:gap-4 w-max ${
          reverse ? 'animate-marquee-rev' : 'animate-marquee'
        }`}
        style={{ '--marquee-duration': duration }}
      >
        {items.map((c, i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-full pl-2 pr-5 py-2 shrink-0"
          >
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <Image src={c.logo} alt={c.univ} width={20} height={20} className="object-contain" />
            </span>
            <span className="text-white text-sm md:text-base font-bold whitespace-nowrap">
              {c.univ} <span className="text-gray-400 font-semibold">{c.dept}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
