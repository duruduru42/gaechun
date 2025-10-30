import Link from "next/link";

const Seventh = () => {
  return (
    <div className="bg-white pt-2 md:pt-0">
      <section className="relative">
        <div className="max-w-screen-lg pt-32 pb-32 mx-auto text-center lg:pt-60 lg:px-6">
          {/* 텍스트 */}
          <div className="font-extrabold text-2xl sm:text-3xl md:text-4xl leading-relaxed md:leading-normal text-black tracking-tight">
            <p className="mb-6">
              고른기회 전형으로 <br className="sm:hidden" />
              대학을 입학하고 싶으신가요?
            </p>
            <p>
              답은{" "}
              <span className="text-orange-500">개천용 컨설팅</span>에
              있습니다.
            </p>
          </div>

          {/* 버튼 */}
          <Link href="/program">
            <button
              className="
                mt-12 px-6 py-3
                w-1/2 sm:w-auto
                bg-orange-500 text-white font-semibold
                rounded-md shadow-md
                hover:bg-orange-600 transition duration-200
              "
            >
              상담 신청하기
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Seventh;
