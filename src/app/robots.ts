import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/watch/", "/categories/", "/search"],
      disallow: ["/admin/", "/api/", "/_next/"],
    },
    sitemap: "https://aiuiso.site/sitemap.xml",
  }
}
