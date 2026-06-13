"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import GradientText from "@/components/ui/GradientText";
import MagneticButton from "@/components/ui/MagneticButton";
import GlowCard from "@/components/ui/GlowCard";
import ConfettiBurst from "@/components/ui/ConfettiBurst";
import type { ContactFormData } from "@/types";

/* ─── Zod schema ─── */
const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(10, "Must be at least 10 characters").max(5000),
});

/* ─── Form field with floating label + focus glow ─── */
function FormField({
  label,
  name,
  type = "text",
  register,
  error,
  isTextarea = false,
  index = 0,
  watch,
}: {
  label: string;
  name: keyof ContactFormData;
  type?: string;
  register: any;
  error?: string;
  isTextarea?: boolean;
  index?: number;
  watch?: (name: keyof ContactFormData) => string;
}) {
  const [focused, setFocused] = useState(false);
  const Tag = isTextarea ? "textarea" : "input";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 + index * 0.08 }}
      className="relative"
    >
      <Tag
        {...register(name)}
        type={isTextarea ? undefined : type}
        rows={isTextarea ? 5 : undefined}
        placeholder={label}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`
          w-full bg-white/[0.02] border rounded-xl px-5 pt-6 pb-3
          text-white/90 font-body text-sm
          placeholder:text-transparent
          focus:outline-none transition-all duration-300
          resize-none
          ${error
            ? "border-red-400/50"
            : focused
            ? "border-indigo-500/50 shadow-[0_0_20px_-8px_rgba(79,70,229,0.3)]"
            : "border-white/[0.08] hover:border-white/[0.15]"
          }
        `}
      />
      {/* Floating label */}
      <motion.label
        className="absolute left-5 pointer-events-none font-body"
        animate={{
          top: focused || watch?.(name) ? 8 : 18,
          fontSize: focused || watch?.(name) ? "11px" : "14px",
          color: error
            ? "rgb(248 113 113)"
            : focused
            ? "rgba(129, 140, 248, 0.9)"
            : "rgba(255,255,255,0.25)",
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {label}
      </motion.label>
      {/* Indigo→cyan focus glow line */}
      <motion.div
        className="absolute bottom-0 left-5 right-5 h-[2px] bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500 rounded-full"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={focused ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{ transformOrigin: "left center" }}
      />
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-xs mt-1.5 font-body px-1"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}

/* ─── Stagger variants ─── */
const heroStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};
const heroItem = {
  hidden: { opacity: 0, y: 50, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

/* ─── Social link data ─── */
const socials = [
  { name: "GitHub", url: "https://github.com", icon: "github" },
  { name: "LinkedIn", url: "https://linkedin.com", icon: "linkedin" },
  { name: "Twitter", url: "https://twitter.com", icon: "twitter" },
  { name: "Email", url: "mailto:hello@portfolio.dev", icon: "email" },
];

const socialPaths: Record<string, string> = {
  github: "M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z",
  linkedin: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  twitter: "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84",
  email: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
};

/* ═══════════════════════════════════════════
   Main contact page
   ═══════════════════════════════════════════ */
export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const {
    formState: { isSubmitting, errors },
    register,
    handleSubmit,
    reset,
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  // Parallax
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const onSubmit = async (data: ContactFormData) => {
    setSubmitError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const responseData = await res.json();
      if (!res.ok || !responseData.success) {
        setSubmitError(responseData.errors?.[0] || "Something went wrong.");
        return;
      }
      setIsSubmitted(true);
      setShowConfetti(true);
      reset();
      setTimeout(() => setShowConfetti(false), 3500);
    } catch {
      setSubmitError("Network error. Please check your connection.");
    }
  };

  const fields = [
    { label: "Your Name", name: "name" as const, type: "text" },
    { label: "Email Address", name: "email" as const, type: "email" },
    { label: "Subject", name: "subject" as const, type: "text" },
  ];

  return (
    <div ref={containerRef} className="relative">
      <ConfettiBurst active={showConfetti} count={50} />
      <main className="min-h-screen">
        {/* ═══════ HERO SECTION ═══════ */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          {/* Floating gradient orbs */}
          <motion.div className="absolute top-[15%] left-[10%] w-[500px] h-[500px] rounded-full opacity-10 blur-[120px] pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(79,70,229,0.4), transparent 70%)" }}
            animate={{ x: [0, 40, 0], y: [0, -20, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="absolute bottom-[20%] right-[8%] w-[450px] h-[450px] rounded-full opacity-10 blur-[120px] pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(6,182,212,0.35), transparent 70%)" }}
            animate={{ y: [0, 40, 0], scale: [1, 1.08, 1], x: [0, -20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full opacity-8 blur-[100px] pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(124,58,237,0.3), transparent 70%)" }}
            animate={{ x: [0, 30, 0], y: [0, 50, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} />

          {/* Diagonal grid */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
            style={{ backgroundImage: "linear-gradient(45deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />

          <motion.div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12" style={{ y: heroY, opacity: heroOpacity }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-screen py-32">
              {/* ─── LEFT: Heading + Socials ─── */}
              <motion.div
                variants={heroStagger}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-8"
              >
                <motion.div variants={heroItem}>
                  <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium font-body bg-white/[0.04] border border-white/[0.08] text-white/50 tracking-[0.2em] uppercase mb-6">
                    Get in Touch
                  </span>
                </motion.div>

                <motion.div variants={heroItem}>
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-[0.92] tracking-tight">
                    Let's Build{" "}
                    <GradientText animate from="#4F46E5" via="#06B6D4" to="#7C3AED">
                      Something
                    </GradientText>
                    <br />
                    <span className="text-white/20">Together</span>
                  </h1>
                </motion.div>

                <motion.p variants={heroItem} className="text-base md:text-lg text-white/40 font-body max-w-md leading-relaxed">
                  Have a project, collaboration, or just want to chat? I'd love to hear from you.
                </motion.p>

                {/* Social links with magnetic hover */}
                <motion.div variants={heroItem} className="flex flex-wrap gap-3">
                  {socials.map((social) => (
                    <Link
                      key={social.name}
                      href={social.url}
                      target={social.name === "Email" ? undefined : "_blank"}
                      rel={social.name === "Email" ? undefined : "noopener noreferrer"}
                      className="group flex items-center gap-2 px-4 py-2.5 rounded-xl
                        bg-white/[0.03] border border-white/[0.06]
                        hover:bg-white/[0.08] hover:border-indigo-500/30
                        hover:shadow-[0_0_20px_-8px_rgba(79,70,229,0.3)]
                        transition-all duration-300"
                    >
                      <svg className="w-4 h-4 text-white/40 group-hover:text-indigo-400 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d={socialPaths[social.icon]} />
                      </svg>
                      <span className="text-sm text-white/50 group-hover:text-white/80 font-body transition-colors duration-300">
                        {social.name}
                      </span>
                    </Link>
                  ))}
                </motion.div>

                {/* Location + availability */}
                <motion.div variants={heroItem} className="flex flex-wrap items-center gap-4 mt-2">
                  <div className="flex items-center gap-2 text-sm text-white/30 font-body">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    San Francisco, CA
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/15">
                    <span className="relative w-1.5 h-1.5">
                      <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-40" />
                      <span className="absolute inset-0 rounded-full bg-emerald-400" />
                    </span>
                    <span className="text-[11px] text-emerald-400/80 font-body">Available</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* ─── RIGHT: Contact Form ─── */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <GlowCard className="p-8 md:p-10" glowSize={400} glowColor="rgba(79,70,229,0.10)">
                  <AnimatePresence mode="wait">
                    {isSubmitted ? (
                      /* ── SUCCESS ── */
                      <motion.div
                        key="success"
                        className="flex flex-col items-center justify-center py-16 text-center"
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                      >
                        <motion.div className="relative w-24 h-24 mb-8"
                          initial={{ rotate: -90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          transition={{ duration: 0.8, type: "spring", stiffness: 120 }}
                        >
                          <div className="absolute inset-0 rounded-full bg-gradient-accent opacity-20 animate-pulse-glow" />
                          <div className="absolute inset-2 rounded-full bg-gradient-accent flex items-center justify-center">
                            <motion.svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.3 }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </motion.svg>
                          </div>
                        </motion.div>
                        <motion.h3 className="text-2xl font-heading font-bold text-white mb-3"
                          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        >
                          Message received!
                        </motion.h3>
                        <motion.p className="text-white/50 font-body max-w-sm leading-relaxed"
                          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                        >
                          Thanks for reaching out! I'll review your message and be in touch within 24 hours.
                        </motion.p>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                          <MagneticButton className="mt-8" onClick={() => { setIsSubmitted(false); setShowConfetti(false); }}>
                            Send Another Message
                          </MagneticButton>
                        </motion.div>
                      </motion.div>
                    ) : (
                      /* ── FORM ── */
                      <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="mb-8">
                          <h2 className="text-2xl font-heading font-bold text-white mb-2">Send a Message</h2>
                          <p className="text-sm text-white/40 font-body">All fields are required. I typically respond within 24 hours.</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <FormField label="Your Name" name="name" register={register} error={errors.name?.message} index={0} watch={watch} />
                            <FormField label="Email Address" name="email" type="email" register={register} error={errors.email?.message} index={1} watch={watch} />
                          </div>
                          <FormField label="Subject" name="subject" register={register} error={errors.subject?.message} index={2} watch={watch} />
                          <FormField label="Your Message" name="message" register={register} error={errors.message?.message} isTextarea index={3} watch={watch} />

                          {submitError && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm font-body">
                              {submitError}
                            </motion.p>
                          )}

                          <motion.div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                          >
                            <MagneticButton type="submit" variant="primary" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
                              {isSubmitting ? (
                                <span className="flex items-center gap-3">
                                  <motion.span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full shrink-0"
                                    animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                                  Sending...
                                </span>
                              ) : (
                                <span className="flex items-center gap-2">
                                  Send Message
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                  </svg>
                                </span>
                              )}
                            </MagneticButton>
                            <span className="text-xs text-white/20 font-body">I'll respond within 24h</span>
                          </motion.div>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlowCard>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
