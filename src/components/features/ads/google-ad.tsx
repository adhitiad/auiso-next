"use client"

import { useEffect } from "react"

interface GoogleAdProps {
  slot: string
  className?: string
}

export function GoogleAd({ slot, className }: GoogleAdProps) {
  useEffect(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).adsbygoogle = (window as any).adsbygoogle || []
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).adsbygoogle.push({})
    } catch (e) {
      console.error("AdSense error", e)
    }
  }, [])

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-XXXXXXXXXXXXX"

  return (
    <div className={`my-4 flex justify-center ${className || ""}`}>
      <ins
        className="adsbygoogle block"
        style={{ display: "block", minWidth: "250px", minHeight: "250px" }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
