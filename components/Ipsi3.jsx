import React from "react";

export default function Ipsi3() {
  return (
    <div className="w-full min-h-screen bg-black">
      {/* 상단 블루 배경 (모바일 높이만 축소) */}
      <div className="w-full h-[240px] md:h-[320px] bg-gradient-to-br from-blue-800 to-blue-500 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{ background: "radial-gradient(circle at 80% 20%, #60a5fa 40%, transparent 70%)" }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <div className="inline-block px-3 py-1 mb-3 bg-blue-700/60 rounded-full text-white text-xs md:text-sm font-semibold">
            고른기회라도 성공적인 대입을 위한
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4">정시 컨설팅</h1>
          <p className="text-sm md:text-lg text-blue-100 font-medium leading-snug">
            확실한 표본분석, <br className="md:hidden" /> 
             대학 합격에 유일한 길입니다.
          </p>
        </div>
      </div>

      {/* 상세 정보 + 가격/구매 — 데스크톱도 세로 스택 */}
<div className="w-full bg-black py-10 md:py-16 px-4 max-w-4xl mx-auto
                flex flex-col gap-8 md:gap-10">

  {/* 상세 정보 */}
  <div className="w-full text-white ml-4 md:ml-8">
    <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">정시 컨설팅 상세 정보</h2>
    <div className="mb-2 md:mb-3 text-sm md:text-base">
      <span className="text-gray-400">대상</span>
      <span className="ml-3 md:ml-4">고3, n수생</span>
    </div>
    <div className="mb-2 md:mb-3 text-sm md:text-base">
      <span className="text-gray-400">시기</span>
      <span className="ml-3 md:ml-4">12월 6일 ~ 12월 31일</span>
    </div>
    <div className="mb-2 md:mb-3 text-sm md:text-base leading-relaxed">
      <span className="text-gray-400">목적</span>
      <span className="ml-3 md:ml-4">
        정시 원서 : 가, 나, 다군 원서 결정
        <span className="block mt-2 ml-10 md:ml-[3rem]">
          프리미엄 컨설팅 : 대표 직접 상담
        </span>
      </span>
    </div>
    <div className="mb-2 md:mb-3 text-sm md:text-base leading-relaxed">
      <span className="text-gray-400">방식</span>
      <span className="ml-3 md:ml-4">
        정시 원서 : <br className="block md:hidden"/><span className="ml-10 md:ml-0">상담 1회, 후속관리, </span><br className="block md:hidden"/><span className="ml-10 md:ml-0">파이널콜 (카톡)</span>
        <span className="block ml-10 mt-2 md:ml-[3rem]">
        프리미엄 컨설팅 : <br className="block md:hidden"/>상담 1회, 후속관리, <br className="block md:hidden"/>파이널콜 (전화)
      </span>
      </span>
    </div>
  </div>

  {/* 결제/옵션 */}
  <div className="w-full bg-black text-white rounded-lg p-6 md:p-8
                  flex flex-col gap-4 md:gap-6 border border-gray-800">
    <div className="flex flex-col items-center gap-2 text-center">
      <span className="text-sm md:text-xl font-bold">정시원서 컨설팅 : 450,000원</span>
      <span className="text-sm md:text-xl font-bold">프리미엄 컨설팅 : 600,000원</span>
    </div>
    <a
      href="https://forms.gle/QpSehquRpphUvKHP6"
      target="_blank"
      rel="noopener noreferrer"
    >
      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold
                         py-2 md:py-3 rounded transition text-sm md:text-base">
        컨설팅 구매하기
      </button>
    </a>
  </div>
</div>


      {/* 고민 섹션 (동일 구성) */}
      <div className="w-full bg-[#222] py-12 md:py-16 px-4 flex flex-col items-center gap-6 md:gap-8">
        <div className="flex flex-col gap-4 md:gap-8 text-gray-300 text-sm md:text-lg max-w-xl w-full text-center">
          <span>정시 원서를 결정하고 싶은데, 어떤 대학을 지원해야 할지 모르겠어요.</span>
          <span>목표 대학은 명확한데, 지금 성적으로는 힘들 거 같아요.</span>
          <span>모집인원 1,2명인 곳을 지원하는 게 너무 불안해요.</span>
          <span>고른기회 정시 전형이 얼마나 유리한지 잘 모르겠어요.</span>
          <span>지방에 살아서 컨설팅을 받기 어려워요.</span>
        </div>
        <div className="text-gray-500 text-2xl md:text-3xl mt-6 mb-6">···</div>
        <div className="text-white text-2xl md:text-4xl font-extrabold text-center leading-snug">
          제가 갈 수 있는 대학을<br />높이고 싶어요.
        </div>
        <div className="text-orange-400 text-lg md:text-2xl font-semibold text-center mt-16 md:mt-32">
          이런 고민을 했다면<br />
          <span className="text-orange-300 font-bold">개천용 정시 컨설팅이 해답입니다.</span>
        </div>
      </div>
{/* 비교형 섹션 — 타업체와의 차이 (모바일 중앙 정렬 깔끔하게) */}
<div className="w-full bg-[#222] py-20 px-4">
  <div className="text-white text-2xl md:text-4xl font-extrabold text-center mb-12">
    개천용 컨설팅은 <br className="md:hidden" />
    이런 점이 달라요
  </div>

  {/* 모바일: 1열 중앙정렬 + 고정 최대너비 / 데스크톱: 가로 2열, 높이 맞춤 */}
  <div className="w-full max-w-4xl mx-auto
                  grid grid-cols-1 place-items-center gap-6 md:gap-8
                  md:flex md:flex-row md:items-stretch md:justify-center">
    
    {/* 타 입시 컨설팅 */}
    <div className="w-full max-w-[360px] md:max-w-none md:flex-1
                    h-full flex flex-col bg-white rounded-2xl p-5 md:p-6 gap-3 md:gap-4">
      <div className="text-center text-base md:text-lg font-bold mb-1 md:mb-2">타 입시 컨설팅</div>
      <div className="bg-gray-700 rounded-lg py-2.5 md:py-3 px-2 text-center text-white text-sm md:text-base">과거 데이터로만 상담 진행.</div>
      <div className="bg-gray-700 rounded-lg py-2.5 md:py-3 px-2 text-center text-white text-sm md:text-base">상담한 학생끼리 겹쳐도 <br/> 따로 통보 X</div>
      <div className="bg-gray-700 rounded-lg py-2.5 md:py-3 px-2 text-center text-white text-sm md:text-base">경력없는 컨설턴트가 <br/>자체적으로 결정</div>
      <div className="bg-gray-700 rounded-lg py-2.5 md:py-3 px-2 text-center text-white text-sm md:text-base">1회성 상담 후 후속관리 없음</div>
      <div className="flex justify-center my-1.5 md:my-2"><span className="text-xl md:text-2xl text-blue-400">↓</span></div>
      <div className="bg-gray-700 rounded-lg py-3 md:py-4 px-2 text-center text-white font-bold text-base md:text-lg border border-blue-700 mt-auto">
        일반전형 지원만 합격
      </div>
    </div>

    {/* 개천용 컨설팅 */}
    <div className="w-full max-w-[360px] md:max-w-none md:flex-1
                    h-full flex flex-col bg-blue-600 rounded-2xl p-5 md:p-6 gap-3 md:gap-4">
      <div className="text-center text-base md:text-lg font-bold text-white mb-1 md:mb-2">
        개천용 컨설팅
      </div>
      <div className="bg-white/80 rounded-lg py-2.5 md:py-3 px-2 text-center text-blue-900 font-semibold text-sm md:text-base">과거 데이터는 참고하고 <br/> 표본분석 우선</div>
      <div className="bg-white/80 rounded-lg py-2.5 md:py-3 px-2 text-center text-blue-900 font-semibold text-sm md:text-base">학생들 몰리지 않도록 작업</div>
      <div className="bg-white/80 rounded-lg py-2.5 md:py-3 px-2 text-center text-blue-900 font-semibold text-sm md:text-base">학생들의 모든 대학 원서 결정<br/> 크로스 체크 진행</div>
      <div className="bg-white/80 rounded-lg py-2.5 md:py-3 px-2 text-center text-blue-900 font-semibold text-sm md:text-base">상담 후 원서 접수까지 후속관리</div>
      <div className="flex justify-center my-1.5 md:my-2"><span className="text-xl md:text-2xl text-white">↓</span></div>
      <div className="bg-white rounded-lg py-3 md:py-4 px-2 text-center text-blue-700 font-bold text-base md:text-lg border border-blue-700 mt-auto">
        3등급 고려대 합격 신화
      </div>
    </div>
  </div>
</div>


      {/* 진행 단계 섹션 (구성 유지) */}
      <div className="w-full bg-[#222] py-20 px-4 flex flex-col items-center">
        <div className="max-w-3xl w-full flex flex-col items-center">
          <div className="text-gray-200 text-2xl md:text-4xl font-extrabold text-center mb-8 md:mb-10">
            <span className="text-orange-400">개천용</span>
            <span className="leading-snug text-gray-400"> 정시 컨설팅은</span><br />
            이렇게 진행돼요.
          </div>

          <div className="w-full flex flex-col gap-10 md:gap-12 mt-6 md:mt-8">
            {/* 1 */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-start w-full">
              <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-blue-600 text-white text-lg md:text-xl font-bold mr-3 md:mr-4 md:ml-4">1</div>
              <div>
                <div className="text-white text-xl md:text-2xl font-extrabold mb-1.5 md:mb-2">첫 상담 진행</div>
                <div className="text-gray-100 text-sm md:text-base font-semibold mb-1">첫 1회 화상 상담을 진행합니다. </div>
                <div className="text-gray-400 text-sm md:text-base">
                  Google Meet 화상 상담을 진행합니다. 학생의 성적과 예년의 데이터를 기반한 예측값으로 학생의 유리한 대학을 1차적으로 설정합니다.
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 my-1.5 md:my-2"></div>

            {/* 2 */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-start w-full">
              <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-blue-600 text-white text-lg md:text-xl font-bold mr-3 md:mr-4 md:ml-4">2</div>
              <div>
                <div className="text-white text-xl md:text-2xl font-extrabold mb-1.5 md:mb-2">후속관리</div>
                <div className="text-gray-100 text-sm md:text-base font-semibold mb-1">
                  상담 이후의 후속관리는 카톡으로 진행됩니다.
                </div>
                <div className="text-gray-400 text-sm md:text-base">
                  대표와 함께하는 단체 카톡방을 통해 후속관리를 진행합니다. 미처 질문하지 못했던 부분이나, 대학 관련 생각이 변경됐을 경우 추가 상담을 해드립니다.
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 my-1.5 md:my-2"></div>

            {/* 3 */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-start w-full">
              <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-blue-600 text-white text-lg md:text-xl font-bold mr-3 md:mr-4 md:ml-4">3</div>
              <div>
                <div className="text-white text-xl md:text-2xl font-extrabold mb-1.5 md:mb-2">파이널콜</div>
                <div className="text-gray-100 text-sm md:text-base font-semibold mb-1">
                  그냥 정시 컨설팅은 카톡으로, 프리미엄 컨설팅은 전화로 진행합니다.
                </div>
                <div className="text-gray-400 text-sm md:text-base">
                  파이널콜의 목적은 개천용 컨설팅 학생들의 원서를 배분해 가장 높은 합격률의 학과를 제시하는 것입니다.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA 섹션 (동일 구성, 모바일만 축소) */}
      <div className="w-full py-20 md:py-36 px-4 flex justify-center md:justify-start">
        <div className="max-w-2xl">
          <div className="text-3xl md:text-5xl font-extrabold leading-snug md:leading-snug text-gray-400 mb-6 md:mb-0 md:ml-8">
            정시 컨설팅은<br />12년 노력의<br /> <span className="text-orange-400">마무리</span>입니다.<br />
          </div>
          <div className="mt-8 md:mt-16 text-2xl md:text-4xl font-extrabold text-white mb-12 md:mb-16 md:ml-8 leading-snug md:leading-snug">
            믿을 수 있는<br /><span className="text-orange-500">개천용 컨설팅</span>에 맡기세요.
          </div>
          <a href="https://forms.gle/CPtFFeQt58gG3ATa9" target="_blank" rel="noopener noreferrer">
            <button className="mt-2 px-6 md:px-8 py-2 md:py-3 bg-blue-600 hover:bg-blue-700 text-white text-base md:text-lg font-bold rounded transition md:ml-8">
              상담 신청하기
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
