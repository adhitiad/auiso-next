"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle } from "lucide-react"
import { moderateVideo } from "@/app/actions/admin-moderation"

export const ModerationButtons = ({ videoId }: { videoId: string }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleModerate = async (intent: "approve" | "reject") => {
    setIsSubmitting(true)
    try {
      await moderateVideo(videoId, intent)
    } catch (error) {
      alert("Gagal memoderasi video")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-end gap-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => handleModerate("approve")}
        disabled={isSubmitting}
        className="text-green-400 border-green-500/50 hover:bg-green-500/10 hover:text-green-300"
      >
        <CheckCircle className="w-4 h-4 mr-1" />
        Setujui
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => handleModerate("reject")}
        disabled={isSubmitting}
        className="text-red-400 border-red-500/50 hover:bg-red-500/10 hover:text-red-300"
      >
        <XCircle className="w-4 h-4 mr-1" />
        Tolak
      </Button>
    </div>
  )
}
