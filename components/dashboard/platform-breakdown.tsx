"use client"

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

interface PlatformBreakdownProps {
  data: Array<{
    publisher_platform: string
    impressions: number
    clicks: number
    spend: number
  }>
}

const platformLabels: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  audience_network: "Audience Network",
  messenger: "Messenger",
}

export function PlatformBreakdown({ data }: PlatformBreakdownProps) {
  const chartData = data.map((d) => ({
    ...d,
    name: platformLabels[d.publisher_platform] ?? d.publisher_platform,
  }))

  return (
    <div>
      <h3 className="text-base font-semibold text-white mb-4">プラットフォーム別内訳</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} tickLine={false} axisLine={false} tickFormatter={(v) => v.toLocaleString()} width={70} />
            <Tooltip
              contentStyle={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "13px", color: "#e2e8f0" }}
              formatter={(value: unknown, name: unknown) => {
                const labels: Record<string, string> = { impressions: "インプレッション", clicks: "クリック" }
                return [Number(value).toLocaleString(), labels[String(name)] ?? String(name)]
              }}
            />
            <Legend formatter={(value) => {
              const labels: Record<string, string> = { impressions: "インプレッション", clicks: "クリック" }
              return <span style={{ color: "#94a3b8" }}>{labels[value] ?? value}</span>
            }} />
            <Bar dataKey="impressions" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
            <Bar dataKey="clicks" fill="#ec4899" radius={[4, 4, 0, 0]} barSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
