"use client"

import { useState, useEffect, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { toggleLike } from "@/app/actions/user-videos"

interface LikeButtonProps {
  videoId: string
  initialLiked: boolean
  likeCount: number
}

export const LikeButton = ({ videoId, initialLiked, likeCount }: LikeButtonProps) => {
  const [isLiked, setIsLiked] = useState(initialLiked)
  const [count, setCount] = useState(likeCount)
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    // Optimistic UI
    setIsLiked((prev) => !prev)
    setCount((prev) => isLiked ? prev - 1 : prev + 1)

    startTransition(async () => {
      const result = await toggleLike(videoId)
      if (result.error) {
        // Revert on error
        setIsLiked((prev) => !prev)
        setCount((prev) => isLiked ? prev + 1 : prev - 1)
      }
    })
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={isPending}
      className={`flex items-center gap-2 border-white/10 transition-all duration-300 ${
        isLiked
          ? "bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 hover:text-purple-300 border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.3)]"
          : "bg-night-card hover:bg-white/10 text-white/70 hover:text-white"
      }`}
    >
      <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
      <span>{count > 0 ? count.toLocaleString("id-ID") : "Like"}</span>
    </Button>
  )
}
