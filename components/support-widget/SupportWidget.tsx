"use client";

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { ArrowRight, HelpCircle, Mail, MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { HRD_REGISTER_STARTER_URL } from "@/lib/site";
import {
  SUPPORT_EMAIL,
  SUPPORT_EMAIL_URL,
  SUPPORT_WHATSAPP_LINKS,
  supportFaqs,
  trackSupportEvent,
} from "@/lib/support";
import SupportFaqList from "./SupportFaqList";

// Di bawah breakpoint `sm` panel menjadi bottom sheet modal.
const MOBILE_QUERY = "(max-width: 639px)";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const SupportWidget = () => {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef(false);
  const panelId = useId();
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const openPanel = () => {
    setOpen(true);
    trackSupportEvent("support_widget_opened", {
      view: isMobile ? "mobile" : "desktop",
    });
  };

  const closePanel = useCallback(
    ({ restoreFocus }: { restoreFocus: boolean }) => {
      restoreFocusRef.current = restoreFocus;
      setOpen(false);
      trackSupportEvent("support_widget_closed");
    },
    []
  );

  // Fokus dikembalikan setelah render: di mobile launcher baru terlihat lagi
  // setelah panel tertutup.
  useEffect(() => {
    if (open) {
      panelRef.current?.focus();
    } else if (restoreFocusRef.current) {
      restoreFocusRef.current = false;
      launcherRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePanel({ restoreFocus: true });
    };

    // Desktop non-modal: klik di luar panel menutup panel tanpa merebut fokus.
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        panelRef.current?.contains(target) ||
        launcherRef.current?.contains(target)
      ) {
        return;
      }
      closePanel({ restoreFocus: false });
    };

    document.addEventListener("keydown", onKeyDown);
    if (!isMobile) document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, isMobile, closePanel]);

  useEffect(() => {
    if (!open || !isMobile) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open, isMobile]);

  // Mobile modal: Tab berputar di dalam panel.
  const trapFocus = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isMobile || event.key !== "Tab" || !panelRef.current) return;
    const focusable = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    ).filter((element) => element.offsetParent !== null);
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === first || active === panelRef.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        onClick={() =>
          open ? closePanel({ restoreFocus: false }) : openPanel()
        }
        aria-label={open ? "Tutup bantuan" : "Buka bantuan Rekastaff"}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={open ? panelId : undefined}
        className={cn(
          "fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-[60] inline-flex h-14 min-w-[56px] items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 motion-reduce:transition-none motion-reduce:hover:scale-100 sm:bottom-6 sm:right-6 sm:px-5 print:hidden",
          open && "max-sm:hidden"
        )}
      >
        {open ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          <HelpCircle className="h-6 w-6" aria-hidden="true" />
        )}
        <span className="hidden sm:inline">{open ? "Tutup" : "Bantuan"}</span>
      </button>

      {open && (
        <>
          <div
            aria-hidden="true"
            onClick={() => closePanel({ restoreFocus: true })}
            className="fixed inset-0 z-[60] bg-default-900/40 motion-safe:animate-in motion-safe:fade-in-0 sm:hidden print:hidden"
          />
          <div
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-modal={isMobile ? true : undefined}
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            tabIndex={-1}
            onKeyDown={trapFocus}
            className="fixed inset-x-0 bottom-0 z-[60] flex max-h-[90dvh] flex-col overflow-hidden rounded-t-2xl border-t bg-card text-card-foreground shadow-2xl outline-none motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-4 sm:inset-x-auto sm:bottom-24 sm:right-6 sm:max-h-[min(600px,calc(100dvh-8rem))] sm:w-[380px] sm:rounded-2xl sm:border print:hidden"
          >
            <div className="flex items-start justify-between gap-3 bg-primary px-5 py-4 text-primary-foreground">
              <div>
                <h2 id={titleId} className="text-base font-bold">
                  Butuh bantuan?
                </h2>
                <p
                  id={descriptionId}
                  className="mt-0.5 text-sm text-primary-foreground/90"
                >
                  Tim Rekastaff siap membantu pada jam kerja.
                </p>
              </div>
              <button
                type="button"
                onClick={() => closePanel({ restoreFocus: true })}
                aria-label="Tutup bantuan"
                className="-mr-2 -mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-primary-foreground/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/70"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div
              className="flex-1 overflow-y-auto overscroll-contain px-4 py-4"
              data-lenis-prevent
            >
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-default-500">
                Pertanyaan populer
              </h3>
              <SupportFaqList
                items={supportFaqs}
                onOpen={(faq) =>
                  trackSupportEvent("support_faq_opened", {
                    faq_id: faq.id ?? "",
                  })
                }
              />
              <a
                href="/#faq"
                onClick={() => closePanel({ restoreFocus: false })}
                className="mt-3 inline-flex min-h-[44px] items-center gap-1.5 rounded-md text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                Lihat FAQ lengkap
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>

              <div className="mt-4 rounded-xl border bg-default-50 p-4">
                <h3 className="text-sm font-bold text-default-900">
                  Belum menemukan jawaban?
                </h3>
                <p className="mb-3 mt-1 text-sm text-default-600">
                  Hubungi tim kami lewat WhatsApp atau email.
                </p>
                <div className="flex flex-col gap-2">
                  {SUPPORT_WHATSAPP_LINKS.map((contact) => (
                    <a
                      key={contact.e164}
                      href={contact.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        trackSupportEvent("support_whatsapp_clicked", {
                          number: contact.e164,
                        })
                      }
                      className="inline-flex min-h-[44px] items-center gap-2.5 rounded-xl border bg-background px-4 py-2.5 text-sm font-semibold text-default-700 transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                      <MessageCircle
                        className="h-4 w-4 shrink-0 text-success"
                        aria-hidden="true"
                      />
                      <span>
                        WhatsApp {contact.display}
                        <span className="sr-only"> (membuka WhatsApp)</span>
                      </span>
                    </a>
                  ))}
                  <a
                    href={SUPPORT_EMAIL_URL}
                    onClick={() => trackSupportEvent("support_email_clicked")}
                    className="inline-flex min-h-[44px] items-center gap-2.5 rounded-xl border bg-background px-4 py-2.5 text-sm font-semibold text-default-700 transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    <Mail
                      className="h-4 w-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span className="break-all">
                      {SUPPORT_EMAIL}
                      <span className="sr-only"> (membuka aplikasi email)</span>
                    </span>
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t bg-card px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:pb-3">
              <a
                href={HRD_REGISTER_STARTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackSupportEvent("support_trial_clicked")}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-md shadow-primary/25 transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
              >
                Coba Gratis
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SupportWidget;
