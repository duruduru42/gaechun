import React from "react";

export default function Ipsi1() {
  return (
    <div className="w-full min-h-screen bg-black">
      {/* 상단 블루 배경 (모바일 높이 축소) */}
      <div className="w-full h-[240px] md:h-[320px] bg-gradient-to-br from-blue-800 to-blue-500 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(circle at 80% 20%, #60a5fa 40%, transparent 70%)",
          }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <div className="inline-block px-3 py-1 mb-3 bg-blue-700/60 rounded-full text-white text-xs md:text-sm font-semibold">
            고른기회라도 성공적인 대입을 위한
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4">
            생기부 컨설팅
          </h1>
          <p className="text-sm md:text-lg text-blue-100 font-medium leading-snug">
            미리 준비하는 생기부,<br className="md:hidden" />
            대학을 올리는 유일한 길입니다.
          </p>
        </div>
      </div>

      {/* 상세 정보 + 가격/구매 (세로 스택, ipsi 포맷) */}
      <div className="w-full bg-black py-10 md:py-16 px-4 max-w-4xl mx-auto flex flex-col gap-8 md:gap-10">
        {/* 상세 정보 */}
        <div className="w-full text-white ml-4 md:ml-8">
          <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">
            생기부 컨설팅 상세 정보
          </h2>
          <div className="mb-2 md:mb-3 text-sm md:text-base">
            <span className="text-gray-400">대상</span>
            <span className="ml-3 md:ml-4">고1~3학생</span>
          </div>
          <div className="mb-2 md:mb-3 text-sm md:text-base">
            <span className="text-gray-400">시기</span>
            <span className="ml-3 md:ml-4">상시 진행</span>
          </div>
          <div className="mb-2 md:mb-3 text-sm md:text-base leading-relaxed">
            <span className="text-gray-400">목적</span>
            <span className="ml-3 md:ml-4">
              진단형 : 생기부 장단점 체크
              <span className="block mt-2 ml-10 md:ml-[3rem]">
                관리형 : 생기부 관리
              </span>
            </span>
          </div>
          <div className="mb-2 md:mb-3 text-sm md:text-base leading-relaxed">
            <span className="text-gray-400">방식</span>
            <span className="ml-3 md:ml-4">
              진단형 : 상담 1회, 후속관리 1개월
              <span className="block mt-2 ml-10 md:ml-[3.7rem]">
                관리형 : 1학기 카톡 상시 연락
              </span>
            </span>
          </div>
        </div>

        {/* 결제/옵션 */}
        <div className="w-full bg-black text-white rounded-lg p-6 md:p-8 flex flex-col gap-4 md:gap-6 border border-gray-800">
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="text-sm md:text-xl font-bold">
              진단형 : 400,000원
            </span>
            <span className="text-sm md:text-xl font-bold">
              관리형 : 950,000원
            </span>
          </div>
          <a
            href="https://forms.gle/MDGAaHAKQh66nn1w9"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 md:py-3 rounded transition text-sm md:text-base">
              컨설팅 구매하기
            </button>
          </a>
        </div>
      </div>

      {/* 고민 섹션 */}
      <div className="w-full bg-[#222] py-12 md:py-16 px-4 flex flex-col items-center gap-6 md:gap-8">
        <div className="flex flex-col gap-4 md:gap-8 text-gray-300 text-sm md:text-lg max-w-xl w-full text-center">
          <span>나름 생기부를 열심히 채우는데, 잘 하는 건지 모르겠어요.</span>
          <span>목표 대학은 명확한데, 지금 내신으로는 힘들 거 같아요.</span>
          <span>좋은 생기부가 뭔지 잘 모르겠어요.</span>
          <span>중간에 진로를 바꿨어요. 괜찮을까요?</span>
          <span>지방에 살아서 컨설팅을 받기 어려워요.</span>
        </div>
        <div className="text-gray-500 text-2xl md:text-3xl mt-6 mb-6">···</div>
        <div className="text-white text-2xl md:text-4xl font-extrabold text-center leading-snug">
          제가 갈 수 있는 대학을<br />
          높이고 싶어요.
        </div>
        <div className="text-orange-400 text-lg md:text-2xl font-semibold text-center mt-16 md:mt-32">
          이런 고민을 했다면<br />
          <span className="text-orange-300 font-bold">
            생기부 컨설팅이 해답입니다.
          </span>
        </div>
      </div>

      {/* 비교형 섹션 — 상황 맞춤 선택 (모바일 가운데 정렬 깔끔하게) */}
      <div className="w-full bg-[#222] py-20 px-4">
        <div className="text-white text-2xl md:text-4xl font-extrabold text-center mb-12">
          상황에 맞는 <br className="md:hidden" />
          컨설팅을 선택하세요.
        </div>

        <div className="w-full max-w-4xl mx-auto
                  grid grid-cols-1 place-items-center gap-6 md:gap-8
                  md:flex md:flex-row md:items-stretch md:justify-center">
          {/* 왼쪽 박스 */}
          <div className="flex flex-col bg-white rounded-2xl p-5 md:p-6 gap-3 md:gap-4 min-w-[280px]">
            <div className="text-center text-base md:text-lg font-bold mb-1 md:mb-2">
              고2 이상 학생
            </div>
            <div className="bg-gray-700 rounded-lg py-2.5 md:py-3 px-2 text-center text-white text-sm md:text-base">
              수시, 정시 고민일 때
            </div>
            <div className="bg-gray-700 rounded-lg py-2.5 md:py-3 px-2 text-center text-white text-sm md:text-base">
              내가 채운 생기부가 <br />경쟁력 있는지 궁금할 때
            </div>
            <div className="bg-gray-700 rounded-lg py-2.5 md:py-3 px-2 text-center text-white text-sm md:text-base">
              앞으로의 목표를 <br /> 명확히 하고 싶을 때
            </div>
            <div className="bg-gray-700 rounded-lg py-2.5 md:py-3 px-2 text-center text-white text-sm md:text-base">
              내신이 낮아 고민일 때
            </div>
            <div className="flex justify-center my-1.5 md:my-2">
              <span className="text-xl md:text-2xl text-blue-400">↓</span>
            </div>
            <div className="bg-gray-700 rounded-lg py-3 md:py-4 px-2 text-center text-white font-bold text-base md:text-lg border border-blue-700">
              진단형 생기부 컨설팅
            </div>
          </div>

          {/* 오른쪽 박스 */}
          <div className="flex flex-col bg-blue-600 rounded-2xl p-5 md:p-6 gap-3 md:gap-4 min-w-[280px]">
            <div className="text-center text-base md:text-lg font-bold text-white mb-1 md:mb-2">
              고1 ~ 고3 학생
            </div>
            <div className="bg-white/80 rounded-lg py-2.5 md:py-3 px-2 text-center text-blue-900 font-semibold text-sm md:text-base">
              학종으로 대학을 가고 싶을 때
            </div>
            <div className="bg-white/80 rounded-lg py-2.5 md:py-3 px-2 text-center text-blue-900 font-semibold text-sm md:text-base">
              학교에서 생기부에 무신경할 때
            </div>
            <div className="bg-white/80 rounded-lg py-2.5 md:py-3 px-2 text-center text-blue-900 font-semibold text-sm md:text-base">
              수행평가, 시험 준비에 바빠서 <br /> 생기부 채우기가 버거울 때
            </div>
            <div className="bg-white/80 rounded-lg py-2.5 md:py-3 px-2 text-center text-blue-900 font-semibold text-sm md:text-base">
              계속 열심히 채우고 있는데, <br /> 최선인지 고민일 때
            </div>
            <div className="flex justify-center my-1.5 md:my-2">
              <span className="text-xl md:text-2xl text-white">↓</span>
            </div>
            <div className="bg-white rounded-lg py-3 md:py-4 px-2 text-center text-blue-700 font-bold text-base md:text-lg border border-blue-700">
              관리형 생기부 컨설팅
            </div>
          </div>
        </div>
      </div>

      {/* 진행 단계 섹션 */}
      <div className="w-full bg-[#222] py-20 px-4 flex flex-col items-center">
        <div className="max-w-3xl w-full flex flex-col items-center">
          <div className="text-gray-200 text-2xl md:text-4xl font-extrabold text-center mb-8 md:mb-10">
            <span className="text-orange-400">관리형</span>
            <span className="leading-snug text-gray-400"> 생기부 컨설팅은</span>
            <br />
            이렇게 진행돼요.
          </div>
          <div className="w-full flex flex-col gap-10 md:gap-12 mt-6 md:mt-8">
            {/* 1 */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-start w-full">
              <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-blue-600 text-white text-lg md:text-xl font-bold mr-3 md:mr-4 md:ml-4">
                1
              </div>
              <div>
                <div className="text-white text-xl md:text-2xl font-extrabold mb-1.5 md:mb-2">
                  OT 진행
                </div>
                <div className="text-gray-100 text-sm md:text-base font-semibold mb-1">
                  첫 1회 화상 상담을 진행합니다.{" "}
                </div>
                <div className="text-gray-400 text-sm md:text-base">
                  간단한 생기부 리뷰를 진행합니다. 이후 학생과의 대화를 통해
                  앞으로의 목표, 진로, 고교 상황 등을 고려하여 앞으로의 전략을
                  수립합니다.
                </div>
              </div>
            </div>
            <div className="border-t border-gray-700 my-1.5 md:my-2"></div>
            {/* 2 */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-start w-full">
              <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-blue-600 text-white text-lg md:text-xl font-bold mr-3 md:mr-4 md:ml-4">
                2
              </div>
              <div>
                <div className="text-white text-xl md:text-2xl font-extrabold mb-1.5 md:mb-2">
                  주기적인 소통을 통한 생기부 관리
                </div>
                <div className="text-gray-100 text-sm md:text-base font-semibold mb-1">
                  대부분의 상담은 카톡으로 진행됩니다.
                </div>
                <div className="text-gray-400 text-sm md:text-base">
                  3학년 1학기 때 채워야 할 방향성, 수행평가 주제, 세특 내용,
                  자율 활동 등 주제 선정에 있어서 조언 등을 진행합니다.
                </div>
              </div>
            </div>
            <div className="border-t border-gray-700 my-1.5 md:my-2"></div>
            {/* 3 */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-start w-full">
              <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-blue-600 text-white text-lg md:text-xl font-bold mr-3 md:mr-4 md:ml-4">
                3
              </div>
              <div>
                <div className="text-white text-xl md:text-2xl font-extrabold mb-1.5 md:mb-2">
                  직접적 주제 선정 3개
                </div>
                <div className="text-gray-100 text-sm md:text-base font-semibold mb-1">
                  컨설턴트 추천 주제는 3개입니다. (추가 시 추가비용)
                </div>
                <div className="text-gray-400 text-sm md:text-base">
                  학생의 목표 대학 인재상, 학과 인재상, 전학년도 홣동 등을
                  고려하여 직접적 주제 3개를 선정합니다.
                </div>
              </div>
            </div>
            <div className="border-t border-gray-700 my-1.5 md:my-2"></div>
            {/* 4 */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-start w-full">
              <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-blue-600 text-white text-lg md:text-xl font-bold mr-3 md:mr-4 md:ml-4">
                4
              </div>
              <div>
                <div className="text-white text-xl md:text-2xl font-extrabold mb-1.5 md:mb-2">
                  생기부 첨삭 및 추가 활동 제안
                </div>
                <div className="text-gray-100 text-sm md:text-base font-semibold mb-1">
                  학기 말, 최종 점검을 통해 부족한 부분을 체크합니다.
                </div>
                <div className="text-gray-400 text-sm md:text-base">
                  고교 분위기에 따라서 세특을 수정하며, 부족한 활동이나 평가가
                  되지 않을 활동을 체크하고 추가 활동을 제안합니다.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA 섹션 */}
      <div className="w-full py-20 md:py-36 px-4 flex justify-start">
        <div className="max-w-2xl">
          <div className="text-3xl md:text-5xl font-extrabold leading-snug md:leading-snug text-gray-400 mb-6 md:mb-0 md:ml-8">
            <span className="text-orange-500">생활기록부</span><br />
            준비는<br />
            언제 시작해도<br />
            늦지 않습니다.
          </div>
          <div className="mt-8 md:mt-16 text-2xl md:text-4xl font-extrabold text-white mb-12 md:mb-16 md:ml-8 leading-snug md:leading-snug">
            지금 바로<br />
            미래에 투자하세요.
          </div>
          <a
            href="https://forms.gle/MDGAaHAKQh66nn1w9"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="mt-2 px-6 md:px-8 py-2 md:py-3 bg-blue-600 hover:bg-blue-700 text-white text-base md:text-lg font-bold rounded transition md:ml-8">
              상담 신청하기
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
