import React from "react";
import { cn } from "@/lib/utils";

/**
 * Bingkai device. Layar memakai `container-type: inline-size` sehingga
 * mini-UI di dalamnya (berbasis unit em dari font-size `cqw`) ikut
 * berskala dengan lebar device - tajam di semua ukuran, tanpa raster.
 */
const screenContainer: React.CSSProperties = { containerType: "inline-size" };

/** Bingkai HP: radius 40px (token rs-xl), shadow e3. */
export function PhoneFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-[9/19] rounded-[40px] bg-rs-ink p-[7px] shadow-e3 ring-1 ring-black/5",
        className
      )}
    >
      <div
        style={screenContainer}
        className="relative h-full w-full overflow-hidden rounded-[33px] bg-white"
      >
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-[7px] z-20 h-[16px] w-[64px] -translate-x-1/2 rounded-full bg-rs-ink"
        />
        {children}
      </div>
    </div>
  );
}

/** Bingkai laptop: layar 16:10 + alas tipis. */
export function LaptopFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <div className="rounded-t-[18px] bg-rs-ink p-[8px] pb-[10px] shadow-e3">
        <div
          style={screenContainer}
          className="relative aspect-[16/10] overflow-hidden rounded-[10px] bg-white"
        >
          {children}
        </div>
      </div>
      <div className="relative -mx-[5%] h-3 rounded-b-[14px] bg-gradient-to-b from-slate-300 to-slate-400 shadow-e2">
        <span className="absolute left-1/2 top-0 h-1.5 w-20 -translate-x-1/2 rounded-b-md bg-slate-400/80" />
      </div>
    </div>
  );
}

/** Jendela browser (dipakai dashboard HRD di hero & dua sisi). */
export function BrowserFrame({
  children,
  className,
  url = "hrd.rekastaff.com",
}: {
  children: React.ReactNode;
  className?: string;
  url?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-rs-lg border border-rs-border bg-white shadow-e3",
        className
      )}
    >
      <div className="flex h-9 items-center gap-2 border-b border-rs-border bg-rs-surface px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
        <span className="ml-3 truncate rounded-md bg-white px-3 py-0.5 text-[11px] font-medium text-slate-500 ring-1 ring-rs-border">
          {url}
        </span>
      </div>
      <div style={screenContainer} className="relative aspect-[16/10]">
        {children}
      </div>
    </div>
  );
}
