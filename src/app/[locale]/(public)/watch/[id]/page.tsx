import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSafeImageUrl } from "@/lib/media";
import { Badge } from "@/components/ui/badge";
import { VideoPlayer } from "@/components/features/video/video-player";
import { SmartSynopsis } from "@/components/features/video/smart-synopsis";
import { LikeButton } from "@/components/features/video/like-button";
import { BookmarkButton } from "@/components/features/video/bookmark-button";
import { ReportButton } from "@/components/features/video/report-button";
import { SmartChapters } from "@/components/features/video/smart-chapters";
import { CommentSection } from "@/components/features/video/comment-section";
import { VideoCard } from "@/components/features/video/video-card";
import { CategoryBadge } from "@/components/ui/category-badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Calendar, Eye, Clock, AlertTriangle, Film } from "lucide-react";
import { getTranslations } from "next-intl/server";

interface WatchPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata(
  props: { params: Promise<{ id: string; locale: string }> }
): Promise<Metadata> {
  const { id, locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "WatchPage" });
  const video = await prisma.video.findUnique({ where: { id } });
  if (!video) return { title: t("videoNotFound") };
  const thumbnail = getSafeImageUrl(video.thumbnail);

  return {
    title: `${video.title} - Aiuiso`,
    description: video.synopsis?.slice(0, 160) ?? undefined,
    openGraph: {
      title: video.title,
      description: video.synopsis ?? undefined,
      images: thumbnail ? [{ url: thumbnail }] : undefined,
      type: "video.other",
    },
    twitter: {
      card: "summary_large_image",
      title: video.title,
      description: video.synopsis?.slice(0, 160) ?? undefined,
      images: thumbnail ? [thumbnail] : undefined,
    },
  };
}

