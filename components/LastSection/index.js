import Link from "next/link";

const LastSection = () => {
  return (
    <section className="bg-gray-50 py-28 md:py-36">
      <div className="max-w-screen-lg mx-auto px-6 text-center">
        <p className="text-orange-500 font-bold text-sm md:text-base mb-5">
          마지막으로
        </p>

        <h2 className="font-extrabold text-2xl sm:text-3xl md:text-4xl leading-relaxed md:leading-snug text-black tracking-tight">
          고른기회 전형으로 <br className="sm:hidden" />
          대학을 입학하고 싶으신가요?
          <br />
          답은{" "}
          <span className="relative inline-block">
            <span className="relative z-10 text-orange-500">개천용 컨설팅</span>
            <span className="absolute left-0 bottom-0.5 z-0 h-3 w-full bg-orange-200/70 -rotate-1" />
          </span>
          에 있습니다.
        </h2>

        <Link href="/program" className="inline-block">
          <button
            className="
              group inline-flex items-center justify-center gap-2
              mt-12 px-8 py-4
              w-auto text-base md:text-lg
              bg-orange-500 text-white font-semibold
              rounded-xl shadow-lg shadow-orange-500/25
              hover:bg-orange-600 hover:shadow-orange-500/35
              active:scale-[0.98] transition-all duration-200
            "
          >
            상담 신청하기
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </button>
        </Link>

      </div>
    </section>
  );
};

export default LastSection;
