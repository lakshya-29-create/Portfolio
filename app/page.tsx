"use client";

import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import SkillsShowcase from "@/components/sections/SkillsShowcase";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import CTASection from "@/components/sections/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <SkillsShowcase />
      <FeaturedProjects />
      <CTASection />
    </>
  );
}
