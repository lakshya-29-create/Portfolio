"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import GlowCard from "@/components/ui/GlowCard";
import GradientText from "@/components/ui/GradientText";
import MagneticButton from "@/components/ui/MagneticButton";
import { projects as mockProjects } from "@/content/site";
import type { Project } from "@/types";
import { useInView } from "@/hooks";

const techColors: Record<string, string> = {
  "Next.js": "from-indigo-500 to-cyan-400",
  "React": "from-cyan-400 to-blue-500",
  "TypeScript": "from-blue-500 to-indigo-500",
  "Tailwind CSS": "from-cyan-400 to-teal-400",
  "Framer Motion": "from-violet-500 to-pink-500",
  "Three.js": "from-indigo-500 to-violet-500",
  "Supabase": "from-emerald-400 to-green-500",
  "PostgreSQL": "from-blue-400 to-indigo-500",
  "Node.js": "from-green-400 to-emerald-500",
  "Python": "from-yellow-400 to-amber-500",
  "D3.js": "from-orange-400 to-red-500",
  "Stripe": "from-purple-400 to-indigo-500",
  "TensorFlow": "from-orange-400 to-yellow-500",
  "Redis": "from-red-400 to-rose-500",
  "AWS": "from-amber-400 to-orange-500",
  "Socket.io": "from-gray-400 to-slate-500",
  "AI": "from-violet-400 to-purple-500",
  "Solidity": "from-gray-300 to-slate-400",
};

/* ─── Project card with cover image, hover lift, and border glow ─── */
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  // Generate a deterministic gradient for projects without images
  const gradients = [
    "from-indigo-500/20 via-violet-500/20 to-cyan-500/20",
    "from-cyan-500/20 via-blue-500/20 to-indigo-500/20",
    "from-violet-500/20 via-indigo-500/20 to-cyan-500/20",
    "from-emerald-500/20 via-cyan-500/20 to-blue-500/20",
  ];
  const gradient = gradients[index % gradients.length];
  const initials = project.title
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        animate={{
          y: isHovered ? -6 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <GlowCard glowSize={350} glowColor="rgba(79,70,229,0.10)">
          <div className="overflow-hidden rounded-t-2xl">
            {/* Cover image */}
            <div className={`relative h-48 md:h-52 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
              {project.cover_image_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={project.cover_image_url}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              ) : (
                <>
                  {/* Decorative pattern fallback */}
                  <div className="absolute inset-0 opacity-[0.12]">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id={`grid-${project.id}`} width="24" height="24" patternUnits="userSpaceOnUse">
                          <circle cx="12" cy="12" r="1" fill="white" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill={`url(#grid-${project.id})`} />
                    </svg>
                  </div>
                  {/* Initials */}
                  <span className="relative text-3xl md:text-4xl font-heading font-bold text-white/20 select-none">
                    {initials}
                  </span>
                </>
              )}
              {/* Glow on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-accent-horizontal opacity-0"
                animate={{ opacity: isHovered ? 0.08 : 0 }}
                transition={{ duration: 0.4 }}
              />
              {/* Floating orbs */}
              <motion.div
                className="absolute w-16 h-16 rounded-full bg-white/[0.04] blur-xl"
                animate={{
                  x: isHovered ? [0, 20, 0] : 0,
                  y: isHovered ? [0, -15, 0] : 0,
                }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ top: "20%", right: "15%" }}
              />
              <motion.div
                className="absolute w-10 h-10 rounded-full bg-white/[0.03] blur-lg"
                animate={{
                  x: isHovered ? [0, -15, 0] : 0,
                  y: isHovered ? [0, 10, 0] : 0,
                }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{ bottom: "25%", left: "10%" }}
              />
            </div>
          </div>


          <div className="p-6 md:p-7">
            {/* Category badge */}
            {project.category && (
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-body font-medium bg-white/[0.04] border border-white/[0.06] text-white/30 uppercase tracking-wider mb-3">
                {project.category}
              </span>
            )}

            {/* Title */}
            <h3 className="text-xl font-heading font-bold text-white mb-2.5">
              {project.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-white/40 font-body leading-relaxed line-clamp-2 mb-5">
              {project.description}
            </p>

            {/* Tech stack pills */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {project.tech_stack.map((tech) => (
                <span
                  key={tech}
                  className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-body font-medium
                    bg-gradient-to-r ${techColors[tech] || "from-white/10 to-white/5"} text-white/50`}
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Links */}
            <div className="flex items-center gap-4">
              {project.live_url && (
                <Link
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-body font-medium text-white/40 hover:text-indigo-400 transition-colors duration-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Live Site
                </Link>
              )}
              {project.github_url && (
                <Link
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-body font-medium text-white/40 hover:text-indigo-400 transition-colors duration-300"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                  Source Code
                </Link>
              )}
            </div>
          </div>
        </GlowCard>
      </motion.div>
    </motion.div>
  );
}

export default function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>(mockProjects.filter((p) => p.is_featured));
  const [loading, setLoading] = useState(true);
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.05 });

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch("/api/projects?featured=true&limit=10");
        if (!res.ok) throw new Error("API not available");
        const data = await res.json();
        if (data.projects && data.projects.length > 0) {
          setProjects(data.projects);
        }
      } catch {
        // Fallback to mock data — already set
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  return (
    <section id="work" ref={ref as React.RefObject<HTMLElement>} className="section-padding relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-glow opacity-60 pointer-events-none" />

      <div className="max-width-container relative">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium font-body bg-white/5 border border-white/[0.08] text-white/50 tracking-wider uppercase mb-4">
            Portfolio
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight tracking-tight">
            Featured{" "}
            <GradientText animate>Projects</GradientText>
          </h2>
          <p className="mt-4 text-white/40 font-body max-w-lg mx-auto">
            A selection of my best work — each project pushed the boundaries of design and technology.
          </p>
        </motion.div>

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
                <div className="h-48 md:h-52 bg-white/[0.04]" />
                <div className="p-6 md:p-7 space-y-4">
                  <div className="h-3 w-20 rounded bg-white/[0.06]" />
                  <div className="h-5 w-3/4 rounded bg-white/[0.06]" />
                  <div className="h-4 w-full rounded bg-white/[0.04]" />
                  <div className="h-4 w-2/3 rounded bg-white/[0.04]" />
                  <div className="flex gap-2">
                    <div className="h-5 w-16 rounded-md bg-white/[0.06]" />
                    <div className="h-5 w-14 rounded-md bg-white/[0.06]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Project grid */}
        {!loading && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
            initial="hidden"
            animate="visible"
          >
            {projects.length === 0 ? (
              <div className="col-span-2 text-center py-16">
                <p className="text-white/30 font-body">No featured projects yet.</p>
              </div>
            ) : (
              projects.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))
            )}
          </motion.div>
        )}

        {/* CTA */}
        {!loading && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
          >
            <MagneticButton variant="secondary" size="md" href="/contact">
              Have a project in mind? Let&apos;s talk
            </MagneticButton>
          </motion.div>
        )}
      </div>
    </section>
  );
}
