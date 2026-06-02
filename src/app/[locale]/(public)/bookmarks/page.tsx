import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { VideoCard } from "@/components/features/video/video-card";
import { Bookmark } from "lucide-react";

export const metadata: Metadata = {
  title: "Video Tersimpan - Aiuiso",
  description: "Koleksi video yang Anda simpan di Aiuiso.",
};

const bookmarksInclude = {
  video: {
    include: { CategoryOnVideo: { include: { Category: true } } },
  },
} satisfies Prisma.BookmarkInclude;

type BookmarkWithVideo = Prisma.BookmarkGetPayload<{
  include: typeof bookmarksInclude;
}>;

const BookmarksPage = async () => {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const bookmarks: BookmarkWithVideo[] = await prisma.bookmark.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: bookmarksInclude,
  });

  return (
    <main className="container mx-auto px-4 py-8 min-h-[80vh]">
      <div className="mb-8 border-b border-white/10 pb-6">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2 flex items-center gap-3">
          <Bookmark className="w-10 h-10 text-purple-400" />
          Video <span className="text-purple-400">Tersimpan</span>
        </h1>
        <p className="text-white/50">Koleksi video pilihan Anda.</p>
      </div>

      {bookmarks.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {bookmarks.map((b) => (
            <VideoCard key={b.id} video={b.video} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-night-card rounded-xl border border-white/10">
          <Bookmark className="w-16 h-16 mx-auto text-white/20 mb-4" />
          <h3 className="text-xl text-white/50 mb-2">
            Belum ada video tersimpan
          </h3>
          <p className="text-white/30">
            Klik ikon simpan di halaman video untuk menyimpannya di sini.
          </p>
        </div>
      )}
    </main>
  );
};

export default BookmarksPage;
