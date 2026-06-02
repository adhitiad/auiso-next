"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/supabase"

export function useRealtimePlayer(videoId: string, onEvent: (event: string, data: any) => void) {
  useEffect(() => {
    const channel = supabase
      .channel(`player-${videoId}`)
      .on("broadcast", { event: "player-event" }, (payload) => {
        onEvent(payload.event, payload.payload)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [videoId, onEvent])

  const broadcastEvent = (event: string, data: any) => {
    supabase.channel(`player-${videoId}`).send({
      type: "broadcast",
      event: "player-event",
      payload: { event, data },
    })
  }

  return { broadcastEvent }
}
