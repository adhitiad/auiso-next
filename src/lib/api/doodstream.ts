import axios from "axios"

export const doodstreamApi = axios.create({
  baseURL: "https://doodapi.com/api",
  timeout: 30000,
})

export async function uploadToDoodStream(file: File) {
  const formData = new FormData()
  formData.append("file", file)

  const response = await doodstreamApi.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return response.data
}

export async function getDoodStreamEmbedUrl(fileCode: string) {
  const response = await doodstreamApi.get("/file/info", { params: { file_code: fileCode } })
  return response.data.result.embed_url
}
