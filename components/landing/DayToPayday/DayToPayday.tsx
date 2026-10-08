"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { story, type Chapter } from "@/content/landing";
import type { MockDates } from "@/lib/format";
import { storyChapterStore } from "@/lib/motion/store";
import { jumpToSection, scrollToElement } from "@/lib/motion/scroll";
import { LG_QUERY, TIER_AMPLITUDE, useMediaQuery, useMotionTier } from "@/lib/motion/tiers";
import { cn } from "@/lib/utils";
import Container from "../shared/Container";
import Eyebrow from "../shared/Eyebrow";
import CtaLink from "../shared/CtaLink";
import Headline from "../shared/Headline";
import Parallax from "@/components/motion/Parallax";
import DeviceStage, { ChapterScreen } from "./DeviceStage";
import BigClock from "./BigClock";
import ActivityFeed from "./ActivityFeed";

const LAST = story.chapters.length - 1;

// Palet waktu (bagian 15.1): pagi -> sore -> siang -> akhir bulan -> malam.
const ATMOSPHERE = [
  "bg-[radial-gradient(60%_40%_at_10%_0%,rgb(253_230_138/.35),transparent),linear-gradient(to_bottom,#EAF2FF,#FFFFFF)]",
  "bg-[radial-gradient(60%_40%_at_90%_10%,rgb(254_215_170/.4),transparent),linear-gradient(to_bottom,#FFF4E6,#F6F8FC)]",
  "bg-[linear-gradient(to_bottom,#F2F7FF,#FFFFFF)]",
  "bg-[linear-gradient(to_bottom,#E8EEFF,#DCE6FF)]",
  "bg-[radial-gradient(50%_40%_at_70%_30%,rgb(37_99_235/.25),transparent),linear-gradient(to_bottom,#0B1220,#13234A)]",
];

/**
 * Day-to-Payday (bagian 16-05) - tulang punggung halaman.
 *
 * Desktop (>= 1024px): teks chapter mengalir natural di kolom kiri (5 x 70svh
 * = 350svh), panggung device di kanan sticky: jam raksasa (speed 0.2), device
 * yang morph HP <-> laptop, dan activity feed. Konten selalu ada di DOM,
 * tidak ada scroll-jacking dan tidak ada focus trap.
 *
 * Mobile/tablet: 5 kartu chapter vertikal, masing-masing dengan layar final.
 * Reduced-motion: sama dengan desktop tetapi tanpa transisi (CSS global).
 */
