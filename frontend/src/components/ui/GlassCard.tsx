import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  hover?: boolean;
};

export function GlassCard({ children, className = "", hover = true }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : undefined}
      className={`glass-panel rounded-2xl p-5 transition-shadow duration-300 ${hover ? "hover:shadow-[0_8px_40px_rgba(14,165,233,0.12)]" : ""} ${className}`}
    >
      {children}
    </motion.div>
  );
}
