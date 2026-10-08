"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useMotionTier } from "@/lib/motion/tiers";
import { setLenis } from "@/lib/motion/scroll";

/**
 * Orkestrator motion global landing page. Satu komponen, tanpa UI:
 *
 * 1. Lenis (smooth scroll) - hanya tier "full" (desktop + pointer halus).
 *    Mobile/tablet tetap scroll native (tanpa scroll-jacking).
 * 2. Scroll reveal `[data-reveal]` / `[data-draw]` - satu IntersectionObserver
 *    untuk seluruh halaman. Elemen hanya disembunyikan bila MASIH di bawah
 *    viewport saat JS aktif; tanpa JS semua konten tetap terlihat.
 * 3. Count-up `[data-countup]` - angka akhir sudah ada di DOM, animasi hanya
 *    visual (elemen ber-aria-hidden, nilai sr-only ada di sebelahnya).
 */
export default function MotionProvider() {
  const tier = useMotionTier();

  // 1. Lenis
  useEffect(() => {
    if (tier !== "full") return;
    const lenis = new Lenis({ lerp: 0.11, anchors: { offset: -72 } });
    setLenis(lenis);
    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      setLenis(null);
    };
  }, [tier]);

  // 2 + 3. Reveal & count-up
  useEffect(() => {
    if (tier === "static") return;

    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal],[data-draw],[data-countup]")
    );
    const vh = window.innerHeight;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          io.unobserve(el);
          if (el.hasAttribute("data-countup")) runCountUp(el);
          else el.classList.remove("rs-pending");
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 }
    );

    for (const el of nodes) {
      const delay = el.dataset.revealDelay;
      if (delay) el.style.setProperty("--rd", `${delay}ms`);
      // Hanya elemen yang belum terlihat yang disembunyikan; yang sudah lewat
      // (mis. setelah deep-link ke #harga) dibiarkan terlihat.
      if (el.getBoundingClientRect().top < vh * 0.92) continue;
      if (!el.hasAttribute("data-countup")) el.classList.add("rs-pending");
      io.observe(el);
    }

    return () => {
      io.disconnect();
      nodes.forEach((el) => el.classList.remove("rs-pending"));
    };
  }, [tier]);

  return null;
}

const numberFormat = new Intl.NumberFormat("id-ID");

function runCountUp(el: HTMLElement) {
  const target = Number(el.dataset.countup);
  if (!Number.isFinite(target) || target <= 0) return;
  const prefix = el.dataset.prefix ?? "";
  const suffix = el.dataset.suffix ?? "";
  const final = el.textContent;
  const start = performance.now();
  const duration = 600;

  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 4);
    el.textContent = `${prefix}${numberFormat.format(Math.round(target * eased))}${suffix}`;
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = final;
  };
  requestAnimationFrame(tick);
}
