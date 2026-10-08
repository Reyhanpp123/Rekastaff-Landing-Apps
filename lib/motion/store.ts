"use client";

import { useSyncExternalStore } from "react";

/**
 * Store kecil tanpa dependency untuk state yang dibagi antar-section
 * (mis. chapter Story yang sedang aktif dibaca oleh Navbar).
 */
function createStore<T>(initial: T) {
  let value = initial;
  const listeners = new Set<() => void>();
  return {
    get: () => value,
    set(next: T) {
      if (Object.is(next, value)) return;
      value = next;
      listeners.forEach((l) => l());
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

/** Index chapter Day-to-Payday yang aktif; -1 bila section tidak terlihat. */
export const storyChapterStore = createStore<number>(-1);

export interface ContextualCta {
  label: string;
  href: string;
}

/** CTA kontekstual untuk sticky CTA mobile (di-set oleh kalkulator harga). */
export const contextualCtaStore = createStore<ContextualCta | null>(null);

export function useStore<T>(store: {
  get: () => T;
  subscribe: (l: () => void) => () => void;
}, serverValue: T): T {
  return useSyncExternalStore(store.subscribe, store.get, () => serverValue);
}
