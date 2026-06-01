'use client'

import { useRef, useState } from 'react';

const qnaData = [
  {
    question: '컨설팅 시기는 언제인가요?',
    answer:
      '수시 원서 상담은 8~9월, 정시 원서 상담은 12월에 진행합니다. 이외에 생기부 상담의 경우 따로 제한을 두고 있지 않기 때문에 날짜 조율을 위해 공식 카톡 혹은 010-5493-3794로 문자 연락 주시기 바랍니다.',
  },
  {
    question: '컨설팅 진행을 위해서 방문해야 하나요?',
    answer:
      '개천용 컨설팅의 모든 상담은 온라인으로 진행됩니다. ZOOM, GOOGLE MEET 등 화상채팅 툴을 사용하고 후속관리의 경우에는 카톡으로 진행합니다.',
  },
  {
    question: '컨설팅 비용은 얼마인가요?',
    answer:
      '수시와 정시 원서 상담의 경우에는 45만원에 진행하고 있고, 생기부 상담의 경우 1회성과 1학기 관리 컨설팅에 따라 금액이 상이하니 따로 문의 주시기 바랍니다.',
  },
  {
    question: '상담은 몇 회 진행 기준인가요?',
    answer:
      '수시와 정시 원서 상담의 경우에는 본 상담 1회 후 이후 질문과 후속 관리는 카톡으로 진행합니다. 또한 정시의 경우에는 표본 분석이 중요하기 때문에 원서 접수 직전에 최종 연락을 드립니다. 생기부 상담의 경우 1회성과 1학기 관리 컨설팅에 따라 방법이 상이하니 따로 문의 주시기 바랍니다.',
  },
  {
    question: '진학사 합격 예측을 구매해야 하나요?',
    answer:
      '수시와 정시 원서 접수할 때 일반전형을 안정 지원으로 지원하기도 합니다. 하지만 안정지원 1개를 위해서 진학사 구매하는 것은 비효율적이기에 추천드리지 않고 있으며, 컨설팅 진행자들을 위해 일반전형 합격 예측 외부 데이터를 이용하고 있으니 따로 구매하지 않으셔도 됩니다.',
  },
  {
    question: '담당 컨설턴트 분들은 어떤 분인가요?',
    answer:
      "담당 컨설턴트를 뽑을 때는 '고른기회 전형'으로 대학을 진학하였거나 관련 업무를 해본 경우 우대하고 있습니다. 이외에는 '학생들과 학부모'님들이 납득 가능한 선에서 학업을 우수하게 마쳤고 사교육에 길에 종사하시며 간절한 학생들의 마음을 이해하는 분들로 선발합니다.",
  },
];

const QnaSection = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const itemsRef = useRef([]);

  const toggle = (i) => setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <section className="bg-black py-20 md:py-32 px-4 sm:px-5">
      <div className="max-w-screen-lg mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12 md:mb-16">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-extrabold text-white mx-auto mb-5 shadow-lg shadow-orange-500/30">
            ?
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">자주 묻는 질문</h2>
        </div>

        {/* 아코디언 */}
        <div className="space-y-3">
          {qnaData.map((item, i) => {
            const open = openIndex === i;
            return (
              <div
                key={i}
                className={`rounded-2xl border transition-colors duration-300 ${
                  open ? 'border-orange-500/40 bg-white/[0.06]' : 'border-white/10 bg-white/[0.03]'
                }`}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`qna-panel-${i}`}
                  onClick={() => toggle(i)}
                  className="w-full text-left flex justify-between items-center gap-4 px-5 py-5 sm:px-7 sm:py-6 text-base sm:text-lg md:text-xl font-bold text-white"
                >
                  <span className="flex items-center gap-3">
                    <span className={`text-sm font-extrabold ${open ? 'text-orange-400' : 'text-gray-500'}`}>Q</span>
                    {item.question}
                  </span>
                  <span
                    className={`shrink-0 text-sm transition-transform duration-300 ${
                      open ? 'rotate-180 text-orange-400' : 'text-gray-500'
                    }`}
                  >
                    ▼
                  </span>
                </button>

                <div
                  id={`qna-panel-${i}`}
                  ref={(el) => { itemsRef.current[i] = el; }}
                  style={{ maxHeight: open ? `${itemsRef.current[i]?.scrollHeight || 0}px` : '0px' }}
                  className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
                >
                  <p className="text-gray-400 text-sm sm:text-base md:text-lg text-left leading-relaxed px-5 pb-6 sm:px-7 sm:pb-7">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 후속 동선 */}
        <div className="text-center mt-12 md:mt-16">
          <p className="text-gray-400 text-sm md:text-base mb-4">더 궁금한 점이 있으신가요?</p>
          <a href="tel:010-5493-3794" className="inline-flex items-center gap-2 text-white font-bold text-lg md:text-xl hover:text-orange-400 transition-colors">
            📞 010-5493-3794
          </a>
        </div>
      </div>
    </section>
  );
};

export default QnaSection;
