// app/page.tsx 혹은 app/inf/page.jsx (서버 컴포넌트 그대로)

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import First from "@/components/First";
import Second from "@/components/Second";
import Third from "@/components/Third";
import Fourth from "@/components/Fourth";
import Sixth from "@/components/Sixth";
import Seventh from "@/components/Seventh";
import Footer from "@/components/Footer";

export default async function Index() {
  // 로그인 상태 확인
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  // 로그인된 상태면 home으로 리다이렉트


  // (서버 전용 로직은 그대로)
  const canInitSupabaseClient = () => {
    try {
      createClient();
      return true;
    } catch {
      return false;
    }
  };
  const isSupabaseConnected = canInitSupabaseClient();

  return (
    <>
      {/* 모바일 차단 화면 제거 — 모든 화면에서 본문 노출 (모바일 최적화 완료) */}
      <First />
      <Second />
      <Third />
      <Fourth />
      <Sixth />
      <Seventh />
      <Footer />
    </>
  );
}
