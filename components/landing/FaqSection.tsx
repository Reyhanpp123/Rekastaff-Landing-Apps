"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, Mail, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONTACT_EMAIL, WHATSAPP_CONTACTS } from "@/lib/site";
import { faqs } from "@/lib/faq";

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="border-t bg-default-50/60 py-20 md:py-28">
      <div className="container px-4 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Kolom kiri: heading + kartu bantuan */}
          <div className="lg:col-span-5">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold text-primary sm:text-sm">
              <HelpCircle className="h-3.5 w-3.5" />
              FAQ
            </span>
            <h2 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-default-900 md:text-5xl">
              Pertanyaan yang <span className="text-primary">Sering Diajukan</span>
            </h2>
            <p className="mb-8 text-base text-default-600 md:text-lg">
              Jawaban singkat seputar paket, setup, keamanan data, dan cara
              memulai Rekastaff.
            </p>

            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <h3 className="mb-2 text-lg font-bold text-default-900">
                Masih ada pertanyaan?
              </h3>
              <p className="mb-5 text-sm leading-relaxed text-default-600">
                Ceritakan kebutuhan HR perusahaan Anda — tim kami bantu arahkan
                paket yang paling sesuai.
              </p>
              <div className="flex flex-col gap-2.5">
                <a
                  href={WHATSAPP_CONTACTS[0].href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-xl border bg-background px-4 py-3 text-sm font-semibold text-default-700 transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <MessageCircle className="h-4 w-4 text-success" />
                  WhatsApp {WHATSAPP_CONTACTS[0].display}
                </a>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex items-center gap-2.5 rounded-xl border bg-background px-4 py-3 text-sm font-semibold text-default-700 transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <Mail className="h-4 w-4 text-primary" />
                  {CONTACT_EMAIL}
                </a>
              </div>
            </div>
          </div>

          {/* Kolom kanan: accordion */}
          <div className="lg:col-span-7">
            <div className="flex flex-col gap-3">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;

                return (
                  <div
                    key={faq.question}
                    className={cn(
                      "rounded-2xl border bg-card transition-all duration-200",
                      isOpen
                        ? "border-primary/30 shadow-md shadow-primary/5"
                        : "hover:border-default-300"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="text-base font-bold text-default-900 md:text-lg">
                        {faq.question}
                      </span>
                      <span
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-200",
                          isOpen
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-default-200 text-default-500"
                        )}
                      >
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            isOpen && "rotate-180"
                          )}
                        />
                      </span>
                    </button>
                    <div
                      className={cn(
                        "grid transition-[grid-template-rows] duration-200 ease-out",
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="px-6 pb-5 leading-relaxed text-default-600">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
