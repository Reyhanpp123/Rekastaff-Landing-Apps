"use client";

import React, { useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { FileSpreadsheet, FileText, MessageCircle } from "lucide-react";
import { problem } from "@/content/landing";
import { LG_QUERY, TIER_AMPLITUDE, useMediaQuery, useMotionTier } from "@/lib/motion/tiers";
import { cn } from "@/lib/utils";
import Container from "../shared/Container";
import Eyebrow from "../shared/Eyebrow";
import Headline from "../shared/Headline";

type Kind = "chat" | "sheet" | "slip";

interface Placement {
  /** Posisi desktop (persen dari panggung). */
  x: string;
  y: string;
  rotate: number;
  /** Kedalaman parallax: 0.6 jauh, 0.85 tengah, 1.1 dekat. */
  depth: number;
}

// Empat fragmen utama = daftar semantik (dibaca screen reader).
const MAIN: Placement[] = [
  { x: "3%", y: "14%", rotate: -6, depth: 0.6 },
  { x: "68%", y: "10%", rotate: 5, depth: 1.1 },
  { x: "1%", y: "64%", rotate: 4, depth: 0.85 },
  { x: "70%", y: "62%", rotate: -5, depth: 0.6 },
];

/** Jarak titik biru di bawah pusat panggung (px), di bawah kalimat penutup. */
const DOT_OFFSET = 150;

// Fragmen dekoratif tambahan (aria-hidden, desktop saja). Total <= 10.
const EXTRA: (Placement & { kind: Kind; text: string })[] = [
  { x: "30%", y: "4%", rotate: 8, depth: 0.85, kind: "sheet", text: "#REF!" },
  { x: "24%", y: "80%", rotate: -7, depth: 1.1, kind: "chat", text: "Pak, saya izin ya, anak sakit" },
  { x: "56%", y: "84%", rotate: 6, depth: 0.85, kind: "slip", text: "Slip_final_v3_revisi.pdf" },
  { x: "84%", y: "38%", rotate: -9, depth: 1.1, kind: "sheet", text: "Lembur = ???" },
];

/**
 * Problem (bagian 16-04): fragmen "kekacauan" di 3 kedalaman, lalu terhisap
 * ke pusat menjadi satu titik biru - titik yang sama menjadi pin clock-in di
 * Story berikutnya (chaos -> order).
 *
 * Desktop + motion: di-pin 120vh (tinggi section 220vh). Mobile, tablet, dan
 * reduced-motion: tanpa pin, fragmen tampil sebagai daftar statis.
 */
export default function ProblemStory() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const tier = useMotionTier();
  const isLg = useMediaQuery(LG_QUERY);
  const animated = isLg && tier !== "static";
  const amp = TIER_AMPLITUDE[tier];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const dotScale = useTransform(scrollYProgress, [0.78, 0.95], [0, 1]);
  const resolveOpacity = useTransform(scrollYProgress, [0.82, 0.96], [0, 1]);
  const resolveY = useTransform(scrollYProgress, [0.82, 0.96], [16, 0]);

  return (
    <section
      id="masalah"
      aria-labelledby="masalah-title"
      className="relative bg-rs-surface"
    >
      <div ref={sectionRef} className="relative lg:motion-ok:h-[220vh]">
        <div
          ref={stageRef}
          className="relative lg:h-[100svh] lg:min-h-[640px] lg:overflow-hidden lg:motion-ok:sticky lg:motion-ok:top-0"
        >
          <Container className="relative py-20 md:py-24 lg:flex lg:h-full lg:items-center lg:justify-center lg:py-0">
            <div className="relative z-10 mx-auto max-w-[620px] text-center">
              <Eyebrow>{problem.eyebrow}</Eyebrow>
              <h2 id="masalah-title" className="rs-h2 mt-4 text-rs-text">
                <Headline copy={problem.title} />
              </h2>
              {/* Desktop: muncul di akhir animasi konvergensi */}
              <motion.p
                style={animated ? { opacity: resolveOpacity, y: resolveY } : undefined}
                className="rs-lead mt-5 hidden font-semibold text-rs-primary-strong lg:block"
              >
                {problem.resolve}
              </motion.p>
            </div>

            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:absolute lg:inset-0 lg:mt-0 lg:block">
              {problem.fragments.map((f, i) => (
                <ChaosFragment
                  key={f.text}
                  kind={f.kind}
                  text={f.text}
                  place={MAIN[i]}
                  progress={scrollYProgress}
                  stageRef={stageRef}
                  animated={animated}
                  amp={amp}
                />
              ))}
              {EXTRA.map((f) => (
                <ChaosFragment
                  key={f.text}
                  kind={f.kind}
                  text={f.text}
                  place={f}
                  progress={scrollYProgress}
                  stageRef={stageRef}
                  animated={animated}
                  amp={amp}
                  decorative
                />
              ))}
            </ul>

            {/* Mobile/tablet: penutup setelah daftar masalah (urutan cerita tetap) */}
            <p className="rs-lead mt-8 text-center font-semibold text-rs-primary-strong lg:hidden">
              {problem.resolve}
            </p>

            {/* Titik biru = pin lokasi clock-in di bab pertama Story */}
            <motion.span
              aria-hidden="true"
              style={{ x: "-50%", y: "-50%", scale: animated ? dotScale : 0 }}
              className="absolute left-1/2 top-[calc(50%+150px)] hidden h-5 w-5 rounded-full bg-rs-primary shadow-[0_0_0_10px_rgb(37_99_235/.15),0_0_0_22px_rgb(37_99_235/.07)] lg:block"
            />
          </Container>
        </div>
      </div>
    </section>
  );
}

