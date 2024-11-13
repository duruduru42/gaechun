"use client";

import { useEffect, useState } from 'react';
import "./globals.css";
import React from "react";
import QueryProvider from "@/components/ui/query-provider";
import Navbar from "@/components/ui/Navbar";
import Sidebar from "@/components/ui/Sidebar";
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from "@/utils/supabase/client";

export default function RootLayout({ children }) {
  const [isClient, setIsClient] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showExamPopup, setShowExamPopup] = useState(false);
  const [session, setSession] = useState(null);

  const router = useRouter();
  const pathname = usePathname();
  const noNavbarPages = ['/login', '/register', '/auth', '/authDetail', '/signup', '/submit', '/inputpage'];
  const noSidebarPages = ['/', '/login', '/register', '/auth', '/authDetail', '/signup', '/submit', '/inputpage'];
  const restrictedPages = ['/home', '/video', '/apply', '/dashboard', '/grade'];
  const checkExamPages = ['/apply', '/dashboard', '/grade'];

  const noNavbar = noNavbarPages.includes(pathname);
  const noSidebar = noSidebarPages.includes(pathname);
  const isRestrictedPage = restrictedPages.includes(pathname);
  const isCheckExamPage = checkExamPages.includes(pathname);

  useEffect(() => {
    setIsClient(true);

    const checkUserSession = async () => {
      if (pathname === '/' || pathname === '/signup') return;

      const supabase = createClient();
      const { data: sessionData } = await supabase.auth.getSession();

      if (sessionData.session) {
        setSession(sessionData.session);
        const { data: profile } = await supabase
          .from("profile")
          .select("image_url")
          .eq("id", sessionData.session.user.id)
          .single();

        if (isRestrictedPage && (!profile || !profile.image_url)) {
          setShowPopup(true);
        } else {
          setShowPopup(false);
        }

        if (isCheckExamPage) {
          const { data: examResult } = await supabase
            .from('exam_results')
            .select('korean, pass')
            .eq('user_id', sessionData.session.user.id)
            .single();

          setShowExamPopup(!examResult || !examResult.korean || examResult.pass === null);
        } else {
          setShowExamPopup(false);
        }
      } else {
        router.push('/auth'); // Redirect if there's no session
      }
    };

    checkUserSession();
  }, [pathname, isRestrictedPage, isCheckExamPage, router]);

  if (!isClient) {
    return null;
  }

  const handleConfirm = () => {
    setShowExamPopup(false);
    router.push('/home');
  };

  return (
    <html lang="en" suppressHydrationWarning>

      <head>
      <meta name="naver-site-verification" content="577bbbbae74a4290a4dcbb58e770025cd09464b9" />
      <meta name='description' content='농어촌 전형, 기회균형 전형, 고른기회 전형, 특성화고 전형 전문으로 컨설팅을 하고 있는 개천용 입시 컨설팅입니다. 정시 컨설팅과 수시 컨설팅, 생기부 컨설팅까지 모두 진행하고 있습니다.'/>
      <meta name='keywords' content='개천용입시컨설팅 농어촌전형 기회균형전형 고른기회전형 고른기회전형컨설팅 기회균형전형컨설팅 특성화고전형' />
      <meta name="robots" content="index, follow"/>


      </head>
      <body className={`h-full ${showPopup || showExamPopup ? 'blur-effect' : ''}`}>
        <QueryProvider>
          <div className="flex h-screen">
            {!noSidebar && <Sidebar />}
            <div className="flex-1 flex flex-col">
              {!noNavbar && <Navbar />}
              <main className="flex-1 bg-gray-50 overflow-y-auto">
                {children}
              </main>
            </div>
          </div>
          {showPopup && (
            <div className="popup-overlay">
              <div className="popup-content">
                <p>우선 정보를 입력해주세요.</p>
                <p>정보입력란을 통해 정보를 입력하고 분석결과를 확인해보세요.</p>
                <button
                  className="bg-blue-500 text-white p-3 rounded mt-3"
                  onClick={() => router.push('/submit')}
                >
                  바로가기
                </button>
              </div>
            </div>
          )}
          {showExamPopup && (
            <div className="popup-overlay">
              <div className="popup-content">
                <p>성적표 관리자 인증 후 사용 가능한 기능입니다.</p>
                <button
                  className="bg-blue-500 text-white p-3 rounded mt-3"
                  onClick={handleConfirm}
                >
                  확인
                </button>
              </div>
            </div>
          )}
        </QueryProvider>
      </body>
    </html>
  );
}
