"use client";
import { useSelectedSkill } from "./pipeline-background";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function SkillTooltip() {
  const skill = useSelectedSkill();

  return (
    <AnimatePresence>
      {skill && (
        <motion.div
          key={skill.name}
          initial={{ opacity: 0, y: 10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0,  scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.96 }}
          transition={{ duration: 0.18 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          <div
            className="flex items-center gap-3 px-5 py-3 rounded-xl border bg-background/90 backdrop-blur-md shadow-2xl"
            style={{ borderColor: skill.color + "55" }}
          >
            {/* Tool icon */}
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: skill.color + "22" }}
            >
              <Image
                src={skill.icon}
                alt={skill.label}
                width={24}
                height={24}
                className="w-6 h-6 object-contain"
                style={{ filter: "brightness(0) invert(1)" }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
            </div>

            {/* Text */}
            <div className="flex flex-col min-w-0">
              <span
                className="font-mono text-sm font-semibold leading-tight"
                style={{ color: skill.color }}
              >
                {skill.label}
              </span>
              <span className="text-xs text-muted-foreground max-w-xs leading-snug mt-0.5">
                {skill.shortDescription}
              </span>
            </div>

            {/* Accent dot */}
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0 ml-1"
              style={{ background: skill.color }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
