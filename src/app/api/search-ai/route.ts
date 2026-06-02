import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Menggunakan Exa API untuk ekspansi kueri dan pemahaman semantik
export async function GET(req: NextRequest) {
  const url = req.nextUrl
  const q = url.searchParams.get("q")
  
  if (!q) {
    return NextResponse.json({ videos: [], expandedKeywords: [] })
  }

  let expandedKeywords: string[] = [q] // Selalu sertakan kueri asli
  let exaResults = []

  // Coba panggil Exa jika API key tersedia
  const exaKey = process.env.EXA_API_KEY
  if (exaKey) {
    try {
      const exaRes = await fetch("https://api.exa.ai/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": exaKey,
        },
        body: JSON.stringify({
          query: `find concepts and keywords related to: ${q} in anime or video context`,
          useAutoprompt: true,
          numResults: 3,
          contents: { text: { maxCharacters: 500 } },
        }),
      })

      if (exaRes.ok) {
        const data = await exaRes.json()
        exaResults = data.results || []
        
        // Ekstrak kata umum dari teks yang dikembalikan Exa
        const combinedText = exaResults.map((r: any) => r.text || r.title).join(" ").toLowerCase()
        
        // Penghapusan stop-word dasar
        const words = combinedText.replace(/[^a-z0-9\s]/g, "").split(/\s+/)
        const stopwords = new Set(["the", "and", "or", "to", "in", "of", "a", "is", "for", "on", "with", "find", "concepts", "related", "anime", "video", "yang", "dan", "di", "ke", "dari", "untuk", "dengan", "ini", "itu", "atau"])
        
        const wordCounts = new Map<string, number>()
        for (const w of words) {
          if (w.length > 3 && !stopwords.has(w)) {
            wordCounts.set(w, (wordCounts.get(w) || 0) + 1)
          }
        }
        
        // Top 3 keywords dari konteks Exa
        const sortedWords = Array.from(wordCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0])
        expandedKeywords = [...expandedKeywords, ...sortedWords]
      }
    } catch (err) {
      console.error("Exa API gagal:", err)
    }
  }

  // Gunakan keyword yang diekspansi untuk mencari di DB
  const orConditions = expandedKeywords.map(keyword => ({
    OR: [
      { title: { contains: keyword } },
      { synopsis: { contains: keyword } },
      { TagOnVideo: { some: { Tag: { name: { contains: keyword } } } } },
    ]
  }))

  const videos = await prisma.video.findMany({
    where: {
      OR: orConditions.flat()
    },
    take: 20,
    orderBy: { views: "desc" },
    include: {
      CategoryOnVideo: { include: { Category: true } },
      TagOnVideo: { include: { Tag: true } }
    }
  })

  return NextResponse.json({
    originalQuery: q,
    expandedKeywords: expandedKeywords.filter(k => k !== q),
    videos,
    exaContext: exaResults.length > 0 ? true : false
  })
}
