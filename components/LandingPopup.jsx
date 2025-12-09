// 'use client' 지시자를 포함하여 클라이언트 컴포넌트임을 명시합니다.
'use client';

// React의 useEffect와 useState 훅을 가져옵니다.
import { useEffect, useState } from 'react';
// Next.js의 Image 컴포넌트를 가져옵니다. 이미지 최적화와 올바른 경로 처리에 사용됩니다.
import Image from 'next/image';

// 팝업 이미지를 가져옵니다.
import popImageSrc from '@/components/popup1.svg';

export default function LandingPopup() {
  // 팝업의 열림/닫힘 상태를 관리하는 state를 정의합니다.
  const [isOpen, setIsOpen] = useState(false);

  // 컴포넌트 마운트 시 팝업을 즉시 엽니다.
  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) {
    return null;
  }

  return (
    // 전체 화면 오버레이
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {/* 1. 팝업 콘텐츠 컨테이너: 최대 너비를 max-w-6xl로 확대하고 배경을 흰색으로 변경합니다. */}
      <div className="relative w-full max-w-sm bg-white shadow-2xl rounded-lg overflow-hidden">
        
        {/* 2. 제목 (Header) 영역: x 버튼 포함 */}
        <div className="flex justify-between items-center p-4 bg-gray-100 border-b border-gray-300">
          <h2 className="text-xl font-bold text-gray-800">
            주요 공지사항
          </h2>
          {/* 닫기 버튼을 제목 영역 안에 배치 */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            // 닫기 버튼 스타일을 제목 영역에 맞게 단순화했습니다.
            className="text-2xl text-gray-700 hover:text-gray-900 leading-none p-1"
            aria-label="팝업 닫기"
          >
            ×
          </button>
        </div>

        {/* 이미지 내용 영역 */}
        <div className="p-0">
          {/* 팝업 이미지 컨테이너: 높이를 600px로 확대 */}
          <div style={{ position: 'relative', width: '100%', height: '600px' }}>
            <Image
              src={popImageSrc}
              alt="공지 팝업"
              fill
              // 이미지 비율을 유지하면서 컨테이너 안에 최대한 크게 표시
              style={{ objectFit: 'contain' }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}