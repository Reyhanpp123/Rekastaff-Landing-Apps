"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { HRD_LOGIN_URL, HRD_REGISTER_STARTER_URL } from "@/lib/site";
import { SUPPORT_WHATSAPP_URL } from "@/lib/support";
import { NAV_LINKS } from "./links";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Menu mobile sebagai dialog modal: focus trap, Esc menutup, fokus kembali
 * ke tombol pemicu, scroll body dikunci. Link besar (56px) untuk jempol.
 */
export default function MobileMenu({
  open,
  onClose,
  active,
}: {
  open: boolean;
  onClose: () => void;
  active: string | null;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
      returnFocusRef.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      id="menu-mobile"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      data-lenis-prevent
      className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-white text-rs-text motion-ok:animate-in motion-ok:fade-in-0 motion-ok:slide-in-from-top-2 lg:hidden"
    >
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-rs-border px-4 sm:px-6">
        <span className="text-[19px] font-extrabold tracking-[-0.02em]">Menu</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup menu"
          className="inline-flex h-11 w-11 items-center justify-center rounded-rs-md border border-rs-border"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <nav aria-label="Navigasi mobile" className="px-4 py-4 sm:px-6">
        <ul className="divide-y divide-rs-border">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <Link
                href={`/#${link.id}`}
                onClick={onClose}
                aria-current={active === link.id ? "location" : undefined}
                className={cn(
                  "flex min-h-[56px] items-center justify-between text-[20px] font-bold tracking-[-0.01em]",
                  active === link.id ? "text-rs-primary-strong" : "text-rs-text"
                )}
              >
                {link.label}
                <ArrowRight className="h-5 w-5 text-rs-muted" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto space-y-3 border-t border-rs-border px-4 py-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:px-6">
        <a
          href={HRD_REGISTER_STARTER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 items-center justify-center gap-2 rounded-rs-md bg-rs-primary text-base font-bold text-white shadow-glow"
        >
          Coba Gratis
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only"> (membuka tab baru)</span>
        </a>
        <div className="grid grid-cols-2 gap-3">
          <a
            href={HRD_LOGIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 items-center justify-center rounded-rs-md border border-rs-border text-[15px] font-semibold"
          >
            Masuk
          </a>
          <a
            href={SUPPORT_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 items-center justify-center gap-2 rounded-rs-md border border-rs-border text-[15px] font-semibold"
          >
            <MessageCircle className="h-4 w-4 text-rs-success" aria-hidden="true" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
