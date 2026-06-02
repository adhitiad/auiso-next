"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function AntiAdBlock() {
  const [adblockDetected, setAdblockDetected] = useState(false);

  useEffect(() => {
    // 1. Create a "bait" element with classes commonly blocked by AdBlockers
    const bait = document.createElement("div");
    bait.className =
      "ad-banner adsense sponsor pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links";

    // Visually hide it but keep it in the DOM tree
    bait.style.position = "absolute";
    bait.style.left = "-9999px";
    bait.style.top = "-9999px";
    bait.style.height = "10px";
    bait.style.width = "10px";
    bait.setAttribute("aria-hidden", "true");

    document.body.appendChild(bait);

    // 2. Wait a brief moment to let extensions modify the DOM
    const timer = setTimeout(() => {
      // Check if the element was hidden, resized, or removed
      const isBlocked =
        !document.body.contains(bait) ||
        bait.offsetHeight === 0 ||
        bait.offsetWidth === 0 ||
        window.getComputedStyle(bait).display === "none";

      if (isBlocked) {
        setAdblockDetected(true);
      }

      // Cleanup
      if (document.body.contains(bait)) {
        document.body.removeChild(bait);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Dialog open={adblockDetected} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-md bg-black/90 border-white/10 text-white [&>button]:hidden outline-none"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex justify-center mb-6 mt-4">
            <div className="p-4 bg-red-500/10 rounded-full">
              <ShieldAlert className="w-16 h-16 text-red-500" />
            </div>
          </div>
          <DialogTitle className="text-2xl text-center font-serif text-white tracking-wide">
            AdBlocker Terdeteksi!
          </DialogTitle>
          <DialogDescription className="text-center text-gray-400 text-base mt-4 leading-relaxed">
            Sepertinya Anda menggunakan AdBlocker. Kami mengandalkan iklan untuk
            menjaga server tetap menyala dan memberikan konten berkualitas
            tinggi kepada Anda.
            <br className="my-2" />
            Mohon nonaktifkan AdBlocker Anda untuk melanjutkan menonton, atau
            tingkatkan ke Premium untuk pengalaman bebas iklan.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-8 mb-2">
          <Button
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-6 text-lg transition-all shadow-lg shadow-purple-500/20"
            onClick={() => window.location.reload()}
          >
            Saya telah menonaktifkan AdBlocker
          </Button>
          <Button
            variant="outline"
            className="w-full border-white/10 text-gray-400 py-6 bg-transparent hover:bg-white/5 transition-colors"
          >
            <Link
              href="/advertise"
              className="w-full h-full flex items-center justify-center hover:text-white"
            >
              Pasang Iklan Bersama Kami
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
