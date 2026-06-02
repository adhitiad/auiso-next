"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export async function moderateVideo(videoId: string, intent: "approve" | "reject") {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  if (!videoId || !intent) {
    throw new Error("Invalid request")
  }

  const newStatus = intent === "approve" ? "SAFE" : "REJECTED"

  await prisma.video.update({
    where: { id: videoId },
    data: { moderationStatus: newStatus }
  })

  revalidatePath("/admin/moderation")
}
