"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function AgeVerification({ onConfirm }: { onConfirm?: () => void }) {
  const [verified, setVerified] = useState(true); // assume verified initially to avoid hydration mismatch
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const isVerified = localStorage.getItem("age-verified") === "true";
    setVerified(isVerified);
  }, []);

  if (!isMounted || verified) return null;

  const handleConfirm = () => {
    localStorage.setItem("age-verified", "true");
    setVerified(true);
    if (onConfirm) onConfirm();
  };

  return (
    <Dialog open={!verified} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md pointer-events-auto">
        <DialogHeader>
          <DialogTitle>Verifikasi Usia</DialogTitle>
          <DialogDescription>
            Video ini mengandung konten dewasa. Anda harus berusia 18+ untuk
            menonton.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 mt-4">
          <Button onClick={handleConfirm} className="flex-1">
            Saya Berusia 18+
          </Button>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="flex-1"
          >
            Kembali
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
