"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface AdPurchase {
  id: string
  targetUrl: string
  bannerUrl: string
  advertiserName: string
}

interface AdDisplayProps {
  position: string
  className?: string
}

export function AdDisplay({ position, className }: AdDisplayProps) {
  const [ad, setAd] = useState<AdPurchase | null>(null)
  const [hasTrackedImpression, setHasTrackedImpression] = useState(false)

  useEffect(() => {
    async function loadAd() {
      try {
        const res = await fetch(`/api/ads/serve?position=${position}`)
        if (res.ok) {
          const data = await res.json()
          if (data && data.id) {
            setAd(data)
          }
        }
      } catch (error) {
        console.error("Failed to load ad", error)
      }
    }
    loadAd()
  }, [position])

  useEffect(() => {
    if (ad?.id && !hasTrackedImpression) {
      // Record an impression
      fetch("/api/ads/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purchaseId: ad.id, type: "impression" })
      }).catch(console.error)
      setHasTrackedImpression(true)
    }
  }, [ad?.id, hasTrackedImpression])

  if (!ad) {
    return null
  }

  const handleClick = () => {
    fetch("/api/ads/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ purchaseId: ad.id, type: "click" })
    }).catch(console.error)
  }

  return (
    <div className={`my-4 flex justify-center ${className || ""}`}>
      <a 
        href={ad.targetUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        onClick={handleClick}
        className="block relative rounded-lg overflow-hidden border border-white/10 hover:opacity-90 transition-opacity max-w-full"
      >
        <Image 
          src={ad.bannerUrl} 
          alt={`Ad - ${ad.advertiserName}`}
          width={728}
          height={90}
          className="w-full h-auto object-cover max-h-64"
        />
        <div className="text-[10px] text-right p-1 bg-black/50 text-white/70 absolute top-0 right-0 rounded-bl-md">
          Ad
        </div>
      </a>
    </div>
  )
}
