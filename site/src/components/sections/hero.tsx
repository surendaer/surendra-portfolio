"use client";
import { config } from "@/data/config";
import { motion } from "framer-motion";
import { ArrowDown, Mail } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" } }),
};

export default function HeroSection() {
  return (
    <section className="relative min-h-screen grid md:grid-cols-2 px-6 md:px-0">
      <div className="col-span-1 flex flex-col justify-center pt-28 pb-20 md:pl-20 lg:pl-28 pr-4 md:pr-10 gap-6 max-w-2xl w-full">

        {/* City trail — from portfolio-references.md: strike through cities left */}
        <motion.div
          variants={fadeUp} custom={0} initial="hidden" animate="show"
          className="font-mono text-xs text-muted-foreground flex items-center gap-2 [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]"
        >
          {config.cities.map((c, i) => (
            <span key={c.name} className="flex items-center gap-2">
              {i > 0 && <span className="text-border">→</span>}
              <span className={c.active ? "text-foreground" : "line-through opacity-40"}>
                {c.name}
              </span>
            </span>
          ))}
          <span className="ml-2 text-border">·</span>
          <span className="text-blue-400">Open to EMEA</span>
        </motion.div>

        {/* Name */}
        <motion.h1
          variants={fadeUp} custom={1} initial="hidden" animate="show"
          className="text-5xl md:text-7xl font-bold tracking-tight [text-shadow:0_2px_20px_rgba(0,0,0,0.4)]"
        >
          Surendra<br />
          <span className="text-foreground/70 font-light">Kumar AR</span>
        </motion.h1>

        {/* Role line */}
        <motion.p
          variants={fadeUp} custom={2} initial="hidden" animate="show"
          className="font-mono text-sm md:text-base text-blue-400 tracking-wide [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]"
        >
          GenAI / ML Infra Architect · Platform Engineering · DevOps
        </motion.p>

        {/* Bio */}
        <motion.p
          variants={fadeUp} custom={3} initial="hidden" animate="show"
          className="text-muted-foreground text-lg max-w-2xl leading-relaxed [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]"
        >
          11 years building platform infrastructure that ships AI and cloud workloads reliably.
          Walmart-scale CI/CD, Kubernetes Operators, GitOps — and AI agents that fix pipelines faster than engineers can context-switch.
          At <strong className="text-foreground">Walmart</strong> and <strong className="text-foreground">IBM</strong>.
        </motion.p>

        {/* Stats */}
        <motion.div
          variants={fadeUp} custom={4} initial="hidden" animate="show"
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-2 border-t border-border/40"
        >
          {[
            { n: "11+",         label: "Years",               sub: "Platform · DevOps · GenAI/ML" },
            { n: "65k/min",     label: "Artifact downloads",  sub: "Peak CI/CD load · Walmart holiday sales" },
            { n: "4 hr → 7 min", label: "DR RTO",             sub: "ArgoCD cross-region recovery" },
            { n: "< 3 min",     label: "Pipeline MTTR",       sub: "AI-driven (was 30–60 min)" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col gap-0.5 pt-4">
              <span className="text-xl font-bold font-mono text-foreground">{s.n}</span>
              <span className="text-sm font-medium">{s.label}</span>
              <span className="text-xs text-muted-foreground leading-snug">{s.sub}</span>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          variants={fadeUp} custom={5} initial="hidden" animate="show"
          className="flex flex-col sm:flex-row gap-4 pt-4"
        >
          {/* Primary CTA — contact. Per portfolio-references: make it big and obvious */}
          <a
            href="#contact"
            className="relative group inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-all"
          >
            <Mail className="w-4 h-4" />
            Get in touch
            {/* Shine ring effect */}
            <span className="absolute inset-0 rounded-lg ring-2 ring-foreground/20 group-hover:ring-foreground/40 transition-all" />
          </a>
          <a
            href="#work"
            className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-lg text-sm hover:bg-accent transition-colors"
          >
            View Work / ADRs
          </a>
          <a
            href={config.resume.consolidated}
            download
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowDown className="w-4 h-4" />
            Resume
          </a>
        </motion.div>
      {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="flex items-center gap-2 mt-2"
        >
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
            <ArrowDown className="w-3 h-3 text-muted-foreground" />
          </motion.div>
        </motion.div>
      </div>
      {/* Right column: empty — pipeline background shows through */}
      <div className="hidden md:block col-span-1 h-full" />
    </section>
  );
}
