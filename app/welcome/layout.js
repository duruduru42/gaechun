"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {Sidebar1} from "@/components/ui/Sidebar1"; // Sidebar 컴포넌트 경로
import {Navbar1} from "@/app/welcome/ui/Navbar1"; // Navbar 컴포넌트 경로

const supabase = createClient();

export default function WelcomeLayout({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthorization = async () => {
      setLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();

      if (sessionData.session) {
        const { data: profile, error } = await supabase
          .from("profile")
          .select("joined_yn")
          .eq("id", sessionData.session.user.id)
          .single();

        if (error || profile?.joined_yn !== "y") {
          router.push("/not-authorized"); // 권한 없는 사용자 리다이렉트
        } else {
          setIsAuthorized(true);
        }
      } else {
        router.push("/auth"); // 로그인하지 않은 사용자 리다이렉트
      }
      setLoading(false);
    };

    checkAuthorization();
  }, []);

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>; // 로딩 중 UI
  }

  if (!isAuthorized) {
    return null; // 리다이렉트 중에는 아무것도 렌더링하지 않음
  }

  return (
    <div className="flex h-screen">
    <Sidebar1 />
    <div className="flex-1 flex flex-col">
      <Navbar1 />
      <main className="flex-1 bg-gray-50 overflow-y-auto mr-48">
        {children}
      </main>
      </div>
    </div>
  );
}

