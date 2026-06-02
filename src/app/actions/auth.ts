"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function getCurrentUser() {
  const session = await auth()
  if (!session?.user?.id) return null

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, image: true, role: true },
  })
  return user
}

export async function updateUserRole(userId: string, role: "USER" | "ADMIN" | "MODERATOR") {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  })
}
