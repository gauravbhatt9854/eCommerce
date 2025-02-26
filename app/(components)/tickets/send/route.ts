import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json({ message: "Invalid JSON payload" }, { status: 400 });
    }

    const { senderId, receiverId, message, orderId } = body;


    if (!message || !orderId) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // Assign default Support ID if sender or receiver is not provided
    const alternateReceiverId = receiverId || process.env.SUPPORT_ID;
    const alternateSenderId = senderId || process.env.SUPPORT_ID;

    if (!alternateReceiverId || !alternateSenderId) {
      return NextResponse.json({ message: "Receiver and sender IDs are required" }, { status: 400 });
    }

    // Check if sender, receiver, and order exist
    const senderExists = await prisma.user.findUnique({ where: { id: alternateSenderId } });
    const receiverExists = await prisma.user.findUnique({ where: { id: alternateReceiverId } });
    const orderExists = await prisma.order.findUnique({ where: { id: orderId } });

    if (!senderExists || !receiverExists || !orderExists) {
      return NextResponse.json({ message: "Invalid sender, receiver, or order ID" }, { status: 400 });
    }

    // Create a new message
    const newMessage = await prisma.customerSupportMessage.create({
      data: {
        senderId: alternateSenderId,
        receiverId: alternateReceiverId,
        message,
        orderId,
      },
    });

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ message: "Error sending message" }, { status: 500 });
  }
}
