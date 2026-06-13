import { createClient } from "@supabase/supabase-js";
import type { Metadata } from "next";
import BlogPostClient from "./BlogPostClient";
import type { Blog } from "@/types";

// Ensure per-request rendering on every visit (views increment must work in prod)
export const dynamic = "force-dynamic";

/* ─── Fetch blog post on server ─── */
async function fetchBlog(slug: string): Promise<{ blog: Blog | null; error: string | null }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return { blog: null, error: "Server configuration error" };
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return { blog: null, error: "Post not found" };
    }
    console.error("Supabase blog fetch error:", error);
    return { blog: null, error: "Failed to load post" };
  }

  return { blog: data as Blog, error: null };
}

/* ─── Generate dynamic metadata ─── */
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const { blog } = await fetchBlog(slug);

  if (!blog) {
    return {
      title: "Post Not Found | Portfolio",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: `${blog.title} | Portfolio`,
    description: blog.excerpt || `${blog.title} — Read more on Portfolio`,
    openGraph: {
      title: blog.title,
      description: blog.excerpt || `${blog.title} — A blog post on Portfolio`,
      type: "article",
      publishedTime: blog.created_at,
      tags: blog.tags,
      siteName: "Portfolio",
      images: blog.cover_image_url
        ? [{ url: blog.cover_image_url, width: 1200, height: 630 }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt || undefined,
      images: blog.cover_image_url ? [blog.cover_image_url] : undefined,
    },
  };
}

/* ─── Server component page ─── */
export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { blog, error } = await fetchBlog(slug);

  // Increment views server-side (fire-and-forget after successful fetch)
  if (blog) {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (supabaseUrl && supabaseAnonKey) {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        void supabase.rpc("increment_views", { blog_slug: slug });
      }
    } catch {
      // Silent — view increment is non-critical
    }
  }

  // Error / not found — render inline since we can't redirect easily
  if (error || !blog) {
    return (
      <main className="min-h-screen pt-32 pb-24">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-6">
            <svg className="w-7 h-7 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-heading font-bold text-white mb-2">
            {error || "Post not found"}
          </h2>
          <p className="text-white/40 font-body mb-8">
            The blog post you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <a
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/80 font-body font-medium text-sm hover:bg-white/10 hover:text-white transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m7-7l-7 7 7 7" />
            </svg>
            Back to Blog
          </a>
        </div>
      </main>
    );
  }

  return <BlogPostClient blog={blog} slug={slug} />;
}
