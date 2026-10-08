"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { TIER_AMPLITUDE, useMotionTier } from "@/lib/motion/tiers";

interface ParallaxProps {
  children?: React.ReactNode;
  className?: string;
  /**
   * Kecepatan relatif terhadap scroll (bagian 17.2 plan):
   * < 1 terasa jauh (bergerak lebih lambat), > 1 terasa dekat.
   */
  speed: number;
  /** Jarak dasar (px) yang dipakai untuk menghitung amplitudo. */
  distance?: number;
  /** Ikut bergerak di tier "selective" (mobile). Default: diam di mobile. */
  mobile?: boolean;
}

/**
 * Layer parallax berbasis transform (GPU). Nilai dihitung oleh useScroll
 * framer-motion tanpa re-render React. Diam total di tier "static".
 */
export default function Parallax({
  children,
  className,
  speed,
  distance = 240,
  mobile = false,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const tier = useMotionTier();
  const amp =
    tier === "selective" ? (mobile ? TIER_AMPLITUDE.selective : 0) : TIER_AMPLITUDE[tier];
  const range = (1 - speed) * distance * amp;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-range, range]);

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      className={className}
      style={amp ? { y } : undefined}
    >
      {children}
    </motion.div>
  );
}
