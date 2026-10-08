"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { onboarding } from "@/content/landing";
import { useMotionTier } from "@/lib/motion/tiers";
import Container from "../shared/Container";
import Eyebrow from "../shared/Eyebrow";
import Headline from "../shared/Headline";
import CtaLink from "../shared/CtaLink";

/**
 * Cara Kerja / Onboarding (bagian 16-09): 3 langkah mulai memakai Rekastaff.
 * Garis progres terisi mengikuti scroll (scaleX desktop / scaleY mobile).
 * Tanpa parallax.
 */
export default function Onboarding({ registerUrl }: { registerUrl: string }) {
  const ref = useRef<HTMLOListElement>(null);
  const tier = useMotionTier();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 55%"] });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const animated = tier !== "static";

  return (
    <section id="mulai" aria-labelledby="mulai-title" className="relative bg-white py-24 md:py-32">
      <Container wide>
        <div className="max-w-[640px]" data-reveal="">
          <Eyebrow>{onboarding.eyebrow}</Eyebrow>
          <h2 id="mulai-title" className="rs-h2 mt-4 text-rs-text">
            <Headline copy={onboarding.title} />
          </h2>
          <p className="rs-lead mt-5 text-rs-muted">{onboarding.sub}</p>
        </div>

        <ol ref={ref} className="relative mt-14 grid gap-10 pl-10 md:mt-16 md:grid-cols-3 md:gap-8 md:pl-0 md:pt-12">
          {/* Rel progres */}
          <span aria-hidden="true" className="absolute bottom-2 left-[11px] top-2 w-[2px] rounded-full bg-rs-border md:bottom-auto md:left-0 md:right-0 md:top-[11px] md:h-[2px] md:w-auto" />
          <motion.span
            aria-hidden="true"
            style={animated ? { scaleY: fill } : undefined}
            className="absolute bottom-2 left-[11px] top-2 w-[2px] origin-top rounded-full bg-gradient-to-b from-rs-primary to-rs-cyan md:hidden"
          />
          <motion.span
            aria-hidden="true"
            style={animated ? { scaleX: fill } : undefined}
            className="absolute left-0 right-0 top-[11px] hidden h-[2px] origin-left rounded-full bg-gradient-to-r from-rs-primary to-rs-cyan md:block"
          />

          {onboarding.steps.map((s, i) => (
            <li key={s.title} className="relative" data-reveal="" data-reveal-delay={String(i * 80)}>
              <span
                aria-hidden="true"
                className="absolute -left-10 top-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-rs-primary bg-white text-[11px] font-extrabold text-rs-primary-strong md:-top-12 md:left-0"
              >
                {i + 1}
              </span>
              <p className="tabular text-[13px] font-bold uppercase tracking-[0.06em] text-rs-amber-strong">{s.label}</p>
              <h3 className="mt-2 text-[22px] font-bold tracking-[-0.015em] text-rs-text">{s.title}</h3>
              <p className="mt-2 max-w-[340px] text-[16px] leading-relaxed text-rs-muted">{s.body}</p>
            </li>
          ))}
        </ol>

        <div data-cta-end="" className="mt-14 flex justify-center">
          <CtaLink href={registerUrl} external arrow>
            {onboarding.cta}
          </CtaLink>
        </div>
      </Container>
    </section>
  );
}
