"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  MapPin,
  Camera,
  CalendarCheck2,
  CalendarRange,
  Banknote,
  FileCheck2,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import SectionLabel from "./parallax/SectionLabel";

/**
 * Section "pinned" bergaya rekapos.com: layar menempel (sticky) sementara
 * scroll menggerakkan cerita — satu clock-in menggerakkan seluruh proses HR.
 * Angka/nama di visual hanya ilustrasi.
 */
const steps = [
  {
    title: "Karyawan clock-in dari HP",
    description: "Lokasi GPS dan foto selfie divalidasi otomatis saat absen.",
  },
  {
    title: "Absensi terekap otomatis",
    description: "Kehadiran, keterlambatan, dan lembur langsung masuk rekap harian.",
  },
  {
    title: "Cuti & shift ikut sinkron",
    description: "Cuti yang disetujui dan jadwal shift terbaca oleh sistem absensi.",
  },
  {
    title: "Payroll terhitung sendiri",
    description: "Gaji, tunjangan, potongan, BPJS, dan PPh 21 dihitung dalam sekali proses.",
  },
  {
    title: "Slip gaji terkirim",
    description: "Setiap karyawan menerima slip gaji digital tanpa kirim satu per satu.",
  },
];

const tiles = [
  { icon: CalendarCheck2, label: "Absensi", value: "Hadir · 08:02", step: 1, tone: "text-blue-300 bg-blue-400/15" },
  { icon: CalendarRange, label: "Cuti & Shift", value: "Shift Pagi", step: 2, tone: "text-orange-300 bg-orange-400/15" },
  { icon: Banknote, label: "Payroll", value: "PPh 21 · BPJS", step: 3, tone: "text-green-300 bg-green-400/15" },
  { icon: FileCheck2, label: "Slip Gaji", value: "Terkirim", step: 4, tone: "text-purple-300 bg-purple-400/15" },
];

const LAST_STEP = steps.length - 1;

const FlowSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [pinned, setPinned] = useState(false);
  const [active, setActive] = useState(0);

  // Pin hanya di desktop; di mobile semua langkah tampil sekaligus.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setPinned(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const animated = pinned && !reduceMotion;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  useMotionValueEvent(scrollYProgress, "change", (p) =>
    setActive(Math.min(LAST_STEP, Math.floor(p * steps.length)))
  );

  const current = animated ? active : LAST_STEP;
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="alur" className="relative bg-[#0b1530] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_50%,#000_40%,transparent_100%)]" />

      {/* Tinggi ekstra di desktop = "jarak scroll" untuk menggerakkan cerita */}
      <div ref={ref} className={cn(animated && "h-[320vh]")}>
        <div
          className={cn(
            "relative py-20 sm:py-24",
            pinned && "sticky top-[72px] flex h-[calc(100vh-72px)] items-center py-6"
          )}
        >
          <div className="container px-4 sm:px-8">
            <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
              {/* Kolom teks + daftar langkah */}
              <div>
                <SectionLabel number="02" dark>Alur Kerja</SectionLabel>
                <h2 className="mt-4 text-3xl font-extrabold leading-[1.12] tracking-tight text-balance sm:text-4xl">
                  Satu clock-in. Seluruh proses HR ikut bergerak.
                </h2>
                <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
                  Absensi, cuti, shift, hingga payroll memakai data yang sama —
                  tanpa rekap manual dan tanpa input berulang.
                </p>

                <ol className="mt-8 space-y-3">
                  {steps.map((step, i) => (
                    <li
                      key={step.title}
                      className={cn(
                        "flex gap-4 rounded-2xl border p-4 transition-all duration-300",
                        i === current && animated
                          ? "border-sky-300/40 bg-white/10"
                          : i <= current
                            ? "border-white/10 bg-white/5"
                            : "border-transparent opacity-50"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold transition-colors",
                          i <= current ? "bg-sky-300 text-[#0b1530]" : "bg-white/10 text-white"
                        )}
                      >
                        {i < current || (!animated && i === current) ? <Check className="h-4 w-4" /> : i + 1}
                      </span>
                      <div>
                        <h3 className="text-sm font-bold">{step.title}</h3>
                        <p className="mt-0.5 text-sm leading-relaxed text-slate-400">
                          {step.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Visual: kartu clock-in → konektor → 4 modul */}
              <div
                className="relative mx-auto w-full max-w-xl"
                role="img"
                aria-label="Ilustrasi: satu clock-in karyawan menggerakkan absensi, cuti dan shift, payroll, dan slip gaji"
              >
                <div
                  className={cn(
                    "rounded-2xl border bg-[#13234a] p-5 shadow-2xl transition-all duration-500",
                    current >= 0 ? "border-sky-300/40 shadow-sky-400/10" : "border-white/10"
                  )}
                >
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-2 font-semibold text-slate-200">
                      <MapPin className="h-4 w-4 text-sky-300" />
                      Clock-in · Kantor Bandung
                    </span>
                    <span>Ilustrasi</span>
                  </div>
                  <div className="mt-4 flex items-center gap-4">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-300/15 text-lg font-extrabold text-sky-200">
                      RD
                    </span>
                    <div className="flex-1">
                      <p className="font-bold">Ratna Dewi</p>
                      <p className="text-xs text-slate-400">08:02 WIB</p>
                    </div>
                    <div className="flex flex-col gap-1.5 text-[11px] font-semibold">
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-400/15 px-2.5 py-1 text-green-300">
                        <MapPin className="h-3 w-3" /> GPS valid
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-400/15 px-2.5 py-1 text-green-300">
                        <Camera className="h-3 w-3" /> Selfie valid
                      </span>
                    </div>
                  </div>
                </div>

                {/* Konektor putus-putus beranimasi (flow-dash) */}
                <svg aria-hidden="true" viewBox="0 0 100 40" preserveAspectRatio="none" className="h-14 w-full">
                  <path
                    d="M50 0 V14 M50 14 H12 V40 M50 14 H38 V40 M50 14 H62 V40 M50 14 H88 V40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.6"
                    vectorEffect="non-scaling-stroke"
                    strokeDasharray="4 4"
                    className={cn(
                      "text-sky-300/60",
                      current >= 1 && !reduceMotion && "animate-flow-dash"
                    )}
                    style={{ opacity: current >= 1 ? 1 : 0.25, transition: "opacity .4s" }}
                  />
                </svg>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {tiles.map((tile) => {
                    const lit = current >= tile.step;
                    return (
                      <motion.div
                        key={tile.label}
                        animate={{ opacity: lit ? 1 : 0.35, y: lit ? 0 : 8, scale: lit ? 1 : 0.97 }}
                        transition={{ duration: 0.4 }}
                        className={cn(
                          "rounded-xl border p-3.5 transition-colors duration-500",
                          lit ? "border-white/20 bg-[#13234a]" : "border-white/5 bg-white/[0.03]"
                        )}
                      >
                        <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg", tile.tone)}>
                          <tile.icon className="h-[18px] w-[18px]" />
                        </span>
                        <p className="mt-3 text-sm font-bold">{tile.label}</p>
                        <p className="mt-0.5 text-[11px] text-slate-400">{tile.value}</p>
                      </motion.div>
                    );
                  })}
                </div>

                {animated && (
                  <div aria-hidden="true" className="mt-6 h-1 overflow-hidden rounded-full bg-white/10">
                    <motion.div style={{ scaleX: barScale }} className="h-full origin-left bg-sky-300" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlowSection;
