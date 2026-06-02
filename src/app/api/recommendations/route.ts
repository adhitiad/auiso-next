import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const url = request.nextUrl
  const fp = url.searchParams.get("fp")

  if (!fp) {
    return NextResponse.json({ recommendations: [] })
  }

  try {
    const recommended = await prisma.videoRecommendation.findMany({
      where: { fingerprint: fp },
      orderBy: { score: "desc" },
      take: 10,
      include: {
        Video: {
          include: {
            CategoryOnVideo: { include: { Category: true } },
          },
        },
      },
    })

    const videos = recommended.map((r) => r.Video)

    let searchBasedVideos: any[] = []
    let searchedKeywords = ""

    const recentSearch = await prisma.searchReferrer.findFirst({
      where: { fingerprint: fp, searchKeywords: { not: null } },
      orderBy: { createdAt: "desc" },
    })

    if (recentSearch && recentSearch.searchKeywords) {
      searchedKeywords = recentSearch.searchKeywords
      searchBasedVideos = await prisma.video.findMany({
        where: {
          OR: [
            { title: { contains: searchedKeywords } },
            { synopsis: { contains: searchedKeywords } },
          ],
        },
        take: 6,
        include: {
          CategoryOnVideo: { include: { Category: true } },
        },
      })
    }

    return NextResponse.json(
      { videos, searchBasedVideos, searchedKeywords },
      { headers: { "Cache-Control": "no-store" } }
    )
  } catch (error) {
    console.error("Recommendations error:", error)
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 })
  }
}
