import { type SiteConfig, type Project, type Skill } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Lakshya Tak",
  title: "Full Stack Developer & Creative Technologist",
  description:
    "Lakshya Tak — a full-stack developer and creative technologist building vibrant, performant digital experiences with cutting-edge web technologies.",
  url: "https://lakshyatak.dev",
  ogImage: "/og.jpg",
  nav: [
    { label: "Home",    href: "/" },
    { label: "Work",    href: "/#work" },
    { label: "Blog",    href: "/blog" },
    { label: "About",   href: "/#about" },
    { label: "Contact", href: "/contact" },
  ],
  social: [
    {
      name: "GitHub",
      url:  "https://github.com/lakshyatak",
      icon: "github",
    },
    {
      name: "Twitter",
      url:  "https://twitter.com/lakshyatak",
      icon: "twitter",
    },
    {
      name: "LinkedIn",
      url:  "https://linkedin.com/in/lakshyatak",
      icon: "linkedin",
    },
    {
      name: "Dribbble",
      url:  "https://dribbble.com/lakshyatak",
      icon: "dribbble",
    },
  ],
};

export const projects: Project[] = [
  {
    id: "1",
    title: "Aurora UI Kit",
    description:
      "A vibrant, fully-typed React component library powered by Framer Motion and Radix primitives — zero config, maximum expressiveness.",
    tech_stack: ["React", "TypeScript", "Framer Motion", "Radix UI"],
    cover_image_url: "/projects/aurora.jpg",
    live_url: "https://auroraui.dev",
    github_url: "https://github.com/lakshyatak/aurora-ui",
    is_featured: true,
    category: "Open Source",
    created_at: "2025-01-15T00:00:00Z",
  },
  {
    id: "2",
    title: "FlowBoard",
    description:
      "Real-time collaborative kanban built with Next.js, Supabase Realtime, and optimistic UI — task management that feels alive.",
    tech_stack: ["Next.js", "Supabase", "TypeScript", "Tailwind CSS"],
    cover_image_url: "/projects/flowboard.jpg",
    live_url: "https://flowboard.app",
    github_url: "https://github.com/lakshyatak/flowboard",
    is_featured: true,
    category: "Web App",
    created_at: "2025-03-20T00:00:00Z",
  },
  {
    id: "3",
    title: "Pixel Commerce",
    description:
      "Next-gen headless e-commerce storefront with 3D product previews, AI-powered recommendations, and sub-100ms page loads.",
    tech_stack: ["Next.js", "Three.js", "Stripe", "Sanity CMS"],
    cover_image_url: "/projects/pixel-commerce.jpg",
    live_url: "https://pixelcommerce.shop",
    github_url: null,
    is_featured: true,
    category: "E-Commerce",
    created_at: "2025-05-10T00:00:00Z",
  },
  {
    id: "4",
    title: "DevMetrics",
    description:
      "Open-source GitHub analytics dashboard visualizing contribution heatmaps, PR velocity, and code churn over time.",
    tech_stack: ["Python", "FastAPI", "React", "D3.js"],
    cover_image_url: "/projects/devmetrics.jpg",
    live_url: null,
    github_url: "https://github.com/lakshyatak/devmetrics",
    is_featured: false,
    category: "Data",
    created_at: "2025-07-05T00:00:00Z",
  },
];

export const bio = {
  greeting: "Hi, I'm Lakshya",
  paragraphs: [
    "A full-stack developer and creative technologist passionate about crafting immersive, vibrant digital experiences. I thrive at the intersection of design thinking and engineering excellence — building products that are both beautiful and blazingly fast.",
    "I love open-source, believe great UX is a superpower, and am always exploring the bleeding edge of web technology. Whether it's shipping side projects at midnight or collaborating on ambitious products, I bring creative energy to everything I build.",
  ],
};

export const skills: Skill[] = [
  // Frontend
  { name: "React / Next.js",  category: "Frontend",  level: 95, icon: "react" },
  { name: "TypeScript",       category: "Frontend",  level: 90, icon: "typescript" },
  { name: "Tailwind CSS",     category: "Frontend",  level: 93, icon: "tailwind" },
  { name: "Framer Motion",    category: "Frontend",  level: 88, icon: "motion" },
  { name: "Three.js / WebGL", category: "Frontend",  level: 70, icon: "three" },
  { name: "HTML / CSS",       category: "Frontend",  level: 96, icon: "html" },
  // Backend
  { name: "Node.js",          category: "Backend",   level: 88, icon: "nodejs" },
  { name: "Python / FastAPI", category: "Backend",   level: 80, icon: "python" },
  { name: "GraphQL",          category: "Backend",   level: 75, icon: "graphql" },
  { name: "REST APIs",        category: "Backend",   level: 92, icon: "api" },
  { name: "Supabase",         category: "Backend",   level: 85, icon: "supabase" },
  { name: "Auth / JWT",       category: "Backend",   level: 82, icon: "auth" },
  // Database
  { name: "PostgreSQL",       category: "Database",  level: 83, icon: "postgres" },
  { name: "Redis",            category: "Database",  level: 70, icon: "redis" },
  { name: "MongoDB",          category: "Database",  level: 72, icon: "mongodb" },
  { name: "Prisma ORM",       category: "Database",  level: 80, icon: "prisma" },
  // Tools & DevOps
  { name: "Docker",           category: "Tools",     level: 74, icon: "docker" },
  { name: "Git / GitHub",     category: "Tools",     level: 92, icon: "git" },
  { name: "Figma",            category: "Tools",     level: 86, icon: "figma" },
  { name: "Vercel / Netlify", category: "Tools",     level: 82, icon: "vercel" },
];

