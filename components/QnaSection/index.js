'use client'

import { useState } from 'react';

const QnaSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const qnaData = [
    {
      question: "컨설팅 시기는 언제인가요?",
      answer: "수시 원서 상담은 8~9월, 정시 원서 상담은 12월에 진행합니다. 이외에 생기부 상담의 경우 따로 제한을 두고 있지 않기 때문에 날짜 조율을 위해 공식 카톡 혹은 010-5493-3794로 문자 연락 주시기 바랍니다."
    },
    {
      question: "컨설팅 진행을 위해서 방문해야 하나요?",
      answer: "개천용 컨설팅의 모든 상담은 온라인으로 진행됩니다. ZOOM, GOOGLE MEET 등 화상채팅 툴을 사용하고 후속관리의 경우에는 카톡으로 진행합니다."
    },
    {
      question: "컨설팅 비용은 얼마인가요?",
      answer: "수시와 정시 원서 상담의 경우에는 45만원에 진행하고 있고, 생기부 상담의 경우 1회성과 1학기 관리 컨설팅에 따라 금액이 상이하니 따로 문의 주시기 바랍니다."
    },
    {
        question: "상담은 몇 회 진행 기준인가요?",
        answer: "수시와 정시 원서 상담의 경우에는 본 상담 1회 후 이후 질문과 후속 관리는 카톡으로 진행합니다. 또한 정시의 경우에는 표본 분석이 중요하기 때문에 원서 접수 직전에 최종 연락을 드립니다. 생기부 상담의 경우 1회성과 1학기 관리 컨설팅에 따라 방법이 상이하니 따로 문의 주시기 바랍니다."
      },
      {
        question: "진학사 합격 예측을 구매해야 하나요?",
        answer: "수시와 정시 원서 접수할 때 일반전형을 안정 지원으로 지원하기도 합니다. 하지만 안정지원 1개를 위해서 진학사 구매하는 것은 비효율적이기에 추천드리지 않고 있으며, 컨설팅 진행자들을 위해 일반전형 합격 예측 외부 데이터를 이용하고 있으니 따로 구매하지 않으셔도 됩니다."
      },
      {
        question: "담당 컨설턴트 분들은 어떤 분인가요?",
        answer: "담당 컨설턴트를 뽑을 때는 '고른기회 전형'으로 대학을 진학하였거나 관련 업무를 해본 경우 우대하고 있습니다. 이외에는 '학생들과 학부모'님들이 납득 가능한 선에서 학업을 우수하게 마쳤고 사교육에 길에 종사하시며 간절한 학생들의 마음을 이해하는 분들로 선발합니다. "
      }
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-black py-20 px-5">
      <div className="max-w-7xl mx-auto text-center">
        <div className="w-[74px] h-[74px] bg-orange-500 rounded-full flex items-center justify-center text-4xl text-white mx-auto mb-5">
          ?
        </div>
        <h2 className="text-4xl text-white mb-12">자주 묻는 질문</h2>
        
        <div className="max-w-screen-lg mx-auto">
          {qnaData.map((item, index) => (
            <div key={index} className="mb-4">
              <button 
                className="w-full p-10 text-2xl bg-white/5 hover:bg-white/10 rounded-xl text-white text-left flex justify-between items-center transition-colors duration-300"
                onClick={() => toggleAccordion(index)}
              >
                {item.question}
                <span className={`text-lg transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 bg-white/[0.03] rounded-b-xl
                  ${openIndex === index ? 'max-h-[200px] p-5' : 'max-h-0'}`}
              >
                <p className="text-white text-2xl text-left p-5 leading-normal">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QnaSection;
