import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { ReactNode } from "react";

interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
  iconBg?: string;
  trend?: number;
  trendLabel?: string;
  accent?: "indigo" | "orange" | "emerald" | "amber" | "red" | "sky" | "purple";
}

const ACCENT_ICON_BG: Record<string, string> = {
  indigo:  "bg-indigo-100 text-indigo-600",
  orange:  "bg-orange-100 text-orange-600",
  emerald: "bg-emerald-100 text-emerald-600",
  amber:   "bg-amber-100 text-amber-600",
  red:     "bg-red-100 text-red-600",
  sky:     "bg-sky-100 text-sky-600",
  purple:  "bg-purple-100 text-purple-600",
};

export function KpiCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendLabel,
  accent = "indigo",
}: KpiCardProps) {
  const iconBg = ACCENT_ICON_BG[accent] ?? ACCENT_ICON_BG.indigo;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide truncate">{title}</p>
          <p className="mt-1.5 text-2xl font-bold text-slate-900 tabular-nums">{value}</p>
          {subtitle && (
            <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>
          )}
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
          {icon}
        </div>
      </div>

      {trend !== undefined && (
        <div className="mt-3 flex items-center gap-1">
          {trend > 0 ? (
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
          ) : trend < 0 ? (
            <TrendingDown className="h-3.5 w-3.5 text-red-500" />
          ) : (
            <Minus className="h-3.5 w-3.5 text-slate-400" />
          )}
          <span
            className={`text-xs font-semibold ${
              trend > 0 ? "text-emerald-600" : trend < 0 ? "text-red-600" : "text-slate-500"
            }`}
          >
            {trend > 0 ? "+" : ""}
            {trend}%
          </span>
          {trendLabel && (
            <span className="text-xs text-slate-400">{trendLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
