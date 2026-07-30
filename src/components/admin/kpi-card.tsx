import { TrendingUp, TrendingDown } from "lucide-react";

interface Props {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ReactNode;
  accent: string;   // tailwind bg class for icon chip
  iconColor: string; // tailwind text class for icon
}

export function KpiCard({ title, value, change, changeLabel, icon, accent, iconColor }: Props) {
  const positive = change >= 0;

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="truncate text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {value}
          </p>
          <div className="mt-2 flex items-center gap-1.5">
            {positive ? (
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-red-500" />
            )}
            <span
              className={`text-xs font-medium ${positive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
            >
              {positive ? "+" : ""}
              {change}%
            </span>
            <span className="text-xs text-neutral-400">{changeLabel}</span>
          </div>
        </div>
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${accent}`}>
          <span className={iconColor}>{icon}</span>
        </div>
      </div>
    </div>
  );
}
