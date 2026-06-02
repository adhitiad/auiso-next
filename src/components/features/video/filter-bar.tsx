"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

interface FilterBarProps {
  tags: { id: string; name: string }[]
  categories?: { id: string; name: string }[]
}

export const FilterBar = ({ tags, categories }: FilterBarProps) => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const currentTag = searchParams.get("tag") || ""
  const currentCat = searchParams.get("category") || ""
  const currentSort = searchParams.get("sort") || "newest"

  const handleFilterChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams.toString())
    if (!value) {
      newParams.delete(key)
    } else {
      newParams.set(key, value)
    }
    newParams.set("page", "1")
    router.push(`?${newParams.toString()}`)
  }

  const handleClearFilters = () => router.push("?")
  const hasFilters = searchParams.has("tag") || searchParams.has("category") || searchParams.has("sort")

  const sorts = [
    { value: "newest", label: "Terbaru" },
    { value: "popular", label: "Terpopuler" },
    { value: "views", label: "Paling Ditonton" },
  ]

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center bg-night-card p-4 rounded-xl border border-white/10 mb-8 shadow-lg">
      <div className={`flex-1 w-full grid grid-cols-1 ${categories ? "sm:grid-cols-3" : "sm:grid-cols-2"} gap-4`}>
        {/* Category Filter */}
        {categories && (
          <select
            value={currentCat}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            className="w-full bg-night-bg border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        )}

        {/* Tag Filter */}
        <select
          value={currentTag}
          onChange={(e) => handleFilterChange("tag", e.target.value)}
          className="w-full bg-night-bg border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Semua Tag</option>
          {tags.map((t) => (
            <option key={t.id} value={t.name}>{t.name}</option>
          ))}
        </select>

        {/* Sort Filter */}
        <select
          value={currentSort}
          onChange={(e) => handleFilterChange("sort", e.target.value)}
          className="w-full bg-night-bg border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {sorts.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {hasFilters && (
        <Button variant="destructive" onClick={handleClearFilters} className="w-full sm:w-auto">
          Reset Filter
        </Button>
      )}
    </div>
  )
}
