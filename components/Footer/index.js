'use client'

import Channeltalk from '@/components/channel_talk'

const Footer = () => {

  return (
    <footer className="w-full border-t border-t-foreground/10 p-8 text-center text-xs bg-gray-50">
      <div className="space-y-2">
        {/* 상호명 및 대표자 */}
        <p>
          <span className="font-bold">상호명:</span> 개천용 입시 컨설팅
        </p>
        <p>
          <span className="font-bold">대표자명:</span> 김하민
        </p>

        {/* 사업자 등록 정보 */}
        <p>
          <span className="font-bold">사업자등록번호:</span> 710-04-02549
        </p>
        <p>
          <span className="font-bold">사업장 주소:</span> 서울 강남구 논현로132길 13
        </p>

        {/* 연락처 */}
        <p>
          <span className="font-bold">유선 전화번호:</span>{" "}
          <a
            href="tel:010-5493-3794"
            className="hover:underline text-blue-600"
          >
            010-5493-3794
          </a>
        </p>
      </div>

      {/* Powered by Section */}
      <p className="mt-4 text-gray-500">
        <a
          href="https://www.gaechundragon.co.kr/"
          target="_blank"
          className="font-bold hover:underline text-gray-600"
          rel="noreferrer"
        >
          개천용 입시 컨설팅
        </a>
        ㅣ
        <a
          href="https://branched-polo-ce5.notion.site/141e04c31f16809881edfe22f974666e?pvs=4"
          target="_blank"
          className="font-bold hover:underline text-gray-600"
          rel="noreferrer"
        >
          이용약관
        </a>

      </p>

    </footer>
  );
};

export default Footer;