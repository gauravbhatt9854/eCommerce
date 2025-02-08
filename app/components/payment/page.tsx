"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Script from "next/script";
import { useRouter } from "next/navigation";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<number | string>("");
  const { user } = useUser();
  const router = useRouter();

  const handlePayment = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert("Please enter a valid amount!");
      return;
    }

    setLoading(true);

    try {
      // Fetch order details from the backend
      const response = await fetch("/api/gateway", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount) * 100 }), // Amount in paise
      });

      if (!response.ok) {
        throw new Error("Failed to fetch order details");
      }

      const order = await response.json();
      // console.log("Order Details:", order);

      const options = {
        key: process.env.NEXT_PUBLIC_YOUR_KEY_ID, // Replace with your Razorpay key
        amount: order.amount, // Amount in paise
        currency: "INR",
        name: "Your Company Name",
        description: "Test Transaction",
        order_id: order.id, // Order ID from backend
        handler: async function (response: any) {
          const sign = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };

          // console.log("Payment Signature:", sign);

          const verificationResponse = await fetch("/api/webhook/razorpay", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sign),
          });

          const verificationResult = await verificationResponse.json();
          router.push("/success");
        },
        prefill: {
          name: user?.fullName || "Guest",
          email: user?.emailAddresses[0]?.emailAddress || "sample@gmail.com",
          contact: user?.phoneNumbers[0]?.phoneNumber || "9999999999",
        },
        theme: {
          color: "#F37254",
        },
      };

      const payment = new (window as any).Razorpay(options);
      payment.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Payment initiation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <h1 className="text-2xl font-bold mb-4">Razorpay Payment Integration</h1>

      <div className="mb-4">
        <label htmlFor="amount" className="block text-lg font-medium mb-2">
          Enter Amount (INR):
        </label>
        <input
          id="amount"
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={handlePayment}
        disabled={loading}
        className={`px-6 py-3 text-white font-semibold rounded-lg ${
          loading
            ? "bg-gray-400"
            : "bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
        }`}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default Page;
