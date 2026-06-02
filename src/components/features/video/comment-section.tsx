"use client"

import { useEffect, useState, useRef, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { supabase } from "@/lib/supabase"
import { useTranslations, useLocale } from "next-intl"

interface Comment {
  id: string
  content: string
  createdAt: string | Date
  user?: { id: string; username?: string | null; name?: string | null; email?: string | null } | null
}

interface CommentSectionProps {
  videoId: string
  initialComments: Comment[]
  isLoggedIn: boolean
}

export const CommentSection = ({ videoId, initialComments, isLoggedIn }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)
  const t = useTranslations("CommentSection")

  useEffect(() => {
    setComments(initialComments)
  }, [initialComments])

  // Supabase Realtime
  useEffect(() => {
    const client = supabase
    if (!client) return

    const channel = client
      .channel(`comments:${videoId}`)
      .on("broadcast", { event: "NEW_COMMENT" }, (payload) => {
        const newComment = payload.payload as Comment
        if (newComment) {
          setComments((prev) => {
            if (prev.some((c) => c.id === newComment.id)) return prev
            return [newComment, ...prev]
          })
        }
      })
      .subscribe()

    return () => { client.removeChannel(channel) }
  }, [videoId])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const content = new FormData(form).get("content") as string
    if (!content?.trim()) return

    startTransition(async () => {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId, content }),
      })
      if (res.ok) {
        formRef.current?.reset()
      }
    })
  }

  const locale = useLocale()

  const getDisplayName = (comment: Comment) => {
    return comment.user?.username || comment.user?.name || comment.user?.email?.split("@")[0] || t("anonymous")
  }

  return (
    <div className="bg-night-card p-6 rounded-2xl border border-night-border mt-8 shadow-lg">
      <h3 className="text-2xl font-serif font-bold mb-6">{t("title")} ({comments.length})</h3>

      {isLoggedIn ? (
        <form ref={formRef} onSubmit={handleSubmit} className="mb-8 flex gap-4">
          <div className="flex-1">
            <Textarea
              name="content"
              placeholder={t("placeholder")}
              className="bg-night-bg border-night-border text-white w-full min-h-[80px] resize-none"
              required
              minLength={3}
              maxLength={1000}
            />
          </div>
          <Button type="submit" disabled={isPending} className="bg-purple-600 hover:bg-purple-700 text-white">
            {isPending ? t("sending") : t("send")}
          </Button>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-night-bg border border-night-border rounded-lg text-center text-white/50">
          <a href={`/${locale}/login`} className="text-cyan-400 hover:underline">{t("loginToComment1")}</a> {t("loginToComment2")}
        </div>
      )}

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <Avatar className="w-10 h-10 border border-night-border">
              <AvatarFallback className="bg-night-hover text-white uppercase">
                {getDisplayName(comment).slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-bold text-white">{getDisplayName(comment)}</span>
                <span className="text-xs text-white/40">
                  {new Date(comment.createdAt).toLocaleDateString(locale)}
                </span>
              </div>
              <p className="text-white/70 whitespace-pre-wrap">{comment.content}</p>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-center text-white/40 py-8">{t("noComments")}</p>
        )}
      </div>
    </div>
  )
}
