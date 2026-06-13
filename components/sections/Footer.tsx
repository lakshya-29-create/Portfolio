"use client";

import Link from "next/link";
import { siteConfig } from "@/content/site";
import GradientText from "@/components/ui/GradientText";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/[0.06]">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-accent-horizontal opacity-30" />

      <div className="max-width-container px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <GradientText as="span" className="text-xl font-heading font-bold">
              Portfolio
            </GradientText>
            <p className="mt-3 text-sm text-white/40 font-body max-w-xs leading-relaxed">
              Building the future of the web, one pixel at a time.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-medium text-white/60 font-body uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-3">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/40 hover:text-white/80 transition-colors duration-300 font-body"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-medium text-white/60 font-body uppercase tracking-wider mb-4">
              Connect
            </h4>
            <div className="flex flex-wrap gap-3">
              {siteConfig.social.map((social) => (
                <Link
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-white hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300 text-sm font-body"
                >
                  <span className="w-4 h-4 rounded-full bg-gradient-accent opacity-60 group-hover:opacity-100 transition-opacity" />
                  {social.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30 font-body">
            &copy; {currentYear} Portfolio. All rights reserved.
          </p>
          <p className="text-xs text-white/20 font-body">
            Designed &amp; built by{" "}
            <span className="text-white/40">Alex Chen</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
