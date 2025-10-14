import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateAndStoreOTP } from "../helper/generateAndStoreOTP";

export async function POST(req: NextRequest) {
  try {
    console.log("🟢 [DEBUG] Incoming POST request received");

    // Step 1: Parse body
    const { email } = await req.json();
    console.log("📨 [DEBUG] Request payload:", email);

    debugger; // 🧩 Debugger point 1 - Before querying database

    // Step 2: Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }],
      },
    });

    console.log("📊 [DEBUG] Prisma query result:", existingUser);

    debugger; // 🧩 Debugger point 2 - After finding user

    if (!existingUser) {
      console.warn("⚠️ [DEBUG] User not found for email:", email);
      return NextResponse.json(
        { error: "User not found!" },
        { status: 404 }
      );
    }

    // Step 3: Generate and store OTP
    console.log("🔧 [DEBUG] Generating OTP for user:", existingUser.id);

    const otp = await generateAndStoreOTP(existingUser.id);

    console.log("📩 [DEBUG] OTP generated and stored successfully:", otp);

    debugger; // 🧩 Debugger point 3 - After OTP generation

    // Step 4: Return response
    console.log("✅ [DEBUG] Sending success response...");
    return NextResponse.json(
      { message: "Signup successful! OTP sent.", otp },
      { status: 200 }
    );

  } catch (error) {
    console.error("❌ [DEBUG] Error occurred in POST handler:", error);

    debugger; // 🧩 Debugger point 4 - In case of exception

    return NextResponse.json(
      { error: "Server error. Try again later!" },
      { status: 500 }
    );
  }
}
