"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface CursorFollowerProps {
  size?: number;
  color?: string;
  trail?: boolean;
}

export default function CursorFollower({
  size = 20,
  color = "rgba(79, 70, 229, 0.5)",
  trail = true,
}: CursorFollowerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const mouseX = useSpring(0, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(0, { stiffness: 150, damping: 15 });

  const cursorScale = useTransform(
    mouseX,
    (latest) => (isHovering ? 2.5 : isClicking ? 0.8 : 1)
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    },
    [mouseX, mouseY, isVisible]
  );

  const handleMouseDown = () => setIsClicking(true);
  const handleMouseUp = () => setIsClicking(false);

  useEffect(() => {
    const handleHoverStart = () => setIsHovering(true);
    const handleHoverEnd = () => setIsHovering(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    document.querySelectorAll("a, button, [data-cursor-hover]").forEach((el) => {
      el.addEventListener("mouseenter", handleHoverStart);
      el.addEventListener("mouseleave", handleHoverEnd);
    });

    const observer = new MutationObserver(() => {
      document.querySelectorAll("a, button, [data-cursor-hover]").forEach((el) => {
        el.addEventListener("mouseenter", handleHoverStart);
        el.addEventListener("mouseleave", handleHoverEnd);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      observer.disconnect();
    };
  }, [handleMouseMove]);

  if (!isVisible) return null;

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{
          left: mouseX,
          top: mouseY,
          scale: cursorScale,
        }}
      >
        <div
          className="rounded-full"
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            boxShadow: `0 0 20px ${color}, 0 0 60px ${color}`,
            transition: "width 0.2s, height 0.2s",
          }}
        />
      </motion.div>

      {/* Cursor ring */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed z-[9998] -translate-x-1/2 -translate-y-1/2"
        style={{
          left: mouseX,
          top: mouseY,
        }}
        animate={{
          width: isHovering ? 60 : 40,
          height: isHovering ? 60 : 40,
          opacity: isHovering ? 0.5 : 0.3,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div
          className="h-full w-full rounded-full border"
          style={{
            borderColor: "rgba(79, 70, 229, 0.3)",
            backdropFilter: "blur(4px)",
          }}
        />
      </motion.div>

      {/* Trail effect */}
      {trail && (
        <CursorTrail mouseX={mouseX} mouseY={mouseY} />
      )}
    </>
  );
}

function CursorTrail({
  mouseX,
  mouseY,
}: {
  mouseX: any;
  mouseY: any;
}) {
  const trailX = useSpring(0, { stiffness: 80, damping: 20 });
  const trailY = useSpring(0, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const unsubscribeX = mouseX.on("change", (v: number) => trailX.set(v));
    const unsubscribeY = mouseY.on("change", (v: number) => trailY.set(v));
    return () => {
      unsubscribeX();
      unsubscribeY();
    };
  }, [mouseX, mouseY, trailX, trailY]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed z-[9997] -translate-x-1/2 -translate-y-1/2"
      style={{
        left: trailX,
        top: trailY,
        width: 8,
        height: 8,
        borderRadius: "50%",
        background:
          "linear-gradient(135deg, rgba(79, 70, 229, 0.3), rgba(6, 182, 212, 0.3))",
        filter: "blur(2px)",
      }}
    />
  );
}
