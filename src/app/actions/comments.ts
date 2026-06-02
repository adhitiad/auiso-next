"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { createCommentSchema } from "@/types/api"

export async function createComment(formData: unknown) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const parsed = createCommentSchema.safeParse(formData)
  if (!parsed.success) return { error: "Validasi gagal", details: parsed.error.flatten() }

  try {
    const comment = await prisma.comment.create({
      data: {
        ...parsed.data,
        userId: session.user.id,
      },
      include: { user: { select: { id: true, name: true, image: true } } },
    })
    revalidatePath(`/watch/${parsed.data.videoId}`)
    return { success: true, comment }
  } catch (error) {
    return { error: "Gagal membuat komentar" }
  }
}

export async function getComments(videoId: string) {
  return prisma.comment.findMany({
    where: { videoId },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, name: true, image: true } } },
  })
}
