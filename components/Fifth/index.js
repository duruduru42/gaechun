import Image from "next/image";
import video from "@/components/video.svg"


const Fifth = () => {
  return (
    <div className="bg-white min-h-screen px-10 py-28"> {/* 상하 패딩 늘림 */}

      <div className="flex justify-center items-center max-w-5xl mx-auto py-10"> {/* 여기에 패딩 추가 */}
        <div className="flex-1 text-left p-5">
          <h1 className="text-orange-500 text-lg font-semibold mb-4">모의지원</h1>
          <h2 className="text-4xl font-bold text-gray-800 leading-normal tracking-tight">수정예정<br/> 수정예정</h2>
          <p className="mt-4 text-lg text-gray-400 font-semibold">
          수정예정<br /> 수정예정
          </p>
        </div>

        <div className="flex-1 max-w-lg p-4 rounded-lg shadow-lg">
          <div className="flex justify-center w-full p-10 drop-shadow-xl">
            <Image src={video} alt="home" />
          </div>
        </div>
      </div>

  

    </div>
  );
};

export default Fifth;
