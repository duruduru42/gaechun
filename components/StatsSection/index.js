import StudentGraph from "@/components/ui/graph.jsx";

export default function StatsSection() {
    return (
      <section className="relative bg-black text-white min-h-screen flex flex-col justify-center items-center">
        {/* Section Title */}
        <div className="w-full max-w-screen-lg text-left text-4xl font-bold mt-48 mb-24 leading-normal">
            진정한 고른기회 실현을 위해<br/>
            다년 간 많은 학생들을 상담하고 있습니다.<br/> 
        </div>
  
        {/* Statistics */}
        <div className=" w-full max-w-screen-lg mx-auto grid grid-cols-2 grid-rows-2 text-left md:gap-y-12">
          {/* Stat 1 */}
          <div>
          <p className="text-base md:text-lg mb-2">누적 상담 학생수</p>
            <h3 className="text-5xl md:text-6xl font-extrabold">1,300명 +</h3>
          </div>
  
          {/* Stat 2 */}
          <div>
          <p className="text-base md:text-lg mb-2">누적 합격 학생수</p>

            <h3 className="text-5xl md:text-6xl font-extrabold">1,000명 +</h3>
          </div>
  
          {/* Stat 3 */}
          <div>
          <p className="text-base md:text-lg mt-6 mb-2">매년 실표본 수 (상담 학생 수)</p>

            <h3 className="text-5xl md:text-6xl font-extrabold">350명 +</h3>
          </div>
        </div>
  
        <StudentGraph/>

      </section>
    );
  }
  