import React from "react";
import { cn } from "@/lib/utils";

/**
 * Label kecil di atas heading. Sengaja bukan pill berwarna seperti desain
 * lama agar ritme section tidak monoton (plan bagian 6.3).
 */
export default function Eyebrow({
  children,
  className,
  tone = "light",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <p
      className={cn(
        "rs-eyebrow inline-flex items-center gap-2.5",
        tone === "light" ? "text-rs-primary-strong" : "text-sky-300",
        className
      )}
    >
      <span aria-hidden="true" className="h-px w-6 bg-current" />
      {children}
    </p>
  );
}
