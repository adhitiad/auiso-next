"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"
import { Play, Info } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { CategoryBadge } from "@/components/ui/category-badge"
import { getSafeImageUrl } from "@/lib/media"

interface FeaturedVideo {
  id: string
  title: string
  synopsis?: string | null
  thumbnail?: string | null
  CategoryOnVideo?: { Category: { name: string; type?: string } }[]
}

interface HeroCarouselProps {
  items: FeaturedVideo[]
}

export const HeroCarousel = ({ items }: HeroCarouselProps) => {
  const plugin = React.useRef(Autoplay({ delay: 5000, stopOnInteraction: true }))

  if (!items || items.length === 0) return null

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-6xl mx-auto rounded-xl overflow-hidden group mb-12 shadow-2xl shadow-purple-500/10"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {items.map((video, index) => {
          const categories = video.CategoryOnVideo?.map((c) => c.Category) ?? []
          const thumbnail = getSafeImageUrl(video.thumbnail)
          return (
            <CarouselItem key={video.id}>
              <div className="relative aspect-[21/9] sm:aspect-[16/9] md:aspect-[21/9] overflow-hidden">
                <div className="absolute inset-0">
                  {thumbnail ? (
                    <Image
                      src={thumbnail}
                      alt={video.title}
                      fill
                      loading={index === 0 ? "eager" : "lazy"}
                      priority={index === 0}
                      sizes="100vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-night-card" />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-6 md:p-12">
                  <div className="max-w-3xl animate-in slide-in-from-bottom-4 duration-700">
                    <div className="flex gap-2 mb-4 flex-wrap">
                      {categories.slice(0, 3).map((cat) => (
                        <CategoryBadge key={cat.name} category={cat} className="shadow-[0_0_10px_rgba(225,29,72,0.5)]" />
                      ))}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4 line-clamp-2">
                      {video.title}
                    </h2>
                    <p className="text-white/70 text-sm md:text-base line-clamp-3 mb-6 max-w-2xl">
                      {video.synopsis}
                    </p>
                    <div className="flex gap-4">
                      <Link
                        href={`/watch/${video.id}`}
                        className="inline-flex items-center gap-2 bg-white text-black hover:bg-white/90 px-6 py-3 rounded-lg font-bold text-sm transition-transform hover:scale-105"
                      >
                        <Play className="w-5 h-5 fill-current" /> Tonton Sekarang
                      </Link>
                      <Link
                        href={`/watch/${video.id}`}
                        className="inline-flex items-center gap-2 border border-white/20 hover:bg-white/10 text-white backdrop-blur-sm px-6 py-3 rounded-lg text-sm transition-colors"
                      >
                        <Info className="w-5 h-5" /> Detail
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          )
        })}
      </CarouselContent>
      <CarouselPrevious className="left-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 border-white/10 hover:bg-black/80 text-white" />
      <CarouselNext className="right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 border-white/10 hover:bg-black/80 text-white" />
    </Carousel>
  )
}
