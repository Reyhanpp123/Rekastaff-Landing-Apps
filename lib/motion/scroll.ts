"use client";

import type Lenis from "lenis";

/** Instance Lenis aktif (hanya tier full). null = scroll native. */
let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

const HEADER_OFFSET = 72;

/**
 * Scroll ke elemen dengan offset header. Memakai Lenis bila aktif agar tidak
 * bertabrakan dengan smoothing-nya, selain itu scroll native.
 */
export function scrollToElement(
  el: HTMLElement,
  opts: { offset?: number; immediate?: boolean } = {}
) {
  const offset = opts.offset ?? -HEADER_OFFSET;
  if (lenis) {
    lenis.scrollTo(el, { offset, duration: 0.8, immediate: opts.immediate });
    return;
  }
  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: opts.immediate ? "auto" : "smooth" });
}

/** Scroll ke anchor lalu pindahkan fokus ke heading-nya (a11y). */
export function jumpToSection(id: string, focusSelector = "h2") {
  const section = document.getElementById(id);
  if (!section) return;
  scrollToElement(section);
  const target = section.querySelector<HTMLElement>(focusSelector) ?? section;
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
  history.replaceState(null, "", `#${id}`);
}
