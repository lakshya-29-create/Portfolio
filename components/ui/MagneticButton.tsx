"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useMousePositionRelative } from "@/hooks";

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  href?: string;
  as?: "button" | "a";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export default function MagneticButton({
  children,
  onClick,
  className = "",
  href,
  as = "button",
  type = "button",
  disabled = false,
  variant = "primary",
  size = "md",
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { x, y } = useMousePositionRelative(ref);
  const [isHovered, setIsHovered] = useState(false);

  const magnetStrength = 0.3;
  const moveX = isHovered ? x * magnetStrength : 0;
  const moveY = isHovered ? y * magnetStrength : 0;

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const variantClasses = {
    primary:
      "bg-gradient-accent text-white font-medium shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40",
    secondary:
      "bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white",
    ghost:
      "text-white/60 hover:text-white hover:bg-white/5",
  };

  const Component = as === "a" ? motion.a : motion.button;

  return (
    <div
      ref={ref}
      className="inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Component
        href={href as any}
        onClick={onClick}
        type={as === "button" ? type : undefined}
        disabled={disabled}
        className={`relative overflow-hidden rounded-xl font-body font-medium transition-colors duration-300 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
        animate={{
          x: moveX,
          y: moveY,
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 15,
          mass: 0.1,
        }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Shimmer overlay on hover */}
        <motion.span
          className="absolute inset-0 opacity-0 bg-gradient-accent-horizontal"
          animate={{ opacity: isHovered ? 0.15 : 0 }}
          transition={{ duration: 0.3 }}
        />
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
      </Component>
    </div>
  );
}
