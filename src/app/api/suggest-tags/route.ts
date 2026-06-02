import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import Groq from "groq-sdk"

export async function GET() {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ enabled: false })
  }
  const hasKey = !!process.env.GROQ_API_KEY
  return NextResponse.json({ enabled: hasKey })
}

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

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const prompt = `Berikan daftar tag dan kategori yang relevan untuk video dengan judul dan deskripsi berikut. Kembalikan HANYA JSON murni tanpa markdown, tanpa penjelasan, persis dengan struktur ini: {"tags": ["tag1", "tag2"], "categories": ["cat1", "cat2"]}\n\nJudul: ${title}\nDeskripsi: ${description || "Tidak ada deskripsi."}`

    const groq = new Groq({ apiKey })
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      response_format: { type: "json_object" },
    })

    const content = response.choices[0]?.message?.content || "{}"

    let parsedContent
    try {
      parsedContent = JSON.parse(content)
    } catch (e) {
      console.error("Failed to parse JSON from Groq:", content)
      return NextResponse.json({ error: "AI returned invalid JSON" }, { status: 500 })
    }

    return NextResponse.json({
      tags: Array.isArray(parsedContent.tags) ? parsedContent.tags : [],
      categories: Array.isArray(parsedContent.categories) ? parsedContent.categories : [],
    })
  } catch (error) {
    console.error("Suggest tags error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
