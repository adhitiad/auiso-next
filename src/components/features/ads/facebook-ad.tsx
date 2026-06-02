"use client"

import { useEffect } from "react"

interface FacebookAdProps {
  placementId: string
  className?: string
}

export function FacebookAd({ placementId, className }: FacebookAdProps) {
  useEffect(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).fbq = (window as any).fbq || function() {}
      // Initialize or push to fbq if needed
    } catch (e) {
      console.error("Facebook Ad error", e)
    }
  }, [])

  return (
    <div className={`my-4 flex justify-center ${className || ""}`}>
      <div
        className="fb-ad"
        data-placementid={placementId}
        data-format="native"
        data-nativeadid="ad_root"
      />
    </div>
  )
}
