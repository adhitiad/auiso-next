"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Trash2, Edit, Plus } from "lucide-react"
import Link from "next/link"
import { deleteVideo } from "@/app/actions/admin-videos"

export const VideoSearch = ({ defaultValue }: { defaultValue: string }) => {
  const router = useRouter()
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const q = formData.get("search") as string
    const searchParams = new URLSearchParams()
    if (q) searchParams.set("search", q)
    searchParams.set("page", "1")
    router.push(`?${searchParams.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="flex max-w-sm gap-2">
      <Input
        name="search"
        placeholder="Cari video..."
        defaultValue={defaultValue}
        className="bg-night-bg border-white/10"
      />
      <Button type="submit" variant="secondary" className="bg-white/5 hover:bg-white/10">
        <Search className="w-4 h-4" />
      </Button>
    </form>
  )
}

export const DeleteVideoButton = ({ id }: { id: string }) => {
  const handleDelete = async () => {
    if (confirm("Apakah Anda yakin ingin menghapus video ini?")) {
      try {
        await deleteVideo(id)
      } catch (error) {
        console.error("Gagal menghapus video:", error)
        alert("Gagal menghapus video")
      }
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDelete}
      className="text-red-500 hover:text-white hover:bg-red-500/20"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  )
}
