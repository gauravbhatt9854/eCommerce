import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "../checkPoint/route";


export async function GET(req: NextRequest) {
    try {
        if (!(await isAuthorized())) return NextResponse.json({ message: "access denied" }, { status: 400 });

        // Retrieve all orders where clerkId equals the userId
        const orders = await prisma.order.findMany({
            include: {
                Product: true,
                User: true,
                CustomerSupportMessage: true,
                DeliveryPerson: true,
            },
        });


        console.log(orders);
        if (orders) {
            return NextResponse.json(orders, { status: 200 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
