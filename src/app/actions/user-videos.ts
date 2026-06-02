"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function toggleLike(videoId: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const existing = await prisma.like.findUnique({
    where: { userId_videoId: { userId: session.user.id, videoId } },
  })

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } })
  } else {
    // QPCVide Like id is String without default, using crypto.randomUUID()
    await prisma.like.create({ data: { id: crypto.randomUUID(), userId: session.user.id, videoId } })
  }

  revalidatePath(`/watch/${videoId}`)
  return { success: true, liked: !existing }
}

export async function addBookmark(videoId: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  try {
    await prisma.bookmark.create({ data: { userId: session.user.id, videoId } })
    return { success: true }
  } catch {
    return { error: "Sudah di-bookmark" }
  }
}

export async function removeBookmark(videoId: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  await prisma.bookmark.deleteMany({ where: { userId: session.user.id, videoId } })
  return { success: true }
}
