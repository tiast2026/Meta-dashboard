"use client"

import { format, parseISO } from "date-fns"
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
} from "recharts"

interface FollowerTrendChartProps {
  data: Array<{ date: string; followers: number }>
}

export function FollowerTrendChart({ data }: FollowerTrendChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    dateLabel: format(parseISO(d.date), "M/d"),
  }))

  return (
    <div>
      <h3 className="text-base font-semibold text-white mb-4">フォロワー推移</h3>
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="followerGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="dateLabel" tick={{ fontSize: 12, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} tickLine={false} axisLine={false} tickFormatter={(v) => v.toLocaleString()} width={60} />
            <Tooltip
              contentStyle={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "13px", color: "#e2e8f0" }}
              formatter={(value: unknown) => [Number(value).toLocaleString(), "フォロワー"]}
              labelFormatter={(label) => label}
            />
            <Area type="monotone" dataKey="followers" stroke="#3b82f6" strokeWidth={2} fill="url(#followerGradient)" dot={false} activeDot={{ r: 4, fill: "#3b82f6" }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
