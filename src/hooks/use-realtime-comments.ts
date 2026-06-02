"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getComments, getCommentById } from "@/app/actions/comments";

export function useRealtimeComments(videoId: string) {
  const [comments, setComments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getComments(videoId).then((data) => {
      setComments(data);
      setIsLoading(false);
    });

    const client = supabase;
    if (!client) return;

    const channel = client
      .channel(`video-${videoId}-comments`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Comment",
          filter: `videoId=eq.${videoId}`,
        },
         async (payload: any) => {
           if (payload.eventType === "INSERT") {
             // fetch data relasi (nama/avatar user) untuk komentar baru ini
             const enrichedComment = await getCommentById(payload.new.id);
             if (enrichedComment) {
               setComments((prev) => [enrichedComment, ...prev]);
             }
           } else if (payload.eventType === "DELETE") {
             setComments((prev) => prev.filter((c) => c.id !== payload.old.id));
           } else if (payload.eventType === "UPDATE") {
             setComments((prev) =>
               prev.map((c) =>
                 c.id === payload.new.id ? { ...c, ...payload.new } : c,
               ),
             );
           }
         },
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [videoId]);

  return { comments, isLoading };
}
