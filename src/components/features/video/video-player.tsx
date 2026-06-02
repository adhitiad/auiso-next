"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useTranslations } from "next-intl";

interface VideoPlayerProps {
  videoId: string;
  peerTubeId?: string | null;
  externalSourceUrl?: string | null;
  videoPlatform?: string | null;
  sourceVideoId?: string | null;
  initialLiveStatus?: boolean;
}

const getEmbedUrl = (
  platform?: string | null,
  sourceVideoId?: string | null,
) => {
  if (!platform || !sourceVideoId) return null;

  const normalizedPlatform = platform.toLowerCase();
  const encodedId = encodeURIComponent(sourceVideoId);

  if (normalizedPlatform === "player4me") {
    return `https://404.4meplayer.com/#${encodedId}`;
  }
  if (normalizedPlatform === "seekplay") {
    return `https://k1.seekplays.com/#${encodedId}`;
  }

  return null;
};

export const VideoPlayer = ({
  videoId,
  peerTubeId,
  externalSourceUrl,
  videoPlatform,
  sourceVideoId,
  initialLiveStatus = false,
}: VideoPlayerProps) => {
  const [isLive, setIsLive] = useState(initialLiveStatus);
  const embedUrl = getEmbedUrl(videoPlatform, sourceVideoId);
  const t = useTranslations("VideoPlayer");

  console.log(embedUrl);

  useEffect(() => {
    const client = supabase;
    if (!client) return;

    const channel = client
      .channel(`stream:${videoId}`)
      .on("broadcast", { event: "STREAM_STATUS" }, (payload) => {
        if (payload.payload?.videoId === videoId) {
          setIsLive(payload.payload.isLive);
        }
      })
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [videoId]);

  if (!peerTubeId && !externalSourceUrl && !embedUrl) {
    return (
      <div className="w-full h-full bg-black flex flex-col items-center justify-center text-white/50">
        <p className="mb-2">{t("sourceUnavailable")}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black">
      {isLive && (
        <div className="absolute top-4 right-4 z-10 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded shadow-lg animate-pulse">
          LIVE
        </div>
      )}
      {peerTubeId ? (
        <iframe
          title="PeerTube Video Player"
          src={`${process.env.NEXT_PUBLIC_PEERTUBE_URL || "https://peertube2.cpy.re"}/videos/embed/${peerTubeId}?api=1`}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          className="w-full h-full object-cover"
        />
      ) : embedUrl ? (
        <iframe
          title={`${videoPlatform} Video Player`}
          src={embedUrl}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-night-card">
          <p className="text-white/50 mb-4">{t("externalHosted")}</p>
          <a
            href={externalSourceUrl as string}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-bold transition-colors"
          >
            {t("watchExternal")}
          </a>
        </div>
      )}
    </div>
  );
}
