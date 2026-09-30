"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  MapPin,
  CalendarCheck2,
  CalendarRange,
  Banknote,
  FileCheck2,
  Check,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import SectionLabel from "./parallax/SectionLabel";

/**
 * "Sehari bersama Rekastaff" — section pinned: layar menempel saat di-scroll,
 * lalu layar HP di tengah berganti mengikuti langkah. Teks langkah di kiri
 * berganti, kartu notifikasi di kanan muncul satu per satu, dan blob latar
 * bergerak mengikuti progres scroll (parallax).
 * Semua angka/nama pada mockup hanyalah ilustrasi.
 */
const steps = [
  {
    icon: MapPin,
    title: "Karyawan clock-in dari HP",
    description: "Lokasi GPS dan foto selfie divalidasi otomatis saat absen.",
    notif: "GPS & selfie tervalidasi",
    tone: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: CalendarCheck2,
    title: "Absensi terekap otomatis",
    description: "Kehadiran, keterlambatan, dan lembur langsung masuk rekap harian.",
    notif: "Rekap absensi hari ini siap",
    tone: "bg-cyan-500/10 text-cyan-600",
  },
  {
    icon: CalendarRange,
    title: "Cuti & shift ikut sinkron",
    description: "Cuti yang disetujui dan jadwal shift terbaca oleh sistem absensi.",
    notif: "Cuti disetujui · Shift Pagi",
    tone: "bg-orange-500/10 text-orange-600",
  },
  {
    icon: Banknote,
    title: "Payroll terhitung sendiri",
    description: "Gaji, tunjangan, potongan, BPJS, dan PPh 21 dihitung dalam sekali proses.",
    notif: "Payroll bulan ini dihitung",
    tone: "bg-green-500/10 text-green-600",
  },
  {
    icon: FileCheck2,
    title: "Slip gaji terkirim",
    description: "Setiap karyawan menerima slip gaji digital tanpa kirim satu per satu.",
    notif: "Slip gaji terkirim ke karyawan",
    tone: "bg-purple-500/10 text-purple-600",
  },
];

const LAST_STEP = steps.length - 1;

/* ---------------------------- Layar HP per langkah --------------------------- */

const days = [
  { d: "Sen", t: "08:02 – 17:05" },
  { d: "Sel", t: "07:58 – 17:01" },
  { d: "Rab", t: "08:05 – 17:30" },
  { d: "Kam", t: "08:00 – 17:02" },
];

