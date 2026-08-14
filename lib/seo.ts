import {
  CONTACT_EMAIL,
  SITE_URL,
  WHATSAPP_CONTACTS,
  HRD_REGISTER_STARTER_URL,
} from "@/lib/site";
import { faqs } from "@/lib/faq";

export const SITE_NAME = "Rekastaff";

/** Judul homepage. Target ~50-60 karakter agar tidak terpotong di SERP. */
export const SEO_TITLE =
  "Aplikasi HRIS, Absensi & Payroll Online — Rekastaff";

/** Deskripsi homepage. Target ~150-160 karakter, mengandung CTA. */
export const SEO_DESCRIPTION =
  "Kelola absensi GPS, cuti, shift, dan payroll (PPh 21 & BPJS) karyawan dalam satu platform HRIS. Setup hitungan jam, gratis untuk tim kecil. Coba sekarang!";

/** Dipakai di OG image dan sebagai judul sosial (boleh lebih panjang dari SEO_TITLE). */
export const SOCIAL_TITLE =
  "Kelola HR Perusahaan Lebih Cerdas dalam Satu Platform";

export const SEO_KEYWORDS = [
  "aplikasi HRIS",
  "software HRIS Indonesia",
  "aplikasi absensi karyawan",
  "absensi online GPS",
  "aplikasi payroll",
  "software penggajian",
  "hitung PPh 21 karyawan",
  "aplikasi cuti karyawan",
  "manajemen shift karyawan",
  "sistem informasi SDM",
  "HRIS gratis",
  "Rekastaff",
];

/** URL logo publik — dipakai untuk structured data Organization. */
export const LOGO_URL = `${SITE_URL}/logo.svg`;

/**
 * Structured data (JSON-LD) untuk homepage.
 *
 * Catatan: sengaja TIDAK memakai `aggregateRating` / `review` karena testimoni
 * di halaman masih placeholder. Memasang rating yang tidak diverifikasi
 * melanggar kebijakan Google dan berisiko kena manual action.
 */
export function buildHomeJsonLd() {
  const organizationId = `${SITE_URL}/#organization`;
  const websiteId = `${SITE_URL}/#website`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: LOGO_URL,
        },
        image: LOGO_URL,
        email: CONTACT_EMAIL,
        telephone: WHATSAPP_CONTACTS.map((c) => c.e164),
        address: {
          "@type": "PostalAddress",
          addressLocality: "Jakarta",
          addressCountry: "ID",
        },
        contactPoint: WHATSAPP_CONTACTS.map((c) => ({
          "@type": "ContactPoint",
          telephone: c.e164,
          contactType: "customer support",
          email: CONTACT_EMAIL,
          areaServed: "ID",
          availableLanguage: ["id", "en"],
        })),
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: SITE_URL,
        name: SITE_NAME,
        description: SEO_DESCRIPTION,
        inLanguage: "id-ID",
        publisher: { "@id": organizationId },
      },
      {
        "@type": "SoftwareApplication",
        name: SITE_NAME,
        url: SITE_URL,
        description: SEO_DESCRIPTION,
        applicationCategory: "BusinessApplication",
        applicationSubCategory: "Human Resource Management System",
        operatingSystem: "Web, Android, iOS",
        inLanguage: "id-ID",
        publisher: { "@id": organizationId },
        featureList: [
          "Absensi online dengan validasi GPS dan foto selfie",
          "Pengajuan dan persetujuan cuti serta izin",
          "Penggajian otomatis termasuk BPJS dan PPh 21",
          "Manajemen shift dan jadwal kerja",
          "Manajemen data dan dokumen karyawan",
          "Laporan dan rekap kehadiran",
        ],
        offers: {
          "@type": "Offer",
          name: "Paket Starter",
          price: "0",
          priceCurrency: "IDR",
          category: "free",
          url: HRD_REGISTER_STARTER_URL,
          availability: "https://schema.org/InStock",
          description:
            "Paket Starter gratis untuk mulai mengelola absensi, cuti, dan data karyawan tanpa biaya di awal.",
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        inLanguage: "id-ID",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };
}
