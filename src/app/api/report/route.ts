import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { targetId, type, reason } = await request.json()

  if (!targetId || !type || !reason) {
    return NextResponse.json({ error: "Field tidak boleh kosong" }, { status: 400 })
  }

  try {
    await (prisma as any).report.create({
      data: {
        id: crypto.randomUUID(),
        type,
        targetId,
        reason,
        status: "PENDING",
      },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Gagal membuat laporan:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
