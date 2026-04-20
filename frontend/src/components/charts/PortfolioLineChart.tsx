import { AreaSeries, ColorType, createChart } from "lightweight-charts";
import { useEffect, useRef } from "react";

type Point = { time: number; value: number };

type Props = {
  data: Point[];
  className?: string;
  height?: number;
};

export function PortfolioLineChart({
  data,
  className = "",
  height = 200,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || data.length === 0) return;
    const chart = createChart(ref.current, {
      height,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#94a3b8",
        fontSize: 11,
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: "rgba(148,163,184,0.06)" },
      },
      rightPriceScale: { borderVisible: false },
      timeScale: { borderVisible: false },
    });

    const area = chart.addSeries(AreaSeries, {
      lineColor: "#38bdf8",
      topColor: "rgba(56, 189, 248, 0.35)",
      bottomColor: "rgba(56, 189, 248, 0.02)",
      lineWidth: 2,
    });
    area.setData(
      data.map((d) => ({
        time: d.time as import("lightweight-charts").UTCTimestamp,
        value: d.value,
      })),
    );

    const ro = new ResizeObserver(() => {
      if (ref.current) chart.applyOptions({ width: ref.current.clientWidth });
    });
    ro.observe(ref.current);
    chart.applyOptions({ width: ref.current.clientWidth });
    chart.timeScale().fitContent();

    return () => {
      ro.disconnect();
      chart.remove();
    };
  }, [data, height]);

  return <div ref={ref} className={`w-full ${className}`} />;
}
