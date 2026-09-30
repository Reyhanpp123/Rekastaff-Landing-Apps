"use client";

import React, { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

interface ParallaxLayerProps {
  children?: React.ReactNode;
  className?: string;
  /**
   * Jarak gerak vertikal (px) selama elemen melintasi viewport.
   * - Positif  → layer bergerak SEARAH scroll (terasa lebih lambat / jauh)  → layer background
   * - Negatif  → layer bergerak BERLAWANAN scroll (terasa lebih cepat / dekat) → layer visual
   * - 0 / tidak diisi → layer konten bergerak normal
   */
  range?: number;
  /** Skala awal → akhir (opsional, untuk efek zoom halus). */
  scale?: [number, number];
  /** Rotasi awal → akhir dalam derajat (opsional). */
  rotate?: [number, number];
}

/**
 * Konsep 3 layer parallax:
 *   1. Background → range kecil positif  (mis. 40–80)   bergerak paling lambat
 *   2. Visual     → range negatif sedang (mis. -30–-60) bergerak sedang
 *   3. Konten     → tanpa ParallaxLayer                 bergerak normal
 *
 * Performa: hanya animasi `transform` (GPU), dihitung dari useScroll milik
 * framer-motion (tanpa re-render React), dan dinonaktifkan otomatis bila
 * pengguna memilih `prefers-reduced-motion`.
 */
const ParallaxLayer = ({
  children,
  className,
  range = 0,
  scale,
  rotate,
}: ParallaxLayerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // progress 0 → elemen baru masuk dari bawah, 1 → elemen keluar di atas.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-range, range]);
  const s = useTransform(scrollYProgress, [0, 1], scale ?? [1, 1]);
  const r = useTransform(scrollYProgress, [0, 1], rotate ?? [0, 0]);

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      className={className}
      style={reduceMotion ? undefined : { y, scale: s, rotate: r }}
    >
      {children}
    </motion.div>
  );
};

export default ParallaxLayer;
