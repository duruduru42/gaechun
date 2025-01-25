export default function HeroSection() {
  return (
    <section className="bg-black">
      <div className="max-w-screen-lg mx-auto flex justify-between items-center min-h-screen">
      {/* 텍스트 섹션 */}
        <div className="flex-1 text-left my-60">
          <h1 className="text-4xl font-extrabold leading-snug text-white">
            <span className=" text-orange-400">개천용 입시 컨설팅</span>을<br />
            믿을 수 있는 이유<br />
          
          </h1>

          <h2 className="text-5xl mt-36 font-extrabold leading-snug text-white">
           <span className="text-orange-300">가장 많은 표본을</span>
            <br />
            약속 드립니다.
          </h2>
          <p className="text-gray-200 text-xl mt-6">
            총 상담 수 1000명 이상, 매년 300명이 넘는 실 표본으로 <br />
            단순 과거 데이터에 기대지 않고, 최신 데이터를 통해 최적의 전략을 제시합니다.
          </p>

          <h2 className="text-5xl mt-36 font-extrabold leading-snug text-white">
           <span className="text-orange-300">철저한 표본 분석을</span>
            <br />
            약속 드립니다.
          </h2>
          <p className="text-gray-200 text-xl mt-6">
            한 명의 표본이 합격 불합격을 가를 수 있음을 충분히 인지하고, <br />
            모집정원과 충원률, 타 학생들의 지원대학을 고려하는 철저한 표본분석을 진행합니다.
          </p>

          <h2 className="text-5xl mt-36 font-extrabold leading-snug text-white">
           <span className="text-orange-300">책임감 있는 후속 관리를</span>
            <br />
            약속 드립니다.
          </h2>

          <p className="text-gray-200 text-xl mt-6">
            책임감 없이 1회성 상담을 진행하거나, 상담 시간 채우기에 급급하지 않고 <br />
            카톡을 통한 후속관리, 파이널콜을 통해 책임감 있는 후속관리를 진행합니다.
          </p>

        </div>
      </div>
    </section>
  );
}