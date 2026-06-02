"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { sendPushNotification } from "@/lib/push"

export const broadcastNotification = async (formData: FormData) => {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized" }
  }

  const title = formData.get("title")
  const body = formData.get("body")
  const url = formData.get("url") || "/"

  if (!title || !body) {
    return { error: "Judul dan pesan wajib diisi." }
  }

  const payload = {
    title: title.toString(),
    body: body.toString(),
    url: url.toString(),
    icon: "/icon-192.png",
  }

  try {
    const uniqueUsers = await prisma.pushSubscription.groupBy({
      by: ["userId"],
    })

    let successCount = 0

    const broadcastPromises = uniqueUsers.map(async (u) => {
      if (u.userId) {
        const success = await sendPushNotification(u.userId, payload)
        if (success) successCount++
      }
    })

    await Promise.all(broadcastPromises)

    return {
      success: true,
      message: `Notifikasi terkirim ke ${successCount} pengguna!`,
    }
  } catch (error) {
    console.error("Broadcast failed:", error)
    return { error: "Gagal mengirim notifikasi siaran." }
  }
}
