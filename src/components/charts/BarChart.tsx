import React, { useMemo } from "react";

interface Point {
  label: string;
  value: number;
}

interface BarChartProps {
  data: Point[];
  height?: number;
  color?: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, height = 200, color = "#8B5CF6" }) => {
  const { points } = useMemo(() => {
    const maxVal = Math.max(...data.map(d => d.value)) * 1.15;
    const barArea = 100 / data.length;
    const pts = data.map((d, i) => ({
      x: barArea * i + barArea * 0.15,
      y: (1 - d.value / maxVal) * (height - 30) + 5,
      w: barArea * 0.7,
      label: d.label,
      value: d.value,
      h: height - 30 - ((1 - d.value / maxVal) * (height - 30) + 5) + 5,
    }));
    return { points: pts };
  }, [data, height]);

  return (
    <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" aria-hidden="true">
      {points.map((p, i) => (
        <g key={i}>
          <rect
            x={p.x}
            y={p.y}
            width={p.w}
            height={p.h}
            rx="2"
            fill="url(#barGradient)"
          />
          <text x={p.x + p.w / 2} y={height - 8} fontSize="3" fill="#94A3B8" textAnchor="middle" fontWeight="600">
            {p.label}
          </text>
        </g>
      ))}
      <defs>
        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={`${color}99`} />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default BarChart;