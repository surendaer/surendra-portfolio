"use client";
import { config } from "@/data/config";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#work",     label: "Work / ADRs" },
  { href: "#projects", label: "Projects" },
  { href: "#skills",   label: "Skills" },
  { href: "#news",     label: "News" },
  { href: "#contact",  label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/8 bg-background/70 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-[56px] flex items-center justify-between">
        <Link href="/" className="font-mono text-sm font-semibold tracking-tight min-h-[44px] flex items-center">
          thesurendra.com
        </Link>
        {/* Desktop nav — 44px touch targets via min-h */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {links.map((l) => (
            <a
              key={l.href} href={l.href}
              className="min-h-[44px] min-w-[44px] px-4 flex items-center text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-all duration-200"
            >
              {l.label}
            </a>
          ))}
          <a
            href={config.resume.consolidated} download
            className="min-h-[44px] ml-2 px-4 flex items-center text-sm font-medium border border-white/15 rounded-lg hover:bg-white/8 hover:border-white/25 transition-all duration-200"
            aria-label="Download resume"
          >
            Resume ↓
          </a>
        </nav>
        {/* Mobile menu toggle — 44×44px minimum */}
        <button
          className="md:hidden w-11 h-11 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/8 bg-background/90 backdrop-blur-md px-6 py-3 flex flex-col">
          {links.map((l) => (
            <a
              key={l.href} href={l.href}
              onClick={() => setOpen(false)}
              className="min-h-[44px] flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href={config.resume.consolidated} download
            className="min-h-[44px] flex items-center text-sm font-medium"
          >
            Resume ↓
          </a>
        </div>
      )}
    </header>
  );
}
