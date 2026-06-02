import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const url = req.nextUrl
  const position = url.searchParams.get("position")

  if (!position) {
    return new NextResponse("Posisi iklan tidak disertakan", { status: 400 })
  }

  const now = new Date()

  // Cari semua slot aktif untuk posisi ini
  const slots = await prisma.adSlot.findMany({
    where: { position, active: true },
    include: {
      AdPurchase: {
        where: {
          status: "APPROVED",
          active: true,
          startDate: { lte: now },
          endDate: { gte: now }
        }
      }
    }
  })

  if (slots.length === 0) return NextResponse.json(null)

  // Gabungkan semua pembelian valid dari slot yang cocok
  const allPurchases = slots.flatMap(s => s.AdPurchase)

  if (allPurchases.length === 0) return NextResponse.json(null)

  // Pilih satu secara acak
  const randomAd = allPurchases[Math.floor(Math.random() * allPurchases.length)]

  return NextResponse.json(randomAd)
}
