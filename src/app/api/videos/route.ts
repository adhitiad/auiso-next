import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { videoListQuerySchema } from "@/types/api";
import { Prisma } from "@/generated/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const parsed = videoListQuerySchema.safeParse(
    Object.fromEntries(searchParams),
  );
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Query tidak valid", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { category, search, sort, limit = 20, offset = 0 } = parsed.data;

  const where: Prisma.VideoWhereInput = { moderationStatus: "SAFE" };
  if (category) {
    where.CategoryOnVideo = { some: { Category: { slug: category } } };
  }
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { synopsis: { contains: search, mode: "insensitive" } },
    ];
  }

  const orderBy =
    sort === "popular" || sort === "trending"
      ? { views: "desc" as const }
      : { createdAt: "desc" as const };

  const [videos, total] = await Promise.all([
    prisma.video.findMany({
      where,
      orderBy,
      take: limit,
      skip: offset,
      include: {
        CategoryOnVideo: { include: { Category: true } },
      },
    }),
    prisma.video.count({ where }),
  ]);

  return NextResponse.json({
    videos,
    total,
    hasMore: offset + videos.length < total,
  });
}
