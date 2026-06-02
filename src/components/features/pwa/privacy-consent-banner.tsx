"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export function PrivacyConsentBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("aiuiso_privacy_consent")
    if (!consent) {
      setShow(true)
    }
  }, [])

  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black/95 border-t border-white/10 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-sm text-gray-300 max-w-3xl">
        <strong className="text-purple-400">Pemberitahuan Privasi:</strong> Kami menggunakan teknologi 
        pelacakan anonim (*fingerprinting*) untuk memberikan rekomendasi video yang dipersonalisasi. 
        Tidak ada informasi identitas pribadi (PII) yang disimpan. Dengan terus menggunakan Aiuiso, 
        Anda menyetujui pelacakan anonim ini.
      </div>
      <Button
        onClick={() => {
          localStorage.setItem("aiuiso_privacy_consent", "true")
          setShow(false)
        }}
        className="bg-purple-600 hover:bg-purple-500 text-white whitespace-nowrap"
      >
        Saya Mengerti
      </Button>
    </div>
  )
}
