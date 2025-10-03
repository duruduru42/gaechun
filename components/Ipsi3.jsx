import React from "react";

export default function Ipsi3() {
  return (
    <div className="w-full min-h-screen bg-black">
      {/* 상단 블루 배경 */}
      <div className="w-full h-[320px] bg-gradient-to-br from-blue-800 to-blue-500 relative overflow-hidden">
        {/* 곡선 효과용 추가 div (옵션) */}
        <div className="absolute left-0 top-0 w-full h-full opacity-30" style={{background: 'radial-gradient(circle at 80% 20%, #60a5fa 40%, transparent 70%)'}} />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
          <div className="inline-block px-4 py-1 mb-4 bg-blue-700/60 rounded-full text-white text-sm font-semibold">고른기회라도 성공적인 대입을 위한</div>
          <h1 className="text-4xl font-bold text-white mb-4">정시 컨설팅</h1>
          <p className="text-lg text-blue-100 font-medium">확실한 표본분석<br />대학 합격에 유일한 길입니다.</p>
        </div>
      </div>
      {/* 하단 검정 배경 영역 */}
      <div className="w-full bg-black py-16 px-4 flex flex-col justify-center items-stretch gap-12 max-w-6xl mx-auto">
        {/* 상세 정보 (좌측) */}
        <div className="flex-1 min-w-[260px] text-white ml-8">
          <h2 className="text-xl font-bold mb-6">정시 컨설팅 상세 정보</h2>
          <div className="mb-3"><span className="text-gray-400">대상</span> <span className="ml-4">고3, n수생</span></div>
          <div className="mb-3"><span className="text-gray-400">시기</span> <span className="ml-4">12월 6일 (성적표 나오고)</span></div>
          <div className="mb-3"><span className="text-gray-400">목적</span> <span className="ml-4">정시 원서 : 가, 나, 다군 각각 최적의 원서 1개씩 정하기 위함. <span className="block ml-[3.7rem]">프리미엄 컨설팅 : 대표 직접 상담, 조금이라도 확률을 높이기 위한 컨설팅</span></span></div>
          <div className="mb-3"><span className="text-gray-400">방식</span> <span className="ml-4">정시 원서 : 화상 상담 1회, 원서 넣기 전까지 후속관리, 파이널콜 (카톡)<span className="block ml-[3.7rem]">프리미엄 컨설팅 : 화상상담 및 후속관리, 이후 다른 학생들의 표본을 고려한 원서 직전 파이널 콜 상담 (20분)</span></span></div>
          </div>
        {/* 결제/옵션 (우측) */}
        <div className="flex-1 min-w-[320px] bg-black text-white rounded-lg p-8 flex flex-col gap-6 border border-gray-800">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xl font-bold">정시 원서 컨설팅 : 450,000원</span>
            <span className="text-xl font-bold">프리미엄 컨설팅 (50명 한정) : 600,000원</span>
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition"><a
            href="https://forms.gle/QpSehquRpphUvKHP6"
            target="_blank"
            rel="noopener noreferrer"
            className="...버튼 스타일..."
            >
            컨설팅 구매하기
            </a></button>
        </div>
      </div>
      {/* 고민/강조 문구 섹션 */}
      <div className="w-full bg-[#222] py-16 px-4 flex flex-col items-center gap-8">
        <div className="flex flex-col gap-8 text-gray-300 text-lg max-w-xl w-full text-center">
          <span>정시 원서를 결정하고 싶은데, 어떤 대학을 지원해야 할지 모르겠어요.</span>
          <span>목표 대학은 명확한데, 지금 성적으로는 힘들 거 같아요.</span>
          <span>모집인원 1,2명인 곳을 지원하는 게 너무 불안해요.</span>
          <span>고른기회 정시 전형이 얼마나 유리한지 잘 모르겠어요.</span>
          <span>지방에 살아서 컨설팅을 받기 어려워요.</span>
        </div>
        <div className="text-gray-500 text-3xl mt-8 mb-8">···</div>
        <div className="text-white text-3xl md:text-4xl font-extrabold text-center leading-snug">
          제가 갈 수 있는 대학을<br />높이고 싶어요.
        </div>
        <div className="text-orange-400 text-2xl font-semibold text-center mt-32">
          이런 고민을 했다면<br />
          <span className="text-orange-300 font-bold">개천용 정시 컨설팅이 해답입니다.</span>
        </div>
      </div>
      {/* 비교형 섹션 */}
      <div className="w-full bg-[#222] py-20 px-4 flex flex-col items-center">
        <div className="text-white text-3xl md:text-4xl font-extrabold text-center mb-12">
          개천용 컨설팅은 <br className="md:hidden" />
          이런 점이 달라요
        </div>
        <div className="flex flex-col md:flex-row gap-8 justify-center items-start w-full max-w-4xl">
          {/* 왼쪽 박스 */}
          <div className="flex flex-col bg-white rounded-2xl p-6 gap-4 flex-1 min-w-[280px]">
            <div className="text-center text-lg font-bold mb-2">
              타 입시 컨설팅
            </div>
            <div className="bg-gray-700 rounded-lg py-3 px-2 text-center text-white">과거 데이터로만 상담 진행.</div>
            <div className="bg-gray-700 rounded-lg py-3 px-2 text-center text-white">상담한 학생끼리 겹쳐도 <br/> 따로 통보 X</div>
            <div className="bg-gray-700 rounded-lg py-3 px-2 text-center text-white">경력없는 컨설턴트가 <br/>자체적으로 결정</div>
            <div className="bg-gray-700 rounded-lg py-3 px-2 text-center text-white">1회성 상담 후 후속관리 없음</div>
            <div className="flex justify-center my-2">
              <span className="text-2xl text-blue-400">↓</span>
            </div>
              <div className="bg-gray-700 rounded-lg py-4 px-2 text-center text-white font-bold text-lg border border-blue-700">
              일반전형 지원만 합격         </div>
          </div>
          {/* 오른쪽 박스 */}
          <div className="flex flex-col bg-blue-600 rounded-2xl p-6 gap-4 flex-1 min-w-[280px]">
            <div className="text-center text-lg font-bold text-white mb-2">
              개천용 컨설팅
            </div>
            <div className="bg-white/80 rounded-lg py-3 px-2 text-center text-blue-900 font-semibold">과거 데이터는 참고하고 <br/> 표본분석 우선</div>
            <div className="bg-white/80 rounded-lg py-3 px-2 text-center text-blue-900 font-semibold">학생들 몰리지 않도록 작업</div>
            <div className="bg-white/80 rounded-lg py-3 px-2 text-center text-blue-900 font-semibold">학생들의 모든 대학 원서 결정<br/> 대표가 직접 참여</div>
            <div className="bg-white/80 rounded-lg py-3 px-2 text-center text-blue-900 font-semibold">상담 후 원서 접수까지 후속관리</div>
            <div className="flex justify-center my-2">
              <span className="text-2xl text-white">↓</span>
            </div>
            <div className="bg-white rounded-lg py-4 px-2 text-center text-blue-700 font-bold text-lg border border-blue-700">
            3등급 고려대 합격 신화
            </div>
          </div>
        </div>
      </div>
      {/* 장점 소개 섹션 */}
      <div className="w-full bg-[#222] py-20 px-4 flex flex-col items-center">
        <div className="max-w-3xl w-full flex flex-col items-center">
          <div className="text-gray-200 text-3xl md:text-4xl font-extrabold text-center mb-10">
            <span className="text-orange-400">개천용</span>
            <span className="leading-snug text-gray-400"> 정시 컨설팅은</span><br />
            이렇게 진행돼요.
          </div>
          <div className="w-full flex flex-col gap-12 mt-8">
            {/* 1번 */}
            <div className="flex flex-col md:flex-row gap-4 items-start w-full">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-xl font-bold mr-4 md:mr-8 ml-4">1</div>
              <div>
                <div className="text-white text-2xl font-extrabold mb-2">첫 상담 진행</div>
                <div className="text-gray-100 font-semibold mb-1">첫 1회 화상 상담을 진행합니다. </div>
                <div className="text-gray-400">Google Meet 화상 상담을 진행합니다. 학생의 성적과 예년의 데이터를 기반한 예측값으로 학생의 유리한 대학을 1차적으로 설정합니다.</div>
              </div>
            </div>
            <div className="border-t border-gray-700 my-2"></div>
            {/* 2번 */}
            <div className="flex flex-col md:flex-row gap-4 items-start w-full">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-xl font-bold mr-4 md:mr-8 ml-4">2</div>
              <div>
                <div className="text-white text-2xl font-extrabold mb-2">후속관리</div>
                <div className="text-gray-100 font-semibold mb-1">상담 이후의 후속관리는 카톡으로 진행됩니다.</div>
                <div className="text-gray-400">대표와 함께하는 카톡 단체 카톡방을 통해 후속관리를 진행합니다. 전에 상담에서 미처 질문하지 못했던 부분이나, 대학 관련 생각이 변경됐을 경우 추가적으로 상담을 해드립니다.
                </div>
              </div>
            </div>
            {/* 3번 */}
          <div className="border-t border-gray-700 my-2"></div>
          <div className="flex flex-col md:flex-row gap-4 items-start w-full">
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-xl font-bold mr-4 md:mr-8 ml-4">3</div>
            <div>
              <div className="text-white text-2xl font-extrabold mb-2">파이널콜</div>
              <div className="text-gray-100 font-semibold mb-1">그냥 정시 컨설팅은 카톡으로, 프리미엄 컨설팅은 전화로 진행합니다.</div>
              <div className="text-gray-400">파이널콜의 가장 큰 목적은 개천용 컨설팅을 받는 학생들의 원서를 배분해 가장 높은 합격률의 학과를 제시하는 것입니다.  </div>
            </div>
          </div>
          </div>
        </div>
      </div>
      {/* 문의 CTA 섹션 */}
      <div className="w-full  py-36 px-4 flex justify-start">
        <div className="max-w-2xl">
          <div className="text-5xl font-extrabold leading-tight text-gray-400 ml-8">
            정시 컨설팅은<br />
            12년 노력의<br />
            마무리입니다.<br />
          </div>
          <div className="mt-16 text-4xl font-extrabold text-white mb-16 ml-8 leading-tight">
            믿을 수 있는<br />
            개천용 컨설팅에 맡기세요.
          </div>
          <a 
  href="https://forms.gle/CPtFFeQt58gG3ATa9" 
  target="_blank" 
  rel="noopener noreferrer"
>
  <button className="mt-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded transition ml-8">
    상담 신청하기
  </button>
</a>

        </div>
      </div>
    </div>
  );
} 
