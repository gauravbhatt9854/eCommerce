// Function to generate and store OTP
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { User } from "@prisma/client";
import { sendOtpEmail } from "@/app/services/rotue";

export async function generateAndStoreOTP(userId: User["id"]) {
  console.log("Generating OTP for user ID:", userId);
    const otp = crypto.randomInt(100000, 999999).toString(); // Generate 6-digit OTP
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes


    const user = await prisma.user.update({
      where: { id: userId },
      data: { otp, otpExpiresAt: expiresAt },
    });
  
    console.log(user);

    await sendOtpEmail(user.email, user.name, otp);
    return otp;
  }
  
  // Function to verify OTP
