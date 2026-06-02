import { vodApi } from "@/lib/api-client"

export async function uploadVideoToVod(file: File) {
  const formData = new FormData()
  formData.append("file", file)

  const response = await vodApi.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })

  return response.data
}

export async function getVodStatus(videoId: string) {
  const response = await vodApi.get(`/status/${videoId}`)
  return response.data
}
