"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"

export const UsernameForm = ({ currentUsername }: { currentUsername: string }) => {
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    
    const formData = new FormData(e.currentTarget)
    const newUsername = formData.get("username") as string

    if (!newUsername || newUsername.length < 3) {
      setError("Username minimal 3 karakter")
      return
    }

    startTransition(async () => {
      const res = await fetch("/api/user/username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newUsername }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Gagal mengubah username")
      } else {
        setSuccess("Username berhasil diubah!")
        router.refresh()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md p-6 glass-card rounded-2xl">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white mb-2">Ubah Username</h3>
        <p className="text-sm text-yellow-400 font-medium">
          Perhatian: Username hanya dapat diubah SATU KALI. Pastikan Anda yakin dengan pilihan Anda.
        </p>
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
        <label htmlFor="username" className="text-sm font-medium text-white/80">Username Baru</label>
        <input
          id="username"
          name="username"
          type="text"
          defaultValue={currentUsername}
          placeholder="Masukkan username baru..."
          className="w-full bg-night-bg border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-white/20"
        />
      </div>

      <button
        type="submit"
        disabled={isPending || !!success}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-2.5 rounded-lg font-bold transition-all disabled:opacity-50 shadow-lg shadow-purple-500/20"
      >
        {isPending ? "Menyimpan..." : success ? "Berhasil Disimpan" : "Simpan Permanen"}
      </button>
    </form>
  )
}
