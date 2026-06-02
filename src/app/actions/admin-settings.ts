"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { encryptSetting } from "@/lib/encryption"
import { revalidatePath } from "next/cache"
import { randomUUID } from "crypto"

export const saveSettings = async (formData: FormData) => {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized" }
  }

  const token = formData.get("telegramToken")?.toString() || ""
  const chatId = formData.get("telegramChatId")?.toString() || ""

  try {
    // Upsert Token (Encrypted)
    if (token) {
      const existing = await prisma.systemSetting.findFirst({ where: { key: "TELEGRAM_BOT_TOKEN" } })
      if (existing) {
        await prisma.systemSetting.update({
          where: { id: existing.id },
          data: { value: encryptSetting(token) }
        })
      } else {
        await prisma.systemSetting.create({
          data: { id: randomUUID(), key: "TELEGRAM_BOT_TOKEN", value: encryptSetting(token), updatedAt: new Date() }
        })
      }
    } else {
      await prisma.systemSetting.deleteMany({
        where: { key: "TELEGRAM_BOT_TOKEN" },
      })
    }

    // Upsert Chat ID (Encrypted)
    if (chatId) {
      const existing = await prisma.systemSetting.findFirst({ where: { key: "TELEGRAM_CHAT_ID" } })
      if (existing) {
        await prisma.systemSetting.update({
          where: { id: existing.id },
          data: { value: encryptSetting(chatId) }
        })
      } else {
        await prisma.systemSetting.create({
          data: { id: randomUUID(), key: "TELEGRAM_CHAT_ID", value: encryptSetting(chatId), updatedAt: new Date() }
        })
      }
    } else {
      await prisma.systemSetting.deleteMany({
        where: { key: "TELEGRAM_CHAT_ID" },
      })
    }

    revalidatePath("/admin/settings")
    return { success: true, message: "Pengaturan berhasil disimpan dengan aman!" }
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal menyimpan pengaturan" }
  }
}
