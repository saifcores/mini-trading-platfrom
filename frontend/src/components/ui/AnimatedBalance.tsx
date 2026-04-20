import { animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Props = {
  value: number;
  prefix?: string;
  className?: string;
};

export function AnimatedBalance({
  value,
  prefix = "$",
  className = "",
}: Props) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);

  useEffect(() => {
    const controls = animate(fromRef.current, value, {
      duration: 0.45,
      ease: [0.25, 0.1, 0.25, 1],
      onUpdate: (v) => setDisplay(v),
      onComplete: () => {
        fromRef.current = value;
      },
    });
    return () => controls.stop();
  }, [value]);

  return (
    <span className={`tabular-nums ${className}`}>
      {prefix}
      {display.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </span>
  );
}
