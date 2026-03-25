"use client"

import { format, parseISO } from "date-fns"
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

interface DailyTrendChartProps {
  data: Array<{
    date: string
    impressions: number
    reach: number
    clicks: number
    spend: number
  }>
}

export function DailyTrendChart({ data }: DailyTrendChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    dateLabel: format(parseISO(d.date), "M/d"),
  }))

  return (
    <div>
      <h3 className="text-base font-semibold text-white mb-4">日別トレンド</h3>
      <div className="h-[360px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="dateLabel" tick={{ fontSize: 12, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
            <YAxis yAxisId="left" tick={{ fontSize: 12, fill: "#94a3b8" }} tickLine={false} axisLine={false} tickFormatter={(v) => v.toLocaleString()} width={70} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: "#94a3b8" }} tickLine={false} axisLine={false} tickFormatter={(v) => `¥${v.toLocaleString()}`} width={80} />
            <Tooltip
              contentStyle={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "13px", color: "#e2e8f0" }}
              formatter={(value: unknown, name: unknown) => {
                const v = Number(value)
                const n = String(name)
                if (n === "spend") return [`¥${v.toLocaleString()}`, "消化金額"]
                if (n === "impressions") return [v.toLocaleString(), "インプレッション"]
                if (n === "reach") return [v.toLocaleString(), "リーチ"]
                if (n === "clicks") return [v.toLocaleString(), "クリック"]
                return [v.toLocaleString(), n]
              }}
            />
            <Legend formatter={(value) => {
              const labels: Record<string, string> = { impressions: "インプレッション", reach: "リーチ", clicks: "クリック", spend: "消化金額" }
              return <span style={{ color: "#94a3b8" }}>{labels[value] ?? value}</span>
            }} />
            <Bar yAxisId="left" dataKey="impressions" fill="#93c5fd" radius={[4, 4, 0, 0]} barSize={20} />
            <Bar yAxisId="left" dataKey="reach" fill="#bfdbfe" radius={[4, 4, 0, 0]} barSize={20} />
            <Line yAxisId="right" type="monotone" dataKey="spend" stroke="#ef4444" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
