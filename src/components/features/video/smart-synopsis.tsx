"use client"

import React, { useMemo } from "react"
import Link from "next/link"

interface SmartSynopsisProps {
  synopsis: string
  tags: string[]
  categories: string[]
}

export const SmartSynopsis = ({ synopsis, tags, categories }: SmartSynopsisProps) => {
  const content = useMemo(() => {
    if (!synopsis) return null

    const dictionary: { keyword: string; url: string }[] = []

    categories.forEach((cat) => {
      dictionary.push({ keyword: cat.toLowerCase(), url: `/${cat.toLowerCase()}` })
    })

    tags.forEach((tag) => {
      dictionary.push({ keyword: tag.toLowerCase(), url: `/?tag=${encodeURIComponent(tag.toLowerCase())}` })
    })

    // Sort descending by length to avoid partial match issues
    dictionary.sort((a, b) => b.keyword.length - a.keyword.length)

    if (dictionary.length === 0) return <>{synopsis}</>

    const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const pattern = new RegExp(`\\b(${dictionary.map((d) => escapeRegExp(d.keyword)).join("|")})\\b`, "gi")
    const parts = synopsis.split(pattern)

    return parts.map((part, i) => {
      const match = dictionary.find((d) => d.keyword === part.toLowerCase())
      if (match) {
        return (
          <Link
            key={i}
            href={match.url}
            className="text-purple-400 hover:text-white hover:underline transition-colors font-medium"
            title={`Lihat lebih banyak video ${match.keyword}`}
          >
            {part}
          </Link>
        )
      }
      return <React.Fragment key={i}>{part}</React.Fragment>
    })
  }, [synopsis, tags, categories])

  return <>{content}</>
}
