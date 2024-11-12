// app/guide/page.tsx

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const GuidePage: React.FC = () => {
  const router = useRouter();


  return (
    <div className="flex items-center justify-center w-full h-screen bg-gray-50">
      <div className="w-full bg-white p-8 rounded-md shadow-md space-y-5">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">분석결과 퍼센트(%) 설명</h1>
        </div>
        <p>올해 정시에서 개천용이 잘 맞힐지 못 맞힐지는 아무도 알 수 없습니다. 만일 개천용이 잘 맞춘다면,</p>
        <div className="space-y-2">
          <div className="flex items-center">
            <span className="font-bold text-blue-500">99%~70%</span>
            <span className="ml-2">괜히 넣었나 싶은 생각이 들 정도로 넉넉하게 합격할 것입니다.</span>
          </div>
          <div className="flex items-center">
            <span className="font-bold text-green-500">69%~60%</span>
            <span className="ml-2">무난하게 합격할 것입니다.</span>
          </div>
          <div className="flex items-center">
            <span className="font-bold text-lime-500">59%~50%</span>
            <span className="ml-2">끝까지 준비하면 결국은 문닫고 합격하겠지만 수명이 단축될 수 있으므로 추천하지는 않습니다.</span>
          </div>
          <div className="flex items-center">
            <span className="font-bold text-yellow-500">49%~40%</span>
            <span className="ml-2">온몸의 피가 말라 없어질 것이고 희망고문을 당하다가 결국 눈 앞에서 문이 닫힐 것입니다.</span>
          </div>
          <div className="flex items-center">
            <span className="font-bold text-orange-500">39%~30%</span>
            <span className="ml-2">안드로메다 예비번호를 받고 무난하게 불합격할 것입니다.</span>
          </div>
          <div className="flex items-center">
            <span className="font-bold text-red-500">29%~1%</span>
            <span className="ml-2">딱히 드릴 말씀이 없습니다.</span>
          </div>
          <div className="flex items-center">
            <span className="font-bold text-black">불가</span>
            <span className="ml-2">모집단위 조건에 따라 지원이 불가능한 곳입니다.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidePage;
