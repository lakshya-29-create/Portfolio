export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      blogs: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string;
          cover_image_url: string | null;
          tags: string[];
          read_time: number;
          is_published: boolean;
          views: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content: string;
          cover_image_url?: string | null;
          tags?: string[];
          read_time?: number;
          is_published?: boolean;
          views?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string | null;
          content?: string;
          cover_image_url?: string | null;
          tags?: string[];
          read_time?: number;
          is_published?: boolean;
          views?: number;
          created_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          tech_stack: string[];
          live_url: string | null;
          github_url: string | null;
          cover_image_url: string | null;
          is_featured: boolean;
          category: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          tech_stack?: string[];
          live_url?: string | null;
          github_url?: string | null;
          cover_image_url?: string | null;
          is_featured?: boolean;
          category?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          tech_stack?: string[];
          live_url?: string | null;
          github_url?: string | null;
          cover_image_url?: string | null;
          is_featured?: boolean;
          category?: string | null;
          created_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          message?: string;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {
      increment_views: {
        Args: { blog_slug: string };
        Returns: void;
      };
    };
    Enums: {};
  };
}
