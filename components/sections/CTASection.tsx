"use client";

import { motion } from "framer-motion";
import GradientText from "@/components/ui/GradientText";
import MagneticButton from "@/components/ui/MagneticButton";
import { useInView } from "@/hooks";

export default function CTASection() {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.2 });

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="section-padding relative overflow-hidden">
      {/* Gradient background glow */}
      <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-[150px] pointer-events-none" />

      <div className="max-width-container relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium font-body bg-white/5 border border-white/[0.08] text-white/50 tracking-wider uppercase mb-6">
            Get in Touch
          </span>

          <h2 className="text-4xl md:text-5xl lg:text-7xl font-heading font-bold leading-tight tracking-tight mb-6">
            Let&apos;s Build Something{" "}
            <GradientText animate>Amazing</GradientText>
            <br />
            <span className="text-white/20">Together</span>
          </h2>

          <p className="text-base md:text-lg text-white/40 font-body max-w-xl mx-auto leading-relaxed mb-10">
            Whether you have a project in mind, a collaboration idea, or just
            want to say hi — I&apos;d love to hear from you.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <MagneticButton variant="primary" size="lg" href="/contact">
              Start a Conversation
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </MagneticButton>
            <MagneticButton variant="secondary" size="lg" href="mailto:hello@portfolio.dev">
              hello@portfolio.dev
            </MagneticButton>
          </div>

          {/* Availability indicator */}
          <motion.div
            className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/10"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            <motion.span
              className="w-2 h-2 rounded-full bg-emerald-400"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs text-emerald-400/70 font-body">Available for new projects</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
