"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Category {
  name: string
  type?: string
}

interface CategoryBadgeProps {
  category: Category
  className?: string
}

const typeColorMap: Record<string, string> = {
  genre: "bg-purple-600/80 text-white hover:bg-purple-600",
  studio: "bg-blue-600/80 text-white hover:bg-blue-600",
  theme: "bg-rose-600/80 text-white hover:bg-rose-600",
  tag: "bg-amber-600/80 text-white hover:bg-amber-600",
}

export const CategoryBadge = ({ category, className }: CategoryBadgeProps) => {
  const color = typeColorMap[category.type ?? ""] ?? "bg-night-accent/80 text-white hover:bg-night-accent"
  return (
    <Badge className={cn("border-none text-xs font-semibold px-2 py-0.5 cursor-pointer", color, className)}>
      {category.name}
    </Badge>
  )
}
