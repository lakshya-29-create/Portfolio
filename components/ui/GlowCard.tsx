"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useMousePositionRelative } from "@/hooks";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  glowSize?: number;
}

export default function GlowCard({
  children,
  className = "",
  glowColor = "rgba(79, 70, 229, 0.15)",
  glowSize = 300,
}: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { x, y } = useMousePositionRelative(ref);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden rounded-2xl bg-gradient-card border border-white/[0.06] ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect that follows mouse */}
      <motion.div
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
        style={{
          width: glowSize,
          height: glowSize,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${glowColor}, transparent 70%)`,
          left: x,
          top: y,
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
