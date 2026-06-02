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
    const { title, description } = body

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 })
    }

    const prompt = `Buat ringkasan 2-3 kalimat untuk video dengan judul dan deskripsi berikut:\n\nJudul: ${title}\nDeskripsi: ${description}`

    const groq = new Groq({ apiKey })
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
    })

    const summary = response.choices[0].message.content

    return NextResponse.json({ summary })
  } catch (error) {
    console.error("Summary generation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
