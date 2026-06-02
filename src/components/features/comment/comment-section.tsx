"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { createComment } from "@/app/actions/comments"
import { useRealtimeComments } from "@/hooks/use-realtime-comments"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface CommentSectionProps {
  videoId: string
  totalComments: number
}

export const CommentSection = ({ videoId, totalComments }: CommentSectionProps) => {
  const { data: session } = useSession()
  const [content, setContent] = useState("")
  const { comments, isLoading } = useRealtimeComments(videoId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || !session) return
    const currentContent = content;
    setContent("")
    await createComment({ videoId, content: currentContent })
  }

  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-lg">{comments.length > totalComments ? comments.length : totalComments} Komentar</h2>
      
      {session ? (
        <form onSubmit={handleSubmit} className="flex gap-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={session.user.image ?? undefined} />
            <AvatarFallback>{session.user.name?.[0] ?? "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 flex flex-col items-end gap-2">
            <input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tambahkan komentar..."
              className="w-full border-b border-muted bg-transparent pb-1 focus:border-primary focus:outline-none transition-colors"
            />
            <button 
              type="submit" 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium disabled:opacity-50 transition-opacity" 
              disabled={!content.trim()}
            >
              Komentar
            </button>
          </div>
        </form>
      ) : (
        <div className="p-4 bg-muted/50 rounded-lg text-center text-sm text-muted-foreground">
          Silakan masuk untuk meninggalkan komentar.
        </div>
      )}

      <div className="space-y-6 mt-6">
        {isLoading ? (
          <p className="text-muted-foreground text-sm">Memuat komentar...</p>
        ) : comments.length === 0 ? (
          <p className="text-muted-foreground text-sm">Belum ada komentar.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <Avatar className="w-10 h-10">
                <AvatarImage src={comment.user?.image ?? undefined} />
                <AvatarFallback>{comment.user?.name?.[0] ?? "U"}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{comment.user?.name || "Pengguna"}</span>
                  <span className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleDateString("id-ID")}</span>
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
