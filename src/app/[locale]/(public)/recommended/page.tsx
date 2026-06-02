"use client"

import { useEffect, useState } from "react"
import { Sparkles, Search } from "lucide-react"
import { VideoCard } from "@/components/features/video/video-card"
import type { VideoGridItem } from "@/components/features/video/video-grid"

const RecommendedPage = () => {
  const [recommendedVideos, setRecommendedVideos] = useState<VideoGridItem[]>([])
  const [searchBasedVideos, setSearchBasedVideos] = useState<VideoGridItem[]>([])
  const [searchedKeywords, setSearchedKeywords] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchRecommendations = async () => {
      // Fingerprint implementation specific to aiuiso
      const getFp = (window as any).getFingerprint
      if (typeof window === "undefined" || !getFp) {
        setLoading(false)
        return
      }

      try {
        const fp = await getFp()
        const res = await fetch(`/api/recommendations?fp=${encodeURIComponent(fp)}`)
        if (!res.ok) throw new Error("Failed to fetch")

        const data = await res.json()
        if (isMounted) {
          setRecommendedVideos(data.videos || [])
          setSearchBasedVideos(data.searchBasedVideos || [])
          setSearchedKeywords(data.searchedKeywords || "")
        }
      } catch (err) {
        console.error("Error fetching recommendations:", err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchRecommendations()

    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-[80vh]">
        <h1 className="text-3xl font-serif font-bold text-white mb-8 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-purple-400" />
          Untuk Anda
        </h1>
        <div className="flex items-center justify-center h-64 bg-night-card rounded-xl border border-white/10 animate-pulse">
          <span className="text-white/50">Menyiapkan rekomendasi personal...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-[80vh]">
      <h1 className="text-3xl font-serif font-bold text-white mb-8 flex items-center gap-3">
        <Sparkles className="w-8 h-8 text-purple-400" />
        Untuk Anda
      </h1>

      {searchBasedVideos.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
            <Search className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-serif font-bold text-white">
              Karena Anda mencari <span className="text-cyan-400">"{searchedKeywords}"</span>...
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {searchBasedVideos.map((video) => (
              <VideoCard key={video.id} video={video as any} />
            ))}
          </div>
        </section>
      )}

      <section className="mb-12">
        <h2 className="text-xl font-serif font-bold text-white mb-6 border-b border-white/10 pb-4">
          Berdasarkan Riwayat Anda
        </h2>
        {recommendedVideos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {recommendedVideos.map((video) => (
              <VideoCard key={video.id} video={video as any} />
            ))}
          </div>
        ) : (
          <div className="bg-night-card border border-white/10 rounded-xl p-8 text-center text-white/50">
            <Sparkles className="w-12 h-12 mx-auto text-white/20 mb-4" />
            <p>Data belum cukup untuk membuat rekomendasi akurat.</p>
            <p className="mt-2 text-sm text-white/30">Mulai tonton beberapa video agar kami bisa merekomendasikan yang terbaik untuk Anda.</p>
          </div>
        )}
      </section>
    </div>
  )
}


export default RecommendedPage;
