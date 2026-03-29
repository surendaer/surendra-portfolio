"use client";
import { projects } from "@/data/projects";
import { motion } from "framer-motion";
import { GitBranch, ArrowUpRight } from "lucide-react";

export default function ProjectsSection() {
  return (
    <section id="projects" className="relative min-h-[85vh] py-24 px-6 flex flex-col justify-center">
      <div className="max-w-6xl mx-auto">
        <div>
          <span className="font-mono text-xs text-blue-400 uppercase tracking-widest">Projects</span>
          <h2 className="text-3xl font-bold mt-2">Open-source & demo repos</h2>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <motion.a
              key={p.name}
              href={p.gitlabUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group border border-white/10 rounded-2xl p-6 hover:border-white/20 hover:bg-background/40 bg-background/25 backdrop-blur-md flex flex-col gap-3 transition-all duration-300 shadow-lg shadow-black/20"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-muted-foreground" />
                  <span className="font-mono text-sm font-semibold group-hover:text-blue-400 transition-colors">
                    {p.name}
                  </span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                {p.description}
              </p>

              <div className="flex items-center justify-between pt-2">
                <span className="font-mono text-xs text-muted-foreground">{p.language}</span>
                <div className="flex flex-wrap gap-1">
                  {p.tags.map((t) => (
                    <span key={t} className="font-mono text-xs bg-muted px-2 py-0.5 rounded">{t}</span>
                  ))}
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
