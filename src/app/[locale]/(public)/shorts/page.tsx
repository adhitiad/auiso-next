import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ShortPlayer } from "@/components/features/video/short-player";

export const metadata: Metadata = {
  title: "Shorts - Aiuiso",
  description: "Jelajahi video pendek yang menghibur",
};

interface ShortsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ShortsPage({ params }: ShortsPageProps) {
  const { locale } = await params;

  // Ambil video dari database.
  // Idealnya ambil video dengan kategori "shorts" atau durasi pendek.
  // Untuk demo, kita ambil video terbaru yang durasinya ada.
  const videos = await prisma.video.findMany({
    where: { moderationStatus: "SAFE" },
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { Like: true, comments: true } },
    },
  });

  if (videos.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <h1 className="text-2xl font-bold">Belum ada video pendek tersedia.</h1>
      </div>
    );
  }

  return (
    <main className="h-[calc(100vh-4rem)] w-full bg-black overflow-y-auto snap-y snap-mandatory hide-scrollbar">
      {videos.map((video) => (
        <section
          key={video.id}
          className="h-full w-full snap-start flex items-center justify-center relative bg-black"
        >
          <div className="w-full max-w-[400px] h-full relative md:h-[80%] md:rounded-2xl overflow-hidden shadow-2xl">
            <ShortPlayer
              videoId={video.id}
              title={video.title}
              thumbnail={video.thumbnail}
              likeCount={video._count.Like}
              commentCount={video._count.comments}
              locale={locale}
              peerTubeId={video.peerTubeId}
              externalSourceUrl={video.externalSourceUrl}
            />
          </div>
        </section>
      ))}
    </main>
  );
}
