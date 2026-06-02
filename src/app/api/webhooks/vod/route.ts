import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  // Webhook integration
  const signature = request.headers.get("x-vod-signature")
  // Verify signature logically here

  try {
    const body = await request.json()
    const { videoId, status, url, thumbnail } = body

    if (status === "ready") {
      await prisma.video.update({
        where: { id: videoId },
        data: { externalSourceUrl: url, thumbnail: thumbnail },
      })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }
}
