import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const updateUsernameSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh berisi huruf, angka, dan underscore"),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Tidak sah" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    if (user.usernameChanged) {
      return NextResponse.json({ error: "Anda sudah pernah mengganti username" }, { status: 403 });
    }

    const body = await req.json();
    const result = updateUsernameSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const { username } = result.data;

    // Cek apakah username sudah ada yang pakai
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUsername) {
      return NextResponse.json({ error: "Username sudah digunakan" }, { status: 409 });
    }

    // Update username dan set usernameChanged ke true
    await prisma.user.update({
      where: { id: user.id },
      data: {
        username,
        usernameChanged: true,
      },
    });

    return NextResponse.json({ message: "Username berhasil diperbarui" });
  } catch (error) {
    console.error("Update username error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan internal peladen" }, { status: 500 });
  }
}
