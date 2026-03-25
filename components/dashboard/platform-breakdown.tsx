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
      <h3 className="text-base font-semibold text-gray-900 mb-4">プラットフォーム別内訳</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} tickLine={false} axisLine={false} tickFormatter={(v) => v.toLocaleString()} width={70} />
            <Tooltip
              contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "13px", color: "#1f2937", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
              formatter={(value: unknown, name: unknown) => {
                const labels: Record<string, string> = { impressions: "インプレッション", clicks: "クリック" }
                return [Number(value).toLocaleString(), labels[String(name)] ?? String(name)]
              }}
            />
            <Legend formatter={(value) => {
              const labels: Record<string, string> = { impressions: "インプレッション", clicks: "クリック" }
              return <span style={{ color: "#6b7280" }}>{labels[value] ?? value}</span>
            }} />
            <Bar dataKey="impressions" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
            <Bar dataKey="clicks" fill="#ec4899" radius={[4, 4, 0, 0]} barSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
