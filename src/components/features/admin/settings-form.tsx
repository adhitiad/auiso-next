"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, ShieldCheck } from "lucide-react"
import { saveSettings } from "@/app/actions/admin-settings"

export const SettingsForm = ({ initialSettings }: { initialSettings: Record<string, string> }) => {
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    try {
      const res = await saveSettings(formData)
      if (res.success) {
        setMessage({ type: "success", text: res.message || "Sukses" })
      } else {
        setMessage({ type: "error", text: res.error || "Gagal" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Terjadi kesalahan" })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message?.type === "success" && (
        <div className="p-4 bg-purple-500/20 border border-purple-500 rounded-lg text-white flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-purple-400" />
          {message.text}
        </div>
      )}

      {message?.type === "error" && (
        <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg text-white">
          {message.text}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="telegramToken" className="text-white/80">
          Telegram Bot Token
        </Label>
        <Input
          id="telegramToken"
          name="telegramToken"
          type="password"
          defaultValue={initialSettings.TELEGRAM_BOT_TOKEN || ""}
          placeholder="12********************************"
          className="bg-night-bg border-white/10 text-white"
        />
        <p className="text-xs text-white/40 mt-1">
          Dapatkan dari @BotFather di Telegram.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="telegramChatId" className="text-white/80">
          Telegram Chat ID
        </Label>
        <Input
          id="telegramChatId"
          name="telegramChatId"
          type="text"
          defaultValue={initialSettings.TELEGRAM_CHAT_ID || ""}
          placeholder="-100***********************************"
          className="bg-night-bg border-white/10 text-white font-mono"
        />
        <p className="text-xs text-white/40 mt-1">
          ID grup/channel tempat bot akan mengirim pesan. Gunakan @RawDataBot untuk mencari ID.
        </p>
      </div>

      <Button
        type="submit"
        className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto flex items-center gap-2"
        disabled={isSaving}
      >
        {isSaving ? (
          <>Menyimpan...</>
        ) : (
          <>
            <Save className="w-4 h-4" />
            Simpan & Enkripsi Pengaturan
          </>
        )}
      </Button>
    </form>
  )
}
