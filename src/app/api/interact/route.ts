import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  let type: string | null = null;
  let videoId: string | null = null;

  try {
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await request.json();
      type = body.type;
      videoId = body.videoId;
    } else {
      const formData = await request.formData();
      type = formData.get("type") as string;
      videoId = formData.get("videoId") as string;
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request payload" },
      { status: 400 },
    );
  }

  if (!videoId || typeof videoId !== "string") {
    return NextResponse.json({ error: "Invalid videoId" }, { status: 400 });
  }

  // Rate Limiting: 30 interactions per minute per user
  const limitStatus = await checkRateLimit(`interact:${userId}`, {
    maxRequests: 30,
    windowSeconds: 60,
  });

  if (!limitStatus.allowed) {
    return NextResponse.json(
      { error: "Terlalu banyak permintaan. Silakan coba lagi nanti." },
      { status: 429 },
    );
  }

  if (type === "like") {
    const existing = await prisma.like.findUnique({
      where: { userId_videoId: { userId, videoId } },
    });

    if (existing) {
      await prisma.like.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ success: true, liked: false });
    } else {
      await prisma.like.create({
        data: { id: randomUUID(), userId, videoId },
      });
      return NextResponse.json({ success: true, liked: true });
    }
  }

  if (type === "bookmark") {
    const existing = await prisma.bookmark.findUnique({
      where: { userId_videoId: { userId, videoId } },
    });

    if (existing) {
      await prisma.bookmark.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ success: true, bookmarked: false });
    } else {
      await prisma.bookmark.create({
        data: { userId, videoId },
      });
      return NextResponse.json({ success: true, bookmarked: true });
    }
  }

  if (type === "watch") {
    // Gunakan upsert agar jika user menonton ulang, waktunya (watchedAt) diperbarui
    const watchRecord = await prisma.watchHistory.upsert({
      where: {
        userId_videoId: { userId, videoId },
      },
      update: {
        watchedAt: new Date(),
      },
      create: {
        id: randomUUID(),
        userId,
        videoId,
      },
    });

    // Opsional: Tambahkan algoritma untuk meningkatkan jumlah 'views' pada tabel Video
    // Hanya tambah view jika ini adalah rekaman baru (dibuat dalam 10 detik terakhir)
    const isNewView = watchRecord.watchedAt.getTime() > Date.now() - 10000;
    if (isNewView) {
      await prisma.video.update({
        where: { id: videoId },
        data: { views: { increment: 1 } },
      });
    }

    return NextResponse.json({ success: true, watched: true });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}
