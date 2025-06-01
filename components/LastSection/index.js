import Link from "next/link";

const Seventh = () => {
  return (
    <div className="bg-white">
    <section className="max-sm:overflow-hidden relative pb-20">
      <div className="max-w-screen-lg px-4 py-10 mx-auto text-center lg:pt-40 lg:px-6">
        <div className="font-extrabold text-4xl text-black tracking-normal leading-normal">
        고른기회 전형으로<br/>
        대학을 입학하고 싶으신가요?<br/><br/>
        답은 <span className="text-orange-500">개천용 컨설팅</span>에 있습니다.<br/>
        </div>

        <a href="/program">
        <button className="mt-12 px-6 py-3 bg-orange-500 text-white font-semibold rounded-md shadow-md hover:bg-orange-00 transition duration-200">
            상담 신청하기
          </button>
        </a>
      </div>
      </section>
    </div>
  );
};

export default Seventh;
