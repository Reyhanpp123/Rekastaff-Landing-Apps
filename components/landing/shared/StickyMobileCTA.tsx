"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { contextualCtaStore, useStore } from "@/lib/motion/store";
import { cn } from "@/lib/utils";

/**
 * CTA melekat di bawah layar (mobile < 768px, bagian 20 & AC-N2).
 * - Muncul setelah hero keluar viewport.
 * - Di section harga labelnya mengikuti kalkulator ("Mulai PRO - Rp ...").
 * - Sembunyi di Final CTA / footer (CTA sudah ada) dan saat keyboard terbuka.
 * - Diberi ruang di kanan agar tidak menumpuk dengan tombol Bantuan.
 */
export default function StickyMobileCTA({ href, label }: { href: string; label: string }) {
  const [pastHero, setPastHero] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [inPricing, setInPricing] = useState(false);
  const [keyboard, setKeyboard] = useState(false);
  const contextual = useStore(contextualCtaStore, null);

  useEffect(() => {
    const hero = document.querySelector("#konten > section");
    const pricing = document.getElementById("harga");
    const ends = Array.from(document.querySelectorAll("[data-cta-end]"));
    const ioHero = new IntersectionObserver(([e]) => setPastHero(!e.isIntersecting && e.boundingClientRect.top < 0));
    const ioPricing = new IntersectionObserver(([e]) => setInPricing(e.isIntersecting), {
      rootMargin: "-30% 0px -30% 0px",
    });
    const visibleEnds = new Set<Element>();
    const ioEnd = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visibleEnds.add(e.target) : visibleEnds.delete(e.target)));
      setBlocked(visibleEnds.size > 0);
    });
    if (hero) ioHero.observe(hero);
    if (pricing) ioPricing.observe(pricing);
    ends.forEach((el) => ioEnd.observe(el));

    const vv = window.visualViewport;
    const onResize = () => setKeyboard(vv ? window.innerHeight - vv.height > 150 : false);
    vv?.addEventListener("resize", onResize);

    return () => {
      ioHero.disconnect();
      ioPricing.disconnect();
      ioEnd.disconnect();
      vv?.removeEventListener("resize", onResize);
    };
  }, []);

  const visible = pastHero && !blocked && !keyboard;
  const cta = inPricing && contextual ? contextual : { href, label };

  return (
    <div
      className={cn(
        "fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-4 right-[88px] z-[55] transition-[transform,opacity] duration-300 ease-rs-out md:hidden print:hidden",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      )}
      aria-hidden={!visible}
    >
      <a
        href={cta.href}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={visible ? 0 : -1}
        className="flex h-14 items-center justify-center gap-2 rounded-rs-md bg-rs-primary px-4 text-[15px] font-bold text-white shadow-glow"
      >
        <span className="truncate">{cta.label}</span>
        <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
        <span className="sr-only"> (membuka tab baru)</span>
      </a>
    </div>
  );
}
