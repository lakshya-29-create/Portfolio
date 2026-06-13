"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import GradientText from "@/components/ui/GradientText";
import GlowCard from "@/components/ui/GlowCard";
import { useInView } from "@/hooks";
import type { Blog } from "@/types";

/* ─── Gradient color map for tags ─── */
const tagGradients: Record<string, string> = {
  react: "from-cyan-400 to-blue-500",
  nextjs: "from-indigo-500 to-cyan-400",
  typescript: "from-blue-500 to-indigo-500",
  javascript: "from-yellow-400 to-amber-500",
  design: "from-violet-400 to-pink-400",
  backend: "from-emerald-400 to-green-500",
  frontend: "from-cyan-400 to-teal-400",
  database: "from-blue-400 to-indigo-500",
  devops: "from-amber-400 to-orange-500",
  ai: "from-violet-400 to-purple-500",
  css: "from-cyan-400 to-teal-400",
  performance: "from-green-400 to-emerald-500",
  tutorial: "from-indigo-400 to-violet-500",
};

function getTagGradient(tag: string): string {
  const key = tag.toLowerCase().replace(/[^a-z0-9]/g, "");
  return tagGradients[key] || "from-white/10 to-white/5";
}

/* ─── Cover image placeholder with gradient ─── */
function BlogCoverImage({ gradient, initials, blogId }: { gradient: string; initials: string; blogId: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative h-48 md:h-52 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Dot pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.1]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={`blog-dots-${blogId}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="0.8" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#blog-dots-${blogId})`} />
      </svg>
      {/* Hover zoom overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-accent-horizontal"
        animate={{ opacity: isHovered ? 0.08 : 0 }}
        transition={{ duration: 0.4 }}
      />
      {/* Initials with zoom on hover */}
      <motion.span
        className="relative text-2xl md:text-3xl font-heading font-bold text-white/15 select-none"
        animate={{ scale: isHovered ? 1.12 : 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {initials}
      </motion.span>
    </div>
  );
}

/* ─── Format date ─── */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/* ─── Loading skeleton ─── */
function BlogCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden animate-pulse">
      <div className="h-48 md:h-52 bg-white/[0.04]" />
      <div className="p-6 space-y-3">
        <div className="h-3 w-24 rounded bg-white/[0.06]" />
        <div className="h-5 w-3/4 rounded bg-white/[0.06]" />
        <div className="h-4 w-full rounded bg-white/[0.04]" />
        <div className="h-4 w-2/3 rounded bg-white/[0.04]" />
        <div className="flex gap-2 pt-2">
          <div className="h-5 w-14 rounded-md bg-white/[0.06]" />
          <div className="h-5 w-16 rounded-md bg-white/[0.06]" />
        </div>
      </div>
    </div>
  );
}

/* ─── Blog card ─── */
function BlogCard({ blog, index }: { blog: Blog; index: number }) {
  const coverGradients = [
    "from-indigo-500/20 via-violet-500/20 to-cyan-500/20",
    "from-cyan-500/20 via-blue-500/20 to-indigo-500/20",
    "from-violet-500/20 via-indigo-500/20 to-cyan-500/20",
    "from-emerald-500/20 via-cyan-500/20 to-blue-500/20",
    "from-rose-500/20 via-violet-500/20 to-indigo-500/20",
  ];
  const gradient = coverGradients[index % coverGradients.length];
  const initials = blog.title
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link href={`/blog/${blog.slug}`} className="block group">
        <GlowCard glowSize={320} glowColor="rgba(79,70,229,0.10)">
          {/* Cover image */}
          <BlogCoverImage gradient={gradient} initials={initials} blogId={blog.id} />

          <div className="p-6">
            {/* Meta row */}
            <div className="flex items-center gap-3 text-xs text-white/30 font-body mb-3">
              <span>{formatDate(blog.created_at)}</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {blog.read_time} min read
              </span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {blog.views}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-lg md:text-xl font-heading font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors duration-300">
              {blog.title}
            </h3>

            {/* Excerpt */}
            {blog.excerpt && (
              <p className="text-sm text-white/40 font-body leading-relaxed line-clamp-2 mb-4">
                {blog.excerpt}
              </p>
            )}

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {blog.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-body font-medium
                      bg-gradient-to-r ${getTagGradient(tag)} text-white/50`}
                  >
                    {tag}
                  </span>
                ))}
                {blog.tags.length > 3 && (
                  <span className="inline-flex px-2.5 py-1 rounded-md text-[10px] font-body font-medium bg-white/[0.04] text-white/30">
                    +{blog.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </GlowCard>
      </Link>
    </motion.div>
  );
}

/* ─── Tag filter pill ─── */
function TagPill({ tag, active, onClick }: { tag: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-xs font-body font-medium transition-all duration-300 ${
        active
          ? "bg-gradient-accent text-white shadow-lg shadow-indigo-500/20"
          : "bg-white/[0.04] border border-white/[0.08] text-white/40 hover:text-white/70 hover:bg-white/[0.06]"
      }`}
    >
      {tag}
    </button>
  );
}

