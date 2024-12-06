'use client';

import { useSearchParams } from "next/navigation";

export default function FailPage() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("code");
  const errorMessage = searchParams.get("message");

  // 에러 코드에 따른 메시지와 이모티콘 설정
  const errorDetails = {
    PAY_PROCESS_CANCELED: {
      icon: "❌",
      title: "결제가 취소되었습니다.",
      description: "구매자에 의해 결제가 취소되었습니다. 다시 시도해주세요.",
    },
    PAY_PROCESS_ABORTED: {
      icon: "⚠️",
      title: "결제가 실패했습니다.",
      description: `오류 메시지: ${errorMessage}. 자세한 사항은 토스페이먼츠 고객센터(1544-7772)로 문의해주세요.`,
    },
    REJECT_CARD_COMPANY: {
      icon: "💳",
      title: "카드 결제가 거부되었습니다.",
      description: "카드 정보에 문제가 있습니다. 정보를 확인한 후 다시 시도해주세요.",
    },
    DEFAULT: {
      icon: "❓",
      title: "알 수 없는 오류",
      description: `에러 코드: ${errorCode}. ${errorMessage || "자세한 사항은 고객센터에 문의해주세요."}`,
    },
  };

  const currentError = errorDetails[errorCode] || errorDetails.DEFAULT;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
        <div className="text-4xl mb-4">{currentError.icon}</div>
        <h2 className="text-xl font-bold mb-2">{currentError.title}</h2>
        <p className="text-gray-600 mb-4">{currentError.description}</p>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
        >
          돌아가기
        </button>
      </div>
    </div>
  );
}
