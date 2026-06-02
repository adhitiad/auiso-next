import { prisma } from "./prisma"
import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function getRecommendedShorts(userId?: string) {
  // 1. Fetch potential shorts (duration <= 60, safe moderation)
  const potentialShorts = await prisma.video.findMany({
    where: {
      duration: { lte: 60 },
      moderationStatus: "SAFE",
    },
    take: 30, // Get top 30 recent shorts
    orderBy: { createdAt: "desc" },
    include: {
      CategoryOnVideo: { include: { Category: true } },
    }
  })

  if (potentialShorts.length === 0) return []

  // 2. Fetch user context (if logged in)
  let userInterestContext = "User is anonymous, no specific interests."
  
  if (userId) {
    const history = await prisma.watchHistory.findMany({
      where: { 
        userId
      },
      take: 10,
      orderBy: { watchedAt: "desc" },
      include: {
        video: {
          include: { CategoryOnVideo: { include: { Category: true } } }
        }
      }
    })

    if (history.length > 0) {
      const watchedTitles = history.map(h => h.video.title)
      const watchedCategories = new Set<string>()
      history.forEach(h => {
        h.video.CategoryOnVideo.forEach((c: any) => watchedCategories.add(c.Category.name))
      })
      
      userInterestContext = `User recently watched videos with titles: ${watchedTitles.join(", ")}. 
User prefers categories: ${Array.from(watchedCategories).join(", ")}.`
    }
  }

  // 3. Ask Groq to sort them based on relevance
  // Create a minimal prompt payload
  const shortsPayload = potentialShorts.map(s => ({
    id: s.id,
    title: s.title,
    categories: s.CategoryOnVideo.map(c => c.Category.name).join(", ")
  }))

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a recommendation engine. Given the user's watch history and a list of available short videos, return a JSON array of the top 10 recommended video IDs from the list, sorted by relevance. Return ONLY a JSON array of strings. Do not include markdown formatting or explanation."
        },
        {
          role: "user",
          content: `User Context: ${userInterestContext}\n\nAvailable Shorts:\n${JSON.stringify(shortsPayload, null, 2)}`
        }
      ],
      model: "llama3-8b-8192", // Fast model for quick sorting
      temperature: 0.2, // Low temp for more deterministic logic
      max_tokens: 500,
    })

    const responseText = completion.choices[0]?.message?.content?.trim() || "[]"
    
    // Attempt to parse the raw JSON array (handle potential markdown formatting just in case)
    let sortedIds: string[] = []
    try {
      const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim()
      sortedIds = JSON.parse(cleanJson)
    } catch (parseError) {
      console.error("[Recommender] Groq JSON parse error:", parseError)
      // Fallback: use recent
      return potentialShorts.slice(0, 10)
    }

    if (!Array.isArray(sortedIds) || sortedIds.length === 0) {
      return potentialShorts.slice(0, 10)
    }

    // Map sorted IDs back to video objects
    const recommendedVideos = []
    for (const id of sortedIds) {
      const video = potentialShorts.find(s => s.id === id)
      if (video) recommendedVideos.push(video)
    }

    // Fill with remaining if < 10
    if (recommendedVideos.length < 10) {
      for (const video of potentialShorts) {
        if (!recommendedVideos.find(v => v.id === video.id)) {
          recommendedVideos.push(video)
          if (recommendedVideos.length >= 10) break
        }
      }
    }

    return recommendedVideos
  } catch (error) {
    console.error("[Recommender] Groq API error:", error)
    return potentialShorts.slice(0, 10) // Fallback to chronologically recent
  }
}
