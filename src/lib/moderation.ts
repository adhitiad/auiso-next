import axios from "axios"

const groq = axios.create({
  baseURL: "https://api.groq.com/openai/v1",
  headers: {
    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    "Content-Type": "application/json"
  }
})

export async function moderateContentWithGroq(content: string) {
  if (!process.env.GROQ_API_KEY) return { safe: true, reason: null }

  try {
    const response = await groq.post("/chat/completions", {
      model: "llama-guard-3-8b",
      messages: [
        { role: "system", content: "You are a content moderator. Respond with SAFE or UNSAFE and a brief reason." },
        { role: "user", content: `Moderate this content: "${content}"` },
      ],
    })

    const result = response.data.choices[0].message.content
    const isSafe = result.includes("SAFE")
    return { safe: isSafe, reason: isSafe ? null : result }
  } catch {
    return { safe: true, reason: null } // Fail open
  }
}
