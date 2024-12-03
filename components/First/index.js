import Link from "next/link";
import home from "@/components/home.svg"
import Image from "next/image";

const Hero = () => {
  return (
    <div>
    <section className="bg-white break-keep max-sm:overflow-hidden relative">
      <div className="max-w-screen-xl px-4 pt-16 mx-auto text-center lg:pt-40 lg:px-6">
        
      <a href="https://forms.gle/39QaWWAFSQxqMYH67" target="_blank" rel="noopener noreferrer">
    <button 
        class="inline-flex justify-between items-center p-1 sm:pr-2 mb-12 text-gray-700 bg-gray-100 rounded-full dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 duration-300"
    > 
        <span class="sm:text-xs text-xxs bg-orange-600 rounded-full text-white sm:px-4 sm:py-1.5 px-3 py-1 mr-3 font-semibold">클릭</span>  
        <span class="sm:text-sm text-xs font-semibold tracking-tight mr-3">2025학년도 정시 컨설팅 모집 중!! </span>  
    </button>
</a>

        <h1 className="font-bold text-6xl text-black">
          고른기회 전형 
        </h1>
        <h1 className="font-bold text-6xl text-orange-500 m-5">
          모의지원 서비스
        </h1>
        <p className="text-2xl text-gray-400 p-5 font-bold">
          전국 최초 <span className="underline underline-offset-4 decoration-4 decoration-orange-500 text-black">성적표 인증</span> 기반
        </p>
        <Link href={'/home'}>        
        <button className="rounded-2xl px-6 py-3 text-lg font-bold mt-10 mb-24 bg-black text-white">
          2025/12/6일 오픈
        </button>
        </Link>
      </div>
      <div className="flex justify-center w-full drop-shadow-xl	p-10">
      <Image src={home} alt="home" className="w-2/3" style={{ boxShadow: '0 -4px 10px rgba(0, 0, 0, 0.25)' }} /></div>
      </section>
    </div>
  );
};

export default Hero;
