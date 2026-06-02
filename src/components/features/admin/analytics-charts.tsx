"use client"

import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, MessageSquare } from "lucide-react"

const COLORS = ["#7C3AED", "#06B6D4", "#E11D48", "#22C55E", "#F59E0B", "#8B5CF6", "#EC4899", "#14B8A6"]

interface ChartData {
  viewsChartData: { date: string, views: number }[]
  commentsChartData: { date: string, comments: number }[]
  topVideosChart: { name: string, views: number, likes: number }[]
  categoryChart: { name: string, value: number }[]
}

export const AnalyticsCharts = ({ data }: { data: ChartData }) => {
  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
      {/* Views Per Day */}
      <Card className="bg-night-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            Tayangan Per Hari
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.viewsChartData}>
              <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1A1A2E", borderColor: "#334155", borderRadius: "8px" }}
              />
              <Line type="monotone" dataKey="views" stroke="#06B6D4" strokeWidth={2} dot={{ fill: "#06B6D4" }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Comments Per Day */}
      <Card className="bg-night-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            Komentar Per Hari
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.commentsChartData}>
              <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1A1A2E", borderColor: "#334155", borderRadius: "8px" }}
              />
              <Line type="monotone" dataKey="comments" stroke="#7C3AED" strokeWidth={2} dot={{ fill: "#7C3AED" }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top 10 Videos */}
      <Card className="bg-night-card border-white/10">
        <CardHeader>
          <CardTitle className="text-white">10 Video Teratas</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.topVideosChart} layout="vertical">
              <XAxis type="number" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} width={120} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1A1A2E", borderColor: "#334155", borderRadius: "8px" }}
              />
              <Bar dataKey="views" fill="#E11D48" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category Distribution */}
      <Card className="bg-night-card border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Distribusi Kategori</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.categoryChart}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }: { name?: string; percent?: number }) => 
                  name && percent !== undefined ? `${name} ${(percent * 100).toFixed(0)}%` : ""
                }
              >
                {data.categoryChart.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#1A1A2E", borderColor: "#334155", borderRadius: "8px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
