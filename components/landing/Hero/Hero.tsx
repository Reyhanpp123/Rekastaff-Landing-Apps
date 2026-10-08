"use client";

import React, { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowDown, Banknote, Check, MapPin, PlayCircle } from "lucide-react";
import { hero } from "@/content/landing";
import type { MockDates } from "@/lib/format";
import { LAYER_SPEED } from "@/lib/motion/tokens";
import { TIER_AMPLITUDE, useMotionTier } from "@/lib/motion/tiers";
import { cn } from "@/lib/utils";
import Container from "../shared/Container";
import Eyebrow from "../shared/Eyebrow";
import CtaLink from "../shared/CtaLink";
import { BrowserFrame, PhoneFrame } from "../shared/DeviceFrame";
import Headline from "../shared/Headline";
import { ClockInScreen } from "../screens/Screens";
import DashboardShot from "../shared/DashboardShot";

/** Jarak referensi parallax hero (px) - layer bergerak (1 - speed) x ini. */
const HERO_TRAVEL = 420;

function useLayerY(progress: MotionValue<number>, speed: number, amp: number) {
  return useTransform(progress, [0, 1], [0, HERO_TRAVEL * (1 - speed) * amp]);
}

export default function Hero({
  dates,
  registerUrl,
}: {
  dates: MockDates;
  registerUrl: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const tier = useMotionTier();
  const amp = TIER_AMPLITUDE[tier];
  // Mobile (selective): hanya phone & chip yang bergerak (bagian 16-02).
  const ampDecor = tier === "selective" ? 0 : amp;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y0 = useLayerY(scrollYProgress, LAYER_SPEED.atmosphere, ampDecor);
  const y1 = useLayerY(scrollYProgress, LAYER_SPEED.context, ampDecor);
  const y2 = useLayerY(scrollYProgress, LAYER_SPEED.system, ampDecor);
  const y3 = useLayerY(scrollYProgress, LAYER_SPEED.content, ampDecor);
  const y4 = useLayerY(scrollYProgress, LAYER_SPEED.human, amp);
  const y5 = useLayerY(scrollYProgress, LAYER_SPEED.signal, amp);
  // Copy hanya memudar saat keluar viewport; saat dibaca selalu diam.
  const textOpacity = useTransform(scrollYProgress, [0.3, 0.75], [1, 0]);
  const phoneScale = useTransform(scrollYProgress, [0, 1], [1, 1 + 0.08 * amp]);

  // Petunjuk scroll hilang setelah 80px.
  const { scrollY } = useScroll();
  const hintOpacity = useTransform(scrollY, [0, 80], [1, 0]);

  // Mouse tilt: hanya tier full (pointer halus, tanpa reduced-motion).
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.6 });
  const tiltX = useTransform(sy, [-0.5, 0.5], [4, -4]);
  const tiltY = useTransform(sx, [-0.5, 0.5], [-4, 4]);
  const shiftX = useTransform(sx, [-0.5, 0.5], [-12, 12]);
  const shiftXSoft = useTransform(sx, [-0.5, 0.5], [-6, 6]);

  useEffect(() => {
    const el = ref.current;
    if (!el || tier !== "full") return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      mx.set((e.clientX - r.left) / r.width - 0.5);
      my.set((e.clientY - r.top) / r.height - 0.5);
    };
    const onLeave = () => {
      mx.set(0);
      my.set(0);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      onLeave();
    };
  }, [tier, mx, my]);

  const moving = amp > 0;
  const tilt = tier === "full";

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden [perspective:1400px]"
    >
      {/* L0 - Atmosfer pagi (speed 0.10) */}
      <motion.div
        aria-hidden="true"
        style={moving ? { y: y0 } : undefined}
        className="absolute inset-x-0 -top-24 -z-20 h-[calc(100%+12rem)] bg-gradient-to-b from-[#EAF2FF] via-[#F5F9FF] to-white"
      >
        <div className="absolute -left-40 -top-24 h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgb(253_230_138/.55),transparent)]" />
        <div className="absolute right-[-10%] top-[20%] h-[480px] w-[640px] rounded-full bg-[radial-gradient(closest-side,rgb(147_197_253/.35),transparent)]" />
      </motion.div>

      <Container
        wide
        className="grid items-center gap-x-12 gap-y-12 pb-16 pt-10 sm:pt-14 md:pb-20 lg:min-h-[max(640px,calc(100svh-64px))] lg:grid-cols-12 lg:py-12"
      >
        {/* L3 - Copy (speed 0.70, hanya saat keluar) */}
        <motion.div
          style={moving ? { y: y3, opacity: textOpacity } : undefined}
          className="relative z-10 lg:col-span-6 xl:col-span-6"
        >
          <div className="rs-enter" style={{ ["--d" as string]: "0ms" }}>
            <Eyebrow>{hero.eyebrow}</Eyebrow>
          </div>

          <h1
            id="hero-title"
            className="rs-enter mt-5 text-[clamp(32px,8.6vw,44px)] font-extrabold leading-[1.08] tracking-[-0.03em] text-rs-text md:text-[clamp(44px,6.4vw,60px)] lg:text-[clamp(40px,3.6vw,56px)]"
            style={{ ["--d" as string]: "80ms" }}
          >
            <Headline copy={hero.title} tone="gradient" />
          </h1>

          <p
            className="rs-enter rs-lead mt-6 max-w-[560px] text-rs-muted"
            style={{ ["--d" as string]: "320ms" }}
          >
            {hero.sub}
          </p>

          <div
            className="rs-enter mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={{ ["--d" as string]: "440ms" }}
          >
            <CtaLink href={registerUrl} external arrow className="w-full sm:w-auto">
              {hero.primaryCta}
            </CtaLink>
            <CtaLink
              href="#fitur"
              variant="secondary"
              className="w-full sm:w-auto"
              icon={<PlayCircle aria-hidden="true" className="h-5 w-5 text-rs-primary" />}
            >
              {hero.secondaryCta}
            </CtaLink>
          </div>
          <p
            className="rs-enter mt-5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[14px] font-medium text-rs-muted"
            style={{ ["--d" as string]: "500ms" }}
          >
            {hero.bullets.map((m) => (
              <span key={m} className="inline-flex items-center gap-1.5">
                <Check aria-hidden="true" className="h-4 w-4 text-rs-success" strokeWidth={2.5} />
                {m}
              </span>
            ))}
          </p>
        </motion.div>

        {/* Visual berlapis */}
        <div
          aria-hidden="true"
          className="relative h-[470px] sm:h-[540px] md:h-[560px] lg:col-span-6 lg:h-[600px] xl:h-[640px]"
        >
          {/* L1 - Peta & geofence (speed 0.25) */}
          <motion.div
            style={moving ? { y: y1 } : undefined}
            className="absolute -inset-x-16 -inset-y-10 [mask-image:radial-gradient(ellipse_at_center,#000_35%,transparent_72%)]"
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(37_99_235/.09)_1px,transparent_1px),linear-gradient(to_bottom,rgb(37_99_235/.09)_1px,transparent_1px)] bg-[size:44px_44px]" />
            <span className="absolute left-[58%] top-[56%] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-rs-primary/25" />
            <span className="absolute left-[58%] top-[56%] h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-rs-primary/30 bg-rs-primary/[0.04]" />
          </motion.div>

          {/* L2 - Dashboard HRD (speed 0.45) - disembunyikan di mobile */}
          <motion.div
            style={moving ? { y: y2 } : undefined}
            className="absolute left-0 top-[3%] hidden w-[84%] md:block lg:-left-[4%] lg:w-[94%]"
          >
            <motion.div style={tilt ? { rotateX: tiltX, rotateY: tiltY, x: shiftXSoft } : undefined}>
              <div className="rs-enter" style={{ ["--d" as string]: "220ms" }}>
                <BrowserFrame>
                  <DashboardShot id="attendance" sizes="(min-width: 1280px) 45vw, (min-width: 768px) 80vw, 100vw" />
                </BrowserFrame>
              </div>
            </motion.div>
          </motion.div>

          {/* L4 - HP karyawan (speed 0.90) */}
          <div className="absolute bottom-0 left-1/2 w-[206px] -translate-x-1/2 sm:w-[224px] md:left-auto md:right-[3%] md:translate-x-0 lg:w-[236px] xl:w-[256px]">
            <motion.div style={moving ? { y: y4, scale: phoneScale } : undefined}>
              <motion.div style={tilt ? { rotateX: tiltX, rotateY: tiltY, x: shiftX } : undefined}>
                <div className="rs-enter-phone" style={{ ["--d" as string]: "380ms" }}>
                  <PhoneFrame>
                    <ClockInScreen dates={dates} rollClock />
                  </PhoneFrame>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* L5 - Chip sinyal (speed 1.15) */}
          <motion.div
            style={moving ? { y: y5 } : undefined}
            className="pointer-events-none absolute inset-0"
          >
            <HeroChip
              className="left-0 top-[16%] sm:left-[4%] md:left-auto md:right-[33%] md:top-[50%] lg:right-[36%]"
              delay={760}
              icon={<MapPin className="h-4 w-4" />}
              tone="bg-rs-primary/10 text-rs-primary-strong"
              title={hero.chips[0].title}
              detail={hero.chips[0].detail}
            />
            <HeroChip
              className="right-0 top-[44%] sm:right-[4%] md:right-[-2%] md:top-[30%]"
              delay={860}
              icon={<Banknote className="h-4 w-4" />}
              tone="bg-emerald-50 text-emerald-700"
              title={hero.chips[1].title}
              detail={hero.chips[1].detail}
            />
          </motion.div>
        </div>
      </Container>

      {/* Ringkasan visual untuk pembaca layar */}
      <p className="sr-only">{hero.srSummary}</p>

      <motion.a
        href="#cerita"
        style={{ opacity: hintOpacity }}
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full px-3 py-2 text-[13px] font-semibold text-rs-muted lg:inline-flex"
      >
        {hero.scrollHint}
        <ArrowDown aria-hidden="true" className="h-4 w-4" />
      </motion.a>
    </section>
  );
}

function HeroChip({
  className,
  delay,
  icon,
  tone,
  title,
  detail,
}: {
  className: string;
  delay: number;
  icon: React.ReactNode;
  tone: string;
  title: string;
  detail: string;
}) {
  return (
    <div className={cn("absolute", className)}>
      <div
        className="rs-enter-pop flex items-center gap-2.5 rounded-rs-md border border-white/80 bg-white/90 py-2 pl-2 pr-4 shadow-e2 backdrop-blur"
        style={{ ["--d" as string]: `${delay}ms` }}
      >
        <span className={cn("flex h-8 w-8 items-center justify-center rounded-rs-sm", tone)}>{icon}</span>
        <span className="leading-tight">
          <span className="block text-[13px] font-bold text-rs-text">{title}</span>
          <span className="block text-[11.5px] font-medium text-rs-muted">{detail}</span>
        </span>
      </div>
    </div>
  );
}
