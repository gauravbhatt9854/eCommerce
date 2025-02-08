import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();

        // Retrieve all orders where clerkId equals the userId
        const orders = await prisma.order.findMany({
            where: {clerkId: userId!},
            include: {
                Product: true,
                DeliveryPerson: true,
                ReportedProblem: true,
              },
        });

        if (orders) {
            return NextResponse.json(orders, { status: 200 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
