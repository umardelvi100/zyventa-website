import type { ChartPoint } from "@/lib/admin/types";

const W = 500;
const H = 160;
const PL = 48; // left padding (y-axis labels)
const PR = 12;
const PT = 12;
const PB = 28; // bottom padding (x-axis labels)

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
  gradientId: string;
  formatY?: (v: number) => string;
}

export function LineChart({ data, color = "#6366f1", gradientId, formatY = fmt }: Props) {
  if (data.length < 2) return null;

  const max = Math.max(...data.map((d) => d.value));
  const min = 0;
  const range = max - min || 1;

  const pts = data.map((d, i) => ({
    x: PL + (i / (data.length - 1)) * CW,
    y: PT + CH - ((d.value - min) / range) * CH,
    label: d.label,
    value: d.value,
  }));

  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L ${pts[pts.length - 1].x.toFixed(1)},${(PT + CH).toFixed(1)} L ${PL},${(PT + CH).toFixed(1)} Z`;

  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  // Show every nth x label to avoid overlap
  const step = Math.ceil(data.length / 7);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Y-axis grid lines + labels */}
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
                {formatY(min + range * t)}
              </text>
            )}
          </g>
        );
      })}

      {/* Area fill */}
      <path d={areaPath} fill={`url(#${gradientId})`} />

      {/* Line */}
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Dots */}
      {pts.map((p) => (
        <circle key={p.label} cx={p.x} cy={p.y} r="3" fill={color} />
      ))}

      {/* X-axis labels */}
      {pts.map((p, i) =>
        i % step === 0 ? (
          <text
            key={p.label}
            x={p.x}
            y={H - 6}
            textAnchor="middle"
            fontSize="10"
            fill="currentColor"
            opacity="0.45"
          >
            {p.label}
          </text>
        ) : null,
      )}
    </svg>
  );
}
