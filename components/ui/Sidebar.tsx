'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [hovered, setHovered] = useState<string | null>(null);

  const menuItems = [
    { href: '/home', label: '홈' },
    { href: '/guide', label: '개천용 합격예측 설명' },
    { href: '/grade', label: '내 성적' },
    { href: '/dashboard', label: '대학 합격률' },
    { href: '/apply', label: '모의지원' },
    { href: '/video', label: '동영상' },
    { href: '/notice', label: '공지사항' },
    { href: 'https://forms.gle/uF72bnZ6iFCpBZU49', label: '정시 컨설팅 신청' },
  ];

  return (
    <div className="w-64 h-screen p-5 bg-white shadow-md mt-12 font-semibold">
      <ul>
        {menuItems.map((item) => (
          <li
            key={item.href}
            className={`mb-4 ${
              pathname === item.href ? 'bg-orange-500 text-white rounded-xl' : 'text-gray-900'
            } ${
              hovered === item.href && pathname !== item.href ? 'bg-orange-500 text-white rounded-xl' : ''
            }`}
            onMouseEnter={() => setHovered(item.href)}
            onMouseLeave={() => setHovered(null)}
          >
            <Link href={item.href} legacyBehavior>
              <a className="flex items-center p-3 rounded-lg">
                <span className="ml-2">{item.label}</span>
              </a>
            </Link>
          </li>
        ))}
        
      </ul>
    </div>
  );
}
