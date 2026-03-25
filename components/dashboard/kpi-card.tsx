import { ReactNode } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"

interface KpiCardProps {
  title: string
  value: number | string
  change?: number
  icon?: ReactNode
  prefix?: string
  suffix?: string
}

export function KpiCard({ title, value, change, icon, prefix, suffix }: KpiCardProps) {
  const formattedValue =
    typeof value === "number" ? value.toLocaleString() : value

  const isPositive = change !== undefined && change >= 0

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-1">
        {prefix && <span className="text-lg font-semibold text-gray-400">{prefix}</span>}
        <span className="text-2xl font-bold text-gray-900">{formattedValue}</span>
        {suffix && <span className="text-sm font-medium text-gray-400">{suffix}</span>}
      </div>
      {change !== undefined && (
        <div className="mt-2 flex items-center gap-1.5">
          {isPositive ? (
            <TrendingUp className="size-3.5 text-emerald-500" />
          ) : (
            <TrendingDown className="size-3.5 text-red-500" />
          )}
          <span className={`text-xs font-semibold ${isPositive ? "text-emerald-500" : "text-red-500"}`}>
            {isPositive ? "+" : ""}{change.toFixed(1)}%
          </span>
          <span className="text-xs text-gray-400">前期比</span>
        </div>
      )}
    </div>
  )
}