function ChaosFragment({
  kind,
  text,
  place,
  progress,
  stageRef,
  animated,
  amp,
  decorative = false,
}: {
  kind: Kind;
  text: string;
  place: Placement;
  progress: MotionValue<number>;
  stageRef: React.RefObject<HTMLDivElement>;
  animated: boolean;
  amp: number;
  decorative?: boolean;
}) {
  const ref = useRef<HTMLLIElement>(null);
  // Jarak dari fragmen ke pusat panggung, diukur ulang saat resize.
  const delta = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!animated) return;
    const measure = () => {
      const el = ref.current;
      const stage = stageRef.current;
      if (!el || !stage) return;
      const s = stage.getBoundingClientRect();
      // offsetLeft/Top tidak terpengaruh transform yang sedang berjalan.
      const cx = el.offsetLeft + el.offsetWidth / 2;
      const cy = el.offsetTop + el.offsetHeight / 2;
      const parent = el.offsetParent as HTMLElement | null;
      const p = parent?.getBoundingClientRect();
      const ox = p ? p.left - s.left : 0;
      const oy = p ? p.top - s.top : 0;
      delta.current = { x: s.width / 2 - (cx + ox), y: s.height / 2 + DOT_OFFSET - (cy + oy) };
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [animated, stageRef]);

  const drift = 140 * place.depth * amp;
  const y = useTransform(progress, (p) => {
    const d = -drift * Math.min(p / 0.6, 1);
    const c = clamp01((p - 0.55) / 0.35);
    return d * (1 - c) + delta.current.y * ease(c);
  });
  const x = useTransform(progress, (p) => delta.current.x * ease(clamp01((p - 0.55) / 0.35)));
  const rotate = useTransform(progress, [0, 0.55, 0.9], [place.rotate, place.rotate * 1.6, 0]);
  const scale = useTransform(progress, [0.55, 0.9], [1, 0.2]);
  const opacity = useTransform(progress, [0.72, 0.9], [1, 0]);

  return (
    <li
      ref={ref}
      aria-hidden={decorative || undefined}
      style={{
        ["--x" as string]: place.x,
        ["--y" as string]: place.y,
        ["--r" as string]: `${place.rotate}deg`,
      }}
      className={cn(
        "lg:absolute lg:left-[var(--x)] lg:top-[var(--y)] lg:w-[260px] xl:w-[280px]",
        decorative && "hidden lg:block lg:w-auto xl:w-auto"
      )}
    >
      <motion.div
        style={animated ? { x, y, rotate, scale, opacity } : undefined}
        // Rotasi statis (reduced-motion); saat animasi, transform inline menimpanya.
        className="lg:[transform:rotate(var(--r))]"
      >
        <FragmentCard kind={kind} text={text} compact={decorative} />
      </motion.div>
    </li>
  );
}

function FragmentCard({ kind, text, compact }: { kind: Kind; text: string; compact?: boolean }) {
  if (kind === "chat") {
    return (
      <div className={cn("rounded-rs-md border border-rs-border bg-white p-4 shadow-e2", compact && "max-w-[220px] p-3")}>
        <p className="flex items-center gap-2 text-[12px] font-semibold text-emerald-700">
          <MessageCircle aria-hidden="true" className="h-3.5 w-3.5" />
          Grup Absensi Kantor
        </p>
        <p className={cn("mt-2 rounded-[12px] rounded-tl-sm bg-emerald-50 px-3 py-2 text-[15px] font-medium leading-snug text-rs-text", compact && "text-[13px]")}>
          {text}
        </p>
      </div>
    );
  }
  if (kind === "sheet") {
    return (
      <div className={cn("overflow-hidden rounded-rs-sm border border-rs-border bg-white shadow-e2", compact && "w-[150px]")}>
        <p className="flex items-center gap-2 border-b border-rs-border bg-emerald-700 px-3 py-1.5 text-[12px] font-semibold text-white">
          <FileSpreadsheet aria-hidden="true" className="h-3.5 w-3.5" />
          gaji_final.xlsx
        </p>
        {compact ? (
          <p className="tabular px-3 py-2 font-mono text-[15px] font-bold text-rs-danger">{text}</p>
        ) : (
          <>
            <div aria-hidden="true" className="grid grid-cols-3 border-b border-rs-border text-[11px] text-slate-400">
              <span className="border-r border-rs-border px-2 py-1">=SUM(D4</span>
              <span className="border-r border-rs-border bg-red-50 px-2 py-1 font-bold text-rs-danger">#REF!</span>
              <span className="px-2 py-1">0,05*</span>
            </div>
            <p className="px-3 py-2.5 text-[15px] font-medium leading-snug text-rs-text">{text}</p>
          </>
        )}
      </div>
    );
  }
  return (
    <div className={cn("rounded-rs-sm border border-rs-border bg-white p-4 shadow-e2", compact && "p-3")}>
      <p className="flex items-center gap-2 text-[12px] font-semibold text-rs-muted">
        <FileText aria-hidden="true" className="h-3.5 w-3.5" />
        {compact ? "Lampiran" : "Slip gaji (1 dari 48)"}
      </p>
      {!compact && (
        <div aria-hidden="true" className="mt-2 space-y-1.5">
          <span className="block h-1.5 w-full rounded bg-slate-100" />
          <span className="block h-1.5 w-4/5 rounded bg-slate-100" />
        </div>
      )}
      <p className={cn("mt-2 text-[15px] font-medium leading-snug text-rs-text", compact && "text-[13px]")}>{text}</p>
    </div>
  );
}

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

function ease(t: number) {
  // ease-in-out cubic: bergerak halus ke pusat.
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
