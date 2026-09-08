import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, ShieldCheck } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { CONTACT_ADDRESS, CONTACT_EMAIL, SITE_URL } from "@/lib/site";
import { SITE_NAME } from "@/lib/seo";
import {
  PRIVACY_POLICY_EFFECTIVE_DATE,
  privacyPolicySections,
} from "@/lib/legal";

const PAGE_TITLE = "Kebijakan Privasi";
const PAGE_DESCRIPTION =
  "Kebijakan Privasi Rekastaff: bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda di situs dan aplikasi HRIS Rekastaff.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/kebijakan-privasi",
  },
  openGraph: {
    url: "/kebijakan-privasi",
    title: `${PAGE_TITLE} | ${SITE_NAME}`,
    description: PAGE_DESCRIPTION,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-grow">
        <section className="border-b bg-default-50/60 py-16 md:py-20">
          <div className="container px-4 sm:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold text-primary sm:text-sm">
                <ShieldCheck className="h-3.5 w-3.5" />
                Privasi &amp; Perlindungan Data
              </span>
              <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-default-900 md:text-5xl">
                Kebijakan Privasi
              </h1>
              <p className="text-base text-default-600 md:text-lg">
                Terakhir diperbarui: {PRIVACY_POLICY_EFFECTIVE_DATE}
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container px-4 sm:px-8">
            <div className="mx-auto max-w-3xl">
              <div className="flex flex-col gap-10">
                {privacyPolicySections.map((section) => (
                  <div key={section.id} id={section.id}>
                    <h2 className="mb-4 text-xl font-bold text-default-900 md:text-2xl">
                      {section.title}
                    </h2>
                    <div className="flex flex-col gap-4">
                      {section.paragraphs?.map((paragraph, index) => (
                        <p
                          key={index}
                          className="leading-relaxed text-default-600"
                        >
                          {paragraph}
                        </p>
                      ))}
                      {section.list && (
                        <ul className="flex flex-col gap-2.5">
                          {section.list.map((item, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2.5 leading-relaxed text-default-600"
                            >
                              <span
                                aria-hidden="true"
                                className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60"
                              />
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}

                <div className="rounded-2xl border bg-card p-6 shadow-sm">
                  <ul className="flex flex-col gap-4 text-sm">
                    <li className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/5">
                        <MapPin className="h-4 w-4 text-primary" />
                      </span>
                      <span className="pt-2 leading-relaxed text-default-600">
                        {CONTACT_ADDRESS}
                      </span>
                    </li>
                    <li>
                      <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="flex items-center gap-3 font-semibold text-default-700 transition-colors hover:text-primary"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/5">
                          <Mail className="h-4 w-4 text-primary" />
                        </span>
                        {CONTACT_EMAIL}
                      </a>
                    </li>
                  </ul>
                </div>

                <p className="text-sm text-default-500">
                  Lihat juga{" "}
                  <Link
                    href="/"
                    className="font-semibold text-primary hover:underline"
                  >
                    halaman utama Rekastaff
                  </Link>{" "}
                  untuk info produk dan paket harga.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
