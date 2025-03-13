'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from "next/navigation";

const  ForgotPasswordPage= ()=> {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSendOtp = async () => {
        const response = await fetch("/api/sign-up/resendOtp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email }),
        });
    
        if (!response.ok) throw new Error("Failed to resend OTP!");
        setStep(()=>2);
        console.log("OTP resent successfully!");
      };

    const handleResetPassword = async () => {
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            setLoading(true);
            const response = await fetch('/api/forget-password',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, otp, password })
                }
            );
            if (!response.ok) {
                throw new Error('Failed to reset password');
            }
            alert('Password reset successful');
            router.push('/sign-in');
        } catch (err) {
            setError('Failed to reset password. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white shadow rounded-lg">
            {error && <p className="text-red-500">{error}</p>}
            {step === 1 && (
                <div>
                    <h2 className="text-xl font-bold">Forgot Password</h2>
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button onClick={handleSendOtp} disabled={loading} className="mt-4 w-full">
                        {loading ? 'Sending OTP...' : 'Send OTP'}
                    </Button>
                </div>
            )}
            {step === 2 && (
                <div>
                    <h2 className="text-xl font-bold">Enter OTP & New Password</h2>
                    <Input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <Input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Button onClick={handleResetPassword} disabled={loading} className="mt-4 w-full">
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </Button>
                </div>
            )}
        </div>
    );
}

export default ForgotPasswordPage;
