"use client";

import React, { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { Check, MessageCircle } from "lucide-react";
import { finalCta } from "@/content/landing";
import type { MockDates } from "@/lib/format";
import { SUPPORT_WHATSAPP_URL } from "@/lib/support";
import { EASE } from "@/lib/motion/tokens";
import { TIER_AMPLITUDE, useMotionTier } from "@/lib/motion/tiers";
import Container from "../shared/Container";
import CtaLink from "../shared/CtaLink";
import Headline from "../shared/Headline";
import { PhoneFrame } from "../shared/DeviceFrame";
import { ClockInScreen } from "../screens/Screens";

/**
 * Final CTA (bagian 16-13): bookend dengan hero. Langit malam berganti fajar
 * (crossfade 2 layer, bukan animasi warna), cahaya matahari naik, jam
 * berganti 23.59 -> 08.02. Area teks tetap gelap sehingga kontras teks dan
 * kedua CTA tetap AA sepanjang transisi (AC-C1).
 */
export default function FinalCTA({
  registerUrl,
  dates,
}: {
  registerUrl: string;
  dates: MockDates;
}) {
  const ref = useRef<HTMLElement>(null);
  const tier = useMotionTier();
  const amp = TIER_AMPLITUDE[tier];
  const animated = amp > 0;
  const [morning, setMorning] = useState(false);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const dawnOpacity = useTransform(scrollYProgress, [0.15, 0.85], [0, 1]);
  const skyY = useTransform(scrollYProgress, [0, 1], [-40 * amp, 0]);
  const sunY = useTransform(scrollYProgress, [0, 1], [160 * amp, 0]);
  const phoneY = useTransform(scrollYProgress, [0, 1], [90 * amp, -20 * amp]);
  useMotionValueEvent(scrollYProgress, "change", (p) => setMorning(p > 0.55));

  const showMorning = !animated || morning;
  const clock = showMorning ? "08.02" : "23.59";

  return (
    <section
      ref={ref}
      aria-labelledby="final-title"
      data-tone="dark"
      data-cta-end=""
      className="relative isolate overflow-hidden bg-rs-night py-28 text-white md:py-36"
    >
      {/* L0 - langit malam (speed 0.1) */}
      <motion.div
        aria-hidden="true"
        style={animated ? { y: skyY } : undefined}
        className="absolute inset-x-0 -top-10 -z-20 h-[calc(100%+40px)] bg-gradient-to-b from-[#0B1220] to-[#13234A]"
      />
      {/* L0' - langit fajar, crossfade */}
      <motion.div
        aria-hidden="true"
        style={animated ? { opacity: dawnOpacity } : { opacity: 1 }}
        className="absolute inset-0 -z-20 bg-gradient-to-b from-[#0B1220] via-[#172C63] to-[#1E40AF]"
      />
      {/* L1 - cahaya matahari terbit (speed 0.3, naik) */}
      <motion.div
        aria-hidden="true"
        style={animated ? { x: "-50%", y: sunY, opacity: dawnOpacity } : { x: "-50%" }}
        className="absolute -bottom-[340px] left-1/2 -z-10 h-[620px] w-[1100px] max-w-[160vw] rounded-full bg-[radial-gradient(closest-side,rgb(251_191_36/.55),rgb(251_146_60/.22)_45%,transparent_72%)]"
      />

      <Container className="relative text-center">
        <div aria-hidden="true" className="relative mx-auto h-[0.9em] overflow-hidden text-[clamp(72px,12vw,160px)] font-extrabold leading-[0.9] tracking-[-0.05em] text-white/[0.14]">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={clock}
              className="tabular block"
              initial={{ y: "60%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "-60%", opacity: 0 }}
              transition={{ duration: 0.5, ease: [...EASE.inOut] }}
            >
              {clock}
            </motion.span>
          </AnimatePresence>
        </div>

        <h2 id="final-title" className="rs-h2 mx-auto -mt-6 max-w-[820px] text-white sm:-mt-10">
          <Headline copy={finalCta.title} tone="dark" />
        </h2>
        <p className="rs-lead mx-auto mt-5 max-w-[640px] text-[#C9D5EC]">{finalCta.sub}</p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <CtaLink href={registerUrl} external arrow variant="light" className="w-full sm:w-auto">
            {finalCta.primary}
          </CtaLink>
          <CtaLink
            href={SUPPORT_WHATSAPP_URL}
            external
            variant="ghost-dark"
            className="w-full sm:w-auto"
            icon={<MessageCircle aria-hidden="true" className="h-5 w-5 text-emerald-300" />}
          >
            {finalCta.secondary}
          </CtaLink>
        </div>
        <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[14px] font-semibold text-white/80">
          {finalCta.bullets.map((b) => (
            <li key={b} className="inline-flex items-center gap-1.5">
              <Check aria-hidden="true" className="h-4 w-4 text-white" strokeWidth={2.5} />
              {b}
            </li>
          ))}
        </ul>
      </Container>

      {/* L3 - HP kecil (speed 1.15) - desktop saja */}
      <motion.div
        aria-hidden="true"
        style={animated ? { y: phoneY, rotate: 8 } : { rotate: 8 }}
        className="absolute bottom-[-120px] right-[4%] hidden w-[180px] opacity-90 xl:block"
      >
        <PhoneFrame>
          <ClockInScreen dates={dates} />
        </PhoneFrame>
      </motion.div>
    </section>
  );
}
