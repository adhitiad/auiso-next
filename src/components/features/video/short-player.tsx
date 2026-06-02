"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, Share2, Play } from "lucide-react";
import { getSafeImageUrl } from "@/lib/media";

interface ShortPlayerProps {
  videoId: string;
  title: string;
  thumbnail: string;
  likeCount: number;
  commentCount: number;
  locale: string;
  peerTubeId?: string | null;
  externalSourceUrl?: string | null;
}

export function ShortPlayer({
  videoId,
  title,
  thumbnail,
  likeCount,
  commentCount,
  locale,
}: ShortPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const safeThumbnail = getSafeImageUrl(thumbnail);

  // In a real app, you would use an IntersectionObserver here
  // to auto-play/pause based on visibility in the scroll-snap viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsPlaying(true);
          } else {
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.6 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-night-bg">
      {/* Background / Video Player Placeholder */}
      <div className="absolute inset-0 bg-black">
        {/* We use an image placeholder here. Real implementation would embed a <video> or iframe */}
        {safeThumbnail && (
          <Image
            src={safeThumbnail}
            alt={title}
            fill
            className={`object-cover transition-opacity duration-500 ${isPlaying ? 'opacity-80' : 'opacity-40'}`}
            sizes="(max-width: 768px) 100vw, 400px"
            priority
          />
        )}
      </div>

      {/* Gradient Overlay for Text */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/90 pointer-events-none" />

      {/* Play/Pause UI Simulator */}
      <button 
        className="absolute inset-0 w-full h-full flex items-center justify-center focus:outline-none"
        onClick={() => setIsPlaying(!isPlaying)}
      >
        {!isPlaying && (
          <div className="w-20 h-20 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <Play className="w-10 h-10 text-white ml-2 opacity-80" />
          </div>
        )}
      </button>

      {/* Bottom Info Section */}
      <div className="absolute bottom-0 left-0 right-16 p-4">
        <Link href={`/${locale}/watch/${videoId}`}>
          <h2 className="text-white text-lg md:text-xl font-bold line-clamp-2 drop-shadow-md hover:underline">
            {title}
          </h2>
        </Link>
        <p className="text-white/70 text-sm mt-2 line-clamp-1">
          @aiuiso_creator • Original Audio
        </p>
      </div>

      {/* Right Action Bar (TikTok Style) */}
      <div className="absolute bottom-4 right-2 flex flex-col items-center gap-6">
        <button className="flex flex-col items-center group">
          <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center mb-1 group-hover:bg-white/20 transition-colors">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xs font-bold drop-shadow-md">{likeCount}</span>
        </button>

        <Link href={`/${locale}/watch/${videoId}#comments`} className="flex flex-col items-center group">
          <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center mb-1 group-hover:bg-white/20 transition-colors">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xs font-bold drop-shadow-md">{commentCount}</span>
        </Link>

        <button className="flex flex-col items-center group">
          <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center mb-1 group-hover:bg-white/20 transition-colors">
            <Share2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xs font-bold drop-shadow-md">Share</span>
        </button>
      </div>
    </div>
  );
}
