"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import { Menu } from "lucide-react";
import { SiteLogo } from "@/components/svg";
import { cn } from "@/lib/utils";
import { HRD_LOGIN_URL, HRD_REGISTER_STARTER_URL } from "@/lib/site";
import { storyChapterStore, useStore } from "@/lib/motion/store";
import { story } from "@/content/landing";
import MobileMenu from "./MobileMenu";
import { NAV_LINKS } from "./links";

/**
 * Header sticky 64px yang berperan sebagai "kompas cerita":
 * - sembunyi saat scroll turun, muncul lagi saat scroll naik (CTA selalu
 *   satu gerakan jauhnya);
 * - berganti tone saat melintasi section gelap (data-tone="dark");
 * - menandai link section yang sedang dibaca (aria-current);
 * - progress bar berubah jadi rail 5 chapter selama Story terlihat.
 */
export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [dark, setDark] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const chapter = useStore(storyChapterStore, -1);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Arah scroll -> hide/show. Listener pasif + rAF, tanpa re-render per frame.
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const delta = y - lastY;
      if (Math.abs(delta) < 6) return;
      const focusInside = headerRef.current?.contains(document.activeElement);
      setHidden(delta > 0 && y > 160 && !focusInside);
      lastY = y;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Tone swap: section gelap yang sedang berada di bawah header.
  useEffect(() => {
    const targets = document.querySelectorAll("[data-tone='dark']");
    if (!targets.length) return;
    const under = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? under.add(e.target) : under.delete(e.target)));
        setDark(under.size > 0);
      },
      { rootMargin: "0px 0px -92% 0px" }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  // Link aktif: section yang memotong garis tengah viewport.
  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(
      (s): s is HTMLElement => Boolean(s)
    );
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
          else setActive((cur) => (cur === e.target.id ? null : cur));
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  const inStory = chapter >= 0;
  const isHidden = hidden && !menuOpen;

  return (
    <>
      <a href="#konten" className="rs-skip-link">
        Lewati ke konten
      </a>
      <header
        ref={headerRef}
        className={cn(
          "sticky top-0 z-50 w-full transition-[transform,background-color,color,border-color] duration-300 ease-rs-standard motion-off:transition-none",
          isHidden ? "-translate-y-full" : "translate-y-0",
          dark
            ? "border-b border-white/10 bg-rs-night/75 text-white backdrop-blur-xl"
            : "border-b border-rs-border/70 bg-white/75 text-rs-text backdrop-blur-xl"
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-rs-wide items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Rekastaff - beranda">
            <SiteLogo className={cn("h-8 w-8", dark ? "text-sky-400" : "text-rs-primary")} />
            <span className="text-[19px] font-extrabold tracking-[-0.02em]">
              Rekastaff
              <span
                className={cn(
                  "ml-1.5 hidden rounded-md px-1.5 py-0.5 align-middle text-[10px] font-bold uppercase tracking-widest min-[400px]:inline",
                  dark ? "bg-white/10 text-sky-300" : "bg-rs-primary/10 text-rs-primary-strong"
                )}
              >
                HRIS
              </span>
            </span>
          </Link>

          <nav aria-label="Navigasi utama" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const current = active === link.id;
                return (
                  <li key={link.id} className={cn(!link.tablet && "hidden lg:block")}>
                    <Link
                      href={`/#${link.id}`}
                      aria-current={current ? "location" : undefined}
                      className={cn(
                        "relative inline-flex h-10 items-center rounded-full px-3.5 text-[15px] font-medium transition-colors xl:px-4",
                        dark
                          ? current
                            ? "text-white"
                            : "text-white/70 hover:text-white"
                          : current
                            ? "text-rs-primary-strong"
                            : "text-rs-muted hover:text-rs-text"
                      )}
                    >
                      {link.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-x-3.5 bottom-1.5 h-0.5 origin-left rounded-full bg-current transition-transform duration-300 ease-rs-out",
                          current ? "scale-x-100" : "scale-x-0"
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={HRD_LOGIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "hidden h-10 items-center rounded-rs-md px-4 text-[15px] font-semibold transition-colors lg:inline-flex",
                dark ? "text-white/80 hover:text-white" : "text-rs-muted hover:text-rs-text"
              )}
            >
              Masuk
            </a>
            <a
              href={HRD_REGISTER_STARTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center whitespace-nowrap rounded-rs-md bg-rs-primary px-3.5 text-[14px] font-bold text-white shadow-glow transition-[transform,background-color] duration-150 hover:-translate-y-px hover:bg-rs-primary-strong sm:px-4 sm:text-[15px]"
            >
              Coba Gratis
              <span className="sr-only"> (membuka tab baru)</span>
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Buka menu"
              aria-expanded={menuOpen}
              aria-controls="menu-mobile"
              className={cn(
                "inline-flex h-11 w-11 items-center justify-center rounded-rs-md border transition-colors lg:hidden",
                dark ? "border-white/20 text-white" : "border-rs-border text-rs-text hover:bg-rs-surface"
              )}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Progress halaman / rail chapter Story */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[3px]">
          {inStory ? (
            <div className="mx-auto flex h-full max-w-rs-wide gap-1.5 px-4 sm:px-6 lg:px-8">
              {story.chapters.map((c, i) => (
                <span key={c.id} className="h-full flex-1 overflow-hidden rounded-full bg-rs-primary/15">
                  <span
                    className={cn(
                      "block h-full origin-left rounded-full bg-rs-amber transition-transform duration-500 ease-rs-out",
                      i <= chapter ? "scale-x-100" : "scale-x-0"
                    )}
                  />
                </span>
              ))}
            </div>
          ) : (
            <motion.div
              style={{ scaleX: progress }}
              className="h-full origin-left bg-gradient-to-r from-rs-primary to-rs-cyan"
            />
          )}
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={closeMenu} active={active} />
    </>
  );
}
