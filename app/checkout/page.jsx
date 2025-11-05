'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid"; // UUID 라이브러리 사용
import check from "@/components/ckmark.svg";
import gaechun from "@/components/gaechun.svg";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";

// 포함된 서비스 리스트
const includedFeatures = [
  "실제 성적표 인증 기반 성적입력 1회",
  "총 1130개 모집단위 분석 결과 제공",
  "군별로 3순위까지 저장, 수정권한 3회",
  "10개 이상 원서 영역 동영상 제공",
];

// Toss Payments 클라이언트 키
const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;

export default function CheckoutPage() {
  const [step, setStep] = useState("initial");
  const [amount, setAmount] = useState({ currency: "KRW", value: 89000 });
  const [widgets, setWidgets] = useState(null);
  const [ready, setReady] = useState(false);
  const [customerKey, setCustomerKey] = useState(""); // Dynamic customerKey
  const orderName = "개천용 합격예측";
  const orderId = `order-${uuidv4()}`; // 고유 주문 ID 생성

  // 고유 customerKey 생성
  useEffect(() => {
    const storedKey = localStorage.getItem("customerKey");
    if (storedKey) {
      setCustomerKey(storedKey); // 이미 생성된 key가 있으면 재사용
    } else {
      const newKey = uuidv4(); // UUID로 고유한 키 생성
      localStorage.setItem("customerKey", newKey); // LocalStorage에 저장
      setCustomerKey(newKey);
    }
  }, []);

  // Toss Payments 위젯 초기화
  const initTossWidgets = async () => {
    const tossPayments = await loadTossPayments(clientKey);
    const widgetsInstance = tossPayments.widgets({ customerKey });
    setWidgets(widgetsInstance);
    await widgetsInstance.setAmount(amount);
    await Promise.all([
      widgetsInstance.renderPaymentMethods({ selector: "#payment-method" }),
      widgetsInstance.renderAgreement({ selector: "#agreement" }),
    ]);
    setReady(true);
  };

  const handlePurchase = async () => {
    setStep("checkout");
    if (!widgets) await initTossWidgets();
  };

  
  // 'checkout' 단계
  if (step === "checkout") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <div className="bg-white w-1/3 h-1/2 p-8 rounded-lg shadow-lg flex flex-col items-center">
          <div className="w-full mb-4">
            <h2 className="text-2xl font-bold">{orderName}</h2>
            <p className="mt-2 ml-1 text-xl text-gray-800">
              {amount.value.toLocaleString()} 원
            </p>
          </div>
          <div id="payment-method" className="mb-4 w-full" />
          <div id="agreement" className="mb-6 w-full" />
          <button
            className="w-full py-2 bg-blue-500 text-white rounded-lg font-semibold text-lg hover:bg-blue-600 transition duration-200 disabled:bg-gray-300"
            disabled={!ready}
            onClick={async () => {
              try {
                await widgets.requestPayment({
                  orderId: `order-${Date.now()}`,
                  orderName,
                  successUrl: `${window.location.origin}/success`,
                  failUrl: `${window.location.origin}/success`,
                });
              } catch (error) {
                alert("결제 요청에 실패했습니다. 다시 시도해주세요.");
                console.error(error);
              }
            }}
          >
            결제하기
          </button>
        </div>
      </div>
    );
  }

  // 'initial' 단계
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            개천용 정시 합격예측 결제
          </h2>
        </div>
        <div className="mx-auto mt-16 max-w-7xl flex flex-col lg:flex-row rounded-3xl ring-1 ring-gray-200 sm:mt-20">
          <div className="p-8 sm:p-10 lg:w-2/3">
            <div className="flex flex-col items-start">
              <Image src={gaechun} alt="logo" className="mb-4" width={100} />
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                2025학년도 고른기회 전형 개천용 정시 합격예측
              </h3>
            </div>
            <div className="mt-10 flex items-center gap-x-4">
              <h4 className="flex-none text-sm font-semibold leading-6 text-orange-500">
                포함된 서비스
              </h4>
              <div className="h-px flex-auto bg-gray-100" />
            </div>
            <ul
              role="list"
              className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6"
            >
              {includedFeatures.map((feature) => (
                <li key={feature} className="flex gap-x-3 font-bold">
                  <Image src={check} alt="체크" aria-hidden="true" className="h-6 w-5 flex-none" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-8 lg:w-1/3 lg:flex-shrink-0">
            <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5">
              <div className="mx-auto max-w-xs px-8">
                <p className="text-base font-semibold text-gray-600">한 번 결제로, 수능 접수 시까지</p>
                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-gray-900">₩ 89,000</span>
                  <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                    원
                  </span>
                </p>
                <button
                  onClick={handlePurchase}
                  className="mt-10 block w-full rounded-md bg-orange-500 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-orange-400"
                >
                  구매하기
                </button>
                <p className="mt-3 text-xs leading-5 text-gray-600">(부가세 별도)</p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-5 text-gray-800">- 원서 마감일까지 서비스 운영 (2026년 1월 3일)</p>
            <p className="mt-3 text-xs leading-5 text-gray-800">- 성적표 인증 완료 전까지만 환불 가능.</p>
          </div>
        </div>
      </div>
    </div>
  );
}