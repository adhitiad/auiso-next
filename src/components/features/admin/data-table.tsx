"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface DataTableProps<T> {
  data: T[]
  columns: {
    key: string
    header: string
    cell?: (item: T) => React.ReactNode
  }[]
}

export function DataTable<T extends Record<string, any>>({ data, columns }: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

  const sorted = sortKey
    ? [...data].sort((a, b) => {
        const aVal = sortKey.includes(".") ? sortKey.split(".").reduce((o, k) => o?.[k], a) : a[sortKey]
        const bVal = sortKey.includes(".") ? sortKey.split(".").reduce((o, k) => o?.[k], b) : b[sortKey]
        if (aVal < bVal) return sortDir === "asc" ? -1 : 1
        if (aVal > bVal) return sortDir === "asc" ? 1 : -1
        return 0
      })
    : data

  return (
    <div className="border rounded-lg overflow-x-auto bg-card">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 border-b">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left font-medium cursor-pointer hover:bg-muted/80 whitespace-nowrap"
                onClick={() => {
                  if (sortKey === col.key) setSortDir((d) => (d === "asc" ? "desc" : "asc"))
                  else { setSortKey(col.key); setSortDir("asc") }
                }}
              >
                <div className="flex items-center gap-1">
                  {col.header}
                  {sortKey === col.key && (
                    sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {sorted.length === 0 ? (
            <tr><td colSpan={columns.length} className="px-4 py-8 text-center text-muted-foreground">Tidak ada data.</td></tr>
          ) : (
            sorted.map((item, i) => (
              <tr key={i} className="hover:bg-muted/50 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    {col.cell ? col.cell(item) : col.key.includes(".") ? col.key.split(".").reduce((o, k) => o?.[k], item) : item[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
