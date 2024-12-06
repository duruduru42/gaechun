import { NextResponse } from "next/server";
import got from "got";

export async function POST(request) {
  try {
    const { paymentKey, orderId, amount } = await request.json();

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        { message: "요청 데이터가 유효하지 않습니다.", code: "INVALID_REQUEST" },
        { status: 400 }
      );
    }
 
    const widgetSecretKey = process.env.TOSS_SECRET_KEY;
    if (!widgetSecretKey) {
      return NextResponse.json(
        { message: "서버 설정 오류: TOSS_SECRET_KEY가 누락되었습니다.", code: "CONFIG_ERROR" },
        { status: 500 }
      );
    }

    const encryptedSecretKey =
      "Basic " + Buffer.from(widgetSecretKey + ":").toString("base64");

    // Toss Payments API 호출
    const response = await got.post("https://api.tosspayments.com/v1/payments/confirm", {
      headers: {
        Authorization: encryptedSecretKey,
        "Content-Type": "application/json",
      },
      json: { orderId, amount: Number(amount), paymentKey }, // 숫자로 변환
      responseType: "json",
    });

    console.log("Toss Payments 응답:", response.body);

    return NextResponse.json(response.body, { status: response.statusCode });
  } catch (error) {
    console.error("결제 확인 오류:", error.response?.body || error.message);
    return NextResponse.json(
      {
        message: error.response?.body?.message || "결제 확인 중 오류 발생",
        code: error.response?.body?.code || "UNKNOWN_ERROR",
      },
      { status: error.response?.statusCode || 500 }
    );
  }
}
