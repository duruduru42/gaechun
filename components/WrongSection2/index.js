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

export default function WrongSection2() {
  const [expandedBoxes, setExpandedBoxes] = useState({});

  const toggleBox = (index) => {
    setExpandedBoxes(prev => ({ ...prev, [index]: !prev[index] }));
  };

  // 공통 박스 클래스: 모바일/데스크탑 높이를 각각 지정해 데스크탑 디자인 고정
  const boxBase =
    'bg-gray-800 p-6 pb-10 rounded-lg overflow-visible md:overflow-hidden transition-all duration-500 ease-in-out relative';

  const boxHeights = (i) =>
    expandedBoxes[i]
      ? 'h-auto' // 모바일 살짝 낮춤, 데스크탑 원래 높이 유지(300)
      : 'h-[150px] md:h-[180px]'; // 모바일 살짝 낮춤, 데스크탑 원래 높이 유지(180)

  const detailClass = (i) =>
    `transition-all duration-500 ease-in-out overflow-hidden ${
      expandedBoxes[i] ? 'opacity-100 mt-6 md:mt-8' : 'opacity-0 mt-0 h-0'
    }`;

  const plusRotate = (i) =>
    ({ transform: expandedBoxes[i] ? 'rotate(45deg)' : 'rotate(0deg)' });

  return (
    <section className="bg-black">
      <div className="max-w-screen-lg mx-auto flex flex-col justify-between min-h-screen px-4 md:px-0">
        {/* 텍스트 섹션: 모바일 줄임, 데스크탑 원본 유지 */}
        <div className="flex-1 text-left mb-16 md:mb-24">
          <h2 className="text-3xl md:text-5xl mt-16 md:mt-36 leading-snug md:leading-snug  font-extrabold text-white">
            <span className="text-gray-400">합격확률을 높이는 것은,</span>
            <br />
            철저한 표본분석입니다.
          </h2>
        </div>

        {/* 합격 사례 그리드: 모바일 1열, 데스크탑 2열(원본 유지) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full mb-24 md:mb-36">
          {/* 1 */}
          <div className={`${boxBase} ${boxHeights(0)}`}>
            <div className="flex flex-col items-center gap-3 md:gap-4">
              <Image src={KoreaLogo} alt="로고1" width={30} height={30} />
              <h3 className="text-xl md:text-2xl font-bold text-white text-center">
                고려대 바이오시스템학과
              </h3>
            </div>
            <div className={detailClass(0)}>
              <div className="text-gray-400 font-bold text-center text-sm md:text-base leading-relaxed">
                상향지원 성공 사례 <br />
                평균 백분위 : 68.3 <br />
                국/수/영/탐/탐 : 34335 <br />
                평균 등급 : 3.5 <br />
              </div>
            </div>
            <div className="flex justify-center mt-3 md:mt-4">
              <button
                onClick={() => toggleBox(0)}
                className="w-8 h-8 flex items-center justify-center transition-all duration-500"
                style={plusRotate(0)}
                aria-expanded={!!expandedBoxes[0]}
                aria-label="더보기"
              >
                <Image src={PlusCircle} alt="더보기" width={24} height={24} className="invert brightness-100" />
              </button>
            </div>
          </div>

          {/* 2 */}
          <div className={`${boxBase} ${boxHeights(1)}`}>
            <div className="flex flex-col items-center gap-3 md:gap-4">
              <Image src={HanyangLogo} alt="로고2" width={40} height={40} />
              <h3 className="text-xl md:text-2xl font-bold text-white text-center">
                한양대 국어국문학과
              </h3>
            </div>
            <div className={detailClass(1)}>
              <div className="text-gray-400 font-bold text-center text-sm md:text-base leading-relaxed">
                상향지원 성공 사례 <br />
                평균 백분위 : 48.2 <br />
                국/수/영/탐/탐 : 55346 <br />
                평균 등급 : 4.5 <br />
              </div>
            </div>
            <div className="flex justify-center mt-3 md:mt-4">
              <button
                onClick={() => toggleBox(1)}
                className="w-8 h-8 flex items-center justify-center transition-all duration-500"
                style={plusRotate(1)}
                aria-expanded={!!expandedBoxes[1]}
                aria-label="더보기"
              >
                <Image src={PlusCircle} alt="더보기" width={24} height={24} className="invert brightness-100" />
              </button>
            </div>
          </div>

          {/* 3 */}
          <div className={`${boxBase} ${boxHeights(2)}`}>
            <div className="flex flex-col items-center gap-3 md:gap-4">
              <Image src={KyungheeLogo} alt="로고3" width={48} height={48} />
              <h3 className="text-xl md:text-2xl font-bold text-white text-center">
                경희대 산업디자인학과
              </h3>
            </div>
            <div className={detailClass(2)}>
              <div className="text-gray-400 font-bold text-center text-sm md:text-base leading-relaxed">
                상향지원 성공 사례 <br />
                평균 백분위 : 64 <br />
                국/수/영/탐/탐 : 36241 <br />
                평균 등급 : 3.4 <br />
              </div>
            </div>
            <div className="flex justify-center mt-3 md:mt-4">
              <button
                onClick={() => toggleBox(2)}
                className="w-8 h-8 flex items-center justify-center transition-all duration-500"
                style={plusRotate(2)}
                aria-expanded={!!expandedBoxes[2]}
                aria-label="더보기"
              >
                <Image src={PlusCircle} alt="더보기" width={24} height={24} className="invert brightness-100" />
              </button>
            </div>
          </div>

          {/* 4 */}
          <div className={`${boxBase} ${boxHeights(3)}`}>
            <div className="flex flex-col items-center gap-3 md:gap-4">
              <Image src={SeoulCityLogo} alt="로고4" width={40} height={40} />
              <h3 className="text-xl md:text-2xl font-bold text-white text-center">
                서울시립대 행정학과
              </h3>
            </div>
            <div className={detailClass(3)}>
              <div className="text-gray-400 font-bold text-center text-sm md:text-base leading-relaxed">
                상향지원 성공 사례 <br />
                평균 백분위 : 68.8 <br />
                국/수/영/탐/탐 : 26442 <br />
                평균 등급 : 3.8 <br />
              </div>
            </div>
            <div className="flex justify-center mt-3 md:mt-4">
              <button
                onClick={() => toggleBox(3)}
                className="w-8 h-8 flex items-center justify-center transition-all duration-500"
                style={plusRotate(3)}
                aria-expanded={!!expandedBoxes[3]}
                aria-label="더보기"
              >
                <Image src={PlusCircle} alt="더보기" width={24} height={24} className="invert brightness-100" />
              </button>
            </div>
          </div>

          {/* 5 */}
          <div className={`${boxBase} ${boxHeights(4)}`}>
            <div className="flex flex-col items-center gap-3 md:gap-4">
              <Image src={SeoulEduLogo} alt="로고5" width={40} height={40} />
              <h3 className="text-xl md:text-2xl font-bold text-white text-center">
                서울교대 초등교육학과
              </h3>
            </div>
            <div className={detailClass(4)}>
              <div className="text-gray-400 font-bold text-center text-sm md:text-base leading-relaxed">
                상향지원 성공 사례 <br />
                평균 백분위 : 62.7 <br />
                국/수/영/탐/탐 : 43356 <br />
                평균 등급 : 3.9 <br />
              </div>
            </div>
            <div className="flex justify-center mt-3 md:mt-4">
              <button
                onClick={() => toggleBox(4)}
                className="w-8 h-8 flex items-center justify-center transition-all duration-500"
                style={plusRotate(4)}
                aria-expanded={!!expandedBoxes[4]}
                aria-label="더보기"
              >
                <Image src={PlusCircle} alt="더보기" width={24} height={24} className="invert brightness-100" />
              </button>
            </div>
          </div>

          {/* 6 */}
          <div className={`${boxBase} ${boxHeights(5)}`}>
            <div className="flex flex-col items-center gap-3 md:gap-4">
              <Image src={ChungnamLogo} alt="로고6" width={40} height={40} />
              <h3 className="text-xl md:text-2xl font-bold text-white text-center">
                충남대 약학과
              </h3>
            </div>
            <div className={detailClass(5)}>
              <div className="text-gray-400 font-bold text-center text-sm md:text-base leading-relaxed">
                상향지원 성공 사례 <br />
                평균 백분위 : 64.7 <br />
                국/수/영/탐/탐 : 44446 <br />
                평균 등급 : 4.3 <br />
              </div>
            </div>
            <div className="flex justify-center mt-3 md:mt-4 mb-2 md:mb-4">
              <button
                onClick={() => toggleBox(5)}
                className="w-8 h-8 flex items-center justify-center transition-all duration-500"
                style={plusRotate(5)}
                aria-expanded={!!expandedBoxes[5]}
                aria-label="더보기"
              >
                <Image src={PlusCircle} alt="더보기" width={24} height={24} className="invert brightness-100" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
