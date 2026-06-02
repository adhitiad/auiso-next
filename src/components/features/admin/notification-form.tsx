"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { broadcastNotification } from "@/app/actions/admin-notifications"

export const NotificationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    try {
      const res = await broadcastNotification(formData)
      if (res.success) {
        setMessage({ type: "success", text: res.message || "Sukses" })
        ;(e.target as HTMLFormElement).reset()
      } else {
        setMessage({ type: "error", text: res.error || "Gagal" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Terjadi kesalahan" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-serif font-bold mb-6 text-purple-400">
        Siaran Notifikasi
      </h2>
      <p className="text-white/60 mb-8">
        Kirim push notification web ke semua pengguna yang telah berlangganan.
      </p>

      {message?.type === "success" && (
        <div className="bg-green-500/20 border border-green-500 text-green-500 p-4 rounded-lg mb-6">
          {message.text}
        </div>
      )}

      {message?.type === "error" && (
        <div className="bg-red-500/20 border border-red-500 text-red-500 p-4 rounded-lg mb-6">
          {message.text}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-night-card p-6 rounded-xl border border-white/10"
      >
        <div>
          <Label className="block text-sm font-medium mb-2 text-white/80">
            Judul
          </Label>
          <Input
            name="title"
            placeholder="Contoh: Video Baru Tersedia!"
            required
            className="bg-night-bg border-white/10 text-white"
          />
        </div>

        <div>
          <Label className="block text-sm font-medium mb-2 text-white/80">
            Pesan
          </Label>
          <Input
            name="body"
            placeholder="Contoh: Tonton konten eksklusif terbaru sekarang."
            required
            className="bg-night-bg border-white/10 text-white"
          />
        </div>

        <div>
          <Label className="block text-sm font-medium mb-2 text-white/80">
            URL Tujuan (Opsional)
          </Label>
          <Input
            name="url"
            placeholder="Contoh: /watch/video-slug"
            className="bg-night-bg border-white/10 text-white"
          />
          <p className="text-xs text-white/40 mt-2">
            URL tujuan saat pengguna mengklik notifikasi.
          </p>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold"
        >
          {isSubmitting ? "Mengirim..." : "Kirim Siaran"}
        </Button>
      </form>
    </div>
  )
}
