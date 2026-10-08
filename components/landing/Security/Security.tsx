import React from "react";
import Link from "next/link";
import { ArrowRight, Building2, KeyRound, Lock, ShieldCheck, type LucideIcon } from "lucide-react";
import { security } from "@/content/landing";
import Container from "../shared/Container";
import Eyebrow from "../shared/Eyebrow";
import Headline from "../shared/Headline";

const PILLAR_ICON: Record<string, LucideIcon> = {
  enkripsi: Lock,
  rbac: KeyRound,
  terpisah: Building2,
};

/** Posisi vertikal kotak peran pada diagram (teksnya dari content/landing.ts). */
const ROLE_TOP = ["17%", "50%", "83%"];

/**
 * Keamanan Data (bagian 16-08). Palet malam, TANPA parallax - kepercayaan
 * lahir dari ketenangan. Hanya diagram RBAC yang tergambar sekali saat
 * terlihat (stroke-dashoffset 900ms). Klaim terbatas pada yang sudah
 * dinyatakan di FAQ / katalog (enkripsi, RBAC, ruang data terpisah).
 */
export default function Security() {
  return (
    <section
      id="keamanan"
      aria-labelledby="keamanan-title"
      data-tone="dark"
      className="relative overflow-hidden bg-rs-night py-24 text-rs-night-text md:py-32"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(50%_60%_at_80%_20%,rgb(37_99_235/.22),transparent)]"
      />
      <Container wide className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6" data-reveal="">
            <Eyebrow tone="dark">{security.eyebrow}</Eyebrow>
            <h2 id="keamanan-title" className="rs-h2 mt-4 text-white">
              <Headline copy={security.title} tone="dark" />
            </h2>
            <p className="rs-lead mt-5 max-w-[520px] text-rs-night-muted">{security.sub}</p>
          </div>

          {/* Diagram RBAC */}
          <div className="lg:col-span-6">
            <div
              role="img"
              aria-label={security.diagram.label}
              className="relative mx-auto aspect-[5/3] w-full max-w-[560px]"
            >
              <svg
                data-draw=""
                viewBox="0 0 500 300"
                fill="none"
                aria-hidden="true"
                className="absolute inset-0 h-full w-full"
              >
                {[50, 150, 250].map((y, i) => (
                  <path
                    key={y}
                    pathLength={1}
                    d={`M150 150 C 250 150, 250 ${y}, 330 ${y}`}
                    stroke={i === 0 ? "#60A5FA" : "rgb(154 168 194 / .55)"}
                    strokeWidth={i === 0 ? 2.5 : 2}
                    strokeLinecap="round"
                    style={{ transitionDelay: `${i * 150}ms` }}
                  />
                ))}
              </svg>
              <div className="absolute left-[30%] top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2">
                <span className="flex h-16 w-16 items-center justify-center rounded-rs-md bg-rs-primary text-white shadow-[0_0_0_10px_rgb(37_99_235/.15)]">
                  <ShieldCheck aria-hidden="true" className="h-7 w-7" />
                </span>
                <span className="whitespace-nowrap text-[13px] font-bold text-white">{security.diagram.center}</span>
              </div>
              {security.diagram.roles.map((r, i) => (
                <div
                  key={r.title}
                  style={{ top: ROLE_TOP[i] }}
                  className="absolute left-[66%] w-[34%] -translate-y-1/2 rounded-rs-md border border-rs-night-border bg-rs-night-raised px-3.5 py-2.5 shadow-night"
                >
                  <p className="text-[14px] font-bold text-white">{r.title}</p>
                  <p className="text-[12.5px] text-rs-night-muted">{r.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <ul className="mt-16 grid gap-px overflow-hidden rounded-rs-lg border border-rs-night-border bg-rs-night-border md:grid-cols-3">
          {security.pillars.map((p, i) => {
            const Icon = PILLAR_ICON[p.key];
            return (
              <li
                key={p.key}
                data-reveal=""
                data-reveal-delay={String(i * 80)}
                className="bg-rs-night p-7 sm:p-8"
              >
                <Icon aria-hidden="true" className="h-6 w-6 text-sky-300" />
                <h3 className="mt-5 text-[19px] font-bold text-white">{p.title}</h3>
                <p className="mt-2 text-[15.5px] leading-relaxed text-rs-night-muted">{p.body}</p>
              </li>
            );
          })}
        </ul>

        <Link
          href="/kebijakan-privasi"
          className="mt-10 inline-flex min-h-[44px] items-center gap-1.5 text-[15px] font-semibold text-sky-300 underline-offset-4 hover:underline"
        >
          {security.link}
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </Container>
    </section>
  );
}
