"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"

export const PasswordForm = ({ changeCount }: { changeCount: number }) => {
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const MAX_CHANGES = 10
  const remainingChanges = MAX_CHANGES - changeCount
  const isLocked = remainingChanges <= 0

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    
    if (isLocked) return

    const formData = new FormData(e.currentTarget)
    const oldPassword = formData.get("oldPassword") as string
    const newPassword = formData.get("newPassword") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Semua kolom wajib diisi")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Sandi baru dan konfirmasi tidak cocok")
      return
    }

    if (newPassword.length < 6) {
      setError("Sandi baru minimal 6 karakter")
      return
    }

    startTransition(async () => {
      const res = await fetch("/api/user/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Gagal mengubah sandi")
      } else {
        setSuccess("Kata sandi berhasil diubah!")
        ;(e.target as HTMLFormElement).reset()
        router.refresh()
      }
    })
  }

  if (isLocked) {
    return (
      <div className="max-w-md p-6 bg-red-900/20 border-l-4 border-red-500 rounded-r-2xl mb-8">
        <h3 className="text-xl font-bold text-white mb-2">Batas Perubahan Sandi Tercapai</h3>
        <p className="text-white/70 text-sm">
          Anda telah mencapai batas maksimal perubahan kata sandi ({MAX_CHANGES} kali). Untuk alasan keamanan, fitur perubahan sandi untuk akun ini telah dikunci permanen.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md p-6 glass-card rounded-2xl mb-8">
      <div className="mb-4 flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Ubah Sandi</h3>
          <p className="text-sm text-white/50">
            Sisa kesempatan mengubah sandi: <span className="text-purple-400 font-bold">{remainingChanges} kali</span>
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm text-center">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-900/30 border border-green-500/50 text-green-300 px-4 py-3 rounded-lg text-sm text-center">
          {success}
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="oldPassword" className="text-sm font-medium text-white/80">Sandi Lama</label>
        <input
          id="oldPassword"
          name="oldPassword"
          type="password"
          placeholder="Masukkan sandi saat ini"
          className="w-full bg-night-bg border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="newPassword" className="text-sm font-medium text-white/80">Sandi Baru</label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          placeholder="Minimal 6 karakter"
          className="w-full bg-night-bg border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="confirmPassword" className="text-sm font-medium text-white/80">Konfirmasi Sandi Baru</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Ulangi sandi baru"
          className="w-full bg-night-bg border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-lg font-bold transition-all disabled:opacity-50"
      >
        {isPending ? "Memproses..." : "Perbarui Sandi"}
      </button>
    </form>
  )
}
