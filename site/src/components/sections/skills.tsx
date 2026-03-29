"use client";
import Image from "next/image";
import { skillGroups, certifications } from "@/data/skills";
import { motion } from "framer-motion";

export default function SkillsSection() {
  return (
    <section id="skills" className="relative min-h-[85vh] py-24 px-6 flex flex-col justify-center">
      <div className="max-w-6xl mx-auto">

        {/* heading */}
        <div>
          <span className="font-mono text-xs text-blue-400 uppercase tracking-widest">Skills</span>
          <h2 className="text-3xl font-bold mt-2">
            Platform &amp; DevOps Stack
          </h2>
        </div>

        {/* Engineering Practices — full-width standalone card */}
        {skillGroups.filter(g => g.emoji === "🎯").map((group) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0 }}
            className="mt-12 border border-blue-500/20 rounded-2xl p-6 bg-blue-950/15 backdrop-blur-md shadow-lg shadow-black/20"
          >
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 flex-wrap">
              <span>{group.emoji}</span>
              {group.category}
              <span className="font-mono text-[10px] text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full">
                11+ yrs · consulting · modernisation · on-prem · cloud · open-source · commercial
              </span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-1.5 font-mono text-xs bg-muted text-muted-foreground px-2 py-1 rounded hover:text-foreground hover:bg-muted/80 transition-colors"
                >
                  {item.icon && (
                    <Image
                      src={`/assets/icons/${item.icon}.svg`}
                      alt={item.label}
                      width={12}
                      height={12}
                      className="object-contain shrink-0"
                      style={{ filter: "brightness(0) invert(0.6)" }}
                    />
                  )}
                  {item.label}
                </span>
              ))}
            </div>
          </motion.div>
        ))}

        {/* remaining skill groups — 3-column grid */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.filter(g => g.emoji !== "🎯").map((group, i) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="border border-white/10 rounded-2xl p-5 bg-background/25 backdrop-blur-md hover:bg-background/35 hover:border-white/20 transition-all duration-300 shadow-md shadow-black/20"
            >
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <span>{group.emoji}</span>
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item.label}
                    className="inline-flex items-center gap-1.5 font-mono text-xs bg-muted text-muted-foreground px-2 py-1 rounded hover:text-foreground hover:bg-muted/80 transition-colors"
                  >
                    {item.icon && (
                      <Image
                        src={`/assets/icons/${item.icon}.svg`}
                        alt={item.label}
                        width={12}
                        height={12}
                        className="object-contain shrink-0"
                        style={{ filter: "brightness(0) invert(0.6)" }}
                      />
                    )}
                    {item.label}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* certifications */}
        <div className="mt-12">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-widest font-mono">
            Certifications
          </h3>
          <div className="flex flex-wrap gap-3">
            {certifications.map((cert) => (
              <div
                key={cert.name}
                className="flex items-center gap-2 border border-border rounded-lg px-4 py-2 text-sm hover:border-blue-400/40 transition-colors"
              >
                <Image
                  src={`/assets/icons/${cert.icon}.svg`}
                  alt={cert.issuer}
                  width={14}
                  height={14}
                  className="object-contain shrink-0"
                  style={{ filter: "brightness(0) invert(0.5)" }}
                />
                <span className="font-mono text-xs text-blue-400">{cert.issuer}</span>
                <span className="text-muted-foreground">·</span>
                <span>{cert.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
