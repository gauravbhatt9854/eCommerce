// /app/api/admin/support/send/route.ts

import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { senderId, receiverId, message, orderId } = await req.json();

    // Ensure that all fields are provided
    if (!senderId || !receiverId || !message || !orderId) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // Create the new message in the database
    const newMessage = await prisma.customerSupportMessage.create({
      data: {
        senderId,
        receiverId,
        message,
        orderId,
        timestamp: new Date(), // Current timestamp
      },
    });

    return NextResponse.json(newMessage, { status: 200 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ message: "Error sending message" }, { status: 500 });
  }
}
