
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Authenticate the user
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body
    const body = await req.json();
    // console.log("Raw Request Body:", body);

    if (!body) {
      return NextResponse.json({ message: "Request body is empty" }, { status: 400 });
    }

    const { productId, price, email, razorpay_order_id, totalAmount } = body;


    // Validate required fields
    if (!productId || typeof productId !== "string") {
      return NextResponse.json({ message: "Invalid or missing productId" }, { status: 400 });
    }
    if (!email || typeof email !== "string") {
      return NextResponse.json({ message: "Invalid or missing email" }, { status: 400 });
    }
    if (!price || isNaN(Number(price))) {
      return NextResponse.json({ message: "Invalid or missing price" }, { status: 400 });
    }
    if (!totalAmount || isNaN(Number(totalAmount))) {
      return NextResponse.json({ message: "Invalid or missing totalAmount" }, { status: 400 });
    }

    // Find user in the database
    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Create the order in the database
    const order = await prisma.order.create({
      data: {
        clerkId,
        userId: user.id,
        razorpay_order_id,
        productId,
        price: Number(price),
        totalAmount: Number(totalAmount),
      },
    });


    // console.log("Order Created Successfully:", order);

    return NextResponse.json({ message: "Order created", orderId: order.id }, { status: 201 });
  } catch (error) {
    console.error("Error handling order request:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
