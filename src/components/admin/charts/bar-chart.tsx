import type { ChartPoint } from "@/lib/admin/types";

const W = 500;
const H = 180;
const PL = 48;
const PR = 12;
const PT = 12;
const PB = 30;

const CW = W - PL - PR;
const CH = H - PT - PB;

function fmt(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}k`;
  return String(n);
}

interface Props {
  data: ChartPoint[];
  color?: string;
  formatY?: (v: number) => string;
}

export function BarChart({ data, color = "#6366f1", formatY = fmt }: Props) {
  if (!data.length) return null;

  const max = Math.max(...data.map((d) => d.value)) || 1;
  const barGap = 6;
  const barW = CW / data.length - barGap;
  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-hidden="true">
      {/* Y-axis grid + labels */}
      {yTicks.map((t) => {
        const y = PT + CH * (1 - t);
        return (
          <g key={t}>
            <line
              x1={PL}
              y1={y}
              x2={W - PR}
              y2={y}
              stroke="currentColor"
              strokeOpacity="0.08"
              strokeWidth="1"
            />
            {t > 0 && (
              <text
                x={PL - 4}
                y={y + 4}
                textAnchor="end"
                fontSize="10"
                fill="currentColor"
                opacity="0.45"
              >
                {formatY(max * t)}
              </text>
            )}
          </g>
        );
      })}

      {/* Bars */}
      {data.map((d, i) => {
        const bh = (d.value / max) * CH;
        const x = PL + i * (barW + barGap) + barGap / 2;
        const y = PT + CH - bh;
        return (
          <g key={d.label}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={bh}
              rx="3"
              fill={color}
              opacity="0.85"
            />
            <text
              x={x + barW / 2}
              y={H - 8}
              textAnchor="middle"
              fontSize="10"
              fill="currentColor"
              opacity="0.45"
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
