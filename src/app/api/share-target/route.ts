import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import cuid from "cuid"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const url = formData.get("url") as string
    const title = formData.get("title") as string
    const text = formData.get("text") as string

    if (!url) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    try {
      const requestUrl = new URL(request.url)
      const sharedUrl = new URL(url)

      if (sharedUrl.hostname === requestUrl.hostname) {
        return NextResponse.redirect(new URL(sharedUrl.pathname + sharedUrl.search, request.url))
      }
    } catch (e) {
      // Ignore invalid URLs
    }

    // Save as SharedLink
    try {
      await prisma.sharedLink.create({
        data: {
          id: cuid(),
          url,
          title: title || "",
          text: text || "",
        }
      })
    } catch (e) {
      console.error("Failed to save shared link", e)
    }

    return NextResponse.redirect(new URL("/?shared=success", request.url))
  } catch (error) {
    return NextResponse.redirect(new URL("/?shared=error", request.url))
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.redirect(new URL("/", request.url))
}
