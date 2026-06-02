import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";
import bcrypt from "bcryptjs";

const updatePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Sandi lama wajib diisi"),
  newPassword: z.string().min(6, "Sandi baru minimal 6 karakter"),
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

    if (user.passwordChangeCount >= 10) {
      return NextResponse.json({ error: "Batas maksimal perubahan sandi (10 kali) telah tercapai" }, { status: 403 });
    }

    if (!user.password) {
      return NextResponse.json({ error: "Akun ini menggunakan Google Login. Anda tidak memiliki sandi untuk diubah." }, { status: 400 });
    }

    const body = await req.json();
    const result = updatePasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const { oldPassword, newPassword } = result.data;

    const passwordsMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordsMatch) {
      return NextResponse.json({ error: "Sandi lama tidak sesuai" }, { status: 400 });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedNewPassword,
        passwordChangeCount: {
          increment: 1
        },
      },
    });

    return NextResponse.json({ message: "Sandi berhasil diperbarui" });
  } catch (error) {
    console.error("Update password error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan internal peladen" }, { status: 500 });
  }
}
