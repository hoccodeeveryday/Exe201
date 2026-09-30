import React, { useMemo } from "react";

interface Slice {
  name: string;
  pct: number;
  color: string;
}

interface DonutChartProps {
  data: Slice[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
}

const DonutChart: React.FC<DonutChartProps> = ({
  data,
  size = 180,
  thickness = 28,
  centerLabel,
  centerValue,
}) => {
  const slices = useMemo(() => {
    const total = data.reduce((acc, d) => acc + d.pct, 0) || 1;
    let currentAngle = -90;
    const r = size / 2;
    return data.map(s => {
      const angle = (s.pct / total) * 360;
      const start = currentAngle;
      const end = currentAngle + angle;
      currentAngle = end;
      const startRad = (start * Math.PI) / 180;
      const endRad = (end * Math.PI) / 180;
      const x1 = r + r * Math.cos(startRad);
      const y1 = r + r * Math.sin(startRad);
      const x2 = r + r * Math.cos(endRad);
      const y2 = r + r * Math.sin(endRad);
      const innerR = r - thickness;
      const ix1 = r + innerR * Math.cos(endRad);
      const iy1 = r + innerR * Math.sin(endRad);
      const ix2 = r + innerR * Math.cos(startRad);
      const iy2 = r + innerR * Math.sin(startRad);
      const large = angle > 180 ? 1 : 0;
      return {
        ...s,
        d: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${innerR} ${innerR} 0 ${large} 0 ${ix2} ${iy2} Z`,
      };
    });
  }, [data, size, thickness]);

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        {slices.map((s, i) => (
          <path key={i} d={s.d} fill={s.color} />
        ))}
        {(centerLabel || centerValue) && (
          <g>
            <text x="50%" y="46%" textAnchor="middle" fontSize="22" fontWeight="800" fill="#0F172A">
              {centerValue}
            </text>
            <text x="50%" y="60%" textAnchor="middle" fontSize="11" fontWeight="600" fill="#94A3B8">
              {centerLabel}
            </text>
          </g>
        )}
      </svg>
      <ul className="space-y-2 text-sm flex-1">
        {slices.map((s, i) => (
          <li key={i} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ background: s.color }} />
              <span className="text-slate-700 font-semibold">{s.name}</span>
            </span>
            <span className="font-extrabold text-slate-900">{s.pct}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DonutChart;