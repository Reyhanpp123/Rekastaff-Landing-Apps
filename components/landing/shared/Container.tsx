import React from "react";
import { cn } from "@/lib/utils";

/**
 * Container landing: 1200px untuk konten, 1360px untuk visual lebar.
 * Gutter 16px (mobile) / 24px (tablet) / 32px (desktop).
 */
export default function Container({
  children,
  className,
  wide = false,
}: {
  children: React.ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        wide ? "max-w-rs-wide" : "max-w-rs-content",
        className
      )}
    >
      {children}
    </div>
  );
}
