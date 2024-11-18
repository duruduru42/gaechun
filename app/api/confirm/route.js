// import { NextResponse } from "next/server";
// import got from "got";

// export async function POST(request) {
//   try {
//     const { paymentKey, orderId, amount } = await request.json();

//     const widgetSecretKey = process.env.TOSS_SECRET_KEY;
//     const encryptedSecretKey =
//       "Basic " + Buffer.from(widgetSecretKey + ":").toString("base64");

//     const response = await got.post("https://api.tosspayments.com/v1/payments/confirm", {
//       headers: {
//         Authorization: encryptedSecretKey,
//         "Content-Type": "application/json",
//       },
//       json: { orderId, amount, paymentKey },
//       responseType: "json",
//     });

//     return NextResponse.json(response.body, { status: response.statusCode });
//   } catch (error) {
//     console.error("결제 확인 오류:", error.response?.body || error.message);
//     return NextResponse.json(error.response?.body || { message: "Internal Server Error" }, {
//       status: error.response?.statusCode || 500,
//     });
//   }
// }
