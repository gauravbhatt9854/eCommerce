"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import OtpBox from "../sign-up/otp/OtpBox "; // Import OTP Box Component
import Link from "next/link";

const SigninPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(true);
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill all fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.message == "User not verified") {
        setIsVerified(false);
        return;
      }

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }


      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Welcome Back
        </h2>
        <p className="text-sm text-gray-500 text-center mb-4">
          Sign in to access your account
        </p>

        {error && (
          <p className="text-red-500 text-sm mb-4 bg-red-100 p-2 rounded">
            {error}
          </p>
        )}

        {!isVerified ? (
          <OtpBox email={email} />
        ) : (

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : ""}
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
        )}

        <p className="text-sm text-gray-500 text-center mt-4 flex flex-col">
          Don't have an account?{" "}
          <a href="/sign-up" className="text-blue-600 hover:underline">
            Sign Up
          </a>
            <Link href="/forget-password" className="text-blue-600 hover:underline">
            Forgot Password
            </Link>
        </p>
      </div>
    </div>
  );
};

export default SigninPage;
