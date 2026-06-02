import { VideoCard } from "./video-card"
import { useTranslations } from "next-intl"

export interface VideoGridItem {
  id: string
  title: string
  thumbnail?: string | null
  views: number
  duration?: number | null
  isFeatured?: boolean
  CategoryOnVideo?: { Category: { name: string; type?: string } }[]
}

interface VideoGridProps {
  videos: VideoGridItem[]
  variant?: "default" | "compact"
  emptyMessage?: string
  loading?: boolean
  aboveFoldImageCount?: number
}

export const VideoGrid = ({
  videos,
  variant = "default",
  emptyMessage,
  loading,
  aboveFoldImageCount = 4,
}: VideoGridProps) => {
  const t = useTranslations("VideoGrid")
  const emptyText = emptyMessage || t("emptyMessage")

  if (loading) return <div className="grid gap-4">{t("loadingMessage")}</div>
  if (videos.length === 0) return <p className="text-muted-foreground text-center py-12">{emptyText}</p>

  return (
    <div className={`grid gap-4 ${variant === "default" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-8" : "grid-cols-1"}`}>
      {videos.map((video, index) => (
        <VideoCard key={video.id} video={video} priority={index < aboveFoldImageCount} />
      ))}
    </div>
  )
}
