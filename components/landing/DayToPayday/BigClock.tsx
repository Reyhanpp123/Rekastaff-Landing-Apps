"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { story } from "@/content/landing";
import { DUR, EASE } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils";

/**
 * Jam / tanggal raksasa di latar panggung. Berganti dengan digit roll 500ms
 * setiap chapter. Dekoratif (aria-hidden) - teks yang sama ada di chapter.
 */
export default function BigClock({ active, night }: { active: number; night: boolean }) {
  const label = story.chapters[active].rail;
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative h-[0.9em] overflow-hidden whitespace-nowrap text-[clamp(120px,13vw,220px)] font-extrabold leading-[0.9] tracking-[-0.05em] transition-colors duration-700",
        night ? "text-white/[0.07]" : "text-rs-ink/[0.06]"
      )}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={label}
          className="tabular block"
          initial={{ y: "60%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-60%", opacity: 0 }}
          transition={{ duration: DUR.slow - 0.1, ease: [...EASE.inOut] }}
        >
          {label}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
