import type { CategoryPoint } from "@/lib/admin/types";

interface Props {
  data: CategoryPoint[];
  size?: number;
  innerRadius?: number;
  label?: string;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function arcPath(
  cx: number,
  cy: number,
  r: number,
  innerR: number,
  startDeg: number,
  endDeg: number,
): string {
  // Clamp to slightly less than full circle to avoid SVG arc bug
  const end = Math.min(endDeg, startDeg + 359.99);
  const largeArc = end - startDeg > 180 ? 1 : 0;
  const s = polarToCartesian(cx, cy, r, startDeg);
  const e = polarToCartesian(cx, cy, r, end);
  const si = polarToCartesian(cx, cy, innerR, startDeg);
  const ei = polarToCartesian(cx, cy, innerR, end);
  return [
    `M ${s.x.toFixed(2)} ${s.y.toFixed(2)}`,
    `A ${r} ${r} 0 ${largeArc} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`,
    `L ${ei.x.toFixed(2)} ${ei.y.toFixed(2)}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${si.x.toFixed(2)} ${si.y.toFixed(2)}`,
    "Z",
  ].join(" ");
}

export function DonutChart({ data, size = 160, innerRadius = 48, label }: Props) {
  if (!data.length) return null;

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;
  const total = data.reduce((s, d) => s + d.value, 0) || 1;

  let current = 0;
  const segments = data.map((d) => {
    const start = current;
    const sweep = (d.value / total) * 360;
    current += sweep;
    return { ...d, start, end: current };
  });

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        {segments.map((s) => (
          <path
            key={s.label}
            d={arcPath(cx, cy, r, innerRadius, s.start, s.end)}
            fill={s.color}
          />
        ))}
        {label && (
          <>
            <text
              x={cx}
              y={cy - 4}
              textAnchor="middle"
              fontSize="18"
              fontWeight="700"
              fill="currentColor"
            >
              {label}
            </text>
            <text
              x={cx}
              y={cy + 14}
              textAnchor="middle"
              fontSize="10"
              fill="currentColor"
              opacity="0.5"
            >
              total
            </text>
          </>
        )}
      </svg>

      {/* Legend */}
      <ul className="flex flex-col gap-2.5">
        {data.map((d) => (
          <li key={d.label} className="flex items-center gap-2 text-sm">
            <span
              className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: d.color }}
            />
            <span className="text-neutral-600 dark:text-neutral-400">{d.label}</span>
            <span className="ml-auto font-semibold text-neutral-800 dark:text-neutral-200">
              {d.value}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
