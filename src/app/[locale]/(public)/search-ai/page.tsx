"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Sparkles, Search, Loader2, Bot } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { VideoCard } from "@/components/features/video/video-card"
import type { VideoGridItem } from "@/components/features/video/video-grid"

const SearchAIContent = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get("q") || ""

  const [query, setQuery] = useState(initialQuery)
  const [videos, setVideos] = useState<VideoGridItem[]>([])
  const [expandedKeywords, setExpandedKeywords] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [exaContext, setExaContext] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  // Use useEffect to perform initial search if query is in URL
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return

    setLoading(true)
    setHasSearched(true)

    try {
      const res = await fetch(`/api/search-ai?q=${encodeURIComponent(searchQuery)}`)
      if (res.ok) {
        const data = await res.json()
        setVideos(data.videos || [])
        setExpandedKeywords(data.expandedKeywords || [])
        setExaContext(data.exaContext || false)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search-ai?q=${encodeURIComponent(query.trim())}`)
      performSearch(query.trim())
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 min-h-[80vh]">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <div className="inline-flex items-center justify-center p-4 bg-night-card border border-white/10 rounded-full mb-6 shadow-[0_0_30px_rgba(124,58,237,0.3)]">
          <Bot className="w-12 h-12 text-purple-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
          Pencarian Semantik AI
        </h1>
        <p className="text-white/60 text-lg mb-8">
          Jelaskan video apa yang ingin Anda tonton, dan AI kami akan memahami maksud Anda untuk menemukan hasil terbaik.
        </p>

        <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Contoh: Film aksi dengan balapan mobil..."
            className="w-full h-16 pl-6 pr-[160px] rounded-full bg-night-card border-2 border-white/10 text-lg text-white placeholder:text-white/30 focus-visible:border-purple-500 focus-visible:ring-1 focus-visible:ring-purple-500 transition-all shadow-lg"
          />
          <Button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-2 bottom-2 rounded-full px-6 bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all shadow-md"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5 mr-2" />
            )}
            {loading ? "Berpikir..." : "Cari dengan AI"}
          </Button>
        </form>
      </div>

      {hasSearched && (
        <div className="mt-16">
          <div className="mb-8 border-b border-white/10 pb-6">
            <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
              <Search className="w-6 h-6 text-cyan-400" />
              Hasil untuk "{query}"
            </h2>

            {expandedKeywords.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-white/50">Diperluas dengan:</span>
                {expandedKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-night-card border border-purple-500/30 text-purple-400 rounded-full font-medium shadow-sm"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            )}

            {exaContext && (
              <div className="mt-3 text-xs text-green-400 font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Diperkuat oleh Exa AI
              </div>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] bg-night-card animate-pulse rounded-xl border border-white/10"
                ></div>
              ))}
            </div>
          ) : videos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video as any} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-night-card rounded-xl border border-white/10 shadow-lg">
              <Bot className="w-16 h-16 mx-auto text-white/20 mb-4 opacity-50" />
              <h3 className="text-xl text-white/50 font-serif mb-2">
                Tidak ditemukan hasil yang cocok
              </h3>
              <p className="text-white/40 text-sm">
                Coba deskripsikan dengan kata-kata yang berbeda atau lebih umum.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const SearchAIPage = () => {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-purple-400" /></div>}>
      <SearchAIContent />
    </Suspense>
  )
}


export default SearchAIPage;
