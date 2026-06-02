"use client"

import Link from "next/link"
import Image from "next/image"
import { Eye, Clock, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { CategoryBadge } from "@/components/ui/category-badge"
import { getSafeImageUrl } from "@/lib/media"
import { useTranslations } from "next-intl"

interface VideoCardProps {
  video: {
    id: string
    title: string
    thumbnail?: string | null
    views: number
    duration?: number | null
    isFeatured?: boolean
    CategoryOnVideo?: { Category: { name: string; type?: string } }[]
  }
  priority?: boolean
}

export const VideoCard = ({ video, priority = false }: VideoCardProps) => {
  const categories = video.CategoryOnVideo?.map((c) => c.Category) ?? []
  const thumbnail = getSafeImageUrl(video.thumbnail)
  const t = useTranslations("VideoCard")

  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    if (h > 0) return `${h}${t("hour")} ${m}${t("minute")}`
    return `${m}${t("minute")}`
  }

  return (
    <Link href={`/watch/${video.id}`} className="block group w-full">
      <Card className="glass-card overflow-hidden card-hover h-full flex flex-col relative">
        {video.isFeatured && (
          <div className="absolute -top-1 -right-1 z-10 bg-gradient-to-br from-yellow-400 to-yellow-600 text-black text-[10px] font-bold px-2 py-1 rounded-bl-lg shadow-lg flex items-center gap-1 shadow-yellow-500/50">
            <Star className="w-3 h-3 fill-black" /> PRO
          </div>
        )}
        <div className="relative aspect-video overflow-hidden bg-black/50">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={video.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              loading={priority ? "eager" : "lazy"}
              priority={priority}
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-night-hover flex items-center justify-center text-night-muted text-xs">
              {t("noThumbnail")}
            </div>
          )}
          <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-md px-2 py-1 rounded border border-white/10 text-xs font-semibold text-white flex items-center gap-1">
            <Eye className="w-3 h-3 text-cyan-400 neon-cyan" /> {video.views.toLocaleString("id-ID")}
          </div>
          {video.duration != null && (
            <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-md px-2 py-1 rounded border border-white/10 text-xs font-semibold text-white flex items-center gap-1">
              <Clock className="w-3 h-3 text-purple-400 neon-text" /> {formatDuration(video.duration)}
            </div>
          )}
        </div>
        <CardContent className="p-3 md:p-4 flex flex-col flex-grow bg-gradient-to-b from-transparent to-black/40">
          <h3 className="font-serif text-sm md:text-base font-bold text-white line-clamp-2 mb-2 group-hover:text-purple-400 transition-colors drop-shadow-md">
            {video.title}
          </h3>
          <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {categories.slice(0, 3).map((cat) => (
              <CategoryBadge key={cat.name} category={cat} />
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
