"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, RefreshCw } from "lucide-react";

type Article = {
  title: string;
  link: string;
  published: string;
  source: string;
  tags: string[];
};

export default function NewsSection() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetch("/data/news.json")
      .then((r) => r.json())
      .then((d) => {
        setArticles(d.articles ?? []);
        setLastUpdated(d.generated_at ?? "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const allTags = Array.from(new Set(articles.flatMap((a) => a.tags ?? [])));
  const filtered = filter === "all" ? articles : articles.filter((a) => a.tags?.includes(filter));

  return (
    <section id="news" className="relative min-h-[70vh] py-24 px-6 flex flex-col justify-center">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <span className="font-mono text-xs text-blue-400 uppercase tracking-widest">Daily Digest</span>
            <h2 className="text-3xl font-bold mt-2">Platform & AI signal</h2>
          </div>
          {lastUpdated && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <RefreshCw className="w-3 h-3" />
              Updated {lastUpdated}
            </div>
          )}
        </div>

        {/* Tag filter */}
        {allTags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`font-mono text-xs px-3 py-1 rounded-full border transition-colors ${
                filter === "all" ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground/40"
              }`}
            >
              all
            </button>
            {allTags.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`font-mono text-xs px-3 py-1 rounded-full border transition-colors ${
                  filter === t ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground/40"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-36 rounded-xl border border-border bg-card animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="mt-12 text-muted-foreground text-sm">No articles found. News is refreshed daily via CI.</p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a, i) => (
              <motion.a
                key={a.link}
                href={a.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="group border border-white/10 rounded-2xl p-6 bg-background/25 backdrop-blur-md hover:border-white/20 hover:bg-background/40 transition-all duration-300 flex flex-col gap-3 shadow-lg shadow-black/20"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium leading-snug group-hover:text-blue-400 transition-colors line-clamp-3">
                    {a.title}
                  </p>
                  <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex items-center justify-between mt-auto pt-2">
                  <span className="font-mono text-xs text-muted-foreground">{a.source}</span>
                  <span className="font-mono text-xs text-muted-foreground">{a.published}</span>
                </div>
                {a.tags && a.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {a.tags.slice(0, 3).map((t) => (
                      <span key={t} className="font-mono text-xs bg-muted px-2 py-0.5 rounded">{t}</span>
                    ))}
                  </div>
                )}
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
