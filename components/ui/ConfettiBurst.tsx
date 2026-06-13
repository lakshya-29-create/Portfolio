"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
  shape: "circle" | "square";
}

interface ConfettiBurstProps {
  active: boolean;
  count?: number;
}

const COLORS = ["#4F46E5", "#06B6D4", "#7C3AED", "#8B5CF6", "#22D3EE", "#A78BFA"];

export default function ConfettiBurst({ active, count = 40 }: ConfettiBurstProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!active) {
      setPieces([]);
      return;
    }

    const newPieces: ConfettiPiece[] = [];
    const w = typeof window !== "undefined" ? window.innerWidth : 800;
    const h = typeof window !== "undefined" ? window.innerHeight : 600;

    for (let i = 0; i < count; i++) {
      newPieces.push({
        id: i,
        x: (Math.random() - 0.5) * w * 1.5,
        y: -(Math.random() * h * 0.8 + 100),
        rotation: Math.random() * 720 - 360,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 8 + 4,
        delay: Math.random() * 0.3,
        duration: Math.random() * 1.5 + 1.5,
        shape: Math.random() > 0.5 ? "circle" : "square",
      });
    }
    setPieces(newPieces);

    const timer = setTimeout(() => setPieces([]), 3500);
    return () => clearTimeout(timer);
  }, [active, count]);

  return (
    <AnimatePresence>
      {pieces.length > 0 && (
        <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden="true">
          {pieces.map((piece) => (
            <motion.div
              key={`${piece.id}-${active}`}
              className="absolute left-1/2 top-1/2"
              initial={{
                x: 0,
                y: 0,
                rotate: 0,
                opacity: 1,
                scale: 0,
              }}
              animate={{
                x: piece.x,
                y: piece.y,
                rotate: piece.rotation,
                opacity: [1, 1, 0],
                scale: [0, 1, 0.5],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: piece.duration,
                delay: piece.delay,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              style={{
                width: piece.size,
                height: piece.size,
                borderRadius: piece.shape === "circle" ? "50%" : "2px",
                backgroundColor: piece.color,
                boxShadow: `0 0 6px ${piece.color}66`,
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
