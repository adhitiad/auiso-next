"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { z } from "zod"
import { randomUUID } from "crypto"

export const createAdSlot = async (formData: FormData) => {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  const name = formData.get("name") as string
  const position = formData.get("position") as string
  const price = parseFloat(formData.get("price") as string)

  if (!name || !position || isNaN(price)) {
    return { error: "Invalid data" }
  }

  await prisma.adSlot.create({
    data: { 
      id: randomUUID(),
      name, 
      position, 
      price, 
      active: true,
      updatedAt: new Date()
    }
  })

  revalidatePath("/admin/ads")
  return { success: true }
}

export const deleteAdSlot = async (id: string) => {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  await prisma.adSlot.delete({ where: { id } })
  revalidatePath("/admin/ads")
}

export const processAdPurchase = async (id: string, intent: "approve" | "reject") => {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  if (intent === "approve") {
    await prisma.adPurchase.update({
      where: { id },
      data: { status: "APPROVED", active: true },
    })
  } else if (intent === "reject") {
    await prisma.adPurchase.update({
      where: { id },
      data: { status: "REJECTED", active: false },
    })
  }

  revalidatePath("/admin/ads/purchases")
}
