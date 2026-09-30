import React from "react";
import { cn } from "@/lib/utils";

interface SectionLabelProps {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
}

/** Badge pill penanda section (ikon + label), dipakai konsisten di semua section. */
const SectionLabel = ({ icon: Icon, children, className }: SectionLabelProps) => (
  <span
    className={cn(
      "inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold text-primary sm:text-sm",
      className
    )}
  >
    <Icon className="h-3.5 w-3.5" />
    {children}
  </span>
);

export default SectionLabel;
