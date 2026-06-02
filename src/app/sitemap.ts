import { MetadataRoute } from "next"
import { prisma } from "@/lib/prisma"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://aiuiso.site"

  const [videos, categories, staticPages] = await Promise.all([
    prisma.video.findMany({ where: { moderationStatus: "SAFE" }, select: { id: true, createdAt: true }, take: 1000, orderBy: { views: "desc" } }),
    prisma.category.findMany({ select: { slug: true } }),
    ["/", "/search", "/login"],
  ])

  const videoUrls = videos.map((v) => ({
    url: `${baseUrl}/watch/${v.id}`,
    lastModified: v.createdAt,
    changeFrequency: "hourly" as const,
    priority: 1.0,
  }))

  const categoryUrls = categories.map((c) => ({
    url: `${baseUrl}/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }))

  const staticUrls = staticPages.map((p) => ({
    url: `${baseUrl}${p}`,
    lastModified: new Date(),
    changeFrequency: "hourly" as const,
    priority: 1.0,
  }))

  return [...staticUrls, ...videoUrls, ...categoryUrls]
}
