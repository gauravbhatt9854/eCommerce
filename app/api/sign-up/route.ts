import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { generateAndStoreOTP } from "./helper/route";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password } = await req.json();

    // Check if email or phone already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email or phone number already exists!" },
        { status: 400 }
      );
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        isVerified: false, // Default false until OTP verification
        otp: null,
        otpExpiresAt: null,
      },
    });

    // Generate and store OTP
    const otp = await generateAndStoreOTP(newUser.id);
    console.log("Signup successful! OTP sent." , otp);

    return NextResponse.json(
      { message: "Signup successful! OTP sent.", otp },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Server error. Try again later!" },
      { status: 500 }
    );
  }
}
