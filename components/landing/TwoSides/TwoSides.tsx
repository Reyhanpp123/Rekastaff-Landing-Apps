"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Check, Clock3, Monitor, Smartphone } from "lucide-react";
import { twoSides } from "@/content/landing";
import type { MockDates } from "@/lib/format";
import { TIER_AMPLITUDE, useMotionTier } from "@/lib/motion/tiers";
import { cn } from "@/lib/utils";
import Container from "../shared/Container";
import Eyebrow from "../shared/Eyebrow";
import Headline from "../shared/Headline";
import DashboardShot from "../shared/DashboardShot";
import { BrowserFrame, PhoneFrame } from "../shared/DeviceFrame";

type Side = "hrd" | "employee";

/**
 * Dua Sisi, Satu Data (bagian 16-06). Desktop: laptop (speed 0.9) dan HP
 * (speed 1.1) saling mendekat, kartu "Cuti 2 hari" berpindah dari HP ke
 * dashboard mengikuti scroll - metafora sinkron. Tidak di-pin.
 * Mobile: toggle [HRD | Karyawan] (tablist) + satu device, tanpa animasi path.
 */
export default function TwoSides({ dates }: { dates: MockDates }) {
  const [side, setSide] = useState<Side>("hrd");
  const tabsId = useId();

  return (
    <section id="dua-sisi" aria-labelledby="dua-sisi-title" className="relative overflow-hidden bg-white py-24 md:py-32">
      <Container wide>
        <div className="mx-auto max-w-[720px] text-center" data-reveal="">
          <Eyebrow>{twoSides.eyebrow}</Eyebrow>
          <h2 id="dua-sisi-title" className="rs-h2 mt-4 text-rs-text">
            <Headline copy={twoSides.title} />
          </h2>
          <p className="rs-lead mt-5 text-rs-muted">{twoSides.sub}</p>
        </div>

        {/* Desktop */}
        <div className="mt-16 hidden grid-cols-[1fr_minmax(0,1.5fr)_1fr] items-center gap-10 lg:grid xl:gap-14">
          <SideList data={twoSides.hrd} icon={<Monitor className="h-5 w-5" />} />
          <SyncVisual dates={dates} />
          <SideList data={twoSides.employee} icon={<Smartphone className="h-5 w-5" />} />
        </div>

        {/* Mobile & tablet */}
        <div className="mt-12 lg:hidden">
          <div
            role="tablist"
            aria-label={twoSides.tabs.label}
            className="mx-auto grid max-w-[360px] grid-cols-2 rounded-full border border-rs-border bg-rs-surface p-1"
            onKeyDown={(e) => {
              if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
              e.preventDefault();
              const next: Side = side === "hrd" ? "employee" : "hrd";
              setSide(next);
              document.getElementById(`${tabsId}-${next}-tab`)?.focus();
            }}
          >
            {(["hrd", "employee"] as const).map((s) => (
              <button
                key={s}
                id={`${tabsId}-${s}-tab`}
                type="button"
                role="tab"
                aria-selected={side === s}
                aria-controls={`${tabsId}-${s}-panel`}
                tabIndex={side === s ? 0 : -1}
                onClick={() => setSide(s)}
                className={cn(
                  "h-11 rounded-full text-[15px] font-bold transition-colors",
                  side === s ? "bg-white text-rs-text shadow-e1" : "text-rs-muted"
                )}
              >
                {twoSides.tabs[s]}
              </button>
            ))}
          </div>

          {(["hrd", "employee"] as const).map((s) => (
            <div
              key={s}
              id={`${tabsId}-${s}-panel`}
              role="tabpanel"
              aria-labelledby={`${tabsId}-${s}-tab`}
              hidden={side !== s}
              // Kelas display harus ikut mati: `grid` menimpa [hidden] bawaan.
              className={cn("mt-8 items-center gap-8 md:grid-cols-2", side === s ? "grid" : "hidden")}
            >
              <SideList
                data={s === "hrd" ? twoSides.hrd : twoSides.employee}
                icon={s === "hrd" ? <Monitor className="h-5 w-5" /> : <Smartphone className="h-5 w-5" />}
              />
              <div aria-hidden="true">
                {s === "hrd" ? (
                  <BrowserFrame>
                    <DashboardShot id="leave" sizes="(min-width: 1024px) 45vw, 90vw" />
                  </BrowserFrame>
                ) : (
                  <PhoneFrame className="mx-auto w-[210px]">
                    <LeaveRequestScreen dates={dates} />
                  </PhoneFrame>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <a
            href="#fitur"
            className="inline-flex min-h-[44px] items-center gap-1.5 text-[15px] font-semibold text-rs-primary-strong underline-offset-4 hover:underline"
          >
            {twoSides.link}
            <ArrowDown aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
      </Container>
    </section>
  );
}

function SideList({
  data,
  icon,
}: {
  data: { label: string; device: string; points: readonly string[] };
  icon: React.ReactNode;
}) {
  return (
    <div data-reveal="">
      <p className="flex items-center gap-2.5">
        <span className="flex h-10 w-10 items-center justify-center rounded-rs-sm bg-rs-primary/10 text-rs-primary-strong">
          {icon}
        </span>
        <span>
          <span className="block text-[18px] font-bold leading-tight text-rs-text">{data.label}</span>
          <span className="block text-[13px] font-semibold uppercase tracking-[0.06em] text-rs-muted">
            {data.device}
          </span>
        </span>
      </p>
      <ul className="mt-6 space-y-3.5">
        {data.points.map((p) => (
          <li key={p} className="flex items-start gap-3 text-[16px] leading-snug text-rs-text">
            <Check aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-rs-success" strokeWidth={2.5} />
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SyncVisual({ dates }: { dates: MockDates }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const tier = useMotionTier();
  const amp = TIER_AMPLITUDE[tier];

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) =>
      setBox({ w: entry.contentRect.width, h: entry.contentRect.height })
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ target: boxRef, offset: ["start 85%", "end 25%"] });
  // Laptop speed 0.9 & HP speed 1.1 -> bergerak berlawanan, saling mendekat.
  const laptopY = useTransform(scrollYProgress, [0, 1], [-30 * amp, 30 * amp]);
  const phoneY = useTransform(scrollYProgress, [0, 1], [50 * amp, -50 * amp]);
  const phoneX = useTransform(scrollYProgress, [0, 1], [24 * amp, -8 * amp]);

  // Kartu cuti: dari layar HP (kanan bawah) ke daftar persetujuan (kiri atas).
  const t = useTransform(scrollYProgress, [0.3, 0.7], [0, 1]);
  const dx = -box.w * 0.48;
  const dy = -box.h * 0.27;
  const cardX = useTransform(t, (v) => dx * easeInOut(v));
  const cardY = useTransform(t, (v) => dy * easeInOut(v) - Math.sin(Math.PI * v) * 60);
  const cardScale = useTransform(t, [0, 0.5, 1], [1, 1.06, 0.92]);
  const doneOpacity = useTransform(t, [0.85, 1], [0, 1]);

  const animated = amp > 0;

  return (
    <div ref={boxRef} aria-hidden="true" className="relative h-[460px] xl:h-[500px]">
      <motion.div style={animated ? { y: laptopY } : undefined} className="absolute left-0 top-[4%] w-[84%]">
        <BrowserFrame>
          <DashboardShot id="leave" sizes="(min-width: 1024px) 45vw, 90vw" />
        </BrowserFrame>
      </motion.div>

      <motion.div
        style={animated ? { y: phoneY, x: phoneX } : undefined}
        className="absolute bottom-0 right-0 w-[38%] max-w-[230px]"
      >
        <PhoneFrame>
          <LeaveRequestScreen dates={dates} />
        </PhoneFrame>
      </motion.div>

      {/* Kartu yang berpindah sepanjang jalur */}
      <motion.div
        style={animated ? { x: cardX, y: cardY, scale: cardScale } : { x: dx, y: dy }}
        className="absolute bottom-[26%] right-[6%] z-20 w-[210px] rounded-rs-md border border-rs-primary/30 bg-white p-3.5 shadow-e3"
      >
        <p className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.06em] text-rs-primary-strong">
          {twoSides.incoming.label}
          <motion.span style={animated ? { opacity: doneOpacity } : undefined} className="text-rs-success">
            {twoSides.incoming.done}
          </motion.span>
        </p>
        <p className="mt-1 text-[15px] font-bold text-rs-text">{twoSides.incoming.title}</p>
        <p className="text-[12.5px] text-rs-muted">Dimas P. - 13-14 {dates.month}</p>
      </motion.div>
    </div>
  );
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/** Layar karyawan: form pengajuan cuti terkirim. */
function LeaveRequestScreen({ dates }: { dates: MockDates }) {
  return (
    <div className="flex h-full flex-col px-[1.4em] pb-[1.4em] pt-[3em] text-[4.3cqw] leading-[1.3] text-rs-text">
      <p className="text-[1.3em] font-bold tracking-[-0.01em]">Ajukan Cuti</p>
      <div className="mt-[1em] space-y-[0.7em] text-[0.9em]">
        {[
          ["Jenis", "Cuti tahunan"],
          ["Tanggal", `13-14 ${dates.month}`],
          ["Durasi", "2 hari"],
          ["Sisa cuti", "12 hari"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-[0.7em] border border-rs-border px-[0.9em] py-[0.6em]">
            <p className="text-[0.8em] font-semibold text-slate-500">{k}</p>
            <p className="font-semibold">{v}</p>
          </div>
        ))}
      </div>
      <div className="mt-[1em] rounded-[0.8em] bg-amber-50 px-[0.9em] py-[0.7em] text-[0.82em] font-semibold text-amber-800 ring-1 ring-amber-100">
        Menunggu persetujuan HRD
      </div>
      <div className="mt-auto flex items-center justify-center gap-[0.5em] rounded-[0.9em] bg-rs-primary py-[0.8em] text-[0.95em] font-bold text-white">
        <Clock3 className="h-[1.1em] w-[1.1em]" />
        Terkirim ke HRD
      </div>
    </div>
  );
}
