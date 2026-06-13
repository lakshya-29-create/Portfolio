"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { skills } from "@/content/site";
import GradientText from "@/components/ui/GradientText";
import { useInView } from "@/hooks";

const CATEGORY_GROUPS = ["Frontend", "Backend", "Database", "Tools"];

const categoryConfig: Record<string, { gradient: string; label: string }> = {
  Frontend: { gradient: "from-indigo-500 to-cyan-400", label: "Frontend" },
  Backend:  { gradient: "from-cyan-400 to-violet-500", label: "Backend" },
  Database: { gradient: "from-violet-500 to-indigo-400", label: "Database" },
  Tools:    { gradient: "from-indigo-400 to-cyan-500", label: "Tools" },
};

/* ─── SVG icons for each skill ─── */
const skillIcons: Record<string, string> = {
  // Frontend
  react:     "<path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z\"/><circle cx=\"12\" cy=\"12\" r=\"2\"/>",
  typescript: "<path d=\"M2 4l2 16 8 2 8-2 2-16H2zm14.4 7.5c.3.2.7.5 1 .8.4.4.7.8.9 1.2.2.4.3.9.3 1.4 0 .7-.2 1.3-.5 1.8-.3.5-.7.9-1.2 1.2-.5.3-1.1.5-1.8.6-.7.1-1.4.1-2.2 0v-1.5c.5.1 1 .1 1.5 0 .4-.1.8-.2 1.1-.4.3-.2.5-.5.7-.8.2-.3.2-.7.2-1.2 0-.5-.2-1-.5-1.3-.3-.3-.7-.5-1.2-.6l-.8-.4c-.3-.1-.6-.3-.8-.5-.3-.2-.5-.4-.7-.7-.2-.3-.3-.6-.3-1.1 0-.4.1-.8.3-1.1.2-.3.4-.6.7-.8.3-.2.6-.4 1-.5.4-.1.8-.2 1.2-.2.4 0 .9.1 1.3.2.4.1.8.2 1.1.4v1.5c-.3-.2-.7-.4-1.1-.5-.4-.1-.8-.2-1.2-.2-.3 0-.6.1-.9.2-.3.1-.5.2-.7.4-.2.2-.3.4-.4.6-.1.2-.1.5-.1.7 0 .5.2.9.5 1.2.3.3.7.5 1.2.7l.8.4z\"/>",
  tailwind:  "<path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z\"/>",
  motion:    "<path d=\"M4 4h16v16H4V4zm2 2v12h12V6H6zm3 3h6v6H9V9z\"/>",
  three:     "<path d=\"M12 2L2 7v10l10 5 10-5V7L12 2zm0 3.5L18.5 9 12 12.5 5.5 9 12 5.5zM4 9.5l7 3.5v6.5l-7-3.5V9.5zm16 0v6.5l-7 3.5V13l7-3.5z\"/>",
  html:      "<path d=\"M4 2l2 18 6 2 6-2 2-18H4zm4.5 7l.5 1H13l-.5 1H9l.5 1h3.5l.5 1H9.7l.5 1h3.2l.6 1h-3.8l.5 1h.8l.5-1h0l.5-1h-3.5l.5-1h2.5l.5-1H9.7l.5-1H14l.5-1H9l-.5 1z\"/>",
  // Backend
  nodejs:    "<path d=\"M12 2L2 7v10l10 5 10-5V7L12 2zM8 16.5l-3-1.5v-5l3 1.5v5zm1-8l3-1.5 3 1.5-3 1.5-3-1.5zm6 8v-5l3-1.5v5l-3 1.5z\"/>",
  python:    "<path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z\"/>",
  graphql:   "<path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93l-1-3.93 4-1 1 4.93-4 0zm1-16.86l1 3.93-4 1-1-4.93 4 0zM6.5 17.5l3-3 3 3-3 3-3-3zm9-9l3-3 3 3-3 3-3-3zm-8.5 2l1-4 4 1-1 4-4-1zm8 0l1 4-4 1-1-4 4-1z\"/>",
  api:       "<path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4 14H8v-2h8v2zm0-4H8v-2h8v2zm0-4H8V6h8v2z\"/>",
  supabase:  "<path d=\"M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5\"/>",
  auth:      "<path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 13.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z\"/>",
  // Database
  postgres:  "<path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z\"/>",
  redis:     "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M12 6v6l4 2\"/>",
  mongodb:   "<path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z\"/>",
  prisma:    "<path d=\"M12 2L2 7v10l10 5 10-5V7L12 2zm0 3.5L18.5 9 12 12.5 5.5 9 12 5.5z\"/>",
  // Tools
  docker:    "<path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2v-2zm0-12h2v10h-2V5z\"/>",
  git:       "<path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 16H9V8h2v10zm4 0h-2V8h2v10z\"/>",
  figma:     "<path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z\"/>",
  vercel:    "<path d=\"M12 2L2 22h20L12 2z\"/>",
};

/* ─── Skill icon component with hover glow ─── */
function SkillIcon({ name, icon, gradient }: { name: string; icon: string; gradient: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative flex flex-col items-center gap-2 p-4 rounded-xl cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {/* Hover glow ring */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        animate={{
          boxShadow: isHovered ? `0 0 30px -5px rgba(79,70,229,0.25), inset 0 0 30px -5px rgba(79,70,229,0.1)` : "none",
          borderColor: isHovered ? "rgba(79,70,229,0.3)" : "rgba(255,255,255,0.04)",
        }}
        style={{ border: "1px solid rgba(255,255,255,0.04)" }}
        transition={{ duration: 0.3 }}
      />

      {/* Icon container */}
      <div className={`relative w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} p-[1px]`}>
        <div className="w-full h-full rounded-lg bg-matte flex items-center justify-center">
          <svg
            className="w-5 h-5 text-white/80"
            viewBox="0 0 24 24"
            fill="currentColor"
            dangerouslySetInnerHTML={{ __html: icon }}
          />
        </div>
      </div>

      {/* Name */}
      <span className="text-[11px] font-body font-medium text-white/45 text-center leading-tight max-w-[72px]">
        {name}
      </span>

      {/* Glow dot on hover */}
      <motion.div
        className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-indigo-400"
        animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
}

export default function SkillsShowcase() {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.05 });

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="section-padding relative overflow-hidden">
      <div className="max-width-container">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium font-body bg-white/5 border border-white/[0.08] text-white/50 tracking-wider uppercase mb-4">
            Tech Stack
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight tracking-tight">
            Skills &amp;{" "}
            <GradientText animate>Tools</GradientText>
          </h2>
          <p className="mt-4 text-white/40 font-body max-w-lg mx-auto">
            Technologies I work with daily to build modern, scalable applications.
          </p>
        </motion.div>

        {/* Category groups */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12">
          {CATEGORY_GROUPS.map((category, gi) => {
            const catSkills = skills.filter((s) => s.category === category);
            const config = categoryConfig[category] || { gradient: "from-indigo-500 to-cyan-400", label: category };

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: gi * 0.12 }}
              >
                {/* Gradient badge header */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] mb-6">
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${config.gradient}`} />
                  <span className="text-xs font-body font-medium text-white/40 uppercase tracking-wider">
                    {config.label}
                  </span>
                </div>

                {/* Skill icons grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                  {catSkills.map((skill, si) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.4, delay: gi * 0.12 + si * 0.04 }}
                    >
                      <SkillIcon
                        name={skill.name}
                        icon={skillIcons[skill.icon || ""] || skillIcons.react}
                        gradient={config.gradient}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
