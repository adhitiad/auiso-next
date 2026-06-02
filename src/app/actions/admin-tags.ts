"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export async function createTag(formData: FormData) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  const name = formData.get("name") as string
  if (!name?.trim()) return { error: "Nama tag tidak boleh kosong" }

  try {
    await prisma.tag.create({
      data: {
        name: name.trim(),
      }
    })
    revalidatePath("/admin/tags")
    return { success: true }
  } catch (e) {
    return { error: "Tag sudah ada" }
  }
}

export async function deleteTag(name: string) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  await prisma.tag.delete({ where: { name } })
  revalidatePath("/admin/tags")
}
