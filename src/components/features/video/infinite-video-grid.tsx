"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { VideoGrid, type VideoGridItem } from "./video-grid";
import Spinners from "@/components/Spinners";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface InfiniteVideoGridProps {
  initialVideos: VideoGridItem[];
  initialHasMore: boolean;
  batchSize?: number;
  category?: string;
  search?: string;
  sort?: "newest" | "popular" | "trending";
}

export const InfiniteVideoGrid = ({
  initialVideos,
  initialHasMore,
  batchSize = 24,
  category,
  search,
  sort = "newest",
}: InfiniteVideoGridProps) => {
  const [videos, setVideos] = useState(initialVideos);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const t = useTranslations("VideoGrid");

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError(null);

    const params = new URLSearchParams({
      limit: String(batchSize),
      offset: String(videos.length),
      sort,
    });

    if (category) params.set("category", category);
    if (search) params.set("search", search);

    try {
      const response = await fetch(`/api/videos?${params.toString()}`);
      if (!response.ok) throw new Error(t("errorLoad"));

      const data = (await response.json()) as {
        videos: VideoGridItem[];
        hasMore: boolean;
      };

      setVideos((current) => {
        const existingIds = new Set(current.map((video) => video.id));
        const nextVideos = data.videos.filter(
          (video) => !existingIds.has(video.id),
        );
        return [...current, ...nextVideos];
      });
      setHasMore(data.hasMore);
    } catch {
      setError(t("errorNext"));
    } finally {
      setIsLoading(false);
    }
  }, [batchSize, category, hasMore, isLoading, search, sort, videos.length]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void loadMore();
        }
      },
      { rootMargin: "600px 0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return (
    <>
      <VideoGrid videos={videos} />

      <div
        ref={sentinelRef}
        className="flex min-h-24 items-center justify-center py-8"
      >
        {isLoading && (
          <div className="flex flex-col items-center gap-2 text-sm">
            <Spinners />
            <span>{t("loading")}</span>
          </div>
        )}
        {error && (
          <Button
            type="button"
            onClick={() => void loadMore()}
            className="rounded-lg border border-night-border bg-night-card px-4 py-2 text-sm text-white/70 hover:bg-night-hover"
          >
            {error} {t("tryAgain")}
          </Button>
        )}
        {!hasMore && videos.length > 0 && (
          <p className="text-sm text-white/35">
            {t("endOfList")}
          </p>
        )}
      </div>
    </>
  );
}
