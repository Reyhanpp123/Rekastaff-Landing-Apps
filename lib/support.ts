import { faqs, type FaqItem } from "@/lib/faq";
import { CONTACT_EMAIL, WHATSAPP_CONTACTS } from "@/lib/site";

/**
 * Khusus widget — sengaja tidak ditaruh di lib/faq.ts supaya tidak ikut
 * JSON-LD FAQPage (isi schema harus sama dengan FAQ yang tampil di halaman).
 */
const WIDGET_ONLY_FAQS: FaqItem[] = [
  {
    id: "import-excel",
    question: "Bisakah data karyawan diimpor dari Excel?",
    answer:
      "Bisa. Setelah mendaftar, unduh template Excel di menu Import Pegawai, isi data karyawan, lalu unggah kembali. Cara yang sama tersedia untuk jadwal shift.",
  },
  {
    id: "multi-cabang",
    question: "Apakah bisa untuk perusahaan dengan beberapa cabang?",
    answer:
      "Bisa. Cabang dikelola dalam satu akun perusahaan, dan komponen gaji (tunjangan maupun potongan) dapat diatur per cabang.",
  },
];

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

const faqCandidates = [...faqs, ...WIDGET_ONLY_FAQS];

export const supportFaqs: FaqItem[] = WIDGET_FAQ_ORDER.map((id) =>
  faqCandidates.find((faq) => faq.id === id),
).filter((faq): faq is FaqItem => Boolean(faq));

const supportWhatsApp = WHATSAPP_CONTACTS[0];

export const SUPPORT_WHATSAPP_DISPLAY = supportWhatsApp.display;

export const SUPPORT_WHATSAPP_URL = `${supportWhatsApp.href}?text=${encodeURIComponent(
  "Halo Rekastaff, saya ingin bertanya tentang Rekastaff.",
)}`;

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
