"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Video, Tags, MessageSquare, DollarSign, ArrowLeft } from "lucide-react"

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/videos", label: "Manajemen Video", icon: Video },
  { href: "/admin/categories", label: "Kategori", icon: Tags },
  { href: "/admin/comments", label: "Moderasi Komentar", icon: MessageSquare },
  { href: "/admin/ads", label: "Iklan & Sponsor", icon: DollarSign },
]

export const AdminSidebar = ({ user }: { user: any }) => {
  const pathname = usePathname()
  return (
    <aside className="w-64 border-r bg-muted/20 min-h-screen flex flex-col hidden md:flex">
      <div className="p-6 border-b">
        <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Aiuiso Admin</h2>
        <p className="text-sm text-muted-foreground mt-1 truncate">{user?.name || user?.email}</p>
      </div>
      <nav className="p-4 space-y-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t">
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Publik
        </Link>
      </div>
    </aside>
  )
}
