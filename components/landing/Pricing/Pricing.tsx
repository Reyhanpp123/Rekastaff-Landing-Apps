"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { BadgePercent, Check, MessageCircle, ShieldCheck } from "lucide-react";
import {
  type BillingAddon,
  type BillingProduct,
  formatDurationLabel,
  getAvailableDurations,
  getBestDurationDiscount,
  getDurationDiscount,
  getPackageForDuration,
  getRecommendedProduct,
  isFreeProduct,
  parseFeatureList,
  estimateSavings,
} from "@/lib/billing";
import { buildRegisterUrl, STARTER_PRD_IDX } from "@/lib/site";
import { SUPPORT_WHATSAPP_URL } from "@/lib/support";
import { formatNumber, formatRupiah } from "@/lib/format";
import { contextualCtaStore } from "@/lib/motion/store";
import { pricing } from "@/content/landing";
import { cn } from "@/lib/utils";
import Container from "../shared/Container";
import Eyebrow from "../shared/Eyebrow";
import CtaLink from "../shared/CtaLink";
import Headline from "../shared/Headline";
import { SLIDER_MAX, countToPosition, positionToCount, quote } from "./pricing-math";

type Tab = "plans" | "addons";

export interface PricingProps {
  products: BillingProduct[];
  addons: BillingAddon[];
  fetchError: string | null;
  initialDuration: number;
}

/**
 * Harga + Kalkulator (bagian 16-10). Section keputusan: TANPA parallax.
 * - Katalog billing tetap satu-satunya sumber harga.
 * - Hanya SATU badge, mengikuti rekomendasi kalkulator (AC-PR2).
 * - Rumus kuota minimal ditampilkan eksplisit (AC-PR1).
 * - Total diumumkan via aria-live polite dengan debounce 400ms (AC-PR3).
 * - Kedua tab selalu ada di HTML (crawler membaca harga add-on tanpa klik).
 */
