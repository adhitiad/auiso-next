"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deleteComment } from "@/app/actions/admin-comments"

export const DeleteCommentButton = ({ id }: { id: string }) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (confirm("Apakah Anda yakin ingin menghapus komentar ini?")) {
      setIsDeleting(true)
      try {
        await deleteComment(id)
      } catch (error) {
        alert("Gagal menghapus komentar")
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
