"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import cuid from "cuid";
import { cachedQuery } from "@/lib/redis";

const videoSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  synopsis: z.string().optional(),
  summary: z.string().optional(),
  thumbnail: z.string().url("Valid thumbnail URL is required"),
  duration: z.number().nullable().optional(),
  videoPlatform: z.string().optional(),
  videoId: z.string().optional(),
  isFeatured: z.boolean().default(false),
  moderationStatus: z.string().default("SAFE"),
  moderationScore: z.number().default(0),
  tags: z.string().optional(),
  categoryIds: z.array(z.string()).default([]),
});

export async function createVideo(formData: unknown) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    const parsed = videoSchema.safeParse(formData);
    if (!parsed.success) {
      return { error: "Invalid form data", details: parsed.error.flatten() };
    }

    const data = parsed.data;

    const tagNames = (data.tags || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const tagsConnectOrCreate = tagNames.map((name) => ({
      id: cuid(),
      Tag: {
        connectOrCreate: {
          where: { name },
          create: { name },
        },
      },
    }));

    const categoriesConnect = data.categoryIds.map((id) => ({
      id: cuid(),
      categoryId: id,
    }));

    const video = await prisma.video.create({
      data: {
        title: data.title,
        slug: data.slug,
        synopsis: data.synopsis || "",
        summary: data.summary || "",
        thumbnail: data.thumbnail,
        releaseDate: new Date(),
        duration: data.duration || null,
        isFeatured: data.isFeatured,
        videoPlatform: data.videoPlatform || "DOODSTREAM",
        videoId: data.videoId || "",
        moderationStatus: data.moderationStatus,
        moderationScore: data.moderationScore,
        TagOnVideo: { create: tagsConnectOrCreate },
        CategoryOnVideo: { create: categoriesConnect },
      },
    });

    revalidatePath("/");
    revalidatePath("/(admin)/videos", "page");

    return { success: true, video };
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    if (err.code === "P2002") {
      return { error: "A video with this slug already exists." };
    }
    return { error: err.message || "Failed to create video" };
  }
}

export async function updateVideo(formData: unknown) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    const parsed = videoSchema.safeParse(formData);
    if (!parsed.success) {
      return { error: "Invalid form data", details: parsed.error.flatten() };
    }

    const data = parsed.data;
    if (!data.id) return { error: "Video ID is required for updating" };

    const tagNames = (data.tags || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const tagsConnectOrCreate = tagNames.map((name) => ({
      id: cuid(),
      Tag: {
        connectOrCreate: {
          where: { name },
          create: { name },
        },
      },
    }));

    const categoriesConnect = data.categoryIds.map((id) => ({
      id: cuid(),
      categoryId: id,
    }));

    // Clear existing relations
    await prisma.tagOnVideo.deleteMany({ where: { videoId: data.id } });
    await prisma.categoryOnVideo.deleteMany({ where: { videoId: data.id } });

    const video = await prisma.video.update({
      where: { id: data.id },
      data: {
        title: data.title,
        slug: data.slug,
        synopsis: data.synopsis || "",
        summary: data.summary || "",
        thumbnail: data.thumbnail,
        releaseDate: new Date(),
        duration: data.duration || null,
        isFeatured: data.isFeatured,
        videoPlatform: data.videoPlatform || "DOODSTREAM",
        videoId: data.videoId || "",
        moderationStatus: data.moderationStatus,
        moderationScore: data.moderationScore,
        TagOnVideo: { create: tagsConnectOrCreate },
        CategoryOnVideo: { create: categoriesConnect },
      },
    });

    revalidatePath("/");
    revalidatePath("/(admin)/videos", "page");
    revalidatePath(`/watch/${data.slug}`);

    return { success: true, video };
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    if (err.code === "P2002") {
      return { error: "A video with this slug already exists." };
    }
    return { error: err.message || "Failed to update video" };
  }
}

export async function deleteVideo(id: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.video.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/(admin)/videos", "page");
    return { success: true };
  } catch (error: unknown) {
    const err = error as { message?: string };
    return { error: err.message || "Failed to delete video" };
  }
}

export async function getTrendingVideos() {
  const cacheKey = "videos:trending:homepage";
  const ttl = 1800; // Cache ditahan selama 30 menit (1800 detik)

    return cachedQuery(cacheKey, ttl, async () => {
      return prisma.video.findMany({
        where: { moderationStatus: "SAFE" },
        orderBy: { views: "desc" },
        take: 12,
        include: {
          CategoryOnVideo: {
            include: {
              Category: true
            }
          }
        }
      });
    });
}
