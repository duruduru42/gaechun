// Add this line to indicate this file is a Client Component
"use client";

import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = "Nwx886WHpgHrM8PA9Sqw6";

function CheckoutPage() {
  const [amount, setAmount] = useState({
    currency: "KRW",
    value: 108900,
  });
  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState(null);
  const orderName = "개천용 합격예측";

  useEffect(() => {
    async function fetchPaymentWidgets() {
      const tossPayments = await loadTossPayments(clientKey);
      const widgets = tossPayments.widgets({ customerKey });
      setWidgets(widgets);
    }
    fetchPaymentWidgets();
  }, []);

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (widgets == null) return;
      await widgets.setAmount(amount);
      await Promise.all([
        widgets.renderPaymentMethods({ selector: "#payment-method" }),
        widgets.renderAgreement({ selector: "#agreement" }),
      ]);
      setReady(true);
    }
    renderPaymentWidgets();
  }, [widgets]);

  useEffect(() => {
    if (widgets == null) return;
    widgets.setAmount(amount);
  }, [widgets, amount]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white w-1/3 h-1/2 p-8 rounded-lg shadow-lg flex flex-col items-center">
        
        {/* Order Information */}
        <div className="w-full mb-4">
          <h2 className="text-2xl font-bold">{orderName}</h2>
          <p className="mt-2 ml-1 text-xl text-gray-800">{amount.value.toLocaleString()} 원</p>
        </div>

        {/* Payment Method and Agreement */}
        <div id="payment-method" className="mb-4 w-full" />
        <div id="agreement" className="mb-6 w-full" />

        {/* Payment Button */}
        <button
          className="w-full py-2 bg-blue-500 text-white rounded-lg font-semibold text-lg hover:bg-blue-600 transition duration-200 disabled:bg-gray-300"
          disabled={!ready}
          onClick={async () => {
            try {
              await widgets.requestPayment({
                orderId: "_VRZ-RPn2AMN19H1RZA0a",
                orderName,
                successUrl: window.location.origin + "/success",
                failUrl: window.location.origin + "/fail",
              });
            } catch (error) {
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

export default CheckoutPage;
