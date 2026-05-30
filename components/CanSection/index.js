import Link from "next/link";

const CanSection = () => {
  return (
    <section className="bg-gray-50 py-28 md:py-40">
      <div className="max-w-screen-lg mx-auto px-6 text-center">
        <p className="text-2xl md:text-4xl font-bold text-black leading-relaxed md:leading-relaxed tracking-tight">
          성공적인{" "}
          <Highlight>고른기회 전형</Highlight> 입시 마무리,
          <br />
          <Highlight>개천용 입시 컨설팅</Highlight>과 함께라면,
          <br />
          어렵지 않을 거에요.
        </p>

        <Link href="/program" className="inline-block">
          <button
            className="
              group inline-flex items-center justify-center gap-2
              mt-10 md:mt-12 px-7 py-3.5
              text-base font-semibold
              bg-orange-500 text-white
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

function Highlight({ children }) {
  return (
    <span className="relative inline-block">
      <span className="relative z-10 text-orange-500">{children}</span>
      <span className="absolute left-0 bottom-0.5 z-0 h-2.5 w-full bg-orange-200/70 -rotate-1" />
    </span>
  );
}

export default CanSection;
