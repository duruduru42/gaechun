'use client'

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useMediaQuery } from 'react-responsive';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const menuItems = [
    { name: '서비스 소개', href: '/service' },
    { name: '지원대학', href: '/university' },
    { name: '가격안내', href: '/price' },
    { name: '개인정보 보호', href: '/privacy' },
  ];

  return (
    <nav className="bg-white fixed w-full top-0 z-50">
      <div className="max-w-screen-lg mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="개천용 로고"
              width={32}
              height={32}
              className="rounded-full"
            />
          </Link>

          {/* 데스크톱 메뉴 */}
          <div className="hidden md:flex space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* 로그인 버튼 */}
            <Link href="/login">
              <button className="bg-blue-500 text-white text-sm px-4 py-2 rounded-lg">
                로그인
              </button>
            </Link>

            {/* 모바일 메뉴 버튼 */}
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-6 flex flex-col items-end gap-1.5">
                <span className="block w-6 h-0.5 bg-gray-800"></span>
                <span className="block w-5 h-0.5 bg-gray-800"></span>
                <span className="block w-4 h-0.5 bg-gray-800"></span>
              </div>
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 드롭다운 */}
        {isMobile && isMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-white shadow-lg">
            <div className="py-2">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-6 py-3 text-gray-800 hover:bg-gray-50 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 