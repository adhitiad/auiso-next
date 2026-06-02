import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { purchaseId, type } = data // type: "impression" atau "click"

    if (!purchaseId || !type) {
      return new NextResponse("Bad Request", { status: 400 })
    }

    if (type === "impression") {
      await prisma.adPurchase.update({
        where: { id: purchaseId },
        data: { impressions: { increment: 1 } }
      })
    } else if (type === "click") {
      await prisma.adPurchase.update({
        where: { id: purchaseId },
        data: { clicks: { increment: 1 } }
      })
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("Gagal melacak iklan:", e)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