/* ─── Main blog listing page ─── */
export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.05 });

  // All unique tags from fetched blogs
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    blogs.forEach((b) => b.tags?.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [blogs]);

  // Filtered blogs
  const filteredBlogs = useMemo(
    () => (activeTag ? blogs.filter((b) => b.tags?.includes(activeTag)) : blogs),
    [blogs, activeTag]
  );

  // Set page title
  useEffect(() => {
    document.title = "Blog | Portfolio";
  }, []);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch("/api/blogs?limit=50");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (data.blogs) setBlogs(data.blogs);
      } catch (err) {
        console.error("Failed to load blogs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  return (
    <main className="min-h-screen pt-32 pb-24">
      {/* ─── Page heading ─── */}
      <section className="px-6 md:px-12 lg:px-24 mb-16">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium font-body bg-white/5 border border-white/[0.08] text-white/50 tracking-wider uppercase mb-6">
            Journal
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight tracking-tight mb-4">
            Thoughts &amp;{" "}
            <GradientText animate>Writings</GradientText>
          </h1>
          {/* Gradient underline */}
          <div className="mx-auto mt-6 w-24 h-1 rounded-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-violet-500 opacity-60" />
          <p className="mt-6 text-base md:text-lg text-white/30 font-body max-w-lg mx-auto">
            Exploring ideas at the intersection of design, engineering, and creative technology.
          </p>
        </motion.div>
      </section>

      {/* ─── Tag filters ─── */}
      {!loading && allTags.length > 0 && (
        <section className="px-6 md:px-12 lg:px-24 mb-12">
          <motion.div
            className="max-w-5xl mx-auto flex flex-wrap justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <TagPill tag="All" active={activeTag === null} onClick={() => setActiveTag(null)} />
            {allTags.map((tag) => (
              <TagPill
                key={tag}
                tag={tag}
                active={activeTag === tag}
                onClick={() => setActiveTag(tag)}
              />
            ))}
          </motion.div>
        </section>
      )}

      {/* ─── Blog grid ─── */}
      <section ref={ref as React.RefObject<HTMLElement>} className="px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {[1, 2, 3, 4].map((i) => (
                <BlogCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredBlogs.length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <p className="text-white/40 font-body text-lg">
                {activeTag ? `No posts tagged "${activeTag}" yet.` : "No blog posts yet."}
              </p>
              <p className="text-white/20 font-body text-sm mt-2">
                {activeTag ? "Try a different filter." : "Check back soon for new content."}
              </p>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTag || "all"}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {filteredBlogs.map((blog, i) => (
                  <BlogCard key={blog.id} blog={blog} index={i} />
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Count */}
          {!loading && filteredBlogs.length > 0 && (
            <motion.p
              className="text-center mt-12 text-xs text-white/20 font-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Showing {filteredBlogs.length} of {blogs.length} posts
            </motion.p>
          )}
        </div>
      </section>
    </main>
  );
}
