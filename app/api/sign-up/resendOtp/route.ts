import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateAndStoreOTP } from "../helper/route";

export async function POST(req: NextRequest) {
  try {
    const {  email } = await req.json();

    // Check if email or phone already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }],
      },
    });

    if(!existingUser){
      return NextResponse.json( { error: "User not found!" }, { status: 404 });
    }

    // Generate and store OTP
    const otp = await generateAndStoreOTP(existingUser.id);
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
