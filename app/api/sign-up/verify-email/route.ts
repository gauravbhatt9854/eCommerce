import { NextRequest , NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
      const { email, code } = await req.json();
      console.log(email , code);

  
      const user = await prisma.user.findUnique({
        where: { email: email },
      });
  
      if (!user || user.otp !== code) {
        return NextResponse.json(
          { error: "Invalid OTP!" },
          { status: 400 }
        );
      }
  
      if (new Date() > user.otpExpiresAt!) {
        return NextResponse.json(
          { error: "OTP expired!" },
          { status: 400 }
        );
      }
  
      // Update user profile as verified and clear OTP fields
      await prisma.user.update({
        where: { email: email },
        data: { isVerified: true, otp: null, otpExpiresAt: null },
      });
  
      return NextResponse.json(
        { message: "OTP verified successfully!" },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { error: "Server error. Try again later!" },
        { status: 500 }
      );
    }
  }