export default function HeroSection() {
  return (
    <section className="bg-black pb-16 md:pb-0">
      <div className="max-w-screen-lg mx-auto flex justify-between items-center min-h-screen px-6 md:px-0">
        {/* 텍스트 섹션 */}
        <div className="flex-1 text-left my-30 md:my-60">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-snug  md:leading-snug text-white">
            <span className=" text-orange-400">개천용 입시 컨설팅</span>을<br />
            믿을 수 있는 이유<br />
          </h1>

          {/* 블록 1 */}
          <h2
            className="
              text-2xl sm:text-3xl md:text-5xl 
              mt-12 md:mt-36 
              font-extrabold leading-snug  md:leading-snug text-white
            "
          >
            <span className="text-orange-300 block md:inline">가장 많은 표본을</span>
            <br className="hidden md:block" />
           약속 드립니다.
          </h2>
          <p className="text-gray-200 text-base sm:text-lg md:text-xl mt-4 md:mt-6">
            총 상담 수 1600명 이상, 매년 400명이 넘는 실제 표본으로 <br className="hidden md:block" />
            단순 과거 데이터에 기대지 않고, 최신 데이터를 통해 최적의 전략을 제시합니다.
          </p>

          {/* 블록 2 */}
          <h2
            className="
              text-2xl sm:text-3xl md:text-5xl 
              mt-12 md:mt-36 
              font-extrabold leading-snug  md:leading-snug text-white
            "
          >
            <span className="text-orange-300 block md:inline">철저한 표본 분석을</span>
            <br className="hidden md:block" />
            약속 드립니다.
          </h2>
          <p className="text-gray-200 text-base sm:text-lg md:text-xl mt-4 md:mt-6">
            한 명의 표본이 합격 불합격을 가를 수 있음을 충분히 인지하고, <br className="hidden md:block" />
            모집정원과 충원률, 타 학생들의 지원대학을 고려하는 철저한 표본분석을 진행합니다.
          </p>

          {/* 블록 3 */}
          <h2
            className="
              text-2xl sm:text-3xl md:text-5xl 
              mt-12 md:mt-36 
              font-extrabold leading-snug md:leading-snug text-white
            "
          >
            <span className="text-orange-300 block md:inline">책임감 있는 후속 관리를</span>
            <br className="hidden md:block" />
            약속 드립니다.
          </h2>
          <p className="text-gray-200 text-base sm:text-lg md:text-xl mt-4 md:mt-6">
            책임감 없이 1회성 상담을 진행하거나, 상담 시간 채우기에 급급하지 않고 <br className="hidden md:block" />
            카톡을 통한 후속관리, 파이널콜을 통해 책임감 있는 후속관리를 진행합니다.
          </p>
        </div>

      </div>
    </section>
  );
}
