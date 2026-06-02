import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Film, Tags, Users, MessageSquare } from "lucide-react"
import { DashboardChart } from "@/components/features/admin/dashboard-chart"

export const metadata = {
  title: "Admin Dashboard - Aiuiso",
}

const AdminDashboard = async () => {
  const [
    animeCount,
    tagCount,
    userCount,
    commentCount,
    popularAnimes
  ] = await Promise.all([
    prisma.video.count(),
    prisma.tag.count(),
    prisma.user.count(),
    prisma.comment.count(),
    prisma.video.findMany({
      take: 5,
      orderBy: { views: "desc" },
      select: { title: true, views: true, _count: { select: { Like: true } } }
    })
  ])

  const chartData = popularAnimes.map(a => ({
    name: a.title.length > 15 ? a.title.substring(0, 15) + "..." : a.title,
    views: a.views,
    likes: a._count.Like
  }))

  const stats = { animeCount, tagCount, userCount, commentCount }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-serif">Dashboard</h1>
        <p className="text-white/60">Ikhtisar platform video Anda.</p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-night-card border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/60">Total Video</CardTitle>
            <Film className="w-4 h-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.animeCount}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-night-card border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/60">Total Tag</CardTitle>
            <Tags className="w-4 h-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.tagCount}</div>
          </CardContent>
        </Card>

        <Card className="bg-night-card border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/60">Total Pengguna</CardTitle>
            <Users className="w-4 h-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.userCount}</div>
          </CardContent>
        </Card>

        <Card className="bg-night-card border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/60">Total Komentar</CardTitle>
            <MessageSquare className="w-4 h-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.commentCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-night-card border-white/10">
        <CardHeader>
          <CardTitle>Top 5 Video Berdasarkan Views</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <DashboardChart data={chartData} />
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminDashboard;
