'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function Sidebar1() {
  const pathname = usePathname();
  const [hovered, setHovered] = useState<string | null>(null);

  const menuItems = [
    { href: '/admin', label: '성적 입력' },
    { href: '/admin/grade1', label: '성적' },
    { href: '/admin/dashboard1', label: '대학 합격률' },
  ];

  return (
    <div className="w-64 h-screen p-5 bg-white shadow-md font-semibold">
      <div className='mt-12'>
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
    </div>
  );
}