export default function DayToPayday({
  dates,
  registerUrl,
}: {
  dates: MockDates;
  registerUrl: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const chaptersRef = useRef<HTMLDivElement>(null);
  const articleRefs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const isLg = useMediaQuery(LG_QUERY);
  const tier = useMotionTier();
  // Panggung sticky hanya untuk desktop + motion. Reduced-motion (OS atau
  // toggle) memakai tumpukan kartu statis di semua ukuran (AC-A1). Kelas CSS
  // memakai varian `lg:motion-ok:` agar layout sudah benar sebelum hidrasi.
  const pinned = isLg && tier !== "static";
  const night = pinned && active === LAST;

  // Chapter aktif = article yang memotong garis tengah viewport.
  useEffect(() => {
    const articles = articleRefs.current.filter((a): a is HTMLElement => Boolean(a));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const index = Number((e.target as HTMLElement).dataset.index);
          setActive(index);
          storyChapterStore.set(index);
        });
      },
      { rootMargin: "-48% 0px -48% 0px" }
    );
    articles.forEach((a) => io.observe(a));
    return () => io.disconnect();
  }, []);

  // Rail di navbar hanya tampil selama area chapter terlihat.
  useEffect(() => {
    const el = chaptersRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => storyChapterStore.set(entry.isIntersecting ? active : -1),
      { rootMargin: "-64px 0px 0px 0px" }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      storyChapterStore.set(-1);
    };
  }, [active]);

  // Jam raksasa bergerak paling lambat (speed 0.2) - terasa "jauh" seperti waktu.
  const { scrollYProgress } = useScroll({ target: chaptersRef, offset: ["start end", "end start"] });
  const amp = TIER_AMPLITUDE[tier];
  const clockY = useTransform(scrollYProgress, [0, 1], [80 * amp, -80 * amp]);
  const feedY = useTransform(scrollYProgress, [0, 1], [24 * amp, -24 * amp]);

  const goTo = (index: number) => {
    const el = articleRefs.current[index];
    if (!el) return;
    scrollToElement(el, { offset: -(window.innerHeight - el.offsetHeight) / 2 });
    el.focus({ preventScroll: true });
  };

  return (
    <section
      ref={sectionRef}
      id="cerita"
      aria-labelledby="cerita-title"
      className={cn(
        "relative isolate transition-colors duration-700 ease-rs-in-out",
        night ? "text-rs-night-text" : "text-rs-text"
      )}
    >
      {/* Legacy anchor dari desain lama */}
      <span id="alur" aria-hidden="true" className="absolute top-0" />
      <span id="how-it-works" aria-hidden="true" className="absolute top-0" />

      {/* Atmosfer waktu (desktop): crossfade antar layer, bukan animasi warna */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 hidden bg-white lg:motion-ok:block">
        {ATMOSPHERE.map((bg, i) => (
          <div
            key={i}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-rs-in-out",
              bg,
              i === active ? "opacity-100" : "opacity-0"
            )}
          />
        ))}
      </div>

      <Container wide className="pt-20 md:pt-28 lg:pt-32">
        <div className="max-w-[720px]">
          <Eyebrow tone={night ? "dark" : "light"}>{story.eyebrow}</Eyebrow>
          <h2 id="cerita-title" className="rs-h2 mt-4">
            <Headline copy={story.title} tone={night ? "dark" : "primary"} />
          </h2>
          <p className={cn("rs-lead mt-5", night ? "text-rs-night-muted" : "text-rs-muted")}>
            {story.sub}
          </p>
          <a
            href="#fitur"
            onClick={(e) => {
              e.preventDefault();
              jumpToSection("fitur");
            }}
            className={cn(
              "mt-5 inline-flex min-h-[44px] items-center gap-1.5 text-[15px] font-semibold underline-offset-4 hover:underline lg:motion-ok:hidden",
              night ? "text-sky-300" : "text-rs-primary-strong"
            )}
          >
            {story.skip}
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-10 grid gap-x-12 lg:mt-4 lg:grid-cols-12">
          {/* Kolom chapter */}
          {/* pb di desktop: chapter terakhir bisa sampai tengah layar selagi panggung masih sticky */}
          <div
            ref={chaptersRef}
            className="space-y-5 lg:col-span-12 lg:grid lg:grid-cols-2 lg:gap-5 lg:space-y-0 lg:motion-ok:col-span-5 lg:motion-ok:block lg:motion-ok:pb-[24svh]"
          >
            {story.chapters.map((c, i) => (
              <article
                key={c.id}
                id={c.id}
                ref={(el) => {
                  articleRefs.current[i] = el;
                }}
                data-index={i}
                tabIndex={-1}
                aria-labelledby={`${c.id}-title`}
                className={cn(
                  "relative rounded-rs-lg border p-5 outline-none sm:p-7",
                  "lg:motion-ok:flex lg:motion-ok:min-h-[70svh] lg:motion-ok:flex-col lg:motion-ok:justify-center lg:motion-ok:rounded-none lg:motion-ok:border-0 lg:motion-ok:bg-transparent lg:motion-ok:p-0 lg:motion-ok:pl-8 lg:motion-ok:text-inherit lg:motion-ok:shadow-none",
                  i === LAST
                    ? "border-rs-night-border bg-rs-night text-rs-night-text shadow-night"
                    : "border-rs-border bg-white shadow-e1"
                )}
              >
                {/* Penanda chapter aktif (desktop) */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute left-0 top-1/2 hidden h-28 w-[3px] -translate-y-1/2 origin-center rounded-full transition-transform duration-500 ease-rs-out lg:motion-ok:block",
                    night ? "bg-amber-300" : "bg-rs-amber",
                    i === active ? "scale-y-100" : "scale-y-0"
                  )}
                />
                <Parallax speed={0.85} distance={60} mobile className="lg:motion-ok:hidden">
                  <ChapterTime chapter={c} night={i === LAST} active />
                </Parallax>
                <div className="hidden lg:motion-ok:block">
                  <ChapterTime chapter={c} night={night} active={i === active} />
                </div>
                <h3 id={`${c.id}-title`} className="rs-h3 mt-3 lg:motion-ok:text-[clamp(24px,2.2vw,32px)] lg:motion-ok:font-bold lg:motion-ok:leading-[1.2] lg:motion-ok:tracking-[-0.02em]">
                  {c.title}
                </h3>
                <p
                  className={cn(
                    "mt-3 max-w-[460px] text-[16px] leading-relaxed lg:text-[17px]",
                    i === LAST ? "text-rs-night-muted" : "text-rs-muted",
                    pinned && (night ? "lg:text-rs-night-muted" : "lg:text-rs-muted")
                  )}
                >
                  {c.body}
                </p>

                {/* Layar final per chapter (mobile, tablet, reduced-motion) */}
                <div aria-hidden="true" className="mt-6 lg:motion-ok:hidden">
                  <ChapterScreen chapter={c} index={i} dates={dates} compact />
                </div>
              </article>
            ))}
          </div>

          {/* Panggung sticky (desktop) */}
          <div className="hidden lg:col-span-7 lg:motion-ok:block">
            <div className="sticky top-16 h-[calc(100svh-64px)] min-h-[560px]">
              <div className="absolute inset-x-0 top-6 z-20 flex items-center justify-between gap-4">
                <nav aria-label={story.railLabel}>
                  <ol className="flex items-center gap-1.5">
                    {story.chapters.map((c, i) => (
                      <li key={c.id}>
                        <button
                          type="button"
                          onClick={() => goTo(i)}
                          aria-current={i === active ? "step" : undefined}
                          aria-label={`${i + 1}. ${c.title}`}
                          className={cn(
                            "tabular h-9 rounded-full px-3.5 text-[13px] font-bold transition-[background-color,color,padding] duration-300 ease-rs-out",
                            i === active
                              ? night
                                ? "bg-amber-300 px-5 text-rs-night"
                                : "bg-rs-ink px-5 text-white"
                              : night
                                ? "text-rs-night-muted hover:bg-white/10 hover:text-white"
                                : "text-rs-muted hover:bg-rs-ink/5 hover:text-rs-text"
                          )}
                        >
                          {c.rail}
                        </button>
                      </li>
                    ))}
                  </ol>
                </nav>
                <a
                  href="#fitur"
                  onClick={(e) => {
                    e.preventDefault();
                    jumpToSection("fitur");
                  }}
                  className={cn(
                    "inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold underline-offset-4 hover:underline",
                    night ? "text-sky-300" : "text-rs-primary-strong"
                  )}
                >
                  {story.skip}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </a>
              </div>

              <motion.div
                style={amp ? { y: clockY } : undefined}
                className="pointer-events-none absolute -left-6 bottom-[6%] z-0"
              >
                <BigClock active={active} night={night} />
              </motion.div>

              <div aria-hidden="true" className="absolute inset-y-0 left-0 right-[230px] z-10 flex items-center justify-center pt-12 xl:right-[250px]">
                <DeviceStage active={active} dates={dates} />
              </div>

              <motion.div
                style={amp ? { y: feedY } : undefined}
                aria-hidden="true"
                className="absolute bottom-[10%] right-0 z-20 w-[240px] xl:w-[256px]"
              >
                <ActivityFeed active={active} night={night} />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Outro + CTA kontekstual (puncak cerita) */}
        <div className="py-20 text-center md:py-28 lg:py-32">
          <p className="rs-h2 mx-auto max-w-[820px]">
            <Headline copy={story.outroTitle} tone={night ? "dark" : "primary"} />
          </p>
          <div data-cta-end="" className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CtaLink href={registerUrl} external arrow className="w-full sm:w-auto">
              {story.outroCta}
            </CtaLink>
            <CtaLink
              href="#harga"
              variant={night ? "ghost-dark" : "secondary"}
              className="w-full sm:w-auto"
            >
              {story.outroSecondary}
            </CtaLink>
          </div>
          <p className={cn("mx-auto mt-6 max-w-[520px] text-[13px]", night ? "text-rs-night-muted" : "text-rs-muted")}>
            {story.note}
          </p>
        </div>
      </Container>
    </section>
  );
}

function ChapterTime({
  chapter,
  night,
  active,
}: {
  chapter: Chapter;
  night: boolean;
  active: boolean;
}) {
  return (
    <p
      className={cn(
        "tabular text-[40px] font-extrabold leading-none tracking-[-0.03em] transition-colors duration-500 lg:text-[64px]",
        night
          ? active
            ? "text-amber-300"
            : "text-rs-night-muted"
          : active
            ? "text-rs-amber-strong"
            : "text-slate-500"
      )}
    >
      {chapter.time}
    </p>
  );
}
