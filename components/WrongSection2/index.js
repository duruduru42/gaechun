'use client'

import { useState } from 'react';
import Image from 'next/image';
import KoreaLogo from '@/components/korea.svg';
import HanyangLogo from '@/components/hanyang.svg';
import KyungheeLogo from '@/components/kyunghee.svg';
import SeoulCityLogo from '@/components/서울시립대.svg';
import SeoulEduLogo from '@/components/seoul_edu.svg';
import ChungnamLogo from '@/components/chungnam.svg';
import PlusCircle from '@/components/plus-circle.svg';

export default function HeroSection() {
    const [expandedBoxes, setExpandedBoxes] = useState({});

    const toggleBox = (index) => {
        setExpandedBoxes(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    return (
      <section className="bg-black">
        <div className="max-w-screen-lg mx-auto flex flex-col justify-between min-h-screen">
          {/* 텍스트 섹션 */}
          <div className="flex-1 text-left mb-24">
            <h2 className="text-5xl mt-36 font-extrabold leading-snug text-white">
              <span className="text-gray-400">합격확률을 높이는 것은,</span>
              <br />
              철저한 표본분석입니다.
            </h2>
          </div>

          {/* 합격 사례 그리드 */}
          <div className="grid grid-cols-2 gap-6 w-full mb-36">
            {/* 첫 번째 박스 */}
            <div className={`bg-gray-800 p-6 pb-8 rounded-lg overflow-hidden transition-all duration-500 ease-in-out relative
              ${expandedBoxes[0] ? 'h-[300px]' : 'h-[180px]'}`}>
              <div className="flex flex-col items-center gap-4">
                <Image src={KoreaLogo} alt="고려대학교 로고" width={30} height={30} />
                <h3 className="text-2xl font-bold text-white text-center">고려대 바이오시스템학과</h3>
              </div>
              
              <div className={`transition-all duration-500 ease-in-out overflow-hidden
                ${expandedBoxes[0] ? 'opacity-100 mt-8' : 'opacity-0 mt-0 h-0'}`}>
                <div className="text-gray-400 font-bold text-center">
                  상향지원 성공 사례 <br/>
                  평균 백분위 : 68.3 <br/>
                  국/수/영/탐/탐 : 34335 <br/>
                  평균 등급 : 3.5 <br/>
                </div>
              </div>

              <div className="flex justify-center mt-4">
                <button 
                  onClick={() => toggleBox(0)}
                  className="w-8 h-8 flex items-center justify-center transition-all duration-500"
                  style={{ transform: expandedBoxes[0] ? 'rotate(45deg)' : 'rotate(0deg)' }}
                >
                  <Image 
                    src={PlusCircle} 
                    alt="더보기" 
                    width={24} 
                    height={24}
                    className="invert brightness-100"
                  />
                </button>
              </div>
            </div>

            {/* 두 번째 박스 */}
            <div className={`bg-gray-800 p-6 pb-8 rounded-lg overflow-hidden transition-all duration-500 ease-in-out relative
              ${expandedBoxes[1] ? 'h-[300px]' : 'h-[180px]'}`}>
              <div className="flex flex-col items-center gap-4">
                <Image src={HanyangLogo} alt="한양대학교 로고" width={40} height={40} />
                <h3 className="text-2xl font-bold text-white text-center">한양대 국어국문학과</h3>
              </div>
              
              <div className={`transition-all duration-500 ease-in-out overflow-hidden
                ${expandedBoxes[1] ? 'opacity-100 mt-8' : 'opacity-0 mt-0 h-0'}`}>
                <div className="text-gray-400 font-bold text-center">
                  상향지원 성공 사례 <br/>
                  평균 백분위 : 48.2 <br/>
                  국/수/영/탐/탐 : 55346 <br/>
                  평균 등급 : 4.5 <br/>
                </div>
              </div>

              <div className="flex justify-center mt-4">
                <button 
                  onClick={() => toggleBox(1)}
                  className="w-8 h-8 flex items-center justify-center transition-all duration-500"
                  style={{ transform: expandedBoxes[1] ? 'rotate(45deg)' : 'rotate(0deg)' }}
                >
                  <Image 
                    src={PlusCircle} 
                    alt="더보기" 
                    width={24} 
                    height={24}
                    className="invert brightness-100"
                  />
                </button>
              </div>
            </div>

            {/* 세 번째 박스 */}
            <div className={`bg-gray-800 p-6 pb-8 rounded-lg overflow-hidden transition-all duration-500 ease-in-out relative
              ${expandedBoxes[2] ? 'h-[300px]' : 'h-[180px]'}`}>
              <div className="flex flex-col items-center gap-4">
                <Image src={KyungheeLogo} alt="경희대학교 로고" width={48} height={48} />
                <h3 className="text-2xl font-bold text-white text-center">경희대 산업디자인학과</h3>
              </div>
              
              <div className={`transition-all duration-500 ease-in-out overflow-hidden
                ${expandedBoxes[2] ? 'opacity-100 mt-8' : 'opacity-0 mt-0 h-0'}`}>
                <div className="text-gray-400 font-bold text-center">
                  상향지원 성공 사례 <br/>
                  평균 백분위 : 64 <br/>
                  국/수/영/탐/탐 : 36241 <br/>
                  평균 등급 : 3.4 <br/>
                </div>
              </div>

              <div className="flex justify-center mt-4">
                <button 
                  onClick={() => toggleBox(2)}
                  className="w-8 h-8 flex items-center justify-center transition-all duration-500"
                  style={{ transform: expandedBoxes[2] ? 'rotate(45deg)' : 'rotate(0deg)' }}
                >
                  <Image 
                    src={PlusCircle} 
                    alt="더보기" 
                    width={24} 
                    height={24}
                    className="invert brightness-100"
                  />
                </button>
              </div>
            </div>

            {/* 네 번째 박스 */}
            <div className={`bg-gray-800 p-6 pb-8 rounded-lg overflow-hidden transition-all duration-500 ease-in-out relative
              ${expandedBoxes[3] ? 'h-[300px]' : 'h-[180px]'}`}>
              <div className="flex flex-col items-center gap-4">
                <Image src={SeoulCityLogo} alt="서울시립대학교 로고" width={40} height={40} />
                <h3 className="text-2xl font-bold text-white text-center">서울시립대 행정학과</h3>
              </div>
              
              <div className={`transition-all duration-500 ease-in-out overflow-hidden
                ${expandedBoxes[3] ? 'opacity-100 mt-8' : 'opacity-0 mt-0 h-0'}`}>
                <div className="text-gray-400 font-bold text-center">
                  상향지원 성공 사례 <br/>
                  평균 백분위 : 68.8 <br/>
                  국/수/영/탐/탐 : 26442 <br/>
                  평균 등급 : 3.8 <br/>
                </div>
              </div>

              <div className="flex justify-center mt-4">
                <button 
                  onClick={() => toggleBox(3)}
                  className="w-8 h-8 flex items-center justify-center transition-all duration-500"
                  style={{ transform: expandedBoxes[3] ? 'rotate(45deg)' : 'rotate(0deg)' }}
                >
                  <Image 
                    src={PlusCircle} 
                    alt="더보기" 
                    width={24} 
                    height={24}
                    className="invert brightness-100"
                  />
                </button>
              </div>
            </div>

            {/* 다섯 번째 박스 */}
            <div className={`bg-gray-800 p-6 pb-8 rounded-lg overflow-hidden transition-all duration-500 ease-in-out relative
              ${expandedBoxes[4] ? 'h-[300px]' : 'h-[180px]'}`}>
              <div className="flex flex-col items-center gap-4">
                <Image src={SeoulEduLogo} alt="서울교육대학교 로고" width={40} height={40} />
                <h3 className="text-2xl font-bold text-white text-center">서울교대 초등교육학과</h3>
              </div>
              
              <div className={`transition-all duration-500 ease-in-out overflow-hidden
                ${expandedBoxes[4] ? 'opacity-100 mt-8' : 'opacity-0 mt-0 h-0'}`}>
                <div className="text-gray-400 font-bold text-center">
                  상향지원 성공 사례 <br/>
                  평균 백분위 : 62.7 <br/>
                  국/수/영/탐/탐 : 43356 <br/>
                  평균 등급 : 3.9 <br/>
                </div>
              </div>

              <div className="flex justify-center mt-4">
                <button 
                  onClick={() => toggleBox(4)}
                  className="w-8 h-8 flex items-center justify-center transition-all duration-500"
                  style={{ transform: expandedBoxes[4] ? 'rotate(45deg)' : 'rotate(0deg)' }}
                >
                  <Image 
                    src={PlusCircle} 
                    alt="더보기" 
                    width={24} 
                    height={24}
                    className="invert brightness-100"
                  />
                </button>
              </div>
            </div>

            {/* 여섯 번째 박스 */}
            <div className={`bg-gray-800 p-6 pb-8 rounded-lg overflow-hidden transition-all duration-500 ease-in-out relative
              ${expandedBoxes[5] ? 'h-[300px]' : 'h-[180px]'}`}>
              <div className="flex flex-col items-center gap-4">
                <Image src={ChungnamLogo} alt="충남대학교 로고" width={40} height={40} />
                <h3 className="text-2xl font-bold text-white text-center">충남대 약학과</h3>
              </div>
              
              <div className={`transition-all duration-500 ease-in-out overflow-hidden
                ${expandedBoxes[5] ? 'opacity-100 mt-8' : 'opacity-0 mt-0 h-0'}`}>
                <div className="text-gray-400 font-bold text-center">
                  상향지원 성공 사례 <br/>
                  평균 백분위 : 64.7 <br/>
                  국/수/영/탐/탐 : 44446 <br/>
                  평균 등급 : 4.3 <br/>
                </div>
              </div>

              <div className="flex justify-center mt-4 mb-4">
                <button 
                  onClick={() => toggleBox(5)}
                  className="w-8 h-8 flex items-center justify-center transition-all duration-500"
                  style={{ transform: expandedBoxes[5] ? 'rotate(45deg)' : 'rotate(0deg)' }}
                >
                  <Image 
                    src={PlusCircle} 
                    alt="더보기" 
                    width={24} 
                    height={24}
                    className="invert brightness-100"
                  />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>
    );
  }