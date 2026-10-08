import React from "react";
import {
  Building2,
  CalendarDays,
  Check,
  ClipboardList,
  Download,
  FileText,
  LayoutDashboard,
  MapPin,
  Users,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { MockDates } from "@/lib/format";

/**
 * Mini-UI produk untuk mockup (Hero, Day-to-Payday, Dua Sisi).
 * - HTML/Tailwind murni: tajam di semua DPI, ringan, tanpa raster.
 * - Ukuran memakai em; font-size akar memakai cqw sehingga mengikuti lebar
 *   device (lihat DeviceFrame).
 * - Selalu aria-hidden di pemanggil; ringkasan teks disediakan terpisah.
 * - Nama & angka fiktif. Tanggal datang dari server (selalu terkini).
 */

const PHONE_ROOT = "flex h-full flex-col text-[4.3cqw] leading-[1.3] text-rs-text";

function StatusBar({ time = "08.02" }: { time?: string }) {
  return (
    <div className="flex items-center justify-between px-[1.6em] pt-[0.9em] text-[0.78em] font-semibold text-slate-500">
      <span className="tabular">{time}</span>
      <span className="flex items-center gap-[0.3em]">
        <span className="h-[0.55em] w-[1.1em] rounded-[0.15em] bg-slate-400" />
        <span className="h-[0.55em] w-[0.55em] rounded-full bg-slate-400" />
      </span>
    </div>
  );
}

function CheckDot({ tone = "success" }: { tone?: "success" | "primary" }) {
  return (
    <span
      className={cn(
        "flex h-[1.35em] w-[1.35em] shrink-0 items-center justify-center rounded-full text-white",
        tone === "success" ? "bg-rs-success" : "bg-rs-primary"
      )}
    >
      <Check className="h-[0.85em] w-[0.85em]" strokeWidth={3} />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* 1. Clock-in (HP karyawan)                                           */
/* ------------------------------------------------------------------ */
export function ClockInScreen({
  dates,
  rollClock = false,
}: {
  dates: MockDates;
  rollClock?: boolean;
}) {
  return (
    <div className={PHONE_ROOT}>
      <StatusBar />
      <div className="px-[1.4em] pt-[1.6em]">
        <p className="text-[0.82em] font-medium text-slate-500">{dates.today}</p>
        <p className="mt-[0.15em] text-[1.3em] font-bold tracking-[-0.01em]">
          Selamat pagi, Dimas
        </p>
      </div>

      <div className="relative mx-[1.4em] mt-[1em] h-[36%] overflow-hidden rounded-[1.1em] bg-sky-50 ring-1 ring-sky-100">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(37_99_235/.08)_1px,transparent_1px),linear-gradient(to_bottom,rgb(37_99_235/.08)_1px,transparent_1px)] bg-[size:1.8em_1.8em]" />
        <span className="absolute -left-[10%] top-[58%] h-[1.1em] w-[130%] -rotate-6 bg-white/90" />
        <span className="absolute left-[62%] top-0 h-full w-[1em] rotate-12 bg-white/90" />
        <span className="absolute left-1/2 top-1/2 h-[9em] w-[9em] -translate-x-1/2 -translate-y-1/2 rounded-full border-[0.14em] border-dashed border-rs-primary/50 bg-rs-primary/10" />
        <span className="rs-ping absolute left-1/2 top-1/2 -ml-[4.5em] -mt-[4.5em] h-[9em] w-[9em] rounded-full bg-rs-primary/20" />
        <span className="absolute left-[56%] top-[30%] flex h-[1.7em] w-[1.7em] items-center justify-center rounded-[0.4em] bg-white text-slate-600 shadow-sm">
          <Building2 className="h-[1em] w-[1em]" />
        </span>
        <span className="absolute left-1/2 top-1/2 flex h-[2.2em] w-[2.2em] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-rs-primary text-white shadow-lg ring-[0.3em] ring-white">
          <MapPin className="h-[1.1em] w-[1.1em]" />
        </span>
        <span className="absolute bottom-[0.6em] left-[0.6em] rounded-full bg-white px-[0.7em] py-[0.2em] text-[0.72em] font-semibold text-slate-600 shadow-sm">
          Radius 100 m
        </span>
      </div>

      <ul className="mx-[1.4em] mt-[1em] space-y-[0.55em] text-[0.9em] font-semibold">
        <li className="flex items-center gap-[0.6em]">
          <CheckDot />
          <span className="flex-1">Dalam radius kantor</span>
          <span className="tabular text-slate-500">38 m</span>
        </li>
        <li className="flex items-center gap-[0.6em]">
          <CheckDot />
          <span className="flex-1">Selfie terverifikasi</span>
          <span className="h-[1.6em] w-[1.6em] rounded-full bg-gradient-to-br from-amber-200 to-orange-300 ring-2 ring-white" />
        </li>
      </ul>

      <div className="mx-[1.4em] mt-[1em] rounded-[0.9em] border border-rs-border px-[0.9em] py-[0.7em]">
        <p className="text-[0.75em] font-semibold text-slate-500">Jadwal hari ini</p>
        <p className="mt-[0.1em] flex items-center justify-between text-[0.95em] font-bold">
          <span>Shift Pagi</span>
          <span className="tabular font-semibold text-slate-600">08.00 - 17.00</span>
        </p>
        <p className="text-[0.75em] text-slate-500">Kantor Pusat - Bandung</p>
      </div>

      <div className="mx-[1.4em] mb-[1.4em] mt-auto rounded-[1em] bg-rs-success px-[1em] py-[0.8em] text-center text-white shadow-[0_0.6em_1.4em_-0.6em_rgb(22_163_74/.6)]">
        <p className="text-[0.78em] font-semibold opacity-90">Clock-in berhasil</p>
        <p className="tabular text-[2em] font-extrabold leading-none tracking-[-0.02em]">
          {rollClock ? (
            <>
              08.0
              <span className="inline-block h-[1em] overflow-hidden align-top">
                <span className="rs-digit-roll block">
                  <span className="block">1</span>
                  <span className="block">2</span>
                </span>
              </span>
            </>
          ) : (
            "08.02"
          )}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Cuti & shift (HP karyawan)                                       */
/* ------------------------------------------------------------------ */
const week = [
  { d: "Sen", n: 12, s: "P" },
  { d: "Sel", n: 13, s: "C" },
  { d: "Rab", n: 14, s: "C" },
  { d: "Kam", n: 15, s: "P" },
  { d: "Jum", n: 16, s: "S" },
  { d: "Sab", n: 17, s: "S" },
  { d: "Min", n: 18, s: "L" },
] as const;

const SHIFT_TONE = {
  P: "bg-rs-primary/10 text-rs-primary-strong",
  S: "bg-cyan-100 text-cyan-800",
  C: "bg-orange-500 text-white",
  L: "bg-slate-100 text-slate-400",
} as const;

export function LeaveShiftScreen({ dates }: { dates: MockDates }) {
  return (
    <div className={PHONE_ROOT}>
      <StatusBar time="10.14" />
      <div className="px-[1.4em] pt-[1.6em]">
        <p className="text-[1.3em] font-bold tracking-[-0.01em]">Cuti & Jadwal</p>
      </div>

      <div className="mx-[1.4em] mt-[0.9em] rounded-[1em] border border-rs-border bg-white p-[1em] shadow-[0_0.5em_1.2em_-0.6em_rgb(11_18_32/.18)]">
        <div className="flex items-start justify-between gap-[0.5em]">
          <div>
            <p className="text-[0.78em] font-semibold text-slate-500">Cuti tahunan</p>
            <p className="text-[1.1em] font-bold">2 hari - 13-14 {dates.month}</p>
          </div>
          <span className="flex items-center gap-[0.3em] rounded-full bg-emerald-50 px-[0.6em] py-[0.2em] text-[0.75em] font-bold text-emerald-700">
            <Check className="h-[0.9em] w-[0.9em]" strokeWidth={3} />
            Disetujui
          </span>
        </div>
        <p className="mt-[0.5em] text-[0.78em] text-slate-500">Disetujui HRD - Maya L. - sisa cuti 10 hari</p>
      </div>

      <div className="mx-[1.4em] mt-[1.1em]">
        <p className="text-[0.85em] font-bold">Jadwal minggu ini</p>
        <div className="mt-[0.5em] grid grid-cols-7 gap-[0.35em] text-center">
          {week.map((w) => (
            <div key={w.d} className="space-y-[0.3em]">
              <p className="text-[0.7em] font-semibold text-slate-400">{w.d}</p>
              <p className={cn("tabular rounded-[0.5em] py-[0.5em] text-[0.85em] font-bold", SHIFT_TONE[w.s])}>
                {w.n}
              </p>
              <p className="text-[0.62em] font-semibold text-slate-500">
                {w.s === "P" ? "Pagi" : w.s === "S" ? "Siang" : w.s === "C" ? "Cuti" : "Libur"}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-[1.4em] mt-[1.1em]">
        <p className="text-[0.85em] font-bold">Saldo cuti</p>
        <div className="mt-[0.5em] grid grid-cols-3 gap-[0.5em] text-center">
          {[
            ["Sisa", "10"],
            ["Terpakai", "2"],
            ["Menunggu", "0"],
          ].map(([l, v]) => (
            <div key={l} className="rounded-[0.7em] border border-rs-border py-[0.55em]">
              <p className="tabular text-[1.3em] font-extrabold leading-none">{v}</p>
              <p className="mt-[0.25em] text-[0.68em] font-semibold text-slate-500">{l}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-[1.4em] mt-[1em] rounded-[0.9em] border border-rs-border px-[0.9em] py-[0.7em]">
        <p className="text-[0.75em] font-semibold text-slate-500">Masuk kembali</p>
        <p className="mt-[0.1em] flex items-center justify-between text-[0.95em] font-bold">
          <span>Kamis, 15 {dates.month}</span>
          <span className="tabular font-semibold text-slate-600">Shift Pagi</span>
        </p>
      </div>

      <div className="mx-[1.4em] mb-[1.4em] mt-auto flex items-center gap-[0.7em] rounded-[1em] bg-rs-ink px-[1em] py-[0.8em] text-white">
        <CalendarDays className="h-[1.3em] w-[1.3em] shrink-0 text-sky-300" />
        <p className="text-[0.82em] font-semibold leading-snug">
          Jadwal shift diperbarui otomatis sesuai cuti yang disetujui.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Slip gaji (HP karyawan)                                          */
/* ------------------------------------------------------------------ */
const slipRows = [
  ["Gaji pokok", "5.000.000", false],
  ["Tunjangan", "750.000", false],
  ["Lembur", "320.000", false],
  ["BPJS", "-200.000", true],
  ["PPh 21", "-150.000", true],
] as const;

export function PayslipScreen({ dates }: { dates: MockDates }) {
  return (
    <div className={PHONE_ROOT}>
      <StatusBar time="09.00" />
      <div className="mx-[1em] mt-[1.4em] flex items-center gap-[0.7em] rounded-[1em] bg-white/95 p-[0.8em] shadow-[0_0.6em_1.4em_-0.5em_rgb(11_18_32/.25)] ring-1 ring-rs-border">
        <span className="h-[2.2em] w-[2.2em] shrink-0 rounded-[0.6em] bg-gradient-to-br from-rs-primary to-rs-cyan" />
        <div className="min-w-0">
          <p className="text-[0.72em] font-semibold text-slate-500">Rekastaff - baru saja</p>
          <p className="truncate text-[0.85em] font-bold">Slip gaji {dates.month} sudah tersedia</p>
        </div>
      </div>

      <div className="mx-[1.4em] mt-[1.1em] flex-1">
        <p className="text-[0.8em] font-semibold text-slate-500">Slip Gaji - {dates.monthYear}</p>
        <p className="text-[1.25em] font-bold tracking-[-0.01em]">Dimas Pratama</p>
        <div className="mt-[0.7em] divide-y divide-dashed divide-slate-200 text-[0.88em]">
          {slipRows.map(([label, value, minus]) => (
            <div key={label} className="flex items-center justify-between py-[0.45em]">
              <span className="text-slate-600">{label}</span>
              <span className={cn("tabular font-semibold", minus ? "text-rose-600" : "text-rs-text")}>
                {value}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-[0.8em] rounded-[1em] bg-emerald-50 px-[1em] py-[0.8em] ring-1 ring-emerald-100">
          <p className="text-[0.78em] font-semibold text-emerald-700">Total diterima</p>
          <p className="tabular text-[1.7em] font-extrabold leading-tight tracking-[-0.02em] text-emerald-700">
            Rp 5.720.000
          </p>
        </div>
        <p className="mt-[1.1em] text-[0.8em] font-semibold text-slate-500">Slip sebelumnya</p>
        <ul className="mt-[0.4em] space-y-[0.4em] text-[0.85em]">
          {["Bulan lalu", "2 bulan lalu"].map((m) => (
            <li key={m} className="flex items-center justify-between rounded-[0.7em] border border-rs-border px-[0.8em] py-[0.5em]">
              <span className="font-semibold">{m}</span>
              <span className="text-slate-500">Lihat</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-[1.4em] mb-[1.4em] mt-[1em] flex items-center justify-center gap-[0.5em] rounded-[0.9em] border border-rs-border py-[0.7em] text-[0.88em] font-bold text-rs-primary-strong">
        <Download className="h-[1.1em] w-[1.1em]" />
        Unduh PDF
      </div>
    </div>
  );
}
