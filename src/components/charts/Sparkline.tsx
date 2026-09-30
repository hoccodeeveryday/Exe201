import React, { useMemo } from "react";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  stroke?: string;
  fill?: string;
  strokeWidth?: number;
}

/**
 * Sparkline nhỏ gọn - dùng trong StatCard.
 * Input: mảng số. Tự scale về W/H.
 */
const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 100,
  height = 36,
  stroke = "#6366F1",
  fill = "rgba(99,102,241,0.18)",
  strokeWidth = 2,
}) => {
  const path = useMemo(() => {
    if (!data.length) return "";
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const stepX = width / (data.length - 1 || 1);
    return data
      .map((v, i) => {
        const x = i * stepX;
        const y = height - ((v - min) / range) * (height - 4) - 2;
        return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");
  }, [data, width, height]);

  const areaPath = useMemo(() => {
    if (!data.length) return "";
    return `${path} L${width},${height} L0,${height} Z`;
  }, [path, width, height, data.length]);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <path d={areaPath} fill={fill} />
      <path d={path} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default Sparkline;