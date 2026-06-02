import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1"

  const clientIp = ip.split(",")[0].trim()

  let partialIp = clientIp
  if (clientIp.includes(".")) {
    // IPv4
    const parts = clientIp.split(".")
    if (parts.length === 4) {
      partialIp = `${parts[0]}.${parts[1]}.x.x`
    }
  } else if (clientIp.includes(":")) {
    // IPv6
    const parts = clientIp.split(":")
    if (parts.length >= 4) {
      partialIp = `${parts[0]}:${parts[1]}:${parts[2]}:${parts[3]}:x:x:x:x`
    }
  }

  return NextResponse.json({ partialIp }, {
    headers: {
      "Cache-Control": "no-store",
    }
  })
}
