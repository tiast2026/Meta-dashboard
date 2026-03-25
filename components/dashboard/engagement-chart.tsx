"use client";

import { format, parseISO } from "date-fns";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface EngagementChartProps {
  data: Array<{
    date: string;
    likes: number;
    comments: number;
    saves: number;
    shares: number;
  }>;
}

export function EngagementChart({ data }: EngagementChartProps) {
  const formatted = data.map((d) => ({
    ...d,
    label: format(parseISO(d.date), "M/d"),
  }));

  return (
    <div>
      <h3 className="text-base font-semibold text-white mb-4">エンゲージメント推移</h3>
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formatted} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="engLikes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="engComments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="engSaves" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#eab308" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="engShares" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} tickLine={false} axisLine={false} tickFormatter={(v) => v.toLocaleString()} />
            <Tooltip
              contentStyle={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "13px", color: "#e2e8f0" }}
              formatter={(value: unknown, name: unknown) => {
                const labels: Record<string, string> = { likes: "いいね", comments: "コメント", saves: "保存", shares: "シェア" };
                return [Number(value).toLocaleString(), labels[String(name)] ?? String(name)];
              }}
            />
            <Legend formatter={(value) => {
              const labels: Record<string, string> = { likes: "いいね", comments: "コメント", saves: "保存", shares: "シェア" };
              return <span style={{ color: "#94a3b8" }}>{labels[value] ?? value}</span>;
            }} />
            <Area type="monotone" dataKey="likes" stackId="1" stroke="#ec4899" fill="url(#engLikes)" strokeWidth={2} />
            <Area type="monotone" dataKey="comments" stackId="1" stroke="#3b82f6" fill="url(#engComments)" strokeWidth={2} />
            <Area type="monotone" dataKey="saves" stackId="1" stroke="#eab308" fill="url(#engSaves)" strokeWidth={2} />
            <Area type="monotone" dataKey="shares" stackId="1" stroke="#22c55e" fill="url(#engShares)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
