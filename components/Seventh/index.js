'use client'
import Link from "next/link";

const Seventh = () => {
  return (
    <div>
    <section className="bg-black max-sm:overflow-hidden relative">
      <div className="max-w-screen-xl px-4 py-10 mx-auto text-center lg:pt-40 lg:px-6">
        <div className="font-extrabold text-4xl text-white tracking-tight">
          성공적인 입시의 꿈,<br/>
          <span className="text-orange-500 leading-loose">개천용</span>으로 이루세요.
        </div>
        <button 
        onClick={() => {
          alert("빠른 시일 내에 오픈 예정입니다.")
         }}
        className="rounded-2xl px-6 py-3 text-lg font-bold mt-10 mb-24 bg-white text-black">
          바로가기
        </button>
        {/* <Link href={'/home'}>        
        <button className="rounded-2xl px-6 py-3 text-lg font-bold mt-10 mb-24 bg-white text-black">
          바로가기
        </button>
        </Link> */}
      </div>
      </section>
    </div>
  );
};

export default Seventh;
