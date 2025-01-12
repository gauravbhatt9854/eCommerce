import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
   try {
     const products = await prisma.product.findMany();
     return NextResponse.json(products , {status: 200});
   } catch (error) {
     console.error(error);
     return NextResponse.json({ message: [] }, { status: 500 });
    
   }
    }