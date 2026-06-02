"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogIn } from "lucide-react"

export const GoogleLoginButton = () => {
  return (
    <Button
      onClick={() => signIn("google", { callbackUrl: "/" })}
      className="w-full bg-white text-black hover:bg-gray-200 transition-colors py-6 text-lg font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)]"
      variant="outline"
    >
      <LogIn className="mr-3 h-6 w-6" />
      Lanjutkan dengan Google
    </Button>
  )
}

