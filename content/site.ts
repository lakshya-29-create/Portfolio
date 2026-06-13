import { type SiteConfig, type Project, type Skill } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Portfolio",
  title: "Creative Developer & Designer",
  description:
    "A futuristic portfolio showcasing creative development work with cutting-edge web technologies.",
  url: "https://portfolio.dev",
  ogImage: "/og.jpg",
  nav: [
    { label: "Home", href: "/" },
    { label: "Work", href: "/#work" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/contact" },
  ],
  social: [
    {
      name: "GitHub",
      url: "https://github.com",
      icon: "github",
    },
    {
      name: "Twitter",
      url: "https://twitter.com",
      icon: "twitter",
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com",
      icon: "linkedin",
    },
    {
      name: "Dribbble",
      url: "https://dribbble.com",
      icon: "dribbble",
    },
  ],
};

export const projects: Project[] = [
  {
    id: "1",
    title: "Nebula Dashboard",
    description:
      "A real-time analytics dashboard with stunning data visualizations and AI-powered insights.",
    tech_stack: ["Next.js", "D3.js", "AI", "PostgreSQL"],
    cover_image_url: "/projects/nebula.jpg",
    live_url: "https://example.com",
    github_url: "https://github.com",
    is_featured: true,
    category: "Web App",
    created_at: "2025-01-15T00:00:00Z",
  },
  {
    id: "2",
    title: "Quantum E-Commerce",
    description:
      "Next-gen shopping experience with AR previews, voice search, and blockchain payments.",
    tech_stack: ["React", "Three.js", "Solidity", "Stripe"],
    cover_image_url: "/projects/quantum.jpg",
    live_url: "https://example.com",
    github_url: "https://github.com",
    is_featured: true,
    category: "E-Commerce",
    created_at: "2025-02-20T00:00:00Z",
  },
  {
    id: "3",
    title: "Synthwave Social",
    description:
      "A retro-futuristic social platform with real-time messaging and collaborative spaces.",
    tech_stack: ["Next.js", "Socket.io", "Supabase", "Redis"],
    cover_image_url: "/projects/synthwave.jpg",
    live_url: "https://example.com",
    github_url: null,
    is_featured: true,
    category: "Social",
    created_at: "2025-03-10T00:00:00Z",
  },
  {
    id: "4",
    title: "EcoTrack",
    description:
      "Environmental monitoring platform using IoT sensors and machine learning predictions.",
    tech_stack: ["Python", "TensorFlow", "React", "AWS"],
    cover_image_url: "/projects/eco.jpg",
    live_url: null,
    github_url: "https://github.com",
    is_featured: false,
    category: "Data",
    created_at: "2025-04-05T00:00:00Z",
  },
];

export const bio = {
  greeting: "Hi, I'm Alex",
  paragraphs: [
    "A full-stack developer and designer passionate about crafting immersive digital experiences. With over 5 years of experience, I specialize in building performant web applications that blend creative design with engineering excellence.",
    "I thrive at the intersection of design thinking and technical execution — turning complex problems into elegant, user-centered solutions. Every project is an opportunity to push the boundaries of what's possible on the web.",
  ],
};

export const skills: Skill[] = [
  // Frontend
  { name: "React / Next.js", category: "Frontend", level: 95, icon: "react" },
  { name: "TypeScript", category: "Frontend", level: 90, icon: "typescript" },
  { name: "Tailwind CSS", category: "Frontend", level: 92, icon: "tailwind" },
  { name: "Framer Motion", category: "Frontend", level: 85, icon: "motion" },
  { name: "Three.js", category: "Frontend", level: 70, icon: "three" },
  { name: "HTML / CSS", category: "Frontend", level: 95, icon: "html" },
  // Backend
  { name: "Node.js", category: "Backend", level: 88, icon: "nodejs" },
  { name: "Python", category: "Backend", level: 78, icon: "python" },
  { name: "GraphQL", category: "Backend", level: 75, icon: "graphql" },
  { name: "REST APIs", category: "Backend", level: 90, icon: "api" },
  { name: "Supabase", category: "Backend", level: 80, icon: "supabase" },
  { name: "Auth / JWT", category: "Backend", level: 82, icon: "auth" },
  // Database
  { name: "PostgreSQL", category: "Database", level: 82, icon: "postgres" },
  { name: "Redis", category: "Database", level: 68, icon: "redis" },
  { name: "MongoDB", category: "Database", level: 70, icon: "mongodb" },
  { name: "Prisma", category: "Database", level: 78, icon: "prisma" },
  // Tools
  { name: "Docker", category: "Tools", level: 72, icon: "docker" },
  { name: "Git", category: "Tools", level: 88, icon: "git" },
  { name: "Figma", category: "Tools", level: 85, icon: "figma" },
  { name: "Vercel", category: "Tools", level: 80, icon: "vercel" },
];
