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
      <div className="block md:hidden flex flex-col items-center justify-center h-screen bg-black text-white px-6">
      <h2 className="text-2xl font-bold mb-4">⚠️ PC로 접속해주세요</h2>
      <p className="text-gray-400 mb-6 text-center">
        이 페이지는 PC 환경에서 최적화되어 있습니다.<br />
        더 나은 사용을 위해 PC에서 다시 접속해주세요.
      </p>
      <a
        href="/"
        className="px-6 py-3 bg-orange-500 rounded-lg text-white font-semibold hover:bg-orange-600 transition"
      >
        홈으로 이동
      </a>
    </div>

      {/* 🖥️ PC(>= md)에서만 보이는 본문 */}
      <div className="hidden md:block">
        <First />
        <Second />
        <Third />
        <Fourth />
        <Sixth />
        <Seventh />
        <Footer />
      </div>
    </>
  );
}
