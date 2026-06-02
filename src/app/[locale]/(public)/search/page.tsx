import { VideoGrid } from "@/components/features/video/video-grid";
import { prisma } from "@/lib/prisma";
import { searchQuerySchema } from "@/types/api";
import { getTranslations } from "next-intl/server";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; type?: string }>;
  params: Promise<{ locale: string }>;
}

const SearchPage = async (props: SearchPageProps) => {
  const { searchParams, params } = props;
  const { q, type } = await searchParams;
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "SearchPage" });
  const parsed = searchQuerySchema.safeParse({ q, type });

  if (!parsed.success) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>
        <p className="text-muted-foreground">{t("invalidKeyword")}</p>
      </div>
    );
  }

  const videos = await prisma.video.findMany({
    where: {
      moderationStatus: "SAFE",
      OR: [
        { title: { contains: parsed.data.q } },
        { synopsis: { contains: parsed.data.q } },
      ],
    },
    take: parsed.data.limit,
    include: {
      CategoryOnVideo: {
        include: { Category: { select: { name: true, slug: true } } },
      },
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {t("resultsFor", { query: parsed.data.q })}
      </h1>
      <VideoGrid videos={videos} emptyMessage={t("emptySearch")} />
    </div>
  );
};

export default SearchPage;
