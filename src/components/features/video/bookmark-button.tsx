"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Bookmark } from "lucide-react"
import { addBookmark, removeBookmark } from "@/app/actions/user-videos"

interface BookmarkButtonProps {
  videoId: string
  initialBookmarked: boolean
}

export const BookmarkButton = ({ videoId, initialBookmarked }: BookmarkButtonProps) => {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked)
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    setIsBookmarked((prev) => !prev)

    startTransition(async () => {
      const action = isBookmarked ? removeBookmark : addBookmark
      const result = await action(videoId)
      if (result.error) {
        setIsBookmarked((prev) => !prev)
      }
    })
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleClick}
      disabled={isPending}
      className={`gap-2 border-night-border hover:bg-night-hover ${
        isBookmarked ? "text-purple-400 border-purple-400/50" : "text-white/60"
      }`}
    >
      <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`} />
      <span>{isBookmarked ? "Tersimpan" : "Simpan"}</span>
    </Button>
  )
}
