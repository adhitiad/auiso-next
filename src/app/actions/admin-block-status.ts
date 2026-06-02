"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { randomUUID } from "crypto"

export const checkBlockStatus = async () => {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized" }
  }

  try {
    // Simulasi pengecekan ke OONI / API eksternal
    // Dalam produksi, ganti dengan fetch ke API yang sebenarnya
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const simulatedStatuses = [
      { country: "ID", status: "accessible" },
      { country: "MY", status: "blocked" },
      { country: "SG", status: "accessible" },
    ]

    for (const data of simulatedStatuses) {
      const existing = await prisma.blockStatus.findFirst({
        where: { country: data.country },
      })
      if (existing) {
        await prisma.blockStatus.update({
          where: { id: existing.id },
          data: { status: data.status, checkedAt: new Date() },
        })
      } else {
        await prisma.blockStatus.create({
          data: {
            id: randomUUID(),
            country: data.country,
            status: data.status,
            checkedAt: new Date(),
          },
        })
      }
    }

    revalidatePath("/admin/block-status")
    return { success: true }
  } catch (error) {
    console.error("Check status failed:", error)
    return { error: "Gagal memeriksa status blokir." }
  }
}
