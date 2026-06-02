"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLocale } from "next-intl"
import { 
  LayoutDashboard, 
  Film, 
  Tags, 
  FolderTree, 
  MessageSquare, 
  Megaphone,
  LogOut,
  DollarSign,
  ShieldAlert,
  BarChart3,
  Settings,
  Bell,
  Ban
} from "lucide-react"

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const locale = useLocale()

  const navigation = [
    { name: "Dashboard", href: `/${locale}/admin/dashboard`, icon: LayoutDashboard },
    { name: "Analytics", href: `/${locale}/admin/analytics`, icon: BarChart3 },
    { name: "Videos", href: `/${locale}/admin/videos`, icon: Film },
    { name: "Tags", href: `/${locale}/admin/tags`, icon: Tags },
    { name: "Categories", href: `/${locale}/admin/categories`, icon: FolderTree },
    { name: "Comments", href: `/${locale}/admin/comments`, icon: MessageSquare },
    { name: "Moderations", href: `/${locale}/admin/moderation`, icon: ShieldAlert },
    { name: "Ads", href: `/${locale}/admin/ads`, icon: Megaphone },
    { name: "Revenue", href: `/${locale}/admin/revenue`, icon: DollarSign },
    { name: "Notifications", href: `/${locale}/admin/notifications`, icon: Bell },
    { name: "Block Status", href: `/${locale}/admin/block-status`, icon: Ban },
    { name: "Settings", href: `/${locale}/admin/settings`, icon: Settings },
  ]

  return (
    <div className="flex min-h-screen bg-night-bg text-white font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-night-card border-r border-white/10 hidden md:flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
          <Link href={`/${locale}/admin/dashboard`} className="text-xl font-serif font-bold text-white tracking-wider hover:opacity-80 transition-opacity">
            AIUISO<span className="text-purple-400">ADMIN</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== `/${locale}/admin/dashboard`)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive 
                    ? "bg-purple-600/20 text-purple-400 border border-purple-500/30" 
                    : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-purple-400" : "text-white/40"}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10 shrink-0">
          <Link 
            href={`/${locale}`} 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-white/60 hover:text-white hover:bg-white/5 transition-all"
          >
            <LogOut className="w-5 h-5 text-white/40" />
            Kembali ke Situs
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-6 bg-night-card border-b border-white/10 md:hidden shrink-0">
           <Link href={`/${locale}/admin/dashboard`} className="text-xl font-serif font-bold text-white tracking-wider">
            AIUISO<span className="text-purple-400">ADMIN</span>
          </Link>
          <Link href={`/${locale}`} className="text-sm text-cyan-400 font-bold">Keluar</Link>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-night-bg p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout;
