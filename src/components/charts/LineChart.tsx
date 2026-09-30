import React, { useMemo } from "react";

interface Point {
  label: string;
  value: number;
}

interface LineChartProps {
  data: Point[];
  data2?: Point[];
  height?: number;
  height1?: string;
  height2?: string;
  height2Legend?: string;
}

const LineChart: React.FC<LineChartProps> = ({ data, data2, height = 220 }) => {
  const all = data2 ? [...data.map(d => d.value), ...data2.map(d => d.value)] : data.map(d => d.value);
  const maxVal = Math.max(...all) * 1.15;

  const build = (arr: Point[]) => {
    const stepX = 100 / (arr.length - 1 || 1);
    const pts = arr.map((d, i) => ({
      x: i * stepX,
      y: (1 - d.value / maxVal) * (height - 40) + 20,
    }));
    const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`).join(" ");
    return { path, pts };
  };

  const line1 = useMemo(() => build(data), [data, maxVal, height]); // eslint-disable-line react-hooks/exhaustive-deps
  const line2 = useMemo(() => (data2 ? build(data2) : null), [data2, maxVal, height]); // eslint-disable-line react-hooks/exhaustive-deps

  const gridTicks = [0, 0.25, 0.5, 0.75, 1].map(t => (1 - t) * (height - 40) + 20);

  return (
    <div>
      <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="line1Grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="line2Grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EC4899" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
          </linearGradient>
        </defs>
        {gridTicks.map((y, i) => (
          <line key={i} x1="0" x2="100" y1={y} y2={y} stroke="#E2E8F0" strokeWidth="0.2" strokeDasharray="0.5,0.5" />
        ))}
        {line1 && <path d={`${line1.path} L 100,${height - 20} L 0,${height - 20} Z`} fill="url(#line1Grad)" />}
        <path d={line1.path} fill="none" stroke="#6366F1" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" />
        {line1.pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="0.6" fill="#fff" stroke="#6366F1" strokeWidth="0.3" />
        ))}
        {line2 && (
          <>
            <path d={`${line2.path} L 100,${height - 20} L 0,${height - 20} Z`} fill="url(#line2Grad)" />
            <path d={line2.path} fill="none" stroke="#EC4899" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" />
            {line2.pts.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="0.6" fill="#fff" stroke="#EC4899" strokeWidth="0.3" />
            ))}
          </>
        )}
        {data.map((p, i) => (
          <text key={i} x={(i * 100) / (data.length - 1)} y={height - 8} fontSize="2.5" fill="#94A3B8" textAnchor="middle" fontWeight="600">
            {p.label}
          </text>
        ))}
      </svg>
      {data2 && (
        <div className="flex gap-6 mt-4 justify-end text-xs">
          <span className="flex items-center gap-2 font-semibold text-slate-600">
            <span className="w-3 h-0.5 bg-indigo-500 rounded" />
            Series 1
          </span>
          <span className="flex items-center gap-2 font-semibold text-slate-600">
            <span className="w-3 h-0.5 bg-pink-500 rounded" />
            Series 2
          </span>
        </div>
      )}
    </div>
  );
};

export default LineChart;