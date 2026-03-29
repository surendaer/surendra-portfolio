"use client";
import { config } from "@/data/config";
import { motion } from "framer-motion";
import { Mail, Linkedin, GitBranch } from "lucide-react";

export default function ContactSection() {
  return (
    <section id="contact" className="relative min-h-[85vh] py-24 px-6 flex flex-col justify-center">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-6"
        >
          <span className="font-mono text-xs text-blue-400 uppercase tracking-widest">Contact</span>
          <h2 className="text-4xl md:text-5xl font-bold">
            Building something?
            <br />
            <span className="text-muted-foreground font-light">Let&apos;s talk.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl">
            Open to Lead or Architect roles in GenAI / ML Infrastructure, DevOps, and Platform Engineering —
            particularly across EMEA (Dubai, London, Amsterdam, remote). Always happy to compare notes on platform architecture.

          </p>

          {/* Primary CTA — big, obvious, per portfolio-references.md */}
          <motion.a
            href={`mailto:${config.email}`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="relative mt-4 inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 rounded-xl font-semibold text-base transition-all"
          >
            <Mail className="w-5 h-5" />
            {config.email}
            {/* Glow ring */}
            <span className="absolute inset-0 rounded-xl ring-2 ring-foreground/30 animate-pulse" />
          </motion.a>

          {/* Secondary links */}
          <div className="flex items-center gap-6 mt-4">
            <a
              href={config.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
            <a
              href={config.social.gitlab}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <GitBranch className="w-4 h-4" />
              GitLab
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
