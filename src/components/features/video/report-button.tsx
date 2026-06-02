"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Flag } from "lucide-react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ReportButtonProps {
  targetId: string
  type: "video" | "comment"
}

const REASONS = [
  { value: "spam", label: "Spam atau Menyesatkan" },
  { value: "illegal", label: "Konten Ilegal / Dibawah Umur" },
  { value: "copyright", label: "Pelanggaran Hak Cipta / Pembajakan" },
  { value: "harassment", label: "Pelecehan atau Bullying" },
  { value: "other", label: "Lainnya" },
]

export const ReportButton = ({ targetId, type }: ReportButtonProps) => {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [reason, setReason] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason) return
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetId, type, reason }),
      })
      if (res.ok) setIsSuccess(true)
    } catch {
      // fail silently
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
        if (!v) { setIsSuccess(false); setReason("") }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white/40 hover:text-rose-500" title="Laporkan Konten">
          <Flag className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-night-card border-night-border text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Laporkan {type === "video" ? "Video" : "Komentar"}</DialogTitle>
          <DialogDescription className="text-white/50">
            Beri tahu kami mengapa konten ini bermasalah.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-6 text-center text-green-400 font-medium">
            ✓ Laporan Anda telah diterima. Terima kasih!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Alasan Pelaporan</label>
              <div className="grid grid-cols-1 gap-2">
                <RadioGroup value={reason} onValueChange={setReason}>
                  {REASONS.map((r) => (
                    <div key={r.value} className={`flex items-center space-x-3 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                      reason === r.value
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-white/10 hover:bg-white/5"
                    }`}>
                      <RadioGroupItem value={r.value} id={`reason-${r.value}`} className="border-white/20 text-purple-500" />
                      <Label htmlFor={`reason-${r.value}`} className="text-sm cursor-pointer w-full">{r.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Batal</Button>
              <Button
                type="submit"
                disabled={isSubmitting || !reason}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isSubmitting ? "Mengirim..." : "Laporkan"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
