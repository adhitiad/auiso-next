"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bell, BellOff, Loader2 } from "lucide-react"

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function PushNotificationToggle() {
  const [isSupported, setIsSupported] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true)
      checkSubscription()
    } else {
      setIsLoading(false)
    }
  }, [])

  async function checkSubscription() {
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      setIsSubscribed(!!subscription)
    } catch (e) {
      console.error("Error checking subscription:", e)
    } finally {
      setIsLoading(false)
    }
  }

  async function subscribe() {
    setIsLoading(true)
    try {
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      if (!vapidPublicKey) {
        throw new Error("VAPID public key not found in env")
      }

      const registration = await navigator.serviceWorker.ready
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      })

      // Send to server
      await fetch("/api/push-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: JSON.stringify(subscription) })
      })
      
      setIsSubscribed(true)
    } catch (error) {
      console.error("Failed to subscribe to push notifications:", error)
      alert("Gagal mengaktifkan notifikasi. Pastikan Anda telah memberikan izin pada browser.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isSupported) return null

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2 border-white/10 bg-black/50 hover:bg-white/5 text-gray-300"
      disabled={isLoading || isSubscribed}
      onClick={subscribe}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isSubscribed ? (
        <>
          <Bell className="w-4 h-4 text-green-500" />
          Telah Berlangganan
        </>
      ) : (
        <>
          <BellOff className="w-4 h-4 text-gray-500" />
          Aktifkan Notifikasi
        </>
      )}
    </Button>
  )
}
