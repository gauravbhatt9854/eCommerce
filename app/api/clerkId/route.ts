import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    try {
        const {clerkId} = await req.json();
        // Retrieve all orders where clerkId equals the userId
        const users = await prisma.user.findMany({
            where: {
                clerkId: clerkId,
            },
        });


        if (users) {
            return NextResponse.json({id : users[0]?.id}, { status: 200 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
