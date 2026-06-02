"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { getSafeImageUrl } from "@/lib/media"

interface SearchResult {
  id: string
  title: string
  thumbnail?: string | null
}

export const SearchBar = () => {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Debounce autocomplete
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsLoading(true)
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=videos&limit=5`)
          const data = await res.json()
          setResults(data.videos || [])
          setIsOpen(true)
        } catch {
          setResults([])
        } finally {
          setIsLoading(false)
        }
      } else {
        setIsOpen(false)
        setResults([])
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (id: string) => {
    setIsOpen(false)
    setQuery("")
    router.push(`/watch/${id}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setIsOpen(false)
      router.push(`/search?q=${encodeURIComponent(query)}`)
      setQuery("")
    }
  }

  return (
    <div ref={wrapperRef} className="relative w-full max-w-sm">
      <form onSubmit={handleSubmit} className="relative">
        <Input
          type="text"
          placeholder="Cari video..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-night-card border-white/10 text-white pl-10 pr-4 rounded-full focus-visible:ring-purple-500"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </div>
      </form>

      {isOpen && query.trim().length >= 2 && (
        <div className="absolute top-full mt-2 w-full bg-night-card border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
          {results.length > 0 ? (
            <ul>
              {results.map((video) => {
                const thumbnail = getSafeImageUrl(video.thumbnail)
                return (
                  <li key={video.id}>
                    <button
                      onClick={() => handleSelect(video.id)}
                      className="w-full text-left px-4 py-3 hover:bg-white/10 flex items-center gap-3 transition-colors"
                    >
                      {thumbnail && (
                        <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                          <Image src={thumbnail} alt={video.title} fill className="object-cover" />
                        </div>
                      )}
                      <span className="text-white text-sm font-medium line-clamp-2">{video.title}</span>
                    </button>
                  </li>
                )
              })}
              <li>
                <button
                  onClick={() => { setIsOpen(false); router.push(`/search?q=${encodeURIComponent(query)}`); setQuery("") }}
                  className="w-full text-center px-4 py-2 bg-white/5 text-cyan-400 text-sm font-bold"
                >
                  Lihat semua hasil
                </button>
              </li>
            </ul>
          ) : !isLoading ? (
            <div className="px-4 py-3 text-white/40 text-sm text-center">
              Tidak ada hasil untuk &quot;{query}&quot;
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
