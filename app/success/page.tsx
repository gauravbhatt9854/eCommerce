"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SuccessPage = () => {
  const router = useRouter();

  useEffect(() => {
    console.log("Payment was successful!");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100 p-4">
      <h1 className="text-4xl font-bold text-green-600 mb-4">Payment Successful!</h1>
      <p className="text-lg text-gray-700 mb-6">
        Thank you for your payment. Your transaction was completed successfully.
      </p>

      <div className="flex space-x-4">
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
        >
          Go to Home
        </button>
        <button
          onClick={() => router.push("/dashboard")}
          className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-300"
        >
          View Dashboard
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
