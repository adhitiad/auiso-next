import { peertubeApi } from "@/lib/api-client"

export async function mirrorToPeertube(videoUrl: string, title: string, description: string) {
  const response = await peertubeApi.post("/videos/upload", {
    name: title,
    description,
    channelId: 1,
    privacy: 1,
    videofile: videoUrl,
  })
  return response.data
}
