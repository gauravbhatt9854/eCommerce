"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface PaymentButtonProps {
  productId: string;
  price: number;
  userEmail?: string;
}

const PaymentButton = ({ productId, price, userEmail }: PaymentButtonProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePayment = async () => {
    if (!price || price <= 0) return alert("Invalid product price!");
    setLoading(true);

    try {
      const response = await fetch("/api/gateway", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: price * 100 }),
      });

      if (!response.ok) throw new Error("Failed to fetch order");

      const order = await response.json();

      const dbOrderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          razorpay_order_id: order.id,
          totalAmount: price,
          price: price,
          email: userEmail,
        }),
      }).then(res => res.json());

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "I am Gaurav",
        description: "Test Transaction",
        order_id: order.id,
        handler: async (response: any) => {
          await fetch("/api/razorpay", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              DB_ORDER_ID: dbOrderResponse.orderId,
            }),
          });
          router.push("/success");
        },
        prefill: { name: "Guest", email: userEmail || "sample@gmail.com" },
        theme: { color: "#F37254" },
      };

      new (window as any).Razorpay(options).open();
    } catch (err) {
      console.error(err);
      alert("Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={`mt-8 px-8 py-4 w-full text-white font-semibold rounded-lg shadow-xl ${loading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 transition"
        }`}
    >
      {loading ? "Processing..." : "Pay Now"}
    </button>
  );
};

export default PaymentButton;