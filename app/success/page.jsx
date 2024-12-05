'use client';

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client"; // Supabase 클라이언트

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const requestData = {
      orderId: searchParams.get("orderId"),
      amount: searchParams.get("amount"),
      paymentKey: searchParams.get("paymentKey"),
    };

    async function confirm() {
      const response = await fetch("/api/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const json = await response.json();

      if (!response.ok) {
        // 결제 실패 비즈니스 로직
        router.push(`/fail?message=${json.message}&code=${json.code}`);
        return;
      }

      // 결제 성공 비즈니스 로직
      const supabase = createClient();

      try {
        const { data: sessionData } = await supabase.auth.getSession();

        if (!sessionData.session) {
          throw new Error("유효한 세션이 없습니다.");
        }

        const userId = sessionData.session.user.id;

        // profile 테이블 업데이트: paymentKey 및 orderId 저장
        const { error } = await supabase
          .from("profile")
          .update({
            paymentkey: requestData.paymentKey,
            order_id: requestData.orderId, // 추가된 부분
          })
          .eq("id", userId);

        if (error) {
          console.error("프로필 업데이트 실패:", error.message);
          throw new Error("프로필 업데이트에 실패했습니다.");
        }

        console.log("프로필이 성공적으로 업데이트되었습니다.");
      } catch (error) {
        console.error("결제 성공 후 데이터베이스 업데이트 오류:", error.message);
      }
    }

    confirm();
  }, []);

  return (
    <div className="result wrapper">
      <div className="box_section">
        <h2>결제 성공</h2>
        <p>{`주문번호: ${searchParams.get("orderId")}`}</p>
        <p>{`결제 금액: ${Number(searchParams.get("amount")).toLocaleString()}원`}</p>
        <p>{`paymentKey: ${searchParams.get("paymentKey")}`}</p>
      </div>
    </div>
  );
}
