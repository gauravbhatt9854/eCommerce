import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productId, price, email, razorpay_order_id } = await req.json();
    console.log("test before")

    const userId_user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    console.log("given id2 ", userId_user?.id , typeof userId_user?.id);
    console.log("given id ", userId , typeof userId);
    console.log("given product id ", productId , typeof productId);
    console.log("given price ", price , typeof price);
    console.log("given razorpay_order_id ", razorpay_order_id , typeof razorpay_order_id);

    const order = await prisma.order.create({
      data: {
        clerkId: userId,
        userId: userId_user?.id || "",
        razorpay_order_id: razorpay_order_id,
        productId: productId,
        price: price || 0,
      },
    });

    console.log("order", order);
    if (!order) {
      return NextResponse.json({ message: "Order not created" }, { status: 400 });
    }

    return NextResponse.json({ message: "Order created" , orderId :order.id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}