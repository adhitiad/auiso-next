import { AnalyticsCharts } from "@/components/features/admin/analytics-charts"

export const metadata = { title: "Admin Revenue - Aiuiso" }

export default function RevenuePage() {
  const dummyData = {
    viewsChartData: [{ date: "Jan", views: 100 }, { date: "Feb", views: 200 }],
    commentsChartData: [{ date: "Jan", comments: 10 }, { date: "Feb", comments: 20 }],
    topVideosChart: [{ name: "Video 1", views: 1000, likes: 100 }],
    categoryChart: [{ name: "Anime", value: 50 }]
  };
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-serif">Pendapatan Platform</h1>
      <AnalyticsCharts data={dummyData} />
    </div>
  )
}
