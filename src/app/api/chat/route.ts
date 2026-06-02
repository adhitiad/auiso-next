import { NextRequest, NextResponse } from "next/server"

// Proxy backend untuk model "Self: After Dark" via SillyTavern / Local LLM
export async function POST(req: NextRequest) {
  const SILLY_TAVERN_API_URL = process.env.SILLY_TAVERN_API_URL || "http://127.0.0.1:5000/v1/chat/completions"
  const SILLY_TAVERN_API_KEY = process.env.SILLY_TAVERN_API_KEY || ""

  try {
    const body = await req.json()

    // Proxy request ke endpoint SillyTavern / Local LLM
    const response = await fetch(SILLY_TAVERN_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SILLY_TAVERN_API_KEY}`
      },
      body: JSON.stringify({
        messages: body.messages,
        model: body.model || "self-after-dark",
        temperature: 0.9,
        max_tokens: 500,
        stream: false // set to true if implementing SSE later
      })
    })

    if (!response.ok) {
      throw new Error(`Local LLM merespons dengan status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Chat API proxy gagal:", error)
    // Fallback saat backend tidak aktif
    return NextResponse.json({
      choices: [
        {
          message: {
            role: "assistant",
            content: "*Hela napas*... Server SillyTavern sedang tidur. Silakan konfigurasikan backend model Self: After Dark untuk melanjutkan obrolan kita."
          }
        }
      ]
    }, { status: 503 })
  }
}