export default function Pricing({ products, addons, fetchError, initialDuration }: PricingProps) {
  const [tab, setTab] = useState<Tab>("plans");
  const [employees, setEmployees] = useState(10);
  const [duration, setDuration] = useState(initialDuration);
  const [announce, setAnnounce] = useState("");
  const tabsId = useId();
  const tabRefs = useRef<Record<Tab, HTMLButtonElement | null>>({ plans: null, addons: null });

  const recommended = useMemo(() => getRecommendedProduct(products, employees), [products, employees]);
  const free = recommended ? isFreeProduct(recommended) : false;
  const paidProducts = useMemo(() => products.filter((p) => !isFreeProduct(p)), [products]);
  // Siklus selalu terlihat; dinonaktifkan saat paket gratis direkomendasikan.
  const durations = useMemo(() => getAvailableDurations(paidProducts.length ? paidProducts : products), [paidProducts, products]);
  const result = useMemo(
    () => (recommended ? quote(recommended, employees, duration) : null),
    [recommended, employees, duration]
  );
  const savings = recommended && !free ? estimateSavings(recommended, employees, duration) : null;
  // Banner diskon lama: persentase & durasi dihitung dari katalog.
  const bestDiscount = useMemo(() => getBestDurationDiscount(products), [products]);

  useEffect(() => {
    if (durations.length && !durations.some((d) => d.value === duration)) {
      setDuration(durations[0].value);
    }
  }, [durations, duration]);

  const registerUrlFor = (product: BillingProduct) =>
    isFreeProduct(product)
      ? buildRegisterUrl({ prd_idx: product.prd_idx })
      : buildRegisterUrl({
          prd_idx: product.prd_idx,
          pkg_idx: getPackageForDuration(product, duration)?.pkg_idx,
        });

  const ctaHref = recommended ? registerUrlFor(recommended) : buildRegisterUrl({ prd_idx: STARTER_PRD_IDX });
  const ctaLabel = pricing.ctaStart;

  // CTA kontekstual untuk sticky CTA mobile.
  useEffect(() => {
    contextualCtaStore.set({ label: ctaLabel, href: ctaHref });
  }, [ctaLabel, ctaHref]);
  useEffect(() => () => contextualCtaStore.set(null), []);

  // Pengumuman screen reader, sekali setelah pengguna berhenti 400ms.
  useEffect(() => {
    if (!recommended || !result) return;
    const text = free
      ? `${formatNumber(employees)} karyawan: paket ${recommended.prd_name}, gratis.`
      : result.total != null
        ? `${formatNumber(employees)} karyawan: paket ${recommended.prd_name}, total ${formatRupiah(result.total)} untuk ${duration} bulan.`
        : "";
    const t = window.setTimeout(() => setAnnounce(text), 400);
    return () => window.clearTimeout(t);
  }, [employees, duration, recommended, result, free]);

  const switchTab = (next: Tab) => {
    setTab(next);
    tabRefs.current[next]?.focus();
  };

  const setCount = (value: number) => setEmployees(Math.min(100000, Math.max(1, Math.round(value))));
  const sliderPos = countToPosition(employees);

  return (
    <section id="harga" aria-labelledby="harga-title" className="relative bg-rs-surface py-24 md:py-32">
      <span id="pricing" aria-hidden="true" className="absolute top-0" />
      <Container wide>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow>{pricing.eyebrow}</Eyebrow>
            <h2 id="harga-title" className="rs-h2 mt-4 text-rs-text">
              <Headline copy={pricing.title} />
            </h2>
          </div>
          <p className="rs-lead text-rs-muted lg:col-span-5 lg:pb-2">{pricing.sub}</p>
        </div>

        {bestDiscount && (
          <p className="mt-8 flex max-w-[760px] items-start gap-3 rounded-rs-md border border-emerald-500/25 bg-emerald-500/[0.06] px-4 py-3 text-[15px] leading-relaxed text-rs-text">
            <BadgePercent aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
            {pricing.discountBanner(Math.round(bestDiscount.percent), formatDurationLabel(bestDiscount.months))}
          </p>
        )}

        <div
          role="tablist"
          aria-label={pricing.tabs.label}
          className="mt-10 inline-flex rounded-full border border-rs-border bg-white p-1 shadow-e1"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
              e.preventDefault();
              switchTab(tab === "plans" ? "addons" : "plans");
            } else if (e.key === "Home") {
              e.preventDefault();
              switchTab("plans");
            } else if (e.key === "End") {
              e.preventDefault();
              switchTab("addons");
            }
          }}
        >
          {(
            [
              ["plans", pricing.tabs.plans],
              ["addons", pricing.tabs.addons],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              ref={(el) => {
                tabRefs.current[value] = el;
              }}
              id={`${tabsId}-${value}-tab`}
              type="button"
              role="tab"
              aria-selected={tab === value}
              aria-controls={`${tabsId}-${value}-panel`}
              tabIndex={tab === value ? 0 : -1}
              onClick={() => setTab(value)}
              className={cn(
                "h-11 whitespace-nowrap rounded-full px-3 text-[12.5px] font-bold transition-colors duration-200 sm:px-6 sm:text-[15px]",
                tab === value ? "bg-rs-ink text-white" : "text-rs-muted hover:text-rs-text"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Panel langganan */}
        <div
          id={`${tabsId}-plans-panel`}
          role="tabpanel"
          aria-labelledby={`${tabsId}-plans-tab`}
          hidden={tab !== "plans"}
          className="mt-8"
        >
          {fetchError || !products.length ? (
            <CatalogError />
          ) : (
            <div className="grid gap-6 lg:grid-cols-12 lg:items-start lg:gap-8">
              {/* Kalkulator */}
              <div className="rounded-rs-lg border border-rs-border bg-white p-6 shadow-e1 sm:p-8 lg:sticky lg:top-24 lg:col-span-5">
                <h3 className="text-[20px] font-bold tracking-[-0.01em] text-rs-text">{pricing.calculator.title}</h3>
                <p className="mt-1 text-[14px] leading-relaxed text-rs-muted">{pricing.calculator.sub}</p>
                <div className="mt-6 flex items-center justify-between gap-4">
                  <label htmlFor="jumlah-karyawan" className="text-[15px] font-semibold text-rs-text">
                    {pricing.calculator.employees}
                  </label>
                  <input
                    id="jumlah-karyawan"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    value={employees}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      setCount(Number.isNaN(v) ? 1 : v);
                    }}
                    className="tabular h-11 w-24 rounded-rs-sm border border-rs-border bg-white px-3 text-center text-[16px] font-bold text-rs-text focus:border-rs-primary"
                  />
                </div>
                <input
                  type="range"
                  aria-label={pricing.calculator.slider}
                  aria-valuetext={`${formatNumber(employees)} karyawan`}
                  min={0}
                  max={SLIDER_MAX}
                  step={1}
                  value={sliderPos}
                  onChange={(e) => setCount(positionToCount(Number(e.target.value)))}
                  style={{ ["--fill" as string]: `${(sliderPos / SLIDER_MAX) * 100}%` }}
                  className="rs-range mt-2"
                />
                <div aria-hidden="true" className="tabular flex justify-between text-[12px] font-medium text-rs-muted">
                  <span>1</span>
                  <span>50</span>
                  <span>200</span>
                  <span>500+</span>
                </div>

                <fieldset className="mt-6" disabled={free}>
                  <legend className="text-[15px] font-semibold text-rs-text">{pricing.calculator.cycle}</legend>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {durations.map((d) => {
                      const discount = recommended && !free ? getDurationDiscount(recommended, d.value) : null;
                      const selected = duration === d.value;
                      return (
                        <label
                          key={d.value}
                          className={cn(
                            "rs-choice relative flex min-h-[52px] cursor-pointer flex-col items-center justify-center rounded-rs-sm border px-2 py-2 text-center transition-colors",
                            selected && !free
                              ? "border-rs-primary bg-rs-primary/[0.06] text-rs-primary-strong"
                              : "border-rs-border bg-white text-rs-text hover:border-slate-300",
                            free && "cursor-not-allowed opacity-50"
                          )}
                        >
                          <input
                            type="radio"
                            name="siklus"
                            value={d.value}
                            checked={selected}
                            onChange={() => setDuration(d.value)}
                            className="sr-only"
                          />
                          <span className="text-[14px] font-bold">{d.label}</span>
                          {discount != null && (
                            <span className="text-[11.5px] font-bold text-emerald-700">
                              Hemat {Math.round(discount)}%
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                  {free && (
                    <p className="mt-2 text-[13px] text-rs-muted">{pricing.calculator.cycleFree}</p>
                  )}
                </fieldset>

                <div className="mt-7 border-t border-dashed border-rs-border pt-6">
                  <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-rs-muted">
                    {pricing.calculator.recommended}
                  </p>
                  <p className="mt-1 text-[22px] font-extrabold tracking-[-0.01em] text-rs-text">
                    {recommended?.prd_name ?? "-"}
                  </p>
                  <p className="tabular mt-3 text-[clamp(30px,3vw,38px)] font-extrabold leading-none tracking-[-0.02em] text-rs-primary-strong">
                    {free
                      ? pricing.calculator.free
                      : result?.total != null
                        ? formatRupiah(result.total)
                        : pricing.calculator.contact}
                    {!free && result?.total != null && (
                      <span className="ml-1.5 text-[15px] font-semibold tracking-normal text-rs-muted">
                        / {duration} bln
                      </span>
                    )}
                  </p>
                  {free && recommended ? (
                    <p className="mt-3 text-[14px] leading-relaxed text-rs-muted">
                      {formatNumber(employees)} karyawan masih dalam kuota paket {recommended.prd_name}
                      {Number(recommended.prd_max_employee) > 0 &&
                        ` (maks ${formatNumber(Number(recommended.prd_max_employee))} karyawan)`}
                      .
                    </p>
                  ) : (
                    result?.formula && (
                      <p className="tabular mt-3 rounded-rs-sm bg-rs-surface px-3 py-2.5 text-[13.5px] font-medium leading-relaxed text-rs-text">
                        {result.formula}
                        {result.belowMinimum && (
                          <span className="mt-1 block text-[12.5px] text-rs-muted">
                            {pricing.calculator.minimumNote(formatNumber(result.billable))}
                          </span>
                        )}
                      </p>
                    )
                  )}
                  {savings != null && (
                    <p className="mt-2 text-[13.5px] font-semibold text-emerald-700">
                      {pricing.calculator.savings(formatRupiah(savings))}
                    </p>
                  )}
                  <CtaLink href={ctaHref} external arrow size="md" className="mt-6 w-full" data-cta-end="">
                    {ctaLabel}
                  </CtaLink>
                  <p aria-live="polite" className="sr-only">
                    {announce}
                  </p>
                </div>
              </div>

              {/* Kartu paket */}
              <ul className={cn("grid gap-6 lg:col-span-7", products.length > 1 && "md:grid-cols-2")}>
                {products.map((product) => (
                  <li key={product.prd_idx}>
                    <PlanCard
                      product={product}
                      duration={duration}
                      recommended={recommended?.prd_idx === product.prd_idx}
                      href={registerUrlFor(product)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Panel add-on */}
        <div
          id={`${tabsId}-addons-panel`}
          role="tabpanel"
          aria-labelledby={`${tabsId}-addons-tab`}
          hidden={tab !== "addons"}
          className="mt-8"
        >
          <AddonPlans addons={addons} fetchError={fetchError} />
        </div>
      </Container>
    </section>
  );
}

function PlanCard({
  product,
  duration,
  recommended,
  href,
}: {
  product: BillingProduct;
  duration: number;
  recommended: boolean;
  href: string;
}) {
  const free = isFreeProduct(product);
  const features = parseFeatureList(product.prd_features);
  const pkg = getPackageForDuration(product, duration);
  const monthly = getPackageForDuration(product, 1);
  const rate = Number(pkg?.pkg_price || 0);
  const monthlyRate = Number(monthly?.pkg_price || 0);
  const paytype = (pkg?.pkg_paytype || product.prd_paytype || "package").toLowerCase();

  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-rs-lg border bg-white p-6 transition-[border-color,box-shadow] duration-200 sm:p-7",
        recommended ? "border-rs-primary shadow-[0_0_0_3px_rgb(37_99_235/.12)]" : "border-rs-border"
      )}
    >
      {recommended && (
        <span className="absolute -top-3 left-6 rounded-full bg-rs-primary px-3 py-1 text-[12px] font-bold text-white shadow-glow motion-ok:animate-in motion-ok:fade-in-0 motion-ok:zoom-in-95">
          {pricing.badge}
        </span>
      )}
      <h3 className="text-[22px] font-extrabold tracking-[-0.01em] text-rs-text">{product.prd_name}</h3>
      {/* Deskripsi paket dari katalog billing (seperti landing lama). */}
      {product.prd_desc && <p className="mt-1 text-[14.5px] text-rs-muted">{product.prd_desc}</p>}

      <div className="mt-6 min-h-[64px]">
        {free ? (
          <p className="tabular text-[38px] font-extrabold leading-none tracking-[-0.02em] text-rs-text">
            Rp 0
          </p>
        ) : pkg && paytype === "personal" ? (
          <>
            <p className="tabular flex flex-wrap items-baseline gap-x-2 text-[38px] font-extrabold leading-none tracking-[-0.02em] text-rs-text">
              {formatRupiah(rate)}
              {monthlyRate > rate && (
                <s className="text-[16px] font-semibold tracking-normal text-rs-muted">{formatRupiah(monthlyRate)}</s>
              )}
            </p>
            <p className="mt-1.5 text-[14px] font-medium text-rs-muted">{pricing.perEmployee}</p>
          </>
        ) : pkg ? (
          <p className="tabular text-[38px] font-extrabold leading-none tracking-[-0.02em] text-rs-text">
            {formatRupiah(rate)}
          </p>
        ) : (
          <p className="text-[18px] font-bold text-rs-text">{pricing.calculator.contact}</p>
        )}
      </div>

      <ul className="mt-6 flex-1 space-y-3 border-t border-rs-border pt-6">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-[15px] leading-snug text-rs-text">
            <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-rs-success" strokeWidth={2.5} />
            {f}
          </li>
        ))}
      </ul>

      <CtaLink
        href={href}
        external
        size="md"
        variant={recommended ? "primary" : "secondary"}
        className="mt-7 w-full"
      >
        {free ? pricing.ctaFree : pricing.ctaPlan(product.prd_name)}
      </CtaLink>
    </article>
  );
}

function AddonPlans({ addons, fetchError }: { addons: BillingAddon[]; fetchError: string | null }) {
  if (fetchError) return <CatalogError />;
  const total = addons.reduce((sum, a) => sum + Number(a.addon_price || 0), 0);
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-rs-lg border border-rs-border bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div className="flex gap-3">
          <ShieldCheck aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-rs-primary-strong" />
          <div className="max-w-[640px]">
            <h3 className="text-[17px] font-bold text-rs-text">{pricing.addon.title}</h3>
            <p className="mt-1 text-[15.5px] leading-relaxed text-rs-muted">{pricing.addon.body}</p>
          </div>
        </div>
        {total > 0 && (
          <p className="shrink-0 text-[14px] text-rs-muted">
            {pricing.addon.total}:{" "}
            <span className="tabular text-[18px] font-extrabold text-rs-text">{formatRupiah(total)}</span>
          </p>
        )}
      </div>

      {!addons.length ? (
        <p className="py-10 text-center text-[15px] text-rs-muted">{pricing.addon.empty}</p>
      ) : (
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {addons.map((a) => {
            const price = Number(a.addon_price || 0);
            return (
              <li key={a.addon_idx}>
                <article className="flex h-full flex-col rounded-rs-lg border border-rs-border bg-white p-6">
                  <h3 className="text-[19px] font-bold text-rs-text">{a.addon_name}</h3>
                  {a.addon_desc && <p className="mt-1 text-[14.5px] text-rs-muted">{a.addon_desc}</p>}
                  <p className="tabular mt-4 text-[28px] font-extrabold tracking-[-0.02em] text-rs-text">
                    {price > 0 ? formatRupiah(price) : pricing.calculator.free}
                    {price > 0 && <span className="ml-1.5 text-[14px] font-semibold tracking-normal text-rs-muted">{pricing.addon.once}</span>}
                  </p>
                  <ul className="mt-5 space-y-2.5 border-t border-rs-border pt-5">
                    {parseFeatureList(a.addon_features).map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-[14.5px] leading-snug text-rs-text">
                        <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-rs-success" strokeWidth={2.5} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function CatalogError() {
  return (
    <div className="mx-auto max-w-[520px] rounded-rs-lg border border-rs-border bg-white p-8 text-center">
      <p className="text-[17px] font-bold text-rs-text">{pricing.error.title}</p>
      <p className="mt-2 text-[15px] text-rs-muted">{pricing.error.body}</p>
      <CtaLink
        href={SUPPORT_WHATSAPP_URL}
        external
        variant="secondary"
        size="md"
        className="mt-5"
        icon={<MessageCircle aria-hidden="true" className="h-4 w-4 text-rs-success" />}
      >
        {pricing.error.cta}
      </CtaLink>
    </div>
  );
}
