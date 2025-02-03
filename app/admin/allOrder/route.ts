import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    try {
              const  user  = await currentUser()
              console.log(user?.publicMetadata.role)
              if(user?.publicMetadata.role !== 'admin')
              {
                return NextResponse.json({message: 'You are not authorized'}, {status: 401})
              }

        // Retrieve all orders where clerkId equals the userId
        const orders = await prisma.order.findMany({
            include: {
                product: true,
                user: true
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
