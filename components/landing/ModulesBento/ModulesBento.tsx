import React from "react";
import {
  Banknote,
  CalendarClock,
  CalendarRange,
  Check,
  FileText,
  FolderOpen,
  MapPin,
  Plane,
  Puzzle,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";
import { modules } from "@/content/landing";
import type { BillingAddon } from "@/lib/billing";
import { parseFeatureList } from "@/lib/billing";
import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";
import Container from "../shared/Container";
import Eyebrow from "../shared/Eyebrow";
import CtaLink from "../shared/CtaLink";
import Headline from "../shared/Headline";
import { MiniAttendance, MiniDocs, MiniEmployees, MiniLeave, MiniPayroll, MiniShift } from "./Mini";

const CORE: Record<string, { icon: LucideIcon; mini: React.ComponentType; span: string }> = {
  absensi: { icon: MapPin, mini: MiniAttendance, span: "lg:col-span-6 lg:row-span-2" },
  payroll: { icon: Banknote, mini: MiniPayroll, span: "lg:col-span-6 lg:row-span-2" },
  cuti: { icon: CalendarRange, mini: MiniLeave, span: "lg:col-span-3" },
  karyawan: { icon: Users, mini: MiniEmployees, span: "lg:col-span-3" },
  shift: { icon: CalendarClock, mini: MiniShift, span: "lg:col-span-3" },
  dokumen: { icon: FolderOpen, mini: MiniDocs, span: "lg:col-span-3" },
};

function addonIcon(name: string): LucideIcon {
  const n = name.toLowerCase();
  if (n.includes("rekrut") || n.includes("recruit")) return UserPlus;
  if (n.includes("dinas") || n.includes("travel")) return Plane;
  if (n.includes("dokumen")) return FileText;
  return Puzzle;
}

/**
 * Modul Lengkap (bagian 16-07): section baca, TANPA parallax. Reveal sekali
 * dengan stagger 60ms. Daftar add-on diambil dari katalog billing - sumber
 * yang sama dengan tab Add-on di section harga (AC-PR4).
 */
export default function ModulesBento({
  addons,
  registerUrl,
}: {
  addons: BillingAddon[];
  registerUrl: string;
}) {
  return (
    <section id="fitur" aria-labelledby="fitur-title" className="relative bg-rs-surface py-24 md:py-32">
      <span id="features" aria-hidden="true" className="absolute top-0" />
      <Container wide>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end" data-reveal="">
          <div className="lg:col-span-7">
            <Eyebrow>{modules.eyebrow}</Eyebrow>
            <h2 id="fitur-title" tabIndex={-1} className="rs-h2 mt-4 text-rs-text outline-none">
              <Headline copy={modules.title} />
            </h2>
          </div>
          <p className="rs-lead text-rs-muted lg:col-span-5 lg:pb-2">{modules.sub}</p>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-12 lg:gap-5">
          {modules.core.map((m, i) => {
            const meta = CORE[m.key];
            const Icon = meta.icon;
            const Mini = meta.mini;
            const big = i < 2;
            return (
              <li
                key={m.key}
                data-reveal=""
                data-reveal-delay={String(i * 60)}
                className={cn(big && "sm:col-span-2 lg:col-span-6", meta.span)}
              >
                <article
                  className={cn(
                    "group flex h-full flex-col overflow-hidden rounded-rs-lg border border-rs-border bg-white transition-[transform,border-color,box-shadow] duration-200 ease-rs-standard hover:-translate-y-1 hover:border-rs-primary/40 hover:shadow-e2 motion-off:hover:translate-y-0",
                    big ? "p-6 sm:p-8" : "p-6"
                  )}
                >
                  {big ? (
                    <>
                      <p className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.06em] text-rs-primary-strong">
                        <Icon aria-hidden="true" className="h-4 w-4" />
                        {m.name}
                      </p>
                      <h3 className="mt-3 text-[clamp(22px,2.2vw,28px)] font-bold leading-[1.2] tracking-[-0.015em] text-rs-text">
                        {m.title}
                      </h3>
                      <p className="mt-2 max-w-[460px] text-[16px] leading-relaxed text-rs-muted">{m.body}</p>
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {m.tags.map((tag) => (
                          <li
                            key={tag}
                            className="inline-flex items-center gap-1.5 rounded-full border border-rs-border bg-rs-surface px-3 py-1.5 text-[12.5px] font-semibold text-rs-text"
                          >
                            <Check aria-hidden="true" className="h-3.5 w-3.5 text-rs-primary" strokeWidth={2.5} />
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <>
                      <h3 className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.06em] text-rs-primary-strong">
                        <Icon aria-hidden="true" className="h-4 w-4" />
                        {m.title}
                      </h3>
                      <p className="mt-3 text-[17px] font-semibold leading-snug tracking-[-0.01em] text-rs-text">
                        {m.body}
                      </p>
                    </>
                  )}
                  <div aria-hidden="true" className={cn("mt-auto", big ? "pt-8" : "pt-6")}>
                    <Mini />
                  </div>
                </article>
              </li>
            );
          })}
        </ul>

        {addons.length > 0 && (
          <div
            data-reveal=""
            className="mt-5 rounded-rs-lg border border-dashed border-rs-primary/35 bg-white/70 p-6 sm:p-8"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-[20px] font-bold tracking-[-0.01em] text-rs-text">{modules.addonTitle}</h3>
                <p className="mt-1 text-[15px] text-rs-muted">{modules.addonSub}</p>
              </div>
              <a
                href="#harga"
                className="inline-flex min-h-[44px] items-center text-[15px] font-semibold text-rs-primary-strong underline-offset-4 hover:underline"
              >
                {modules.addonLink}
              </a>
            </div>
            <ul className="mt-6 grid gap-4 md:grid-cols-2">
              {addons.map((a) => {
                const Icon = addonIcon(a.addon_name);
                const features = parseFeatureList(a.addon_features).slice(0, 3);
                const price = Number(a.addon_price || 0);
                return (
                  <li key={a.addon_idx} className="flex gap-4 rounded-rs-md border border-rs-border bg-white p-5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-rs-sm bg-rs-primary/10 text-rs-primary-strong">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="text-[17px] font-bold text-rs-text">{a.addon_name}</span>
                        <span className="tabular text-[14px] font-semibold text-rs-muted">
                          {price > 0 ? `${formatRupiah(price)} ${modules.addonOnce}` : modules.addonFree}
                        </span>
                      </p>
                      <ul className="mt-2 space-y-1">
                        {features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-[14px] text-rs-muted">
                            <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-rs-success" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div data-cta-end="" className="mt-12 flex justify-center">
          <CtaLink href={registerUrl} external arrow>
            {modules.cta}
          </CtaLink>
        </div>
      </Container>
    </section>
  );
}
