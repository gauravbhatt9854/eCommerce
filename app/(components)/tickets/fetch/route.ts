
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest, res: NextResponse) {

  try {
    const { customerId , orderId } = await req.json();

    if (!customerId) {
      return NextResponse.json({ message: "Customer ID is required" }, { status: 400 });
    }

    // Fetch messages where the customer is either sender or receiver
    const messages = await prisma.customerSupportMessage.findMany({
      where: {
        OR: [
          { senderId: customerId },
          { receiverId: customerId },
        ],
        orderId: orderId,
      },
      orderBy: { timestamp: "asc" }, // Order by timestamp (oldest to newest)
    });
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ message: "Error fetching messages" }, { status: 500 });
  }
}
