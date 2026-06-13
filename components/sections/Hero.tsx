"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import GradientText from "@/components/ui/GradientText";
import MagneticButton from "@/components/ui/MagneticButton";

const ROLES = ["Full Stack Developer", "UI/UX Enthusiast", "Creative Technologist", "Open Source Builder"];

/* ─── Gradient mesh background with floating orbs ─── */
function GradientMeshBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid overlay */}
      <svg className="absolute w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hero-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>
      {[
      { top: "10%", left: "5%",  size: 600, color: "rgba(59,130,246,0.18)",  dur: 14, xDrift:  70, yDrift: -50 },
        { top: "65%", left: "3%",  size: 500, color: "rgba(236,72,153,0.14)",  dur: 16, xDrift: -60, yDrift:  60 },
        { top: "25%", left: "45%", size: 420, color: "rgba(139,92,246,0.12)",  dur: 12, xDrift:  40, yDrift:  40 },
        { top: "75%", left: "55%", size: 380, color: "rgba(236,72,153,0.10)",  dur: 18, xDrift: -50, yDrift: -40 },
        { top: "5%",  left: "70%", size: 350, color: "rgba(59,130,246,0.08)",  dur: 13, xDrift:  45, yDrift:  55 },
      ].map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            top: orb.top,
            left: orb.left,
            background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
            filter: "blur(80px)",
          }}
          animate={{
            x: [0, orb.xDrift, -orb.xDrift * 0.6, 0],
            y: [0, orb.yDrift, -orb.yDrift * 0.5, 0],
            scale: [1, 1.08, 0.95, 1],
          }}
          transition={{ duration: orb.dur, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ─── Animated role text with typewriter transitions ─── */
function RoleText({ texts, currentIndex }: { texts: string[]; currentIndex: number }) {
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={currentIndex}
        initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -30, filter: "blur(6px)" }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="inline-flex items-center gap-1"
      >
        {texts[currentIndex]}
        <motion.span
          className="inline-block w-[3px] h-[0.9em] bg-violet-400 rounded-full align-middle"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
        />
      </motion.span>
    </AnimatePresence>
  );
}

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-matte"
    >
      <GradientMeshBackground />

      {/* Vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-matte/40 via-transparent to-matte/80 pointer-events-none" />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center max-w-5xl mx-auto px-6"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        {/* Availability badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-[11px] font-medium font-body
            bg-white/[0.03] border border-white/[0.06] text-white/40 tracking-[0.18em] uppercase"
          >
            <span className="relative w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-40" />
              <span className="absolute inset-0 rounded-full bg-emerald-400" />
            </span>
            Available for projects
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h1 className="text-[clamp(2.8rem,10vw,5.5rem)] font-heading font-bold leading-[0.88] tracking-tight">
            Hi, I'm{" "}
            <GradientText from="#3B82F6" via="#8B5CF6" to="#EC4899">
              Lakshya Tak
            </GradientText>
          </h1>
        </motion.div>

        {/* Animated role — Clash Display 80px */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-5 h-24 flex items-center justify-center"
        >
          <span className="text-[clamp(1.8rem,6vw,5rem)] md:text-[clamp(2rem,5vw,5rem)] lg:text-[80px] font-heading font-medium text-white/50 leading-none">
            <RoleText texts={ROLES} currentIndex={roleIndex} />
          </span>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6 text-base md:text-lg text-white/30 font-body max-w-xl mx-auto leading-relaxed"
        >
          I build performant, beautiful web experiences at the intersection
          of design and engineering — turning complex ideas into vibrant reality.
        </motion.p>

        {/* CTA Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-5"
        >
          <MagneticButton variant="primary" size="lg" href="/#work">
            View My Work
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </MagneticButton>

          {/* Ghost button with glow border */}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-xl font-body font-medium text-base text-white/70
              border border-white/10 transition-all duration-300
              hover:border-violet-500/40 hover:text-white hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.3)]"
          >
            <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-electric-500/0 via-violet-500/5 to-pink-500/0
              opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="relative z-10">Download Resume</span>
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <motion.span
            className="text-[10px] font-body tracking-[0.35em] uppercase text-white/15"
            animate={{ opacity: [0.15, 0.4, 0.15] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            Scroll
          </motion.span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg className="w-4 h-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
