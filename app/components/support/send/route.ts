import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    console.log("Sending message")
    const { senderId, receiverId, message, orderId } = await req.json();
    // Validate input
    if ( !message || !orderId) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // Check if the sender, receiver, and order exist in the database
    const alternateReceiverId = receiverId ||  process.env.SUPPORT_ID || "";
    const alternateSenderId = senderId || process.env.SUPPORT_ID || "";

    const senderExists = await prisma.user.findMany({ where: { id: alternateSenderId } });
    const receiverExists = await prisma.user.findMany({ where: { id: alternateReceiverId } });
    const orderExists = await prisma.order.findMany({ where: { id: orderId } });

    if (!senderExists || !orderExists || !receiverExists) {
      return NextResponse.json({ message: "Invalid sender, receiver, or order ID" }, { status: 400 });
    }

    console.log("Sending message2")
    // Create a new message
    const newMessage = await prisma.customerSupportMessage.create({
      data: {
        senderId : alternateSenderId,
        receiverId : alternateReceiverId,
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
