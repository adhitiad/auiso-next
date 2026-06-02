import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { searchQuerySchema } from "@/types/api"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const parsed = searchQuerySchema.safeParse(Object.fromEntries(searchParams))
  if (!parsed.success) {
    return NextResponse.json({ error: "Query tidak valid" }, { status: 400 })
  }

  const { q, type, limit = 10 } = parsed.data

  const results: any = {}

  if (type === "all" || type === "videos") {
    results.videos = await prisma.video.findMany({
      where: { 
        moderationStatus: "SAFE", 
        OR: [
          { title: { contains: q, mode: "insensitive" } }, 
          { synopsis: { contains: q, mode: "insensitive" } }
        ] 
      },
      take: limit,
      include: { CategoryOnVideo: { include: { Category: true } } },
    })
  }

  if (type === "all" || type === "users") {
    results.users = await prisma.user.findMany({
      where: { 
        OR: [
          { username: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } }
        ]
      },
      take: limit,
      select: { id: true, username: true, email: true, name: true, image: true },
    })
  }

  return NextResponse.json(results)
}
