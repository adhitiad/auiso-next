import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import Groq from "groq-sdk"

export async function POST(request: NextRequest) {
  const session = await auth()
  
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "GROQ_API_KEY is not configured" }, { status: 400 })
  }

  try {
    const body = await request.json()
    const { images } = body

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: "Images array is required" }, { status: 400 })
    }

    const groq = new Groq({ apiKey })

    const prompt = "Anda adalah asisten kurasi thumbnail video. Dari gambar-gambar berikut, berikan indeks (0 sampai N-1) dari gambar yang paling estetis, menarik perhatian, dan memiliki pencahayaan terbaik. Kembalikan HANYA format JSON seperti ini: {\"bestIndex\": 0}"

    const messages = [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          ...images.map(url => ({
            type: "image_url",
            image_url: { url }
          }))
        ]
      }
    ]

    const response = await groq.chat.completions.create({
      model: "llama-3.2-90b-vision-preview",
      messages: messages as any,
      response_format: { type: "json_object" },
    })

    const content = response.choices[0]?.message?.content || "{}"
    const parsed = JSON.parse(content)

    return NextResponse.json({ bestIndex: parsed.bestIndex || 0 })
  } catch (error) {
    console.error("Thumbnail selection error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
