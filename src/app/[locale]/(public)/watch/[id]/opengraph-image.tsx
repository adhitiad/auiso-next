import { ImageResponse } from "next/og"
import { prisma } from "@/lib/prisma"



export const alt = "Video Thumbnail"
export const size = { width: 1200, height: 630 }

const Image = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const video = await prisma.video.findUnique({ where: { id } })

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 40,
          background: "linear-gradient(to bottom, #000, #333)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          padding: 40,
        }}
      >
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h1 style={{ fontSize: 60, fontWeight: "bold", marginBottom: 20 }}>{video?.title ?? "Aiuiso Video"}</h1>
          <p style={{ fontSize: 30, opacity: 0.8 }}>Tonton di Aiuiso.tv</p>
        </div>
      </div>
    ),
    { ...size }
  )
}


export default Image;
