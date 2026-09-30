import React, { useMemo } from "react";

interface Point {
  label: string;
  value: number;
}

interface AreaChartProps {
  data: Point[];
  height?: number;
  stroke?: string;
  gradientFrom?: string;
  gradientTo?: string;
  yFormat?: (v: number) => string;
}

/**
 * Area chart với trục Y và lưới ngang.
 * Responsive 100% width.
 */
const AreaChart: React.FC<AreaChartProps> = ({
  data,
  height = 240,
  stroke = "#6366F1",
  gradientFrom = "rgba(99,102,241,0.45)",
  gradientTo = "rgba(99,102,241,0)",
  yFormat = v => `${v}`,
}) => {
  const { maxVal, yTicks, gridLines, points, areaPath } = useMemo(() => {
    const maxVal = Math.max(...data.map(d => d.value)) * 1.1;
    const ticks = [0, 0.25, 0.5, 0.75, 1].map(t => t * maxVal);
    const grid = ticks.map(t => ({ y: (1 - t / maxVal) * (height - 40) + 20 }));
    const stepX = 100 / (data.length - 1 || 1);
    const pts = data.map((d, i) => ({
      x: i * stepX,
      y: (1 - d.value / maxVal) * (height - 40) + 20,
      label: d.label,
      value: d.value,
    }));
    const path = `M ${pts[0].x},${pts[0].y} ` + pts.slice(1).map(p => `L ${p.x},${p.y}`).join(" ");
    const area = `${path} L 100,${height - 40 + 20} L 0,${height - 40 + 20} Z`;
    return { maxVal, yTicks: ticks, gridLines: grid, points: pts, areaPath: { path, area } };
  }, [data, height]);

  const gradientId = "areaChartGradient";
  return (
    <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={gradientFrom} />
          <stop offset="100%" stopColor={gradientTo} />
        </linearGradient>
      </defs>
      {/* Grid */}
      {gridLines.map((g, i) => (
        <line key={i} x1="0" x2="100" y1={g.y} y2={g.y} stroke="#E2E8F0" strokeWidth="0.2" strokeDasharray="0.5,0.5" />
      ))}
      {/* Y axis labels */}
      {yTicks.map((t, i) => (
        <text key={i} x="0.5" y={(1 - t / maxVal) * (height - 40) + 20 + 1} fontSize="2.5" fill="#94A3B8" fontWeight="600">
          {yFormat(t)}
        </text>
      ))}
      {/* Area */}
      <path d={areaPath.area} fill={`url(#${gradientId})`} />
      {/* Line */}
      <path d={areaPath.path} fill="none" stroke={stroke} strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round" />
      {/* Points */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="0.7" fill="#fff" stroke={stroke} strokeWidth="0.5" />
      ))}
      {/* X axis labels */}
      {points.map((p, i) => (i % 1 === 0 ? (
        <text key={i} x={p.x} y={height - 12} fontSize="2.5" fill="#94A3B8" textAnchor="middle" fontWeight="600">
          {p.label}
        </text>
      ) : null))}
    </svg>
  );
};

export default AreaChart;