"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/**
 * Smooth scroll ala rekapos.com (Lenis). Scroll tetap native — posisi window
 * diperbarui secara halus — sehingga useScroll framer-motion ikut mulus.
 * Dimatikan otomatis untuk pengguna `prefers-reduced-motion`.
 */
const SmoothScroll = () => {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.1, anchors: true });
    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
};

export default SmoothScroll;
