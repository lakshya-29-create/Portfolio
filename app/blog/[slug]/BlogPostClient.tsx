"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import GlowCard from "@/components/ui/GlowCard";
import MagneticButton from "@/components/ui/MagneticButton";
import type { Blog } from "@/types";

/* ═══════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════ */

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

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
}

const coverGradients = [
  "from-indigo-500/30 via-violet-500/30 to-cyan-500/30",
  "from-cyan-500/30 via-blue-500/30 to-indigo-500/30",
  "from-violet-500/30 via-indigo-500/30 to-cyan-500/30",
  "from-emerald-500/30 via-cyan-500/30 to-blue-500/30",
  "from-rose-500/30 via-violet-500/30 to-indigo-500/30",
];

function gradientIndex(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = slug.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash) % coverGradients.length;
}

function extractHeadings(markdown: string): { id: string; text: string; level: number }[] {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  const headings: { id: string; text: string; level: number }[] = [];
  let match;
  while ((match = headingRegex.exec(markdown)) !== null) {
    const text = match[2].trim();
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    headings.push({ id, text, level: match[1].length });
  }
  return headings;
}

function extractTextFromChildren(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(extractTextFromChildren).join("");
  if (children && typeof children === "object" && "props" in children)
    return extractTextFromChildren((children as any).props.children);
  return "";
}

function createHeadingComponent(level: number) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return function HeadingWithId({ children, ...props }: any) {
    const text = extractTextFromChildren(children);
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return <Tag id={id} {...props}>{children}</Tag>;
  };
}

/* ═══════════════════════════════════════════
   Toast
   ═══════════════════════════════════════════ */
function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <div className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] backdrop-blur-xl shadow-2xl">
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm text-white/80 font-body">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════
   Reading progress bar
   ═══════════════════════════════════════════ */
function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) setProgress(Math.min((scrollTop / docHeight) * 100, 100));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-white/[0.04]">
      <motion.div className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-violet-500" style={{ width: `${progress}%` }} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   Table of Contents
   ═══════════════════════════════════════════ */
