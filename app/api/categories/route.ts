import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
   try {
     const categories = await prisma.category.findMany();
     return NextResponse.json(categories , {status: 200});
   } catch (error) {
     console.error(error);
     return NextResponse.json({ categories: [] }, { status: 500 });
    
   }
    }