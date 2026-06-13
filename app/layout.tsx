import type { Metadata } from "next";
import PageTransition from "./PageTransition";
import { siteConfig } from "@/content/site";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import CursorFollower from "@/components/ui/CursorFollower";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.title} | ${siteConfig.name}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-matte text-white/90 font-body antialiased">
        <Navbar />
        <PageTransition>{children}</PageTransition>
        <Footer />
        <CursorFollower />
      </body>
    </html>
  );
}
