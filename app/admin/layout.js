"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {Sidebar1} from "@/app/admin/ui/Sidebar1"; // Sidebar 컴포넌트 경로
import {Navbar1} from "@/app/admin/ui/Navbar1"; // Sidebar 컴포넌트 경로


const supabase = createClient();

export default function AdminLayout({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAdminRole = async () => {
      setLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();

      if (sessionData.session) {
        const { data: profile, error } = await supabase
          .from("profile")
          .select("role")
          .eq("id", sessionData.session.user.id)
          .single();

        // 디버깅을 위한 로그 추가
        console.log("Profile data:", profile);
        console.log("Profile error:", error);
        console.log("Role value:", profile?.role);
        console.log("Role type:", typeof profile?.role);
        
        // role 값을 trim하고 소문자로 변환하여 비교 (대소문자 및 공백 문제 방지)
        const userRole = profile?.role?.toString().trim().toLowerCase();
        const isAdminRole = userRole === "admin";
        
        console.log("Normalized role:", userRole);
        console.log("Is admin:", isAdminRole);

        // error가 발생했거나 role이 "admin"이 아닌 경우
        if (error) {
          console.error("Profile fetch error:", error);
          router.push("/not-authorized");
        } else if (!isAdminRole) {
          console.warn("User is not admin. Role:", profile?.role);
          router.push("/not-authorized");
        } else {
          setIsAdmin(true);
        }
      } else {
        router.push("/auth"); // 로그인하지 않은 사용자 리다이렉트
      }
      setLoading(false);
    };

    checkAdminRole();
  }, []);

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>; // 로딩 중 UI
  }

  if (!isAdmin) {
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