import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { slug } = params;

    // Fetch the blog post
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Blog post not found" },
          { status: 404 }
        );
      }
      console.error("Supabase blog fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch blog post" },
        { status: 500 }
      );
    }

    // Increment views asynchronously (fire-and-forget)
    void supabase.rpc("increment_views", { blog_slug: slug });

    return NextResponse.json({ blog: data });
  } catch (err) {
    console.error("Blog API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
