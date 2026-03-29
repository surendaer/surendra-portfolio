"use client";
import { workItems, type WorkItem } from "@/data/work";
import { motion } from "framer-motion";

export default function WorkSection() {
  const featured = workItems.filter((w) => w.featured);
  const rest = workItems.filter((w) => !w.featured);

  return (
    <section id="work" className="relative min-h-[85vh] py-24 px-6 flex flex-col justify-center">
      <div className="max-w-6xl mx-auto">
        <SectionHeader label="Work / ADRs" title="Engineering outcomes that moved the needle" />

        {/* Featured cards — metrics visible without clicking (per portfolio-references.md) */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((item, i) => (
            <FeaturedCard key={item.slug} item={item} index={i} />
          ))}
        </div>

        {/* Non-featured — compact list (placeholders included) */}
        {rest.length > 0 && (
          <div className="mt-8 border border-border rounded-xl divide-y divide-border">
            {rest.map((item) => (
              <div
                key={item.slug}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 hover:bg-accent/50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <span className="font-semibold text-sm">{item.title}</span>
                  <span className="text-muted-foreground text-xs">{item.company} · {item.period}</span>
                  {item.placeholder && (
                    <span className="font-mono text-xs text-amber-500/70 border border-amber-500/30 px-2 py-0.5 rounded w-fit">
                      details coming
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((t) => (
                    <span key={t} className="font-mono text-xs bg-muted px-2 py-0.5 rounded">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FeaturedCard({ item, index }: { item: WorkItem; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group border border-white/10 rounded-2xl p-7 hover:border-white/20 hover:bg-background/40 transition-all duration-300 bg-background/25 backdrop-blur-md flex flex-col gap-4 shadow-lg shadow-black/20"
    >
      {/* Company · Period */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-muted-foreground">{item.company}</span>
        <span className="font-mono text-xs text-muted-foreground">{item.period}</span>
      </div>

      {/* Title */}
      <div>
        <h3 className="font-semibold text-lg leading-snug group-hover:text-blue-400 transition-colors">
          {item.title}
        </h3>
        <p className="text-muted-foreground text-sm mt-1">{item.subtitle}</p>
      </div>

      {/* Metrics or placeholder state */}
      {item.placeholder ? (
        <div className="mt-auto flex flex-col gap-2 py-4 border border-dashed border-border rounded-lg items-center justify-center">
          <span className="font-mono text-xs text-amber-500/70">Case study in progress</span>
          <span className="text-xs text-muted-foreground">Details will be added shortly</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 mt-auto">
          {item.results.slice(0, 4).map((r) => (
            <div key={r.label} className="flex flex-col">
              <span className="font-mono text-sm font-bold text-blue-400">{r.metric}</span>
              <span className="text-xs text-muted-foreground mt-0.5 leading-tight">{r.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 pt-2">
        {item.tags.map((t) => (
          <span key={t} className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
            {t}
          </span>
        ))}
      </div>
    </motion.article>
  );
}

function SectionHeader({ label, title }: { label: string; title: string }) {
  return (
    <div>
      <span className="font-mono text-xs text-blue-400 uppercase tracking-widest">{label}</span>
      <h2 className="text-3xl font-bold mt-2">{title}</h2>
    </div>
  );
}
