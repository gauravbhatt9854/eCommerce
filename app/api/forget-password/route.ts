import prisma from '@/lib/prisma';
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from 'next/server';
import { sendUserEvent } from '@/app/api/services/nodemailerServices';

export async function POST(req: NextRequest) {
    const { email, otp, password } = await req.json();

    if (!email || !otp || !password) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    try {
        // Verify OTP (Assuming OTPs are stored in DB with expiry)
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || user.otp !== otp || user.otpExpiresAt! < new Date()) {
            return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update password and clear OTP
        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword, otp: null, otpExpiresAt: null }
        });

        await sendUserEvent(user, "user.passwordReset");
        return NextResponse.json({ message: 'Password reset successful' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}