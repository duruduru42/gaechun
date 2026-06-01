'use client'
import Link from "next/link";

const Seventh = () => {
  return (
    <div>
    <section className="bg-black max-sm:overflow-hidden relative">
      <div className="max-w-screen-xl px-4 py-10 mx-auto text-center lg:pt-40 lg:px-6">
        <div className="font-extrabold text-2xl sm:text-4xl text-white tracking-tight break-keep">
          성공적인 입시의 꿈,<br/>
          <span className="text-orange-500 leading-loose">개천용</span>으로 이루세요.
        </div>

        {/* 모의지원 서비스 미운영 — 비활성화 (오픈 시 아래 Link 복구)
        <Link href={'/home'}>
        <button className="rounded-2xl px-6 py-3 text-lg font-bold mt-10 mb-24 bg-white text-black">
          바로가기
        </button>
        </Link>
        */}
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="rounded-2xl px-6 py-3 text-lg font-bold mt-10 mb-24 bg-gray-700 text-gray-400 cursor-not-allowed"
        >
          11/22 오픈 예정
        </button>
      </div>
      </section>
    </div>
  );
};

export default Seventh;
