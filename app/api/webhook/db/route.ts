import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { currentUser } from '@clerk/nextjs/server'
export async function POST(req: NextRequest) {
    const Clerkuser = await currentUser()
    const { name, email, phone } = await req.json()
    try {
        const user = await prisma.user.create({
            data: {
                clerkId: Clerkuser?.id as string || Date.now().toString(),
                name,
                email,
                phone
            }
        })
        if(user) 
        {
            return NextResponse.json(
                { user, isOk: true },
                { status: 200 }
              );
        }
        else 
        {
            return NextResponse.json({ message: "User creation failed", isOk: false }, { status: 400 })
        }
    } catch (error) {
        return NextResponse.json({ message: "User creation failed", isOk: false }, { status: 400 })
    }
}