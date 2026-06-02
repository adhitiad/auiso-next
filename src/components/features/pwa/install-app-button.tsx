"use client";

import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InstallAppButton() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if prompt is already saved globally
    if (typeof window !== "undefined" && (window as any).deferredPrompt) {
      setDeferredPrompt((window as any).deferredPrompt);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (typeof window !== "undefined") {
        (window as any).deferredPrompt = e;
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
      if (typeof window !== "undefined") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).deferredPrompt = null;
      }
    }
  };

  if (!deferredPrompt) return null;

  return (
    <Button
      variant="outline"
      size="sm"
      className="hidden sm:flex items-center gap-2 border-purple-500 text-purple-400 hover:bg-purple-600 hover:text-white transition-colors"
      onClick={handleInstallClick}
      title="Instal Aplikasi"
    >
      <Download className="h-4 w-4" />
      <span className="font-bold">Instal</span>
    </Button>
  );
}
