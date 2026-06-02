import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const video = await prisma.video.findUnique({
    where: { id, moderationStatus: "SAFE" },
    include: { CategoryOnVideo: { include: { Category: true } }, TagOnVideo: { include: { Tag: true } } },
  })

  if (!video) return NextResponse.json({ error: "Video tidak ditemukan" }, { status: 404 })

  await prisma.video.update({ where: { id }, data: { views: { increment: 1 } } })

  return NextResponse.json({ video })
}
