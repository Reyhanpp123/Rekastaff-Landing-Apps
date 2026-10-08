import React from "react";
import type { Headline as HeadlineCopy } from "@/content/landing";
import { cn } from "@/lib/utils";

const TONE = {
  // Pola landing lama: gradient #2563EB -> #06B6D4 (hero).
  gradient: "bg-gradient-to-r from-[#2563EB] to-[#06B6D4] bg-clip-text pb-[0.06em] text-transparent",
  // Pola landing lama: kata terakhir H2 berwarna primary.
  primary: "text-rs-primary",
  // Versi section gelap agar kontras tetap terjaga.
  dark: "text-sky-300",
} as const;

/**
 * Merender teks headline dengan frasa `highlight` diberi warna (pola lama).
 * Hanya mengubah warna frasa; ukuran & layout tetap dari elemen pemanggil.
 */
export default function Headline({
  copy,
  tone = "primary",
  className,
}: {
  copy: HeadlineCopy;
  tone?: keyof typeof TONE;
  className?: string;
}) {
  const index = copy.text.indexOf(copy.highlight);
  if (index < 0) return <>{copy.text}</>;
  const before = copy.text.slice(0, index);
  const after = copy.text.slice(index + copy.highlight.length);
  return (
    <>
      {before}
      <span className={cn(TONE[tone], className)}>{copy.highlight}</span>
      {after}
    </>
  );
}
