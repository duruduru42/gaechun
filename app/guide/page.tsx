'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const GuidePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'합격확률' | '변수등급'>('합격확률');
  const router = useRouter();

  const 합격확률Content = (
  
    <div className="space-y-2">
    <div className="flex items-center">
      <span className="font-bold text-2xl text-blue-700">90% 이상</span>
      <span className="ml-2 font-semibold pl-2">안정 기준점보다 10% 이상일 때입니다. <br/>
      계열별 모집의 경우 합격이 보장되었다 봐도 되고, <br/>
      과별 모집의 경우 일반전형보다 입결이 높은 기이한 현상이 있지 않는 한, 합격입니다. </span>
    </div>
    <div className="flex items-center">
      <span className="font-bold text-2xl text-blue-400">80%~90%</span>
      <span className="ml-2 font-semibold">안정 기준점을 넘겼을 때입니다. <br/>
      계열별 모집의 경우 합격한다고 봐도 되고, <br/>
      과별 모집의 경우 10개의 학과중에서 1개 정도를 제외하고는 합격할 성적입니다. (이것까지는 고려하지 못 합니다.) </span>
    </div>
    <div className="flex items-center">
      <span className="font-bold text-2xl  text-lime-500">60%~80%</span>
      <span className="ml-2 font-semibold">안정 기준점과 적정 기준점 사이입니다. <br/>
      계열별 모집의 경우 웬만하면 합격한다고 봐도 되고, <br/>
      과별 모집의 경우 합격 사례가 많지만, 불합격 사례가 가끔 있기도 합니다. 하지만 2개를 넣으면 하나는 보통 합격합니다.</span>
    </div>
    <div className="flex items-center">
      <span className="font-bold  text-2xl text-yellow-500">40%~60%</span>
      <span className="ml-2 font-semibold">적정 기준점과 소신 기준점 사이입니다. <br/>
      계열별 모집의 경우 추가합격으로 끝나는 경우가 많지만 불합격이 나오기도 합니다. <br/>
      과별 모집의 경우 합격 사례와 불합격 사례가 공존합니다. 리스크가 살짝 있지만, 그만큼 기댓값이 있는 영역입니다.</span>
    </div>
    <div className="flex items-center">
      <span className="font-bold text-2xl text-orange-500">20%~40%</span>
      <span className="ml-2 font-semibold">소신 기준점과 상향 기준점 사이입니다. <br/>
      계열별 모집의 경우 불합격이 대다수입니다. <br/>
      과별 모집의 경우 변수등급이 4,5등급인 대학에서 합격사례가 꽤 있지만, 불합격 사례도 그만큼 많이 존재합니다.</span>
    </div>
    <div className="flex items-center">
      <span className="font-bold text-2xl  text-red-500">20%~10%</span>
      <span className="ml-2 font-semibold">상향 기준점보다 성적이 낮습니다. <br/>
      계열별 모집의 경우 작년처럼 연세대 2배 증원으로 인한 일시적 빵구가 아니라면, 불합격입니다. <br/>
      과별 모집의 경우 변수등급이 5등급인 대학에서 합격사례가 가끔 나옵니다만, 대부분 불합격입니다.</span>
    </div>
    <div className="flex items-center">
      <span className="font-bold text-2xl text-black">10% 미만</span>
      <span className="ml-2 font-semibold pl-2">지원을 추천하지 않습니다.</span>
    </div>
  </div>
  );

  const 변수등급Content = (
    <div className="space-y-2">
      <div className="flex items-center">
        <span className="font-bold text-2xl text-blue-500">1등급</span>
        <span className="ml-2 font-semibold pl-2">계열별 모집, 과별 편차 거의 없음, 정확도 높음, <br/>안정/적정 지원에 적합, 일반전형과 비슷한 안정도</span>
      </div>
      <div className="flex items-center">
        <span className="font-bold text-2xl text-green-500">2등급</span>
        <span className="ml-2 font-semibold pl-2">계열별 모집 or 모집인원 많은 과별모집, 정확도 높음,<br/> 안정/적정 지원에 적합하지만 약간의 변수가 있을 수 있음.</span>
      </div>
      <div className="flex items-center">
        <span className="font-bold text-2xl text-yellow-500">3등급</span>
        <span className="ml-2 font-semibold pl-2">무난한 모집인원을 가진 과별모집 (2명 이상), 입결 발표한 대학들, <br/>적정 대학으로 적합한 대학들, 과별 모집 특성 상 학과별 편차 불가피함.</span>
      </div>
      <div className="flex items-center">
        <span className="font-bold text-2xl text-orange-500">4등급</span>
        <span className="ml-2 font-semibold pl-2">적은 모집인원을 가진 과별모집 (1~2명), 올해 변수가 있는 대학들 (ex : 신설 대학), <br/>소신/상향 대학으로 적합한 대학들, 과별 모집 특성 상 학과별 편차 불가피하며 표본분석 중요함.</span>
      </div>
      <div className="flex items-center">
        <span className="font-bold text-2xl text-red-500">5등급</span>
        <span className="ml-2 font-semibold pl-2">적은 모집인원을 가진 과별모집 (1명), 학과별 편차 굉장히 큼, <br/>상향 지원 대학으로 적합한 대학들, 절대 안정지원 금지. 예측이 무의미하며 표본분석 굉장히 중요</span>
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-center w-full h-screen bg-gray-50">
      <div className="w-2/3 bg-white p-8 rounded-md shadow-md space-y-5">
        {/* Tab Navigation */}
        <nav className="bg-white pt-2 sm:mt-8 sm:sticky sm:top-0 top-9 z-30">
          <div className="flex items-center sm:gap-2 gap-3 max-sm:px-4">
            <button
              onClick={() => setActiveTab('합격확률')}
              className={`sm:text-xl text-lg font-bold sm:px-1 pb-1 border-b-2 duration-200 ${
                activeTab === '합격확률' ? 'border-orange-600 text-gray-800' : 'border-transparent text-gray-300'
              }`}
            >
              합격확률 가이드
            </button>
            <button
              onClick={() => setActiveTab('변수등급')}
              className={`sm:text-xl text-lg font-bold sm:px-1 pb-1 border-b-2 duration-200 ${
                activeTab === '변수등급' ? 'border-orange-600 text-gray-800' : 'border-transparent text-gray-300'
              }`}
            >
               변수등급 가이드
            </button>
          </div>
          <hr />
        </nav>

        {/* Content */}
        <div className="mt-4">
          {activeTab === '합격확률' ? 합격확률Content : 변수등급Content}
        </div>
      </div>
    </div>
  );
};

export default GuidePage;
