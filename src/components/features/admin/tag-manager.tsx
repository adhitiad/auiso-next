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
import { Plus, Trash2 } from "lucide-react"
import { createTag, deleteTag } from "@/app/actions/admin-tags"

export const CreateTagDialog = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      const res = await createTag(formData)
      if (res?.error) {
        alert(res.error)
      } else {
        setIsOpen(false)
      }
    } catch (error) {
      alert("Gagal membuat tag")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Tag
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-night-card border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Buat Tag Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Tag</Label>
            <Input id="name" name="name" required placeholder="Contoh: Action" className="bg-night-bg border-white/10 text-white" />
          </div>
          <div className="flex justify-end">
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Simpan Tag"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export const DeleteTagButton = ({ name }: { name: string }) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (confirm(`Apakah Anda yakin ingin menghapus tag "${name}"?`)) {
      setIsDeleting(true)
      try {
        await deleteTag(name)
      } catch (error) {
        alert("Gagal menghapus tag")
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
