import { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { VideoCard } from "@/components/features/video/video-card"
import { Clock, Trash2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Riwayat Tontonan - Aiuiso",
  description: "Video yang pernah Anda tonton di Aiuiso.",
}

const HistoryPage = async () => {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const history = await prisma.watchHistory.findMany({
    where: { userId: session.user.id },
    orderBy: { watchedAt: "desc" },
    take: 100,
    include: {
      video: {
        include: { CategoryOnVideo: { include: { Category: true } } },
      },
    },
  })

  return (
    <main className="container mx-auto px-4 py-8 min-h-[80vh]">
      <div className="mb-8 border-b border-white/10 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2 flex items-center gap-3">
            <Clock className="w-10 h-10 text-cyan-400" />
            Riwayat <span className="text-cyan-400">Tontonan</span>
          </h1>
          <p className="text-white/50">Video yang pernah Anda tonton.</p>
        </div>
      </div>

      {history.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {history.map((h) => (
            <VideoCard key={h.id} video={h.video as any} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-night-card rounded-xl border border-white/10">
          <Clock className="w-16 h-16 mx-auto text-white/20 mb-4" />
          <h3 className="text-xl text-white/50 mb-2">Riwayat kosong</h3>
          <p className="text-white/30">Mulai tonton video dan riwayat Anda akan muncul di sini.</p>
        </div>
      )}
    </main>
  )
}


export default HistoryPage;
