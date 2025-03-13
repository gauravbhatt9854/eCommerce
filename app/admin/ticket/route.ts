import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export async function GET(req: NextRequest) {
  try {
   
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Step 2: Verify Token & Check Admin Role
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
    } catch (error) {
      return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
    }

    if (decoded.role !== "ADMIN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

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
    return NextResponse.json(tickets , { status: 200 });
  } catch (error) {
    console.error("Failed to fetch tickets:", error);
    return NextResponse.json({ message: "Error fetching tickets." }, { status: 500 });
  }
}
