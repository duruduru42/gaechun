// app/client-layout.js
"use client";

import { useEffect, useState } from 'react';
import QueryProvider from "@/components/ui/query-provider";
import Navbar from "@/components/ui/Navbar";
import Sidebar from "@/components/ui/Sidebar";
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from "@/utils/supabase/client";

export default function ClientLayout({ children }) {
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
  );
}
