"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/supabase"

export function useRealtimePlayer(videoId: string, onEvent: (event: string, data: any) => void) {
  useEffect(() => {
    const client = supabase
    if (!client) return

    const channel = client
      .channel(`player-${videoId}`)
      .on("broadcast", { event: "player-event" }, (payload) => {
        onEvent(payload.event, payload.payload)
      })
      .subscribe()

    return () => { client.removeChannel(channel) }
  }, [videoId, onEvent])

  const broadcastEvent = (event: string, data: any) => {
    if (!supabase) return

    supabase.channel(`player-${videoId}`).send({
      type: "broadcast",
      event: "player-event",
      payload: { event, data },
    })
  }

  return { broadcastEvent }
}
