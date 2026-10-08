"use client";

import { useSyncExternalStore } from "react";

/**
 * Tier motion (LANDING_PAGE_REDESIGN_PLAN.md bagian 21.1).
 * - full      : >= 1024px, pointer halus, tanpa reduced-motion
 * - reduced   : 768-1023px, atau layar besar dengan pointer kasar (tablet)
 * - selective : < 768px
 * - static    : pengguna meminta prefers-reduced-motion di sistem operasi
 */
export type MotionTier = "full" | "reduced" | "selective" | "static";

/** Pengali amplitudo parallax per tier. */
export const TIER_AMPLITUDE: Record<MotionTier, number> = {
  full: 1,
  reduced: 0.6,
  selective: 0.3,
  static: 0,
};

const QUERIES = [
  "(prefers-reduced-motion: reduce)",
  "(max-width: 767px)",
  "(max-width: 1023px)",
  "(pointer: coarse)",
];

export function computeTier(): MotionTier {
  if (typeof window === "undefined") return "static";
  const mq = (q: string) => window.matchMedia(q).matches;
  if (mq(QUERIES[0])) {
    return "static";
  }
  if (mq(QUERIES[1])) return "selective";
  if (mq(QUERIES[2]) || mq(QUERIES[3])) return "reduced";
  return "full";
}

function subscribe(onChange: () => void) {
  const lists = QUERIES.map((q) => window.matchMedia(q));
  lists.forEach((l) => l.addEventListener("change", onChange));
  return () => {
    lists.forEach((l) => l.removeEventListener("change", onChange));
  };
}

/**
 * Server snapshot = "static": HTML awal selalu tanpa transform scroll, lalu
 * tier sebenarnya aktif setelah hidrasi (tidak ada hydration mismatch).
 */
export function useMotionTier(): MotionTier {
  return useSyncExternalStore(subscribe, computeTier, () => "static");
}

/** matchMedia reaktif. Server snapshot = false (layout mobile-first). */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

export const LG_QUERY = "(min-width: 1024px)";
