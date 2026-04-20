import { useId } from "react";

type Props = {
  values: number[];
  positive?: boolean;
  className?: string;
};

export function MiniSparkline({
  values,
  positive = true,
  className = "",
}: Props) {
  const gid = useId().replace(/:/g, "");
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = 2;
  const w = 80;
  const h = 28;
  const range = max - min || 1;
  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  });
  const path = `M ${pts.join(" L ")}`;
  const stroke = positive ? "#22c55e" : "#ef4444";
  const gradId = `spark-${positive ? "p" : "n"}-${gid}`;

  return (
    <svg
      className={className}
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      aria-hidden
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.35" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`${path} L ${w - pad} ${h} L ${pad} ${h} Z`}
        fill={`url(#${gradId})`}
      />
      <path
        d={path}
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
