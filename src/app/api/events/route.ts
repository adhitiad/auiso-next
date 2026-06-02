import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { checkRateLimit } from "@/lib/rate-limit"

const eventSchema = z.object({
  fingerprint: z.string().min(1),
  videoId: z.string().min(1),
  action: z.string().min(1),
})

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()
    const result = eventSchema.safeParse(payload)

    if (!result.success) {
      return NextResponse.json({ error: "Payload tidak valid" }, { status: 400 })
    }

    const { fingerprint, videoId, action } = result.data

    // Gunakan rate limiter untuk mencegah abuse
    const { allowed } = await checkRateLimit(`events:${fingerprint}`, { maxRequests: 30, windowSeconds: 60 })
    
    if (!allowed) {
      return NextResponse.json({ error: "Terlalu banyak permintaan. Coba lagi nanti." }, { status: 429 })
    }

    // Simpan ke UserEvent
    // Generate id manually if not using dbgenerated / default uuid in postgres
    // In our schema, UserEvent id is a String without default, so we need to generate one
    const cuid = require("cuid")

    await prisma.userEvent.create({
      data: {
        id: cuid(),
        fingerprint,
        videoId,
        action,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Gagal melacak event:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
