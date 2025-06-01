import React from "react";
import Profile from "./Profile";
import Link from "next/link";
import Image from "next/image";
import gaechun from "@/components/gaechun.svg";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center px-24">
      {/* 로고 */}
      <Link href="/">
        <Image src={gaechun} alt="Gaechun logo" className="ml-14" width={120} />
      </Link>

      {/* 네비게이션 메뉴 */}
      <div className="flex space-x-6 text-gray-600 text-sm font-semibold ml-auto mr-12">
        {[
          { label: "모의지원", href: "/inf" },
          { label: "컨설팅 신청", href: "/program" },
          { label: "회사소개", href: "https://blog.naver.com/gaechun-dragon/222558713706" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="px-4 py-2 rounded-md hover:bg-gray-100 transition duration-200"
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* 프로필 */}
      <Profile />
    </div>
  );
}
