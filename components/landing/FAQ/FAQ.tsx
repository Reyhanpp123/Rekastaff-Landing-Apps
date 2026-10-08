import React from "react";
import { Mail, MessageCircle, Plus } from "lucide-react";
import { faqs } from "@/lib/faq";
import { CONTACT_EMAIL, WHATSAPP_CONTACTS } from "@/lib/site";
import Container from "../shared/Container";
import Eyebrow from "../shared/Eyebrow";
import Headline from "../shared/Headline";
import { faqSection } from "@/content/landing";

/**
 * FAQ (bagian 16-12). Konten dari lib/faq.ts - sumber yang sama dengan
 * JSON-LD FAQPage, jadi teks yang terlihat selalu identik dengan schema.
 *
 * Accordion memakai <details>/<summary> native: tetap bisa dibuka tanpa
 * JavaScript (AC-A3), aksesibel bawaan (keyboard & screen reader), dan
 * jawabannya selalu ada di HTML untuk crawler.
 */
export default function FAQ() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="relative bg-rs-surface py-24 md:py-32">
      <Container wide>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Eyebrow>{faqSection.eyebrow}</Eyebrow>
            <h2 id="faq-title" className="rs-h2 mt-4 text-rs-text">
              <Headline copy={faqSection.title} />
            </h2>
            <p className="rs-lead mt-5 text-rs-muted">{faqSection.sub}</p>

            <div className="mt-8 rounded-rs-lg border border-rs-border bg-white p-6 lg:sticky lg:top-24">
              <h3 className="text-[18px] font-bold text-rs-text">{faqSection.contactTitle}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-rs-muted">{faqSection.contactBody}</p>
              <div className="mt-5 flex flex-col gap-2.5">
                {WHATSAPP_CONTACTS.map((contact) => (
                  <a
                    key={contact.e164}
                    href={contact.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[48px] items-center gap-3 rounded-rs-md border border-rs-border px-4 text-[15px] font-semibold text-rs-text transition-colors hover:border-rs-primary/40 hover:text-rs-primary-strong"
                  >
                    <MessageCircle aria-hidden="true" className="h-4 w-4 text-rs-success" />
                    WhatsApp {contact.display}
                  </a>
                ))}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex min-h-[48px] items-center gap-3 rounded-rs-md border border-rs-border px-4 text-[15px] font-semibold text-rs-text transition-colors hover:border-rs-primary/40 hover:text-rs-primary-strong"
                >
                  <Mail aria-hidden="true" className="h-4 w-4 text-rs-primary-strong" />
                  <span className="break-all">{CONTACT_EMAIL}</span>
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="divide-y divide-rs-border rounded-rs-lg border border-rs-border bg-white">
              {faqs.map((faq, i) => (
                <details key={faq.question} open={i === 0} className="rs-faq group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-5 py-5 sm:px-7 [&::-webkit-details-marker]:hidden">
                    <h3 className="text-[17px] font-bold leading-snug text-rs-text">{faq.question}</h3>
                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-rs-border text-rs-muted transition-[transform,background-color,border-color,color] duration-200 group-open:rotate-45 group-open:border-rs-primary group-open:bg-rs-primary group-open:text-white"
                    >
                      <Plus className="h-4 w-4" />
                    </span>
                  </summary>
                  <p className="rs-faq-body px-5 pb-6 text-[16px] leading-relaxed text-rs-muted sm:px-7">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
