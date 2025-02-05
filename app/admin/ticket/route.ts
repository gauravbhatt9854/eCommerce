import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Fetch the Tickets (reported problems) from the database
    const tickets = await prisma.reportedProblem.findMany({
      include: {
        user: true,   // Include the related user details
        order: true,  // Include the related order details
      },
    });

    // Return the fetched tickets in the response
    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Failed to fetch tickets:", error);
    return NextResponse.json({ message: "Error fetching tickets." }, { status: 500 });
  }
}
