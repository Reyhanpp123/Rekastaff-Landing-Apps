"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONTACT_EMAIL, WHATSAPP_CONTACTS } from "@/lib/site";

const whatsappList = WHATSAPP_CONTACTS.map((c) => c.display).join(" dan ");

const faqs = [
  {
    question: "Apakah Rekastaff bisa dicoba gratis?",
    answer:
      "Ya. Tersedia paket Starter gratis untuk mulai mengelola absensi, cuti, dan data karyawan tanpa biaya di awal. Anda bisa upgrade kapan saja saat tim bertambah.",
  },
  {
    question: "Berapa lama proses setup awal?",
    answer:
      "Umumnya cukup dalam hitungan jam. Setelah daftar, Anda membuat profil perusahaan, menambah karyawan, lalu langsung bisa pakai fitur inti seperti absensi dan pengajuan cuti.",
  },
  {
    question: "Apakah data karyawan aman?",
    answer:
      "Data disimpan di infrastruktur terenkripsi dengan kontrol akses berbasis peran. Setiap perusahaan memiliki ruang data terpisah, sehingga informasi hanya bisa diakses oleh akun yang berwenang.",
  },
  {
    question: "Apakah termasuk payroll, BPJS, dan PPh 21?",
    answer:
      "Ya, modul penggajian mendukung perhitungan gaji, BPJS, dan PPh 21 sesuai konfigurasi perusahaan. Untuk kebutuhan lanjutan, tersedia juga modul add-on pada paket Pro+.",
  },
  {
    question: "Bagaimana jika jumlah karyawan bertambah?",
    answer:
      "Anda bisa upgrade paket atau menambah kuota sesuai skala tim. Perubahan berlaku tanpa migrasi ulang data — riwayat absensi, cuti, dan dokumen tetap aman.",
  },
  {
    question: "Butuh bantuan atau konsultasi paket?",
    answer: `Tim kami siap membantu lewat email ${CONTACT_EMAIL} atau WhatsApp di ${whatsappList}. Ceritakan kebutuhan HR Anda, kami bantu arahkan paket yang paling sesuai.`,
  },
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24">
      <div className="container px-4 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-default-900 mb-4">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-lg text-default-600">
            Jawaban singkat seputar paket, setup, keamanan data, dan cara memulai Rekastaff.
          </p>
        </div>

        <div className="max-w-3xl mx-auto divide-y divide-default-200 border-y border-default-200">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={faq.question}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-base md:text-lg font-semibold text-default-900">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-default-500 transition-transform duration-200",
                      isOpen && "rotate-180 text-primary"
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-[grid-template-rows] duration-200 ease-out",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="pb-5 text-default-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
