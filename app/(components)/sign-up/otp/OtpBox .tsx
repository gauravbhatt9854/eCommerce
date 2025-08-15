"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface OtpBoxProps {
  email: string;
}

const OtpBox = ({ email }: OtpBoxProps) => {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const onVerify = async (otp: string) => {
    const response = await fetch("/api/sign-up/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, code: otp }),
    });

    if (!response.ok) throw new Error("Invalid OTP!");
    console.log("OTP verified successfully!");
    router.push("/sign-in");
  };

  const onSendOtp = async () => {
    setError("");
    setTimer(30); // Start 30-second timer

    try {
      const response = await fetch("/api/sign-up/resendOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email }),
      });
      if (!response.ok) throw new Error("Failed to send OTP!");
      console.log("OTP sent successfully!");
    } catch (err) {
      setError("Failed to send OTP!");
      setTimer(0);
    }
  };

  const handleVerify = async () => {
    if (!otp) return setError("Please enter OTP");
    setIsLoading(true);
    setError("");
    try {
      await onVerify(otp);
    } catch (err) {
      setError("Invalid OTP. Try again!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <p className="text-sm text-gray-700">Enter OTP sent to <b>{email}</b></p>
      <button
        onClick={onSendOtp}
        className="w-full bg-blue-600 text-white py-2 rounded-lg mt-3 hover:bg-blue-700 transition"
        disabled={timer > 0}
      >
        {timer > 0 ? `Wait ${timer}s` : "Send OTP"}
      </button>
      <input
        type="text"
        className="w-full border p-3 rounded-lg mt-2 focus:ring-2 focus:ring-blue-500"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button
        onClick={handleVerify}
        className="w-full bg-green-600 text-white py-3 rounded-lg mt-3 hover:bg-green-700 transition flex items-center justify-center"
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : ""}
        {isLoading ? "Verifying..." : "Submit OTP"}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default OtpBox;
