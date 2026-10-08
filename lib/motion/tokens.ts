/**
 * Motion tokens (LANDING_PAGE_REDESIGN_PLAN.md bagian 19.1 dan 17.2).
 * Durasi dalam detik karena dipakai langsung oleh framer-motion.
 */
export const DUR = {
  instant: 0.12,
  fast: 0.2,
  base: 0.32,
  slow: 0.6,
  cinematic: 1.1,
} as const;

export const EASE = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
  standard: [0.4, 0, 0.2, 1],
} as const;

/**
 * Peta kecepatan layer parallax global. 1 = ikut scroll normal,
 * < 1 = terasa jauh (lebih lambat), > 1 = terasa dekat (lebih cepat).
 */
export const LAYER_SPEED = {
  atmosphere: 0.1,
  context: 0.25,
  system: 0.45,
  content: 0.7,
  human: 0.9,
  signal: 1.15,
} as const;
