"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import GradientText from "@/components/ui/GradientText";
import { useInView } from "@/hooks";
import { bio } from "@/content/site";

/* ─── Animated counter that counts up on scroll ─── */
function AnimatedCounter({ value, suffix, label, inView }: { value: number; suffix: string; label: string; inView: boolean }) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [inView, value]);

  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-heading font-bold text-white tabular-nums mb-1">
        {count}{suffix}
      </div>
      <p className="text-xs text-white/30 font-body uppercase tracking-wider">{label}</p>
    </div>
  );
}

/* ─── Glowing portrait placeholder ring ─── */
function PortraitRing() {
  const ringRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative w-[280px] h-[280px] md:w-[340px] md:h-[340px] mx-auto">
      {/* Animated glow ring */}
      <motion.div
        ref={ringRef}
        className="absolute inset-0 rounded-full"
        style={{
          background: "conic-gradient(from 0deg, #4F46E5, #06B6D4, #7C3AED, #4F46E5)",
          padding: 2,
          WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #fff calc(100% - 1px))",
          mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #fff calc(100% - 1px))",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Outer glow blur */}
      <motion.div
        className="absolute -inset-8 rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(79,70,229,0.25), transparent 70%)",
        }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Inner content — gradient placeholder with initials */}
      <div className="absolute inset-[3px] rounded-full bg-matte overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-matte to-cyan-500/20" />
        <div className="absolute inset-0 bg-gradient-glow opacity-30" />
        <motion.span
          className="relative text-6xl md:text-7xl font-heading font-bold text-white/10"
          animate={{ scale: [1, 1.02, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          AC
        </motion.span>
        {/* Decorative dots */}
        <div className="absolute top-[15%] left-[18%] w-2 h-2 rounded-full bg-indigo-400/20" />
        <div className="absolute bottom-[20%] right-[15%] w-1.5 h-1.5 rounded-full bg-cyan-400/20" />
        <div className="absolute top-[35%] right-[20%] w-1 h-1 rounded-full bg-violet-400/15" />
      </div>
    </div>
  );
}

export default function About() {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.1 });
  const statsInView = useInView<HTMLDivElement>({ threshold: 0.3 });

  return (
    <section id="about" ref={ref as React.RefObject<HTMLElement>} className="section-padding relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 -left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 -right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <div className="max-width-container">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium font-body bg-white/5 border border-white/[0.08] text-white/50 tracking-wider uppercase mb-4">
            About Me
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight tracking-tight">
            Who{" "}
            <GradientText animate>I Am</GradientText>
          </h2>
        </motion.div>

        {/* Split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Portrait */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex justify-center"
          >
            <PortraitRing />
          </motion.div>

          {/* Right — Bio + Stats */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <h3 className="text-2xl md:text-3xl font-heading font-bold text-white mb-6">
              {bio.greeting}
            </h3>

            {bio.paragraphs.map((p, i) => (
              <p
                key={i}
                className="text-base text-white/40 font-body leading-relaxed mb-4 last:mb-0"
              >
                {p}
              </p>
            ))}

            {/* Animated stat counters */}
            <div
              ref={statsInView[0] as React.RefObject<HTMLDivElement>}
              className="grid grid-cols-3 gap-6 mt-10 pt-10 border-t border-white/[0.06]"
            >
              <AnimatedCounter value={5} suffix="+" label="Years Exp." inView={statsInView[1]} />
              <AnimatedCounter value={50} suffix="+" label="Projects" inView={statsInView[1]} />
              <AnimatedCounter value={15} suffix="+" label="Blog Posts" inView={statsInView[1]} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
