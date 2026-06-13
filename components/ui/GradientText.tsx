"use client";

import { motion } from "framer-motion";

interface GradientTextProps {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "p";
  className?: string;
  animate?: boolean;
  from?: string;
  via?: string;
  to?: string;
}

export default function GradientText({
  children,
  as: Tag = "span",
  className = "",
  animate = true,
  from = "#3B82F6",
  via = "#8B5CF6",
  to = "#EC4899",
}: GradientTextProps) {
  return (
    <Tag className={`relative inline-block ${className}`}>
      <motion.span
        className="bg-clip-text text-transparent"
        style={{
          backgroundImage: `linear-gradient(135deg, ${from}, ${via}, ${to})`,
          backgroundSize: animate ? "200% 200%" : "100% 100%",
        }}
        animate={
          animate
            ? {
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }
            : undefined
        }
        transition={
          animate
            ? {
                duration: 6,
                repeat: Infinity,
                ease: "linear",
              }
            : undefined
        }
      >
        {children}
      </motion.span>
    </Tag>
  );
}
