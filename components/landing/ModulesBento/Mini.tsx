import React from "react";
import { Check, FileText, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Mini-UI statis untuk kartu bento. Murni dekoratif (aria-hidden di
 * pemanggil), micro-state dipicu hover kartu (group-hover), tanpa JS.
 */

export function MiniAttendance() {
  const rows = [
    ["Dimas Pratama", "08.02", "Tepat waktu"],
    ["Sari Wulandari", "07.56", "Tepat waktu"],
    ["Rudi Hartono", "08.19", "Terlambat"],
    ["Andika Putra", "08.00", "Tepat waktu"],
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-[1fr_1.3fr]">
      <div className="relative h-40 overflow-hidden sm:h-auto sm:min-h-[176px] rounded-rs-md bg-sky-50 ring-1 ring-sky-100">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(37_99_235/.08)_1px,transparent_1px),linear-gradient(to_bottom,rgb(37_99_235/.08)_1px,transparent_1px)] bg-[size:22px_22px]" />
        <span className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-rs-primary/40 bg-rs-primary/10 transition-transform duration-300 group-hover:scale-110" />
        <span className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-rs-primary text-white shadow-lg ring-4 ring-white">
          <MapPin className="h-4 w-4" />
        </span>
      </div>
      <ul className="space-y-2">
        {rows.map(([n, t, s]) => (
          <li key={n} className="flex items-center justify-between gap-3 rounded-rs-sm border border-rs-border bg-rs-surface px-3 py-2 text-[13px]">
            <span className="truncate font-semibold text-rs-text">{n}</span>
            <span className="tabular text-rs-muted">{t}</span>
            <span
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 text-[11.5px] font-bold",
                s === "Terlambat" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
              )}
            >
              {s}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MiniPayroll() {
  const rows = [
    ["Gaji pokok", "5.000.000", false],
    ["Tunjangan & lembur", "1.070.000", false],
    ["BPJS", "-200.000", true],
    ["PPh 21", "-150.000", true],
  ] as const;
  return (
    <div className="rounded-rs-md border border-rs-border bg-rs-surface p-4">
      <div className="space-y-2 text-[13.5px]">
        {rows.map(([l, v, minus]) => (
          <div key={l} className="flex items-center justify-between border-b border-dashed border-rs-border pb-2">
            <span className="text-rs-muted">{l}</span>
            <span className={cn("tabular font-semibold", minus ? "text-rose-600" : "text-rs-text")}>{v}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between rounded-rs-sm bg-emerald-50 px-3 py-2.5">
        <span className="text-[13px] font-semibold text-emerald-700">Diterima</span>
        <span className="tabular text-[18px] font-extrabold text-emerald-700">Rp 5.720.000</span>
      </div>
    </div>
  );
}

export function MiniLeave() {
  return (
    <div className="flex items-center justify-between gap-3 rounded-rs-md border border-rs-border bg-rs-surface p-3">
      <div className="min-w-0">
        <p className="text-[13px] font-bold text-rs-text">Cuti 2 hari</p>
        <p className="text-[12px] text-rs-muted">Dimas P.</p>
      </div>
      <span className="relative inline-flex h-8 min-w-[92px] items-center justify-center overflow-hidden rounded-rs-sm text-[12.5px] font-bold">
        <span className="absolute inset-0 flex items-center justify-center bg-rs-primary text-white transition-opacity duration-200 group-hover:opacity-0">
          Setujui
        </span>
        <span className="absolute inset-0 flex items-center justify-center gap-1 bg-emerald-50 text-emerald-700 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
          Disetujui
        </span>
      </span>
    </div>
  );
}

export function MiniEmployees() {
  const people = [
    ["DP", "bg-sky-100 text-sky-700"],
    ["SW", "bg-rose-100 text-rose-700"],
    ["RH", "bg-amber-100 text-amber-700"],
    ["ML", "bg-violet-100 text-violet-700"],
  ];
  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2">
        {people.map(([i, t]) => (
          <span key={i} className={cn("flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-bold ring-2 ring-white", t)}>
            {i}
          </span>
        ))}
      </div>
      <span className="rounded-full border border-rs-border bg-rs-surface px-3 py-1 text-[12.5px] font-semibold text-rs-muted transition-colors group-hover:border-rs-primary/40 group-hover:text-rs-primary-strong">
        Import dari Excel
      </span>
    </div>
  );
}

export function MiniShift() {
  const cells = ["P", "P", "S", "S", "L", "P", "S"];
  return (
    <div className="grid grid-cols-7 gap-1.5">
      {cells.map((c, i) => (
        <span
          key={i}
          className={cn(
            "flex h-9 items-center justify-center rounded-rs-sm text-[12px] font-bold transition-transform duration-200 group-hover:-translate-y-0.5",
            c === "P" ? "bg-rs-primary/10 text-rs-primary-strong" : c === "S" ? "bg-cyan-100 text-cyan-800" : "bg-slate-100 text-slate-500"
          )}
          style={{ transitionDelay: `${i * 25}ms` }}
        >
          {c}
        </span>
      ))}
    </div>
  );
}

export function MiniDocs() {
  return (
    <ul className="space-y-1.5">
      {["Kontrak_kerja.pdf", "KTP_scan.pdf"].map((f) => (
        <li key={f} className="flex items-center gap-2 rounded-rs-sm border border-rs-border bg-rs-surface px-3 py-2 text-[12.5px] font-semibold text-rs-text">
          <FileText className="h-4 w-4 text-rs-primary-strong" />
          <span className="truncate">{f}</span>
        </li>
      ))}
    </ul>
  );
}