const WatchPage = async ({ params }: WatchPageProps) => {
  const { id, locale } = await params;
  const session = await auth();
  const userId = session?.user?.id;
  const t = await getTranslations({ locale, namespace: "WatchPage" });

  // Ambil video & increment view
  const video = await (prisma as any).video
    .update({
      where: { id, moderationStatus: "SAFE" },
      data: { views: { increment: 1 } },
      include: {
        CategoryOnVideo: { include: { Category: true } },
        TagOnVideo: { include: { Tag: true } },
        comments: {
          orderBy: { createdAt: "desc" },
          take: 50,
          include: {
            user: {
              select: { id: true, username: true, name: true, email: true },
            },
          },
        },
        _count: { select: { Like: true, comments: true } },
      },
    })
    .catch(async () => {
      // Jika tidak ditemukan (misalnya status bukan SAFE), fetch tanpa increment
      return await (prisma as any).video.findUnique({
        where: { id, moderationStatus: "SAFE" },
        include: {
          CategoryOnVideo: { include: { Category: true } },
          TagOnVideo: { include: { Tag: true } },
          comments: {
            orderBy: { createdAt: "desc" },
            take: 50,
            include: {
              user: {
                select: { id: true, username: true, name: true, email: true },
              },
            },
          },
          _count: { select: { Like: true, comments: true } },
        },
      });
    });

  if (!video) return notFound();

  // Status like & bookmark user
  let isLiked = false;
  let isBookmarked = false;

  if (userId) {
    const [like, bookmark] = await Promise.all([
      prisma.like.findUnique({
        where: { userId_videoId: { userId, videoId: id } },
      }),
      prisma.bookmark.findUnique({
        where: { userId_videoId: { userId, videoId: id } },
      }),
    ]);
    isLiked = !!like;
    isBookmarked = !!bookmark;

    // Update riwayat tontonan
    await prisma.watchHistory.upsert({
      where: { userId_videoId: { userId, videoId: id } },
      update: { watchedAt: new Date() },
      create: { id: crypto.randomUUID(), userId, videoId: id },
    });
  }

  // Ambil semua tag & kategori untuk SmartSynopsis
  const [allTags, allCategories] = await Promise.all([
    prisma.tag.findMany({ select: { name: true }, take: 200 }),
    prisma.category.findMany({ select: { name: true }, take: 100 }),
  ]);

  // Video terkait
  const categoryIds =
    video.CategoryOnVideo?.map((c: any) => c.categoryId) ?? [];
  const relatedVideos = await prisma.video.findMany({
    where: {
      AND: [
        { id: { not: id } },
        { moderationStatus: "SAFE" },
        categoryIds.length > 0
          ? { CategoryOnVideo: { some: { categoryId: { in: categoryIds } } } }
          : {},
      ],
    },
    take: 12,
    orderBy: { views: "desc" },
    include: { CategoryOnVideo: { include: { Category: true } } },
  });

  const categories = video.CategoryOnVideo?.map((c: any) => c.Category) ?? [];
  const tags = video.TagOnVideo?.map((t: any) => t.Tag) ?? [];
  const thumbnail = getSafeImageUrl(video.thumbnail);

  const formatDuration = (minutes?: number | null) => {
    if (!minutes) return null;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}${t("hour")} ${m}${t("minute")}` : `${m}${t("minute")}`;
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.synopsis,
    thumbnailUrl: thumbnail ?? undefined,
    uploadDate: video.createdAt.toISOString(),
    datePublished: video.releaseDate?.toISOString(),
    isFamilyFriendly: false,
    genre: categories.map((c: any) => c.name),
    keywords: tags.map((t: any) => t.name).join(", "),
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: { "@type": "WatchAction" },
      userInteractionCount: video.views,
    },
  };

  return (
    <main className="min-h-screen bg-night-bg bg-[radial-gradient(circle_at_top,rgba(147,51,234,0.18),transparent_34rem)] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8 lg:py-8">
        {/* Anti-Piracy Warning */}
        <div className="mb-4 flex items-center justify-center rounded-lg border border-rose-400/30 bg-rose-950/35 px-4 py-2 text-center text-sm font-medium text-rose-100 shadow-lg shadow-rose-950/10">
          <AlertTriangle className="w-5 h-5 mr-2 shrink-0" />
          <span>
            {t("antiPiracy")}
          </span>
        </div>

        {/* Video Player */}
        <div
          id="player-container"
          className="relative mb-8 aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl shadow-black/40"
        >
          {video.peerTubeId ||
          video.externalSourceUrl ||
          (video.videoPlatform && video.videoId) ? (
            <VideoPlayer
              videoId={video.id}
              peerTubeId={video.peerTubeId}
              externalSourceUrl={video.externalSourceUrl}
              videoPlatform={video.videoPlatform}
              sourceVideoId={video.videoId}
              initialLiveStatus={video.isLive ?? false}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-night-card text-white/40">
              <Film className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-xl font-medium">{t("videoUnavailable")}</p>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mb-8 flex flex-col gap-8 rounded-xl border border-night-border bg-night-card/95 p-5 shadow-xl shadow-black/20 md:p-6 lg:flex-row lg:p-8">
          {/* Thumbnail */}
          {thumbnail && (
            <div className="w-full lg:w-1/3 flex-shrink-0">
              <div className="relative aspect-square sm:aspect-auto lg:aspect-[3/4] rounded-xl overflow-hidden border border-white/10">
                <Image
                  src={thumbnail}
                  alt={video.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  loading="eager"
                  priority
                />
              </div>
            </div>
          )}

          {/* Details */}
          <div className="flex w-full flex-col lg:w-2/3">
            {/* Categories & Actions */}
            <div className="flex flex-wrap gap-2 mb-4 justify-between items-start">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat: any) => (
                  <Link key={cat.id} href={`/${cat.name.toLowerCase()}`}>
                    <CategoryBadge category={cat} />
                  </Link>
                ))}
              </div>

              {userId && (
                <div className="flex gap-2">
                  <LikeButton
                    videoId={video.id}
                    initialLiked={isLiked}
                    likeCount={video._count.Like}
                  />
                  <BookmarkButton
                    videoId={video.id}
                    initialBookmarked={isBookmarked}
                  />
                  <ReportButton targetId={video.id} type="video" />
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="mb-4 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
              {video.title}
            </h1>

            {/* Meta */}
            <div className="mb-6 flex flex-wrap items-center gap-5 text-sm text-white/55 md:text-base">
              {video.releaseDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  <span>{new Date(video.releaseDate).getFullYear()}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-cyan-400" />
                <span>{video.views.toLocaleString("id-ID")} {t("views")}</span>
              </div>
              {video.duration && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  <span>{formatDuration(video.duration)}</span>
                </div>
              )}
            </div>

            {/* AI Summary */}
            {video.summary && (
              <div className="mb-6 p-4 bg-night-bg rounded-lg border border-white/10">
                <h4 className="text-sm font-bold text-purple-400 mb-2">
                  AI Summary
                </h4>
                <p className="text-white/70 text-sm italic">{video.summary}</p>
              </div>
            )}

            {/* Smart Chapters */}
            <SmartChapters duration={video.duration} videoTitle={video.title} />

            {/* Synopsis */}
            <div className="mb-6 flex-grow select-none">
              <h3 className="text-xl font-bold mb-3">{t("synopsis")}</h3>
              <p className="text-white/60 leading-relaxed whitespace-pre-wrap text-base md:text-lg">
                <SmartSynopsis
                  synopsis={video.synopsis ?? ""}
                  tags={allTags.map((t) => t.name)}
                  categories={allCategories.map((c) => c.name)}
                />
              </p>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="mt-auto pt-6 border-t border-white/10">
                <h3 className="text-lg font-bold mb-3">{t("tags")}</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag: any) => (
                    <Link
                      key={tag.id}
                      href={`/?tag=${encodeURIComponent(tag.name.toLowerCase())}`}
                    >
                      <Badge
                        variant="outline"
                        className="border-white/20 text-white/60 hover:bg-white/10 hover:text-white cursor-pointer transition-colors"
                      >
                        {tag.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Comment Section */}
        <div className="max-w-4xl mx-auto mb-8">
          <CommentSection
            videoId={video.id}
            initialComments={video.comments as any}
            isLoggedIn={!!userId}
          />
        </div>

        {/* Related Videos */}
        {relatedVideos.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-serif font-bold mb-6 pl-4 border-l-4 border-purple-500">
              {t("relatedVideos")}
            </h2>
            <Carousel opts={{ align: "start", loop: false }} className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {relatedVideos.map((item) => (
                  <CarouselItem
                    key={item.id}
                    className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                  >
                    <VideoCard video={item as any} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0 xl:-left-12 bg-night-card border-white/10 text-white hover:bg-white/10" />
              <CarouselNext className="right-0 xl:-right-12 bg-night-card border-white/10 text-white hover:bg-white/10" />
            </Carousel>
          </div>
        )}
      </div>
    </main>
  );
}


export default WatchPage;
