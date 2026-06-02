import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { moderateContentWithGroq } from "@/lib/moderation"

export async function POST(request: NextRequest) {
  const session = await auth()
  
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { text } = body

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    const result = await moderateContentWithGroq(text)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Moderation error:", error)
    return NextResponse.json({ error: "Failed to process moderation request" }, { status: 500 })
  }
}
