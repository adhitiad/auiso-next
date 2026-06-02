"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Trash2, Check, X } from "lucide-react"
import { createAdSlot, deleteAdSlot, processAdPurchase } from "@/app/actions/admin-ads"

export const CreateAdSlotDialog = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      const res = await createAdSlot(formData)
      if (res?.error) {
        alert(res.error)
      } else {
        setIsOpen(false)
      }
    } catch (error) {
      alert("Gagal membuat slot iklan")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Buat Slot Iklan
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-night-card border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Buat Slot Iklan Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Slot (cth: Header Banner)</Label>
            <Input id="name" name="name" required className="bg-night-bg border-white/10 text-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Posisi (header, sidebar)</Label>
            <Input id="position" name="position" required className="bg-night-bg border-white/10 text-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Harga (USD/hari)</Label>
            <Input type="number" step="0.01" id="price" name="price" required className="bg-night-bg border-white/10 text-white" />
          </div>
          <div className="flex justify-end">
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Simpan Slot"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export const DeleteAdSlotButton = ({ id }: { id: string }) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (confirm("Apakah Anda yakin ingin menghapus Slot Iklan ini?")) {
      setIsDeleting(true)
      try {
        await deleteAdSlot(id)
      } catch (error) {
        alert("Gagal menghapus slot iklan")
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-500 hover:bg-red-500/20 hover:text-red-400"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  )
}

export const ProcessPurchaseButtons = ({ id }: { id: string }) => {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleProcess = async (intent: "approve" | "reject") => {
    setIsProcessing(true)
    try {
      await processAdPurchase(id, intent)
    } catch (error) {
      alert("Gagal memproses pembelian iklan")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleProcess("approve")}
        disabled={isProcessing}
        className="text-green-500 hover:bg-green-500/20 hover:text-green-400"
      >
        <Check className="w-4 h-4 mr-1" /> Setujui
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleProcess("reject")}
        disabled={isProcessing}
        className="text-red-500 hover:bg-red-500/20 hover:text-red-400"
      >
        <X className="w-4 h-4 mr-1" /> Tolak
      </Button>
    </div>
  )
}
