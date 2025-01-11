import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req :Request) {

      const  user  = await currentUser()
      console.log(user?.publicMetadata.role)
      if(user?.publicMetadata.role !== 'admin')
      {
        return NextResponse.json({message: 'You are not authorized'}, {status: 401})
      }
    const {name , description , price} = await req.json();

    console.log(name, description, price);
    console.log(typeof name, typeof description, typeof price);
    try {
        const product = await prisma.product.create({
            data: {
              name: name as string,
              description: description as string,
              price: Number(price) // convert to number because json stringify and parse change the type of everything
            },
          });

        if (product) {
            console.log(product);
            return NextResponse.json({ product, isOk: true }, { status: 200 });
    }
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "User creation failed", isOk: false }, { status: 400 });
    }
}