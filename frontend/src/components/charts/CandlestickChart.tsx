import {
  CandlestickSeries,
  ColorType,
  createChart,
  type UTCTimestamp,
} from "lightweight-charts";
import { useEffect, useRef } from "react";

type Props = {
  className?: string;
  height?: number;
};

function genData(points = 80) {
  const out: {
    time: UTCTimestamp;
    open: number;
    high: number;
    low: number;
    close: number;
  }[] = [];
  let c = 175 + Math.random() * 10;
  const start = Math.floor(Date.now() / 1000) - points * 3600;
  for (let i = 0; i < points; i++) {
    const time = (start + i * 3600) as UTCTimestamp;
    const o = c;
    const change = (Math.random() - 0.48) * 4;
    c = Math.max(50, o + change);
    const h = Math.max(o, c) + Math.random() * 2;
    const l = Math.min(o, c) - Math.random() * 2;
    out.push({ time, open: o, high: h, low: l, close: c });
  }
  return out;
}

export function CandlestickChart({ className = "", height = 320 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const chart = createChart(ref.current, {
      height,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#94a3b8",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: "rgba(148,163,184,0.08)" },
        horzLines: { color: "rgba(148,163,184,0.08)" },
      },
      rightPriceScale: { borderColor: "rgba(148,163,184,0.15)" },
      timeScale: { borderColor: "rgba(148,163,184,0.15)" },
      crosshair: {
        vertLine: { color: "rgba(14,165,233,0.35)" },
        horzLine: { color: "rgba(14,165,233,0.35)" },
      },
    });
    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderUpColor: "#22c55e",
      borderDownColor: "#ef4444",
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
    });
    series.setData(genData());

    const ro = new ResizeObserver(() => {
      if (ref.current) chart.applyOptions({ width: ref.current.clientWidth });
    });
    ro.observe(ref.current);
    chart.applyOptions({ width: ref.current.clientWidth });

    return () => {
      ro.disconnect();
      chart.remove();
    };
  }, [height]);

  return <div ref={ref} className={`w-full min-h-[200px] ${className}`} />;
}