const PhoneScreen = ({ step }: { step: number }) => {
  switch (step) {
    case 0:
      return (
        <div className="flex h-full flex-col gap-3">
          <p className="text-[11px] font-bold text-default-900">Absensi</p>
          <div className="relative flex-1 overflow-hidden rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.12)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.12)_1px,transparent_1px)] bg-[size:22px_22px]" />
            <span className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-primary/20 motion-reduce:animate-none" />
            <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
              <MapPin className="h-5 w-5" />
            </span>
          </div>
          {["GPS dalam radius kantor", "Selfie terverifikasi"].map((t) => (
            <p key={t} className="flex items-center gap-2 text-[11px] font-semibold text-default-700">
              <Check className="h-3.5 w-3.5 rounded-full bg-green-500 p-0.5 text-white" />
              {t}
            </p>
          ))}
          <div className="rounded-xl bg-primary py-2.5 text-center text-xs font-bold text-primary-foreground">
            Clock-in · 08:02
          </div>
        </div>
      );
    case 1:
      return (
        <div className="flex h-full flex-col gap-2.5">
          <p className="text-[11px] font-bold text-default-900">Rekap Minggu Ini</p>
          {days.map((row) => (
            <div key={row.d} className="flex items-center justify-between rounded-xl border bg-default-50 px-3 py-2.5">
              <span className="text-xs font-bold text-default-800">{row.d}</span>
              <span className="text-[11px] text-default-500">{row.t}</span>
              <Check className="h-4 w-4 rounded-full bg-green-500 p-0.5 text-white" />
            </div>
          ))}
          <p className="mt-auto text-center text-[10px] text-default-400">Contoh tampilan</p>
        </div>
      );
    case 2:
      return (
        <div className="flex h-full flex-col gap-3">
          <p className="text-[11px] font-bold text-default-900">Jadwal & Cuti</p>
          <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-semibold text-default-600">
            {Array.from({ length: 28 }).map((_, i) => {
              const cuti = i === 9 || i === 10;
              const shift = !cuti && [2, 3, 4, 5, 6, 16, 17, 18, 19, 20].includes(i);
              return (
                <span
                  key={i}
                  className={cn(
                    "flex aspect-square items-center justify-center rounded-md",
                    cuti ? "bg-orange-500 text-white" : shift ? "bg-primary/15 text-primary" : "bg-default-100"
                  )}
                >
                  {i + 1}
                </span>
              );
            })}
          </div>
          <div className="mt-1 space-y-1.5 text-[11px] font-semibold text-default-700">
            <p className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm bg-orange-500" />Cuti disetujui</p>
            <p className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm bg-primary/40" />Shift Pagi</p>
          </div>
        </div>
      );
    case 3:
      return (
        <div className="flex h-full flex-col gap-2">
          <p className="text-[11px] font-bold text-default-900">Payroll Bulan Ini</p>
          {[
            ["Gaji pokok", "Rp 5.000.000", false],
            ["Tunjangan", "Rp 750.000", false],
            ["BPJS", "− Rp 200.000", true],
            ["PPh 21", "− Rp 150.000", true],
          ].map(([l, v, neg]) => (
            <div key={l as string} className="flex items-center justify-between border-b border-dashed py-2 text-[11px]">
              <span className="text-default-600">{l}</span>
              <span className={cn("font-bold", neg ? "text-red-500" : "text-default-900")}>{v}</span>
            </div>
          ))}
          <div className="mt-2 rounded-xl bg-green-500/10 p-3 text-center">
            <p className="text-[10px] font-semibold text-green-700">Gaji diterima</p>
            <p className="text-base font-extrabold text-green-700">Rp 5.400.000</p>
          </div>
          <p className="mt-auto text-center text-[10px] text-default-400">Contoh tampilan</p>
        </div>
      );
    default:
      return (
        <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/10">
            <FileCheck2 className="h-8 w-8 text-purple-600" />
          </span>
          <p className="text-sm font-extrabold text-default-900">Slip gaji terkirim</p>
          <p className="px-4 text-[11px] leading-relaxed text-default-500">
            Karyawan menerima slip gaji digital di HP mereka.
          </p>
        </div>
      );
  }
};

/* --------------------------------- Section ---------------------------------- */

const FlowSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [pinned, setPinned] = useState(false);
  const [active, setActive] = useState(0);

  // Pin hanya di desktop; di layar kecil cukup daftar langkah biasa.
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

  // Parallax blob & kemiringan HP mengikuti progres scroll.
  const blobAX = useTransform(scrollYProgress, [0, 1], [-80, 80]);
  const blobAY = useTransform(scrollYProgress, [0, 1], [40, -60]);
  const blobBX = useTransform(scrollYProgress, [0, 1], [60, -70]);
  const blobBY = useTransform(scrollYProgress, [0, 1], [-30, 70]);
  const phoneRotate = useTransform(scrollYProgress, [0, 1], [-4, 4]);

  return (
    <section
      id="alur"
      className="relative border-y bg-gradient-to-b from-primary-50/70 via-background to-primary-50/50"
    >
      <div ref={ref} className={cn(animated && "h-[340vh]")}>
        <div
          className={cn(
            "relative overflow-hidden py-16 sm:py-20",
            pinned && "sticky top-[72px] flex h-[calc(100vh-72px)] items-center py-4"
          )}
        >
          {/* Blob latar (parallax mengikuti scroll) */}
          <motion.div
            aria-hidden="true"
            style={animated ? { x: blobAX, y: blobAY } : undefined}
            className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/15 blur-[90px]"
          />
          <motion.div
            aria-hidden="true"
            style={animated ? { x: blobBX, y: blobBY } : undefined}
            className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-info/15 blur-[90px]"
          />

          <div className="container relative px-4 sm:px-8">
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-14">
              {/* Kiri: judul + teks langkah aktif */}
              <div className="text-center lg:text-left">
                <SectionLabel icon={Smartphone} className="mb-4">Alur Kerja</SectionLabel>
                <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-default-900 md:text-4xl">
                  Sehari bersama{" "}
                  <span className="bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
                    Rekastaff
                  </span>
                </h2>
                <p className="mt-3 text-base text-default-600 md:text-lg">
                  Satu clock-in menggerakkan absensi, cuti, shift, hingga payroll —
                  tanpa rekap manual.
                </p>

                {animated && (
                  <div className="relative mt-8 h-36">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={current}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -18 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0"
                      >
                        <span className="text-6xl font-extrabold leading-none text-primary/15">
                          0{current + 1}
                        </span>
                        <h3 className="mt-1 text-xl font-bold text-default-900">
                          {steps[current].title}
                        </h3>
                        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-default-600">
                          {steps[current].description}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Tengah: mockup HP */}
              <div className="flex flex-col items-center gap-5">
                <motion.div
                  style={animated ? { rotate: phoneRotate } : undefined}
                  role="img"
                  aria-label="Ilustrasi aplikasi Rekastaff di HP: clock-in, rekap absensi, jadwal dan cuti, payroll, dan slip gaji"
                  className="relative aspect-[9/18] w-[230px] rounded-[38px] border-[7px] border-default-900 bg-background shadow-2xl shadow-primary/20 lg:h-[min(500px,54vh)] lg:w-auto"
                >
                  <span className="absolute left-1/2 top-2 z-10 h-4 w-16 -translate-x-1/2 rounded-full bg-default-900" />
                  <div className="relative h-full overflow-hidden rounded-[30px] px-4 pb-4 pt-9">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={current}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -24 }}
                        transition={{ duration: 0.3 }}
                        className="h-full"
                      >
                        <PhoneScreen step={current} />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>

                {/* Indikator langkah */}
                <div aria-hidden="true" className="flex items-center gap-2">
                  {steps.map((s, i) => (
                    <span
                      key={s.title}
                      className={cn(
                        "h-2 rounded-full transition-all duration-300",
                        i === current ? "w-8 bg-primary" : i < current ? "w-2 bg-primary/50" : "w-2 bg-default-300"
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Kanan: kartu notifikasi bermunculan (desktop) */}
              {animated ? (
                <div className="flex flex-col gap-3">
                  {steps.map((s, i) => (
                    <motion.div
                      key={s.title}
                      animate={{
                        opacity: i <= current ? 1 : 0,
                        x: i <= current ? 0 : 48,
                        scale: i === current ? 1.03 : 1,
                      }}
                      transition={{ duration: 0.4 }}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl border bg-card px-4 py-3 shadow-sm",
                        i === current && "border-primary/40 shadow-lg shadow-primary/10"
                      )}
                    >
                      <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", s.tone)}>
                        <s.icon className="h-5 w-5" />
                      </span>
                      <span className="text-sm font-bold text-default-800">{s.notif}</span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                // Layar kecil / reduced-motion: semua langkah sebagai daftar biasa.
                <ol className="space-y-3 lg:col-span-3">
                  {steps.map((s, i) => (
                    <li key={s.title} className="flex items-start gap-4 rounded-2xl border bg-card p-4 shadow-sm">
                      <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", s.tone)}>
                        <s.icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-default-900">
                          {i + 1}. {s.title}
                        </h3>
                        <p className="mt-0.5 text-sm leading-relaxed text-default-600">{s.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlowSection;
