import React from "react";
import { cn } from "@/lib/utils";

interface SectionLabelProps {
  number: string;
  children: React.ReactNode;
  /** Varian untuk latar gelap. */
  dark?: boolean;
  className?: string;
}

/** Penanda section bernomor (gaya rekapos.com): [01] FITUR UNGGULAN. */
const SectionLabel = ({ number, children, dark, className }: SectionLabelProps) => (
  <p
    className={cn(
      "flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em]",
      dark ? "text-sky-300" : "text-primary",
      className
    )}
  >
    <span
      className={cn(
        "rounded-md px-1.5 py-0.5 text-[11px] tabular-nums",
        dark ? "bg-white/10 text-white" : "bg-primary/10 text-primary"
      )}
    >
      {number}
    </span>
    {children}
  </p>
);

export default SectionLabel;
