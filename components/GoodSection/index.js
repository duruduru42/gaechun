'use client'

import { motion } from 'framer-motion';

const PROMISES = [
  {
    no: '01',
    title: '가장 많은 표본을',
    desc: '총 상담 수 1,600명 이상, 매년 400명이 넘는 실제 표본으로 단순 과거 데이터에 기대지 않고, 최신 데이터를 통해 최적의 전략을 제시합니다.',
  },
  {
    no: '02',
    title: '철저한 표본 분석을',
    desc: '한 명의 표본이 합격·불합격을 가를 수 있음을 충분히 인지하고, 모집정원과 충원률, 타 학생들의 지원대학을 고려하는 철저한 표본분석을 진행합니다.',
  },
  {
    no: '03',
    title: '책임감 있는 후속 관리를',
    desc: '1회성 상담이나 상담 시간 채우기에 급급하지 않고, 카톡 후속관리와 파이널콜을 통해 책임감 있는 후속관리를 진행합니다.',
  },
];

export default function GoodSection() {
  return (
    <section className="bg-black py-28 md:py-40">
      <div className="max-w-screen-lg mx-auto px-4 md:px-0">
        <h2 className="text-3xl md:text-5xl font-extrabold leading-snug md:leading-snug text-white mb-14 md:mb-20">
          <span className="text-orange-400">개천용 입시 컨설팅</span>을
          <br />
          믿을 수 있는 이유
        </h2>

        <div className="space-y-4 md:space-y-5">
          {PROMISES.map((p, i) => (
            <motion.div
              key={p.no}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8 bg-[#141414] rounded-2xl border border-white/5 p-7 md:p-10"
            >
              <span className="text-orange-500/80 text-4xl md:text-5xl font-extrabold shrink-0 md:w-24">
                {p.no}
              </span>
              <div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-snug mb-3">
                  <span className="text-orange-300">{p.title}</span> 약속 드립니다.
                </h3>
                <p className="text-gray-400 text-base md:text-lg leading-relaxed">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
