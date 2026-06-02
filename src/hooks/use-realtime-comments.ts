"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { getComments } from "@/app/actions/comments"

export function useRealtimeComments(videoId: string) {
  const [comments, setComments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getComments(videoId).then((data) => {
      setComments(data)
      setIsLoading(false)
    })

    const client = supabase
    if (!client) return

    const channel = client
      .channel(`video-${videoId}-comments`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "Comment",
        filter: `videoId=eq.${videoId}`,
      }, (payload) => {
        setComments((prev) => [payload.new, ...prev])
      })
      .subscribe()

    return () => { client.removeChannel(channel) }
  }, [videoId])

  return { comments, isLoading }
}
