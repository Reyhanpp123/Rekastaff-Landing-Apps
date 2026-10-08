import { faqs, type FaqItem } from "@/lib/faq";
import { CONTACT_EMAIL, WHATSAPP_CONTACTS } from "@/lib/site";

/**
 * Urutan FAQ di widget. Dari lib/faq.ts hanya item yang klaimnya sudah
 * diverifikasi; item lain ditahan sampai teksnya disetujui pemilik produk
 * (REKASTAFF-Docs/features/support-widget/REKASTAFF_SUPPORT_WIDGET_FAQ_CURATION.md §3).
 */
const WIDGET_FAQ_ORDER = [
  "coba-gratis",
  "import-excel",
  "multi-cabang",
  "karyawan-bertambah",
  "install-aplikasi",
];

export const supportFaqs: FaqItem[] = WIDGET_FAQ_ORDER.map((id) =>
  faqs.find((faq) => faq.id === id),
).filter((faq): faq is FaqItem => Boolean(faq));

const SUPPORT_WHATSAPP_TEXT = encodeURIComponent(
  "Halo Rekastaff, saya ingin bertanya tentang Rekastaff.",
);

/** Semua nomor WhatsApp, masing-masing dengan pesan pembuka. */
export const SUPPORT_WHATSAPP_LINKS = WHATSAPP_CONTACTS.map((contact) => ({
  e164: contact.e164,
  display: contact.display,
  url: `${contact.href}?text=${SUPPORT_WHATSAPP_TEXT}`,
}));

// Nomor utama (pertama): dipakai tombol tunggal seperti menu mobile dan CTA.
export const SUPPORT_WHATSAPP_DISPLAY = SUPPORT_WHATSAPP_LINKS[0].display;

export const SUPPORT_WHATSAPP_URL = SUPPORT_WHATSAPP_LINKS[0].url;

export const SUPPORT_EMAIL = CONTACT_EMAIL;

export const SUPPORT_EMAIL_URL = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  "Pertanyaan tentang Rekastaff",
)}`;

export type SupportEvent =
  | "support_widget_opened"
  | "support_widget_closed"
  | "support_faq_opened"
  | "support_whatsapp_clicked"
  | "support_email_clicked"
  | "support_trial_clicked";

/**
 * Landing belum memasang tool analytics. Event hanya diteruskan ke
 * `window.dataLayer` bila tag manager sudah ada; selain itu no-op, jadi tidak
 * ada request atau cookie baru dari widget.
 */
export function trackSupportEvent(
  event: SupportEvent,
  params?: Record<string, string>,
) {
  if (typeof window === "undefined") return;
  const dataLayer = (window as { dataLayer?: unknown }).dataLayer;
  if (!Array.isArray(dataLayer)) return;
  dataLayer.push({ event, ...params });
}
