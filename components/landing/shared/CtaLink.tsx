import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "light" | "ghost-dark";
type Size = "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-rs-primary text-white shadow-glow hover:-translate-y-px hover:bg-rs-primary-strong active:translate-y-0 active:scale-[0.98]",
  secondary:
    "border border-rs-border bg-white text-rs-text shadow-e1 hover:-translate-y-px hover:border-rs-primary/40 hover:text-rs-primary-strong",
  light:
    "bg-white text-rs-primary-strong shadow-e2 hover:-translate-y-px hover:bg-sky-50 active:scale-[0.98]",
  "ghost-dark":
    "border border-white/25 bg-white/5 text-white hover:-translate-y-px hover:border-white/50 hover:bg-white/10",
};

const SIZES: Record<Size, string> = {
  md: "h-11 px-5 text-[15px]",
  lg: "h-12 px-6 text-base sm:h-14 sm:px-7",
};

interface CtaLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  size?: Size;
  /** Buka di tab baru (dipakai untuk link ke app HRD & WhatsApp). */
  external?: boolean;
  arrow?: boolean;
  icon?: React.ReactNode;
}

/**
 * Tombol CTA berbentuk link (navigasi = <a>, bukan <button>).
 * Target sentuh minimal 44px, radius 14px (token rs-md).
 */
export default function CtaLink({
  variant = "primary",
  size = "lg",
  external = false,
  arrow = false,
  icon,
  className,
  children,
  ...rest
}: CtaLinkProps) {
  return (
    <a
      {...rest}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "group inline-flex min-h-[44px] items-center justify-center gap-2 whitespace-nowrap rounded-rs-md font-bold tracking-[-0.005em] transition-[transform,background-color,border-color,color,box-shadow] duration-150 ease-rs-standard",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
    >
      {icon}
      {children}
      {arrow && (
        <ArrowRight
          aria-hidden="true"
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
        />
      )}
      {external && <span className="sr-only"> (membuka tab baru)</span>}
    </a>
  );
}
