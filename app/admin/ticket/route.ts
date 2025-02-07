import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "../checkPoint/route";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    if(!(await isAuthorized())) return NextResponse.json({ message: "access denied" }, { status: 400 });

    // Fetch the Tickets (reported problems) from the database
    const tickets = await prisma.reportedProblem.findMany({
      include: {
        User: true,   // Include the related user details
        Order: 
        {
          include: {
            Product: true, // Include the related product details
          }
        } // Include the related order details
      },
    });

    // Return the fetched tickets in the response
    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Failed to fetch tickets:", error);
    return NextResponse.json({ message: "Error fetching tickets." }, { status: 500 });
  }
}
