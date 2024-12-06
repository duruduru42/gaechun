'use client';

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client"; // Supabase 클라이언트

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isConfirmed, setIsConfirmed] = useState(false);

  // 상태로 orderId, amount, paymentKey 관리
  const [orderDetails, setOrderDetails] = useState({
    orderId: null,
    amount: null,
    paymentKey: null,
  });

  useEffect(() => {
    if (isConfirmed) return; // 이미 처리된 요청이면 중단
  
    async function confirmPayment() {
      setIsConfirmed(true); // 요청 시작 시 바로 상태 업데이트
  
      const orderId = searchParams.get("orderId");
      const amount = searchParams.get("amount");
      const paymentKey = searchParams.get("paymentKey");
  
      if (!orderId || !amount || !paymentKey) {
        console.error("필수 쿼리 파라미터 누락");
        router.push("/fail");
        return;
      }
  
      setOrderDetails({ orderId, amount, paymentKey });
  
      try {
        console.log("클라이언트 요청 데이터:", { orderId, amount, paymentKey });
  
        const response = await fetch("/api/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            amount: Number(amount), // 숫자로 변환
            paymentKey,
          }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          console.error("결제 확인 실패:", errorData);
          return;
        }
  
        console.log("결제 확인 성공:", await response.json());
  
        // Supabase 프로필 업데이트
        const supabase = createClient();
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
        if (sessionError || !sessionData.session) {
          router.push("/login");
          return;
        }
  
        const userId = sessionData.session.user.id;
  
        const { error: profileError } = await supabase
          .from("profile")
          .update({
            paymentkey: paymentKey,
            order_id: orderId,
          })
          .eq("id", userId);
  
        if (profileError) {
          console.error("프로필 업데이트 실패:", profileError.message);
          return;
        }
  
        console.log("결제 및 프로필 업데이트 성공");
      } catch (error) {
        console.error("결제 처리 중 오류:", error.message);
      }
    }
  
    confirmPayment();
  }, [isConfirmed]);
  

  if (!orderDetails.orderId || !orderDetails.amount || !orderDetails.paymentKey) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
          <div className="text-4xl mb-4">⏳</div>
          <h2 className="text-xl font-bold mb-2">결제 정보를 불러오는 중...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
        <div className="text-4xl mb-4">🎉</div>
        <h2 className="text-xl font-bold mb-2">결제가 성공적으로 완료되었습니다!</h2>
        <p className="text-gray-600 mb-4">
          주문 번호: <span className="font-semibold">{orderDetails.orderId}</span>
        </p>
        <p className="text-gray-600 mb-4">
          결제 금액: <span className="font-semibold">{Number(orderDetails.amount).toLocaleString()}원</span>
        </p>
        <p className="text-gray-600 mb-4">
          결제 키: <span className="font-semibold">{orderDetails.paymentKey}</span>
        </p>
        <button
          onClick={() => router.push("/submit")}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
        >
          성적입력
        </button>
      </div>
    </div>
  );
}
