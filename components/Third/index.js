import React from 'react';
import vudrkdnjs from '@/components/vudrkdnjs.svg';
import dashboard from '@/components/dashboard.svg';
import video from "@/components/video.svg"
import Image from 'next/image';

const ExampleLayout = () => {
  return (
    <div className="bg-white min-h-screen px-10 py-28"> {/* 상하 패딩 늘림 */}

      <div className="flex justify-center items-center max-w-5xl mx-auto py-10"> {/* 여기에 패딩 추가 */}
        <div className="flex-1 text-left p-5">
          <h1 className="text-orange-500 text-lg font-semibold mb-4">성적표 인증</h1>
          <h2 className="text-4xl font-bold text-gray-800 leading-normal tracking-tight">실 성적표 인증으로,<br/> 모두가 믿을 수 있도록</h2>
          <p className="mt-4 text-lg text-gray-400 font-semibold">
            실제 성적표 사진으로 인증하여 허수가 없도록,<br /> 개천용과 함께 표본 조작 걱정 없이 모의지원 하세요.
          </p>
        </div>

        <div className="flex-1 max-w-lg p-4 rounded-lg shadow-lg">
          <div className="flex justify-center w-full p-10 drop-shadow-xl">
            <Image src={vudrkdnjs} alt="성적" />
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center max-w-5xl mx-auto mt-28 py-10"> {/* 마진 및 패딩 추가 */}
        <div className="flex-1 max-w-2xl p-4 rounded-lg shadow-lg">
          <div className="flex justify-center w-full drop-shadow-xl">
            <Image src={dashboard} alt="대시보드" />
          </div>
        </div>
        
        <div className="flex-1 text-left p-5 ml-20">
          <h1 className="text-orange-500 text-lg font-semibold mb-4">대학 합격률</h1>
          <h2 className="text-4xl font-bold text-gray-800 leading-normal tracking-tight">한 눈에 들어오는<br/> 대학별 합격 가능성</h2>
          <p className="mt-4 text-lg text-gray-400 font-semibold">
            자신의 위치에 맞는 원서를 쓸 수 있게, <br /> 모집단위마다 올해 예측되는 합격률을 제공합니다.
          </p>
        </div>
      </div>

      <div className="flex justify-center items-center max-w-5xl mx-auto mt-28 py-10"> {/* 마진 및 패딩 추가 */}
        <div className="flex-1 text-left p-5">
          <h1 className="text-orange-500 text-lg font-semibold mb-4">동영상 강의</h1>
          <h2 className="text-4xl font-bold text-gray-800 leading-normal tracking-tight">입시, 모르는 게 없도록<br/> 다 알려드릴게요.</h2>
          <p className="mt-4 text-lg text-gray-400 font-semibold">
            올해 입시 동향, 대학별 특징부터<br /> 합격예측 이용자에게만 제공하는 상향지원 꿀팁까지
          </p>
        </div>

        <div className="flex-1 max-w-lg p-4 rounded-lg shadow-lg">
          <div className="flex justify-center w-full p-10 drop-shadow-xl">
            <Image src={video} alt="비디오"/>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ExampleLayout;
