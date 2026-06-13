"use client";

import { motion } from "framer-motion";

interface AnimatedBorderProps {
  children: React.ReactNode;
  className?: string;
  borderRadius?: string;
  borderWidth?: number;
  speed?: number;
  colors?: string[];
}

export default function AnimatedBorder({
  children,
  className = "",
  borderRadius = "1rem",
  borderWidth = 1,
  speed = 4,
  colors = ["#4F46E5", "#06B6D4", "#7C3AED", "#4F46E5"],
}: AnimatedBorderProps) {
  return (
    <div
      className={`relative ${className}`}
      style={{ borderRadius }}
    >
      {/* Rotating gradient background (renders beneath the content) */}
      <div
        className="pointer-events-none absolute -inset-[1px] overflow-hidden"
        style={{ borderRadius }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            background: `conic-gradient(${colors.join(", ")})`,
            transformOrigin: "center center",
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: speed,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Mask layer: punches a hole in the gradient so only border-width ring shows */}
      <div
        className="pointer-events-none absolute -inset-[1px]"
        style={{
          borderRadius,
          boxShadow: `inset 0 0 0 ${borderWidth}px #060606`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
