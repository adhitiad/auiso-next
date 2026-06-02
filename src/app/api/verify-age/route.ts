import { NextResponse } from "next/server"

export async function POST() {
  const response = NextResponse.json({ success: true })
  
  // Set cookie for 1 year (age verification)
  response.cookies.set("age_verified", "true", {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  })

  return response
}
