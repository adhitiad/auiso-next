"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PictureInPicture2 } from "lucide-react"

export function PiPButton({ targetId }: { targetId: string }) {
  const [isSupported, setIsSupported] = useState(false)
  const [inPip, setInPip] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pipWindowRef = useRef<any>(null)

  useEffect(() => {
    if ("documentPictureInPicture" in window) {
      setIsSupported(true)
    }
  }, [])

  const togglePip = async () => {
    const target = document.getElementById(targetId)
    if (!target) return

    if (inPip && pipWindowRef.current) {
      pipWindowRef.current.close()
      return
    }

    try {
      // @ts-expect-error - documentPictureInPicture is an experimental API
      const pipWindow = await window.documentPictureInPicture.requestWindow({
        width: 400,
        height: 300,
      })

      pipWindowRef.current = pipWindow
      setInPip(true)

      // Store original parent
      const originalParent = target.parentNode
      const originalSibling = target.nextSibling

      // Ensure target takes full space in PiP
      target.style.width = "100%"
      target.style.height = "100%"
      target.style.margin = "0"

      pipWindow.document.body.style.margin = "0"
      pipWindow.document.body.style.padding = "0"
      pipWindow.document.body.style.backgroundColor = "#000"

      pipWindow.document.body.appendChild(target)

      pipWindow.addEventListener("pagehide", () => {
        // Restore styling and position
        target.style.width = "100%"
        target.style.height = "100%"
        
        if (originalSibling) {
          originalParent?.insertBefore(target, originalSibling)
        } else {
          originalParent?.appendChild(target)
        }
        setInPip(false)
        pipWindowRef.current = null
      })
    } catch (error) {
      console.error("Failed to open PiP", error)
      alert("Browser Anda tidak mendukung fitur PiP dinamis ini atau Anda harus mengkliknya secara langsung (User Gesture).")
    }
  }

  if (!isSupported) return null

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={togglePip} 
      className="text-gray-400 hover:text-white" 
      title={inPip ? "Tutup Picture-in-Picture" : "Picture-in-Picture"}
    >
      <PictureInPicture2 className="w-5 h-5" />
    </Button>
  )
}
