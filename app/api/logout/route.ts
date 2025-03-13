import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ message: "Logged out successfully" });

  // Clear the "token" cookie
  response.cookies.set("token", "", {
    expires: new Date(0), // Expire immediately
    path: "/",
    httpOnly: true,
    secure: true, // Ensure it's only sent over HTTPS
  });

  return response;
}
