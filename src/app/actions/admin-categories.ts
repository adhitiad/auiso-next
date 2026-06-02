"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export async function createCategory(formData: FormData) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  const name = formData.get("name") as string
  if (!name?.trim()) return { error: "Nama kategori tidak boleh kosong" }

  const trimmedName = name.trim()
  const slug = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-')

  try {
    await prisma.category.create({
      data: {
        name: trimmedName,
        slug,
        type: "genre"
      }
    })
    revalidatePath("/admin/categories")
    return { success: true }
  } catch (e) {
    return { error: "Kategori sudah ada" }
  }
}

export async function deleteCategory(name: string) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  await prisma.category.delete({ where: { name } })
  revalidatePath("/admin/categories")
}
