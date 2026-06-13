export interface Project {
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
}

export interface Skill {
  name: string;
  category: string;
  level: number;
  icon?: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface Blog {
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
}

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  ogImage: string;
  nav: NavItem[];
  social: SocialLink[];
  blog?: Blog[];
}
