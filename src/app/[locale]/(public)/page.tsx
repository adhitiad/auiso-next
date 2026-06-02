import { InfiniteVideoGrid } from "@/components/features/video/infinite-video-grid"
import { ShortsCarousel } from "@/components/features/video/shorts-carousel"
import { getRecommendedShorts } from "@/lib/recommender"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { unstable_cache } from "next/cache"
import { getTranslations } from "next-intl/server"

const HOME_VIDEO_LIMIT = 24

const getHomeVideos = unstable_cache(
  async () => {
    const where = { moderationStatus: "SAFE" }
    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where,
        take: HOME_VIDEO_LIMIT,
        orderBy: { createdAt: "desc" },
        include: {
          CategoryOnVideo: { include: { Category: { select: { name: true, slug: true } } } },
          _count: { select: { comments: true } },
        },
      }),
      prisma.video.count({ where }),
    ])

    return {
      videos,
      hasMore: videos.length < total,
    }
  },
  ["home-videos"],
  { revalidate: 60 }
)

const HomePage = async (props: { params: Promise<{ locale: string }> }) => {
  const { locale } = await props.params;
  const session = await auth()
  const userId = session?.user?.id
  const t = await getTranslations({ locale, namespace: "Home" })
  
  const [{ videos, hasMore }, shorts] = await Promise.all([
    getHomeVideos(),
    getRecommendedShorts(userId)
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      {shorts.length > 0 && <ShortsCarousel shorts={shorts} />}
      
      <h1 className="text-2xl font-bold mb-6 mt-4">{t("latestVideos")}</h1>
      <InfiniteVideoGrid initialVideos={videos} initialHasMore={hasMore} batchSize={HOME_VIDEO_LIMIT} />
    </div>
  )
}


export default HomePage;
