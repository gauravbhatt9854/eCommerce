import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    console.log("Sending message")
    const { senderId, receiverId, message, orderId } = await req.json();
    // Validate input
    if (!senderId || !message || !orderId) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // Check if the sender, receiver, and order exist in the database
    const senderExists = await prisma.user.findMany({ where: { id: senderId } });
    // const receiverExists = await prisma.user.findMany({ where: { id: receiverId } });
    const orderExists = await prisma.order.findMany({ where: { id: orderId } });

    if (!senderExists || !orderExists) {
      return NextResponse.json({ message: "Invalid sender, receiver, or order ID" }, { status: 400 });
    }

    console.log("Sending message2")
    // Create a new message
    const newMessage = await prisma.customerSupportMessage.create({
      data: {
        senderId,
        receiverId : receiverId || process.env.SUPPORT_ID || "",
        message,
        orderId,
      },
    });
    console.log("Sending message3")
    // Return the newly created message as response
    return NextResponse.json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ message: "Error sending message" }, { status: 500 });
  }
}
