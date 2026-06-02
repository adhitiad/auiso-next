"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Play, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

// Types
type Category = { name: string; slug: string };
type ShortVideo = {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  duration: number | null;
  CategoryOnVideo: { Category: Category }[];
};

interface ShortsCarouselProps {
  shorts: ShortVideo[];
}

export function ShortsCarousel({ shorts }: ShortsCarouselProps) {
  const [width, setWidth] = useState(0);
  const carousel = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const t = useTranslations("Shorts");

  useEffect(() => {
    if (carousel.current) {
      // Calculate max scroll width
      setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
    }
  }, [shorts]);

  if (!shorts || shorts.length === 0) return null;

  return (
    <div className="w-full mb-12 overflow-hidden bg-black/20 py-8 rounded-2xl relative border border-white/5 shadow-2xl">
      {/* Title / Header */}
      <div className="px-6 mb-6 flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            {t("title")}
          </h2>
          <p className="text-sm text-gray-400">{t("subtitle")}</p>
        </div>
      </div>

      {/* Drag Carousel */}
      <motion.div
        ref={carousel}
        className="cursor-grab active:cursor-grabbing overflow-hidden px-6"
      >
        <motion.div
          drag="x"
          dragConstraints={{ right: 0, left: -width }}
          className="flex gap-4"
          style={{ x }}
          // Spring animation config for drag release
          dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
        >
          {shorts.map((video) => (
            <motion.div
              key={video.id}
              className="min-w-[200px] md:min-w-[240px] max-w-[200px] md:max-w-[240px]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={`/watch/${video.slug}`}
                className="block relative aspect-[9/16] rounded-2xl overflow-hidden group"
              >
                {/* Thumbnail */}
                <Image
                  src={
                    video.thumbnail ||
                    "https://placehold.co/480x854/1a1a1a/FFFFFF.png?text=Shorts"
                  }
                  alt={video.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 200px, 240px"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90 pointer-events-none" />

                {/* Play Button (Hidden until hover on desktop, always visible on mobile if wanted, but hover is better) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <Play className="w-6 h-6 text-white ml-1" />
                  </div>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-sm md:text-base line-clamp-2 leading-tight mb-2 drop-shadow-md">
                    {video.title}
                  </h3>

                  {/* Categories/Tags (limit to 1 or 2) */}
                  <div className="flex flex-wrap gap-1">
                    {video.CategoryOnVideo.slice(0, 2).map((cov) => (
                      <span
                        key={cov.Category.slug}
                        className="text-[10px] uppercase font-bold bg-white/10 backdrop-blur-md text-white/80 px-2 py-1 rounded-full border border-white/10"
                      >
                        {cov.Category.name}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
