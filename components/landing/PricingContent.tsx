"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Check,
  HelpCircle,
  Sparkles,
  Calculator,
  Coins,
  TrendingUp,
  UserPlus,
  Plane,
  DollarSign,
  FileText,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  Puzzle,
  BadgePercent,
  PiggyBank,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BillingAddon,
  BillingProduct,
  estimateProductTotal,
  estimateSavings,
  formatDurationLabel,
  getAvailableDurations,
  getBestDurationDiscount,
  getDurationDiscount,
  getPackageForDuration,
  getPackageMonths,
  getRecommendedProduct,
  isFreeProduct,
  parseFeatureList,
} from "@/lib/billing";
import { buildRegisterUrl, STARTER_PRD_IDX } from "@/lib/site";

const formatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

const ADDON_STYLES: { icon: LucideIcon; color: string; bg: string }[] = [
  { icon: Coins, color: "text-green-500", bg: "bg-green-500/10" },
  { icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10" },
  { icon: UserPlus, color: "text-purple-500", bg: "bg-purple-500/10" },
  { icon: Plane, color: "text-amber-500", bg: "bg-amber-500/10" },
  { icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { icon: FileText, color: "text-rose-500", bg: "bg-rose-500/10" },
  { icon: MessageSquare, color: "text-cyan-500", bg: "bg-cyan-500/10" },
  { icon: Puzzle, color: "text-indigo-500", bg: "bg-indigo-500/10" },
];

function getAddonStyle(name: string, index: number) {
  const n = name.toLowerCase();
  if (n.includes("gaji") || n.includes("payroll") || n.includes("penggajian")) {
    return ADDON_STYLES[0];
  }
  if (n.includes("kpi") || n.includes("performance") || n.includes("kinerja")) {
    return ADDON_STYLES[1];
  }
  if (n.includes("recruit")) return ADDON_STYLES[2];
  if (n.includes("dinas") || n.includes("travel")) return ADDON_STYLES[3];
  if (n.includes("keuangan") || n.includes("finance")) return ADDON_STYLES[4];
  if (n.includes("dokumen") || n.includes("document")) return ADDON_STYLES[5];
  if (n.includes("komunikasi") || n.includes("communication")) return ADDON_STYLES[6];
  return ADDON_STYLES[index % ADDON_STYLES.length];
}

export interface PricingContentProps {
  products: BillingProduct[];
  addons: BillingAddon[];
  fetchError: string | null;
  /**
   * Durasi awal yang dihitung di server dari katalog. Dipakai sebagai nilai
   * seed agar render pertama (yang masuk ke HTML) sudah menampilkan harga
   * paket sungguhan, bukan fallback "Hubungi Sales".
   */
  initialDuration: number;
}

export default function PricingContent({
  products,
  addons,
  fetchError,
  initialDuration,
}: PricingContentProps) {
  const [duration, setDuration] = useState<number>(initialDuration);
  const [employeeCount, setEmployeeCount] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>("plans");

  const formatPrice = (val: number) => formatter.format(val);

  const addonBundleTotal = useMemo(
    () => addons.reduce((sum, a) => sum + Number(a.addon_price || 0), 0),
    [addons]
  );

  const recommended = useMemo(
    () => getRecommendedProduct(products, employeeCount),
    [products, employeeCount]
  );

  const recommendedTotal = useMemo(() => {
    if (!recommended) return null;
    return estimateProductTotal(recommended, employeeCount, duration);
  }, [recommended, employeeCount, duration]);

  /** Diskon terbesar di katalog — dipakai untuk banner promosi. */
  const bestDiscount = useMemo(
    () => getBestDurationDiscount(products),
    [products]
  );

  /** Hemat nominal untuk kombinasi yang sedang dipilih di kalkulator. */
  const recommendedSavings = useMemo(() => {
    if (!recommended) return null;
    return estimateSavings(recommended, employeeCount, duration);
  }, [recommended, employeeCount, duration]);

  const recommendedPkg = useMemo(
    () => (recommended ? getPackageForDuration(recommended, duration) : null),
    [recommended, duration]
  );

  const recommendedPaytype = (
    recommendedPkg?.pkg_paytype ||
    recommended?.prd_paytype ||
    "package"
  ).toLowerCase();

  const durations = useMemo(
    () => getAvailableDurations(recommended ? [recommended] : []),
    [recommended]
  );

  useEffect(() => {
    if (!durations.length) return;
    if (!durations.some((d) => d.value === duration)) {
      setDuration(durations[0].value);
    }
  }, [durations, duration]);

  const selectedDurationLabel =
    durations.find((d) => d.value === duration)?.label || `${duration} Bulan`;

  const handleSliderChange = (value: number[]) => {
    if (value && value.length > 0) {
      setEmployeeCount(value[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 1) {
      setEmployeeCount(val);
    } else if (e.target.value === "") {
      setEmployeeCount(1);
    }
  };

  const getProductRegisterUrl = (product: BillingProduct) => {
    if (isFreeProduct(product)) {
      return buildRegisterUrl({ prd_idx: product.prd_idx });
    }
    const pkg = getPackageForDuration(product, duration);
    return buildRegisterUrl({
      prd_idx: product.prd_idx,
      pkg_idx: pkg?.pkg_idx,
    });
  };

  const recommendedRegisterUrl = recommended
    ? getProductRegisterUrl(recommended)
    : buildRegisterUrl({ prd_idx: STARTER_PRD_IDX });

  const renderProductPrice = (product: BillingProduct) => {
    if (isFreeProduct(product)) {
      return (
        <>
          <span className="text-4xl font-extrabold text-default-900">Rp 0</span>
          <span className="text-default-500 text-sm font-semibold"> / gratis</span>
        </>
      );
    }

    const pkg = getPackageForDuration(product, duration);
    const paytype = (pkg?.pkg_paytype || product.prd_paytype || "package").toLowerCase();
    const months = pkg ? getPackageMonths(pkg) || duration : duration;

    if (pkg && paytype === "personal") {
      const rate = Number(pkg.pkg_price || product.prd_price_extra_employee || 0);
      return (
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold text-default-900">
              {formatPrice(rate)}
            </span>
            <span className="text-default-500 text-sm font-semibold">
              / karyawan / bulan
            </span>
          </div>
          {Number(product.prd_min_employee || 0) > 0 && (
            <span className="text-xs text-default-400 font-semibold mt-1">
              Minimal {product.prd_min_employee} karyawan
            </span>
          )}
        </div>
      );
    }

    if (pkg) {
      return (
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold text-default-900">
              {formatPrice(Number(pkg.pkg_price || 0))}
            </span>
            <span className="text-default-500 text-sm font-semibold">
              / {months} Bulan
            </span>
          </div>
          {months > 0 && (
            <span className="text-xs text-default-400 font-semibold mt-1">
              Setara {formatPrice(Math.round(Number(pkg.pkg_price) / months))} / bulan
            </span>
          )}
        </div>
      );
    }

    const extra = Number(product.prd_price_extra_employee || 0);
    if (product.prd_paytype === "personal" && extra > 0) {
      return (
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold text-default-900">
              {formatPrice(extra)}
            </span>
            <span className="text-default-500 text-sm font-semibold">
              / karyawan / bulan
            </span>
          </div>
          {Number(product.prd_min_employee || 0) > 0 && (
            <span className="text-xs text-default-400 font-semibold mt-1">
              Minimal {product.prd_min_employee} karyawan
            </span>
          )}
        </div>
      );
    }

    if (extra > 0) {
      return (
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-semibold text-default-600">
              Extra karyawan {formatPrice(extra)} / kary / bulan
            </span>
          </div>
          <span className="text-xs text-default-400 font-semibold mt-1">
            Lihat kalkulator untuk estimasi total
          </span>
        </div>
      );
    }

    return (
      <span className="text-lg font-bold text-default-700">Hubungi Sales</span>
    );
  };

  return (
    <section id="pricing" className="py-24 bg-default-50/30 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="container px-4 sm:px-8 font-sans">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-4 text-xs px-4 py-1" color="default" variant="soft">
            <Sparkles className="h-3.5 w-3.5 mr-2 inline text-primary" /> Harga Fleksibel & Transparan
          </Badge>
          <h2 className="text-3xl md:text-5xl font-extrabold text-default-900 mb-6 leading-tight">
            Pilih Paket Terbaik untuk <span className="text-primary">Tim Anda</span>
          </h2>
          <p className="text-lg text-default-600">
            Mulai gratis untuk tim kecil, atau upgrade ke paket profesional dengan kuota yang fleksibel sesuai ukuran bisnis Anda.
          </p>
        </div>

        {/*
          Banner diskon. Persentasenya dihitung dari katalog (harga periode
          dibanding tarif bulanan × jumlah bulan), jadi ikut berubah sendiri
          bila admin mengubah harga — dan hilang sendiri bila diskon dicabut.
        */}
        {bestDiscount && (
          <div className="flex justify-center -mt-8 mb-12">
            <div className="inline-flex items-center gap-4 rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.06] px-5 py-4 shadow-sm">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                <BadgePercent className="h-6 w-6 text-emerald-600" />
              </span>
              <p className="text-left text-sm text-default-700 leading-relaxed">
                <span className="font-extrabold text-emerald-600">
                  Hemat hingga {Math.round(bestDiscount.percent)}%
                </span>{" "}
                dengan berlangganan {formatDurationLabel(bestDiscount.months)}.
                <span className="hidden sm:inline">
                  {" "}
                  Semakin panjang siklus pembayaran, semakin besar potongannya.
                </span>
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 bg-default-100 rounded-full border shadow-sm">
            <button
              onClick={() => setActiveTab("plans")}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab === "plans"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-default-600 hover:text-primary"
              }`}
            >
              Paket Langganan Utama
            </button>
            <button
              onClick={() => setActiveTab("addons")}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab === "addons"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-default-600 hover:text-primary"
              }`}
            >
              Modul Add-on Pro+
            </button>
          </div>
        </div>

        {/*
          Kedua panel selalu dirender (yang non-aktif hanya disembunyikan lewat
          CSS) supaya nama, deskripsi, dan harga modul add-on ikut masuk ke HTML
          dan bisa dibaca crawler tanpa perlu menekan tab.
        */}
        <div className={activeTab === "plans" ? undefined : "hidden"}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-16"
          >
            {fetchError ? (
              <div className="max-w-xl mx-auto text-center py-12 space-y-3">
                <HelpCircle className="h-8 w-8 text-default-400 mx-auto" />
                <p className="text-sm text-default-600">{fetchError}</p>
              </div>
            ) : (
              <div
                className={`grid grid-cols-1 gap-8 items-stretch mx-auto ${
                  products.length <= 1
                    ? "md:grid-cols-1 max-w-md"
                    : products.length === 2
                      ? "md:grid-cols-2 max-w-4xl"
                      : "md:grid-cols-3 max-w-6xl"
                }`}
              >
                {products.map((product) => {
                  const features = parseFeatureList(product.prd_features);
                  const isRecommended = recommended?.prd_idx === product.prd_idx;
                  const nameLower = (product.prd_name || "").toLowerCase();
                  const isPopular =
                    nameLower.includes("pro") && !nameLower.includes("starter");

                  return (
                    <Card
                      key={product.prd_idx}
                      className={`flex flex-col relative transition-all duration-300 hover:shadow-xl border-t-4 ${
                        isRecommended
                          ? "border-primary shadow-lg scale-105 md:scale-[1.03] z-10"
                          : isPopular
                            ? "border-primary/50"
                            : "border-default-200"
                      }`}
                    >
                      <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 flex gap-1">
                        {isPopular && (
                          <Badge className="bg-amber-500 text-white font-bold px-3 py-1 text-xs">
                            TERLARIS
                          </Badge>
                        )}
                        {isRecommended && (
                          <Badge className="bg-primary text-primary-foreground font-bold px-3 py-1 text-xs">
                            REKOMENDASI
                          </Badge>
                        )}
                      </div>

                      <CardHeader className="p-8">
                        <CardTitle className="text-2xl font-bold text-default-900">
                          {product.prd_name}
                        </CardTitle>
                        <CardDescription className="text-sm text-default-500 mt-2 min-h-[40px]">
                          {product.prd_desc}
                        </CardDescription>
                        <div className="mt-6 flex items-baseline gap-1 flex-wrap">
                          {renderProductPrice(product)}
                        </div>
                      </CardHeader>

                      <CardContent className="p-8 pt-0 flex-grow border-t">
                        <ul className="space-y-4 text-sm text-default-600 mt-6">
                          {features.map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                          {Number(product.prd_price_extra_employee || 0) > 0 &&
                            product.prd_paytype === "package" && (
                              <li className="flex items-start gap-3">
                                <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                                <span>
                                  Extra karyawan:{" "}
                                  <strong>
                                    {formatPrice(Number(product.prd_price_extra_employee))} / kary /
                                    bulan
                                  </strong>
                                </span>
                              </li>
                            )}
                        </ul>
                      </CardContent>

                      <CardFooter
                        className={`p-8 border-t ${
                          isPopular || isRecommended
                            ? "bg-primary/[0.02]"
                            : "bg-default-50/50"
                        }`}
                      >
                        <a
                          href={getProductRegisterUrl(product)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full"
                        >
                          <Button
                            variant={isPopular || isRecommended ? undefined : "outline"}
                            className="w-full font-bold h-11 text-sm"
                          >
                            {isFreeProduct(product)
                              ? "Daftar Gratis"
                              : product.prd_paytype === "personal" &&
                                  !getPackageForDuration(product, duration)
                                ? "Hubungi Sales"
                                : `Pilih Paket ${product.prd_name}`}
                          </Button>
                        </a>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}

            <div className="max-w-4xl mx-auto bg-card rounded-3xl border p-8 md:p-10 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none" />
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Calculator className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-default-900">Kalkulator Karyawan</h3>
                      <p className="text-sm text-default-500">
                        Sesuaikan jumlah karyawan untuk menemukan paket & harga terbaik.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-semibold text-default-700">Jumlah Karyawan:</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={employeeCount}
                          onChange={handleInputChange}
                          className="w-20 px-3 py-1.5 text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm font-bold bg-background text-foreground"
                          min="1"
                        />
                        <span className="text-sm text-default-500 font-semibold">Orang</span>
                      </div>
                    </div>

                    <Slider
                      value={[employeeCount]}
                      min={1}
                      max={200}
                      step={1}
                      onValueChange={handleSliderChange}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-default-400 font-medium">
                      <span>1 Karyawan</span>
                      <span>50 Karyawan</span>
                      <span>100 Karyawan</span>
                      <span>200+ Karyawan</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-sm font-semibold text-default-700 block">Siklus Pembayaran:</span>
                    <div
                      className={
                        durations.length <= 1
                          ? "flex flex-wrap gap-2.5"
                          : `grid gap-2.5 ${
                              durations.length === 2
                                ? "grid-cols-2"
                                : durations.length === 3
                                  ? "grid-cols-3"
                                  : "grid-cols-2 sm:grid-cols-4"
                            }`
                      }
                    >
                      {durations.length === 0 ? (
                        <span className="text-xs text-default-400">
                          Siklus belum tersedia
                        </span>
                      ) : (
                        durations.map((d) => {
                          const discount = recommended
                            ? getDurationDiscount(recommended, d.value)
                            : null;

                          return (
                            <button
                              key={d.value}
                              type="button"
                              onClick={() => setDuration(d.value)}
                              className={`flex flex-col items-center justify-center gap-0.5 py-2.5 px-2 border rounded-xl text-xs font-bold transition-all ${
                                durations.length === 1 ? "w-auto min-w-[5.5rem]" : "w-full"
                              } ${
                                duration === d.value
                                  ? "bg-primary/10 border-primary text-primary shadow-sm"
                                  : "bg-background border-default-200 text-default-600 hover:border-default-400"
                              }`}
                            >
                              <span>{d.label}</span>
                              {discount != null && (
                                <span
                                  className={`text-[10px] font-extrabold leading-none ${
                                    duration === d.value
                                      ? "text-emerald-600"
                                      : "text-emerald-600/70"
                                  }`}
                                >
                                  Hemat {Math.round(discount)}%
                                </span>
                              )}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-default-50/50 p-6 md:p-8 rounded-2xl border flex flex-col justify-between h-full space-y-6">
                  <div>
                    <span className="text-xs font-bold text-default-500 uppercase tracking-wider">
                      Rekomendasi Paket
                    </span>
                    <h4 className="text-2xl font-extrabold text-default-900 mt-1">
                      {recommended?.prd_name || "—"}
                    </h4>
                    <p className="text-sm text-default-600 mt-2">
                      {recommended?.prd_desc ||
                        "Geser jumlah karyawan untuk melihat rekomendasi paket."}
                    </p>
                  </div>

                  <div className="border-t border-dashed pt-4">
                    <span className="text-xs text-default-400 font-semibold block">
                      Estimasi Biaya ({selectedDurationLabel}):
                    </span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-3xl font-extrabold text-primary">
                        {recommendedTotal === 0
                          ? "Gratis"
                          : recommendedTotal != null
                            ? formatPrice(recommendedTotal)
                            : "Hubungi Sales"}
                      </span>
                      {recommendedTotal != null && recommendedTotal > 0 && (
                        <span className="text-sm text-default-500 font-semibold">/ total</span>
                      )}
                    </div>
                    {recommendedSavings != null && (
                      <div className="mt-2.5 flex items-center gap-2.5 rounded-lg bg-emerald-500/10 px-3 py-2">
                        <PiggyBank className="h-4 w-4 shrink-0 text-emerald-600" />
                        <div className="leading-tight">
                          <span className="block text-xs font-extrabold text-emerald-700">
                            Hemat {formatPrice(recommendedSavings)}
                          </span>
                          <span className="block text-[11px] font-medium text-emerald-700/70">
                            dibanding bayar bulanan
                          </span>
                        </div>
                      </div>
                    )}
                    {recommended &&
                      recommendedPkg &&
                      recommendedPaytype === "personal" &&
                      recommendedTotal != null &&
                      recommendedTotal > 0 && (
                        <span className="text-xs text-default-500 font-medium block mt-1">
                          {employeeCount} karyawan ×{" "}
                          {formatPrice(Number(recommendedPkg.pkg_price || 0))} ×{" "}
                          {getPackageMonths(recommendedPkg) || duration} bln
                        </span>
                      )}
                    {recommended &&
                      recommendedPaytype === "package" &&
                      !isFreeProduct(recommended) &&
                      recommendedTotal != null &&
                      recommendedTotal > 0 && (
                        <span className="text-xs text-default-500 font-medium block mt-1">
                          Harga paket flat untuk {Number(recommended.prd_min_employee || 0)}–
                          {Number(recommended.prd_max_employee || 0)} karyawan
                        </span>
                      )}
                    {recommended &&
                      Number(recommended.prd_price_extra_employee || 0) > 0 &&
                      employeeCount > Number(recommended.prd_max_employee || 0) && (
                        <span className="text-xs text-emerald-600 font-medium block mt-1">
                          *Termasuk biaya {employeeCount - Number(recommended.prd_max_employee)} extra
                          karyawan:{" "}
                          {formatPrice(
                            (employeeCount - Number(recommended.prd_max_employee)) *
                              Number(recommended.prd_price_extra_employee) *
                              duration
                          )}
                        </span>
                      )}
                  </div>

                  <a
                    href={recommendedRegisterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button className="w-full font-bold group h-12 text-sm shadow-md">
                      Mulai Sekarang
                      <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className={activeTab === "addons" ? undefined : "hidden"}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-12 max-w-6xl mx-auto"
          >
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
              <div className="space-y-2 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <h3 className="font-bold text-lg text-default-900">
                    Modul Tambahan Pro+ (Add-on)
                  </h3>
                </div>
                <p className="text-sm text-default-600 max-w-2xl">
                  Beli modul yang dibutuhkan secara terpisah. Pembayaran dilakukan sekali untuk
                  selamanya (lifetime access). Modul tetap dapat diakses meskipun masa
                  berlangganan bulanan utama Anda habis.
                </p>
              </div>
              {addonBundleTotal > 0 && (
                <div className="text-center md:text-right shrink-0 bg-primary text-primary-foreground px-5 py-3 rounded-xl shadow-md">
                  <span className="text-xs uppercase font-bold tracking-wider opacity-90 block">
                    Total Semua Modul
                  </span>
                  <span className="text-xl font-black block mt-0.5">
                    {formatPrice(addonBundleTotal)}
                  </span>
                  <span className="text-xs opacity-75 font-semibold">
                    {addons.length} modul · sekali bayar
                  </span>
                </div>
              )}
            </div>

            {!addons.length ? (
              <div className="text-center py-12 text-sm text-default-500">
                Belum ada modul add-on tersedia.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {addons.map((addon, index) => {
                  const style = getAddonStyle(addon.addon_name, index);
                  const IconComponent = style.icon;
                  const features = parseFeatureList(addon.addon_features);
                  const price = Number(addon.addon_price || 0);

                  return (
                    <Card
                      key={addon.addon_idx}
                      className="flex flex-col hover:shadow-md transition-shadow duration-300 border-none bg-card shadow-sm"
                    >
                      <CardHeader className="p-6 pb-4">
                        <div className="flex items-start justify-between">
                          <div
                            className={`w-10 h-10 rounded-lg ${style.bg} flex items-center justify-center`}
                          >
                            <IconComponent className={`h-5 w-5 ${style.color}`} />
                          </div>
                          <Badge className="bg-primary/10 text-primary border-none text-[10px] font-bold py-0.5 px-2">
                            ONE-TIME
                          </Badge>
                        </div>
                        <CardTitle className="text-lg font-bold text-default-900 mt-4">
                          {addon.addon_name}
                        </CardTitle>
                        <CardDescription className="text-sm text-default-500 mt-1 min-h-[60px]">
                          {addon.addon_desc}
                        </CardDescription>
                        <div className="mt-3">
                          <span className="text-xl font-bold text-primary">
                            {price > 0 ? formatPrice(price) : "Gratis"}
                          </span>
                          {price > 0 && (
                            <span className="text-xs text-default-400 font-semibold">
                              {" "}
                              / sekali bayar
                            </span>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 pt-0 flex-grow border-t">
                        <ul className="space-y-2.5 text-xs text-default-600 mt-4">
                          {features.map((feat, fIdx) => (
                            <li key={fIdx} className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
