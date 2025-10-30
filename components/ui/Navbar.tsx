"use client";
import React, { useState } from "react";
import Profile from "./Profile";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import gaechun from "@/components/gaechun.svg";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "모의지원", href: "/inf" },
    { label: "컨설팅 신청", href: "/program" },
    { label: "회사소개", href: "https://blog.naver.com/gaechun-dragon/222558713706" },
  ];

  return (
    <header className="border-b">
      {/* 상단 바 */}
      <div
        className="
          grid grid-cols-[auto_1fr_auto] items-center gap-x-4
          px-[clamp(1rem,4vw,6rem)]
          py-[clamp(0.75rem,1.5vw,1rem)]
        "
      >
        {/* 로고 */}
        <Link href="/" className="shrink-0">
          <Image
            src={gaechun}
            alt="Gaechun logo"
            width={120}
            height={40}
            priority
            className="h-auto w-[clamp(6rem,12vw,7.5rem)]"
          />
        </Link>

        {/* 데스크탑 네비게이션 */}
        <nav className="hidden md:flex justify-end space-x-6 text-gray-600 text-sm font-semibold">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="px-4 py-2 rounded-md hover:bg-gray-100 transition duration-200"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 데스크탑 프로필 */}
        <div className="hidden md:block">
          <Profile />
        </div>

        {/* 모바일 햄버거 버튼 */}
        <button
          className="md:hidden justify-self-end p-[clamp(0.25rem,1vw,0.5rem)] text-gray-600"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsOpen((v) => !v)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* 모바일 메뉴 */}
      <div
        id="mobile-menu"
        className={[
          "md:hidden bg-white shadow-md overflow-hidden transition-all duration-300 ease-out",
          "origin-top transform",
          isOpen ? "max-h-[320px] opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2",
        ].join(" ")}
      >
        <div className="flex flex-col items-start space-y-2 px-6 py-4 text-gray-700">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="w-full px-4 py-2 rounded-md transition duration-200"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          {/* 모바일 프로필 */}
          <div className="w-full mt-2">
            <Profile />
          </div>
        </div>
      </div>
    </header>
  );
}
