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
  const [resendDisabled, setResendDisabled] = useState(false);

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

  const onResend = async () => {
    const response = await fetch("/api/sign-up/resendOtp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email }),
    });

    if (!response.ok) throw new Error("Failed to resend OTP!");
    console.log("OTP resent successfully!");
  };

  useEffect(() => {
    if(email)
        onResend();

  }, []);

  const handleVerify = async () => {
    if (!otp) return setError("Please enter OTP");
    setIsLoading(true);
    setError("");

    try {
      await onVerify(otp);
      router.push("/sign-in");
      
    } catch (err) {
      setError("Invalid OTP. Try again!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResendDisabled(true);
    setError("");

    try {
      await onResend();
    } catch (err) {
      setError("Failed to resend OTP!");
    } finally {
      setTimeout(() => setResendDisabled(false), 5 * 1000); // 30-sec cooldown
    }
  };

  return (
    <div>
      <p className="text-sm text-gray-700">Enter OTP sent to <b>{email}</b></p>
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
      <button
        onClick={handleResend}
        className="w-full text-blue-600 py-2 mt-2 text-sm disabled:text-gray-400"
        disabled={resendDisabled}
      >
        {resendDisabled ? "Wait 30 sec to resend" : "Resend OTP"}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default OtpBox;