function TableOfContents({ headings, activeId }: { headings: { id: string; text: string; level: number }[]; activeId: string | null }) {
  if (headings.length === 0) return null;
  return (
    <nav className="sticky top-32 space-y-1">
      <h4 className="text-[11px] font-body font-medium uppercase tracking-[0.2em] text-white/20 mb-4">On this page</h4>
      {headings.map((h) => (
        <a
          key={h.id}
          href={`#${h.id}`}
          onClick={(e) => { e.preventDefault(); document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" }); }}
          className={`block text-xs font-body leading-relaxed transition-all duration-300 ${
            h.level === 2 ? "pl-0" : h.level === 3 ? "pl-4" : "pl-8"
          } ${activeId === h.id ? "text-indigo-400 font-medium" : "text-white/25 hover:text-white/50"}`}
        >
          {h.text}
        </a>
      ))}
    </nav>
  );
}

/* ═══════════════════════════════════════════
   Cover hero
   ═══════════════════════════════════════════ */
function CoverHero({ blog, gIndex }: { blog: Blog; gIndex: number }) {
  const gradient = coverGradients[gIndex];
  return (
    <div className="relative h-[45vh] min-h-[320px] md:min-h-[420px] overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} scale-110 blur-3xl`} />
      <div className="absolute inset-0 bg-gradient-to-b from-matte/60 via-matte/40 to-matte" />
      <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
        <defs><pattern id="hero-dots" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="16" cy="16" r="1" fill="white" /></pattern></defs>
        <rect width="100%" height="100%" fill="url(#hero-dots)" />
      </svg>
      <motion.div className="absolute w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-[100px]"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ top: "10%", left: "5%" }} />
      <motion.div className="absolute w-[300px] h-[300px] rounded-full bg-cyan-500/8 blur-[80px]"
        animate={{ x: [0, -20, 0], y: [0, 25, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{ bottom: "20%", right: "10%" }} />
      <div className="absolute inset-0 flex items-end">
        <div className="w-full max-w-4xl mx-auto px-6 pb-12 md:pb-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {blog.tags.map((tag) => (
                  <span key={tag} className={`inline-flex px-3 py-1 rounded-full text-[11px] font-body font-medium bg-gradient-to-r ${getTagGradient(tag)} text-white/70 backdrop-blur-sm`}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight tracking-tight text-white">{blog.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-white/40 font-body">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center text-[11px] font-heading font-bold text-white">AC</div>
                <span className="text-white/60">Alex Chen</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                {formatDate(blog.created_at)}
              </span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {blog.read_time} min read
              </span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                {blog.views} views
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Share buttons
   ═══════════════════════════════════════════ */
function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}/blog/${slug}` : `/blog/${slug}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: "Twitter",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />,
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />,
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch { /* fallback */ }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-white/20 font-body mr-1">Share</span>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center
            hover:bg-white/[0.08] hover:border-indigo-500/30 transition-all duration-300 group"
          aria-label={`Share on ${link.name}`}
        >
          <svg className="w-4 h-4 text-white/40 group-hover:text-indigo-400 transition-colors duration-300" viewBox="0 0 24 24" fill="currentColor">
            {link.icon}
          </svg>
        </a>
      ))}
      <button
        onClick={handleCopyLink}
        className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center
          hover:bg-white/[0.08] hover:border-indigo-500/30 transition-all duration-300 group relative"
        aria-label="Copy link"
      >
        <svg className={`w-4 h-4 transition-colors duration-300 ${copied ? "text-emerald-400" : "text-white/40 group-hover:text-indigo-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {copied ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          ) : (
            <>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </>
          )}
        </svg>
      </button>
      <Toast message="Link copied to clipboard!" visible={copied} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   Related blogs
   ═══════════════════════════════════════════ */
function RelatedBlogs({ currentId, tags }: { currentId: string; tags: string[] }) {
  const [related, setRelated] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tags || tags.length === 0) { setLoading(false); return; }
    async function fetchRelated() {
      try {
        const res = await fetch(`/api/blogs?limit=3&tag=${encodeURIComponent(tags[0])}`);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        // Exclude current post and limit to 2
        setRelated((data.blogs || []).filter((b: Blog) => b.id !== currentId).slice(0, 2));
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchRelated();
  }, [currentId, tags]);

  if (loading) return null;
  if (related.length === 0) return null;

  return (
    <div className="mt-12 pt-10 border-t border-white/[0.06]">
      <h3 className="text-lg font-heading font-bold text-white mb-6">Continue Reading</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {related.map((blog) => (
          <Link key={blog.id} href={`/blog/${blog.slug}`} className="group">
            <GlowCard glowSize={250} glowColor="rgba(79,70,229,0.08)">
              <div className="p-5">
                <div className="flex items-center gap-2 text-[11px] text-white/30 font-body mb-2">
                  <span>{formatDate(blog.created_at)}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span>{blog.read_time} min read</span>
                </div>
                <h4 className="text-base font-heading font-bold text-white mb-1.5 group-hover:text-indigo-300 transition-colors duration-300">
                  {blog.title}
                </h4>
                {blog.excerpt && (
                  <p className="text-xs text-white/40 font-body leading-relaxed line-clamp-2">{blog.excerpt}</p>
                )}
              </div>
            </GlowCard>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Main client component
   ═══════════════════════════════════════════ */
export default function BlogPostClient({ blog, slug }: { blog: Blog; slug: string }) {
  const [activeHeading, setActiveHeading] = useState<string | null>(null);

  // Set page title + OG tags client-side as fallback
  useEffect(() => {
    document.title = `${blog.title} | Portfolio`;
  }, [blog]);

  // Extract headings
  const headings = useMemo(() => extractHeadings(blog.content), [blog]);

  // Active heading tracking
  const handleScroll = useCallback(() => {
    if (headings.length === 0) return;
    let current = headings[0].id;
    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top < 200) current = h.id;
      }
    }
    setActiveHeading(current);
  }, [headings]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const gIdx = gradientIndex(slug);

  return (
    <>
      <ReadingProgress />

      <main className="min-h-screen bg-matte">
        <CoverHero blog={blog} gIndex={gIdx} />

        <div className="max-w-6xl mx-auto px-6 -mt-8 relative z-10">
          <div className="flex gap-12 lg:gap-16">
            {/* ToC sidebar */}
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <div className="pt-8">
                <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs text-white/25 font-body hover:text-indigo-400 transition-colors duration-300 mb-8">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 12H5m7-7l-7 7 7 7" /></svg>
                  Back
                </Link>
                <TableOfContents headings={headings} activeId={activeHeading} />
              </div>
            </aside>

            <article className="flex-1 min-w-0">
              <div className="lg:hidden mb-6">
                <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs text-white/30 font-body hover:text-indigo-400 transition-colors duration-300">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 12H5m7-7l-7 7 7 7" /></svg>
                  Back to all posts
                </Link>
              </div>

              {/* Content */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="prose-custom">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      h2: createHeadingComponent(2),
                      h3: createHeadingComponent(3),
                      h4: createHeadingComponent(4),
                    }}
                  >
                    {blog.content}
                  </ReactMarkdown>
                </div>
              </motion.div>

              {/* ─── Share buttons row ─── */}
              <div className="mt-10 flex items-center justify-between">
                <ShareButtons title={blog.title} slug={slug} />
              </div>

              {/* ─── Related blogs ─── */}
              <RelatedBlogs currentId={blog.id} tags={blog.tags} />

              {/* ─── Footer ─── */}
              <div className="mt-12 pt-10 border-t border-white/[0.06]">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-white/30 font-body">Thanks for reading!</p>
                  <div className="flex gap-3">
                    <MagneticButton variant="secondary" size="sm" href="/blog">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m7-7l-7 7 7 7" /></svg>
                      All Posts
                    </MagneticButton>
                    <MagneticButton variant="primary" size="sm" href="/contact">Share Your Thoughts</MagneticButton>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </main>
    </>
  );
}
