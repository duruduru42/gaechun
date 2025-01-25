import Image from "next/image";
import studentImage from "@/components/home_student.svg"; // 이미지 경로를 실제 경로로 변경하세요.

export default function HeroSection() {
  return (
    <section className="bg-gray-50" style={{ minHeight: "calc(100vh - 4rem)" }}>
      <div className="max-w-screen-lg mx-auto flex justify-between items-center min-h-screen">
      {/* 텍스트 섹션 */}
        <div className="flex-1 text-left">
          <h1 className="text-5xl font-extrabold leading-snug text-gray-900">
            고른기회 전형<br />
            유일 성공 공식,<br />
            <span className="underline underline-offset-4 decoration-4 decoration-orange-500 text-black">개천용 입시 컨설팅</span>
          </h1>
          <p className="text-gray-400 text-xl font-bold mt-12">
            농어촌, 기초생활수급자 및 차상위, 국가보훈, <br />
            특성화고 등 고른기회의 모든 전형을 함께합니다.
          </p>
          <a href="https://open.kakao.com/o/se4mzOnf">
          <button className="mt-12 px-6 py-3 bg-orange-500 text-white font-semibold rounded-md shadow-md hover:bg-orange-00 transition duration-200">
            상담 신청하기
          </button>
          </a>
        </div>

        {/* 이미지 섹션 */}
        <div className="flex-1 relative flex justify-center">
          <div className="w-96 aspect-[3/4] rounded-full overflow-hidden">
            <Image
              src={studentImage}
              alt="학생 사진과 학교 배경"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}