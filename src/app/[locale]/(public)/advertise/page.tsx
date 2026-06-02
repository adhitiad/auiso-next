"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useTranslations } from "next-intl"

const MOCK_SLOTS = [
  { id: "slot1", name: "Homepage Top Banner", price: 50 },
  { id: "slot2", name: "Sidebar Banner", price: 30 },
  { id: "slot3", name: "Video Player Overlay", price: 80 },
]

const AdvertisePage = () => {
  const router = useRouter()
  const t = useTranslations("Legal")
  const tA = useTranslations("Advertise")
  const [slotId, setSlotId] = useState<string>("")
  const [duration, setDuration] = useState<number>(7)
  const [paymentMethod, setPaymentMethod] = useState<string>("SOL")
  const [showQR, setShowQR] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedSlot = MOCK_SLOTS.find((s) => s.id === slotId)
  const totalPrice = selectedSlot ? selectedSlot.price * duration : 0

  const handlePay = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!slotId || duration <= 0) return
    setShowQR(true)
  }

  const handleVerify = async () => {
    setIsSubmitting(true)
    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 1500))
    router.push("/?ad_purchased=true")
  }

  const getWalletAddress = () => {
    switch (paymentMethod) {
      case "SOL": return "SolanaAdsWalletAddress123456789"
      case "BNB": return "0xBNBAdsWalletAddress987654321"
      case "USDT": return "0xUSDTAdsWalletAddress456789123"
      default: return ""
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4 py-12">
      <Card className="w-full max-w-2xl bg-night-card border border-white/10 text-white">
        <CardHeader>
          <CardTitle className="text-3xl font-serif text-purple-400 text-center">
            {t("advertiseTitle")}
          </CardTitle>
          <CardDescription className="text-white/50 text-center text-lg mt-2">
            {tA("desc")}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {!showQR ? (
            <form onSubmit={handlePay} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{tA("advName")}</Label>
                  <Input name="advertiserName" placeholder={tA("advNamePlaceholder")} required className="bg-night-bg border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label>{tA("bannerUrl")}</Label>
                  <Input name="bannerUrl" type="url" placeholder="https://example.com/banner.jpg" required className="bg-night-bg border-white/10" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{tA("targetUrl")}</Label>
                <Input name="targetUrl" type="url" placeholder="https://example.com" required className="bg-night-bg border-white/10" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{tA("adPosition")}</Label>
                  <Select value={slotId} onValueChange={(val) => setSlotId(val ?? "")} required>
                    <SelectTrigger className="bg-night-bg border-white/10">
                      <SelectValue placeholder={tA("adPositionPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent className="bg-night-card border-white/10 text-white">
                      {MOCK_SLOTS.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name} (${s.price}/hari)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{tA("duration")}</Label>
                  <Input 
                    type="number" min="1" max="365" 
                    value={duration} 
                    onChange={(e) => setDuration(parseInt(e.target.value) || 0)} 
                    required 
                    className="bg-night-bg border-white/10"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <h3 className="font-medium text-lg mb-4 text-cyan-400">{tA("totalPrice")}: ${totalPrice.toFixed(2)}</h3>
                
                <Label className="mb-2 block">{tA("paymentMethod")}</Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-3 gap-4 mb-6">
                  {["SOL", "BNB", "USDT"].map((method) => (
                    <div key={method} className="flex items-center space-x-2 border border-white/10 p-3 rounded-lg hover:bg-white/5 cursor-pointer">
                      <RadioGroupItem value={method} id={`pay-${method}`} className="border-white/20 text-purple-500" />
                      <Label htmlFor={`pay-${method}`} className="cursor-pointer">{method}</Label>
                    </div>
                  ))}
                </RadioGroup>

                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-all shadow-lg shadow-purple-500/30"
                  disabled={!slotId || duration <= 0}
                >
                  {tA("proceedPayment")}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6 text-center py-8">
              <h3 className="font-medium text-xl">{tA("sendVia")} ${totalPrice.toFixed(2)} via {paymentMethod}</h3>
              
              <div className="bg-white p-4 w-56 h-56 mx-auto rounded-xl flex items-center justify-center">
                <div className="text-black font-bold text-2xl border-4 border-dashed border-black/20 p-8 rounded-lg">QR CODE</div>
              </div>
              
              <div className="bg-night-bg p-4 rounded-lg flex items-center justify-between border border-white/10 mx-auto max-w-sm">
                <span className="text-sm font-mono text-white/50 truncate max-w-[250px]">
                  {getWalletAddress()}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(getWalletAddress())}
                  className="bg-night-card border-white/20 hover:bg-white/10 hover:text-white"
                >
                  Copy
                </Button>
              </div>

              <p className="text-sm text-white/40 max-w-sm mx-auto">
                {tA("verifyMessage")}
              </p>

              <div className="w-full max-w-sm mx-auto space-y-3 pt-4">
                <Button
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                  onClick={handleVerify}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? tA("verifying") : tA("verifyButton")}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-white/50 hover:text-white"
                  onClick={() => setShowQR(false)}
                  disabled={isSubmitting}
                >
                  {tA("cancel")}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


export default AdvertisePage;
