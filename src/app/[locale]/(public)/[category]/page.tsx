import { InfiniteVideoGrid } from "@/components/features/video/infinite-video-grid";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

const CATEGORY_VIDEO_LIMIT = 24;

interface CategoryPageProps {
  params: Promise<{ category: string; locale: string }>;
}

export async function generateMetadata(
  props: CategoryPageProps,
): Promise<Metadata> {
  const { category, locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "CategoryPage" });
  const cat = await prisma.category.findUnique({ where: { slug: category } });
  if (!cat) return { title: t("notFound") };
  return {
    title: cat.name,
    description: t("description", { category: cat.name }),
  };
}

const CategoryPage = async (props: CategoryPageProps) => {
  const { category } = await props.params;
  const cat = await prisma.category.findUnique({ where: { slug: category } });
  if (!cat) return notFound();

  const where = {
    moderationStatus: "SAFE",
    CategoryOnVideo: { some: { categoryId: cat.id } },
  };

  const [videos, total] = await Promise.all([
    prisma.video.findMany({
      where,
      take: CATEGORY_VIDEO_LIMIT,
      orderBy: { createdAt: "desc" },
      include: {
        CategoryOnVideo: {
          include: { Category: { select: { name: true, slug: true } } },
        },
      },
    }),
    prisma.video.count({ where }),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">{cat.name}</h1>
      <p className="text-muted-foreground mb-6">{cat.description}</p>
      <InfiniteVideoGrid
        initialVideos={videos}
        initialHasMore={videos.length < total}
        batchSize={CATEGORY_VIDEO_LIMIT}
        category={cat.slug}
      />
    </div>
  );
};

export default CategoryPage;
