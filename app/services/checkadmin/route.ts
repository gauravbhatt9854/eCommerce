import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST() {
  const user = await currentUser()
  try {
    if (user?.publicMetadata.role === "admin")
      return NextResponse.json({ isAdmin: true } , { status: 200 })
    else
      return NextResponse.json({ isAdmin: false }, { status: 200 })
  } catch (error) {
    console.log("error with isAdmin service")
    return NextResponse.json({ isAdmin: false }, { status: 500 })

  }
}