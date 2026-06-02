"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function deleteVideo(videoId: string) {
  const session = await auth()
  const isAdmin = session?.user?.role === "admin" || session?.user?.role === "ADMIN"
  if (!isAdmin) throw new Error("Unauthorized")

  await prisma.video.delete({ where: { id: videoId } })
  revalidatePath("/admin/videos")
  revalidatePath("/")
  return { success: true }
}

export async function toggleVideoStatus(videoId: string, currentStatus: string) {
  const session = await auth()
  const isAdmin = session?.user?.role === "admin" || session?.user?.role === "ADMIN"
  if (!isAdmin) throw new Error("Unauthorized")

  const newStatus = currentStatus === "SAFE" ? "HIDDEN" : "SAFE"

  await prisma.video.update({
    where: { id: videoId },
    data: { moderationStatus: newStatus },
  })
  revalidatePath("/admin/videos")
  revalidatePath(`/watch/${videoId}`)
  return { success: true }
}
