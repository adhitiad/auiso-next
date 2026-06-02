import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { parseSearchReferrer } from "@/lib/search-referrer-parser"
import { randomUUID } from "crypto"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { fingerprint, referrerUrl } = data

    if (!fingerprint || !referrerUrl) {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 })
    }

    const { searchEngine, searchKeywords } = parseSearchReferrer(referrerUrl)

    await prisma.searchReferrer.create({
      data: {
        id: randomUUID(),
        fingerprint,
        referrerUrl,
        searchEngine,
        searchKeywords,
      },
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("[SearchReferrer API] Error saving referrer:", e)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
