"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, Globe, ShieldAlert, ShieldCheck } from "lucide-react"
import { checkBlockStatus } from "@/app/actions/admin-block-status"
import { ComposableMap, Geographies, Geography } from "react-simple-maps"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { BlockStatus } from "@prisma/client"

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

export const BlockStatusManager = ({ initialStatuses }: { initialStatuses: BlockStatus[] }) => {
  const [isChecking, setIsChecking] = useState(false)

  const handleCheck = async () => {
    setIsChecking(true)
    try {
      const res = await checkBlockStatus()
      if (res.error) {
        alert(res.error)
      }
    } catch (error) {
      alert("Terjadi kesalahan")
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-white">Status Blokir Website</h1>
          <p className="text-white/60">Pantau aksesibilitas domain Anda di seluruh dunia via OONI.</p>
        </div>
        <Button 
          onClick={handleCheck}
          className="bg-purple-600 hover:bg-purple-700 text-white"
          disabled={isChecking}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isChecking ? "animate-spin" : ""}`} />
          {isChecking ? "Memeriksa..." : "Periksa Sekarang"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-night-card border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Globe className="w-5 h-5 text-cyan-400" />
              Peta Akses Global
            </CardTitle>
            <CardDescription className="text-white/60">
              Representasi visual status blokir (Pencocokan disimulasikan).
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center p-0 md:p-6">
            <div className="w-full max-w-[500px] border border-white/10 rounded-lg bg-[#0D0D1A] overflow-hidden">
              <ComposableMap
                projectionConfig={{ scale: 140 }}
                width={800}
                height={400}
              >
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      let fill = "#2D2D3A" // Default gray
                      
                      if (geo.id === "360" && initialStatuses.some(b => b.country === "ID" && b.status === "blocked")) fill = "#EF4444"
                      else if (geo.id === "360" && initialStatuses.some(b => b.country === "ID" && b.status === "accessible")) fill = "#22C55E"
                      if (geo.id === "458" && initialStatuses.some(b => b.country === "MY" && b.status === "blocked")) fill = "#EF4444"
                      else if (geo.id === "458" && initialStatuses.some(b => b.country === "MY" && b.status === "accessible")) fill = "#22C55E"
                      if (geo.id === "702" && initialStatuses.some(b => b.country === "SG" && b.status === "blocked")) fill = "#EF4444"
                      else if (geo.id === "702" && initialStatuses.some(b => b.country === "SG" && b.status === "accessible")) fill = "#22C55E"

                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={fill}
                          stroke="#0D0D1A"
                          strokeWidth={0.5}
                          style={{
                            default: { outline: "none" },
                            hover: { fill: "#7C3AED", outline: "none" },
                            pressed: { outline: "none" },
                          }}
                        />
                      )
                    })
                  }
                </Geographies>
              </ComposableMap>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-night-card border-white/10 flex flex-col">
          <CardHeader>
            <CardTitle className="text-white">Status Detail</CardTitle>
            <CardDescription className="text-white/60">
              Daftar pemeriksaan blokir terbaru berdasarkan negara.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            {initialStatuses.length === 0 ? (
              <div className="text-center py-12 text-white/40">
                <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Tidak ada data pemantauan tersedia.</p>
                <p className="text-sm">Klik "Periksa Sekarang" untuk mengambil data.</p>
              </div>
            ) : (
              <div className="rounded-md border border-white/10 max-h-[400px] overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-night-bg z-10 border-b border-white/10">
                    <TableRow className="border-none hover:bg-transparent">
                      <TableHead className="text-white/60">Negara (ISO)</TableHead>
                      <TableHead className="text-white/60">Status</TableHead>
                      <TableHead className="text-white/60 text-right">Terakhir Diperiksa</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {initialStatuses.map((block) => (
                      <TableRow key={block.id} className="border-b border-white/10 hover:bg-white/5">
                        <TableCell className="font-medium text-white">
                          {block.country}
                        </TableCell>
                        <TableCell>
                          {block.status === "blocked" ? (
                            <Badge variant="outline" className="text-red-500 border-red-500/50 bg-red-500/10 gap-1">
                              <ShieldAlert className="w-3 h-3" />
                              Diblokir
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-green-500 border-green-500/50 bg-green-500/10 gap-1">
                              <ShieldCheck className="w-3 h-3" />
                              Dapat Diakses
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right text-white/60 text-sm">
                          {new Date(block.checkedAt).toLocaleString("id-ID")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
