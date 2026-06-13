"use client";

import { useEffect, useRef, useCallback, useMemo } from "react";
import { useMousePosition } from "@/hooks";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
  life: number;
  maxLife: number;
}

interface ParticleFieldProps {
  particleCount?: number;
  mouseInfluence?: number;
  className?: string;
  colors?: readonly [string, string, string];
}

const DEFAULT_COLORS = ["#4F46E5", "#06B6D4", "#7C3AED"] as const;

export default function ParticleField({
  particleCount = 60,
  mouseInfluence = 30,
  className = "",
  colors = DEFAULT_COLORS,
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const { x: mouseX, y: mouseY } = useMousePosition();

  // Keep mouse position in ref for animation loop
  useEffect(() => {
    mouseRef.current = { x: mouseX, y: mouseY };
  }, [mouseX, mouseY]);

  const initParticle = useCallback(
    (width: number, height: number): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.2,
      hue: Math.floor(Math.random() * 3),
      life: 0,
      maxLife: Math.random() * 200 + 100,
    }),
    []
  );

  // Stable identity for colors to prevent unnecessary re-initialization
  const stableColors = useMemo(() => colors, [colors]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize particles
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(initParticle(canvas.width, canvas.height));
    }
    particlesRef.current = particles;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mouse = mouseRef.current;
      const w = canvas.width;
      const h = canvas.height;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life++;

        // Mouse influence — attraction / ripple
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouseInfluence * 10 && dist > 0) {
          const force = (mouseInfluence * 10 - dist) / (mouseInfluence * 10);
          p.vx += (dx / dist) * force * 0.2;
          p.vy += (dy / dist) * force * 0.2;
        }

        // Damping
        p.vx *= 0.99;
        p.vy *= 0.99;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // Respawn if too old
        if (p.life > p.maxLife) {
          Object.assign(p, initParticle(w, h));
        }

        // Draw particle
        const color = stableColors[p.hue] || stableColors[0];
        const alpha = p.opacity * (1 - p.life / p.maxLife);
        const size = p.size * (1 + Math.sin(p.life * 0.02) * 0.3);

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha * 0.6;
        ctx.fill();

        // Outer glow
        const gradient = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          size * 4
        );
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.globalAlpha = alpha * 0.15;
        ctx.fill();

        // Draw connections between nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
          if (cdist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = stableColors[0];
            ctx.globalAlpha = (1 - cdist / 120) * 0.08;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
    // Only re-initialize when particleCount or mouseInfluence changes, not colors
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [particleCount, mouseInfluence, initParticle]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 z-0 ${className}`}
      aria-hidden="true"
    />
  );
}
