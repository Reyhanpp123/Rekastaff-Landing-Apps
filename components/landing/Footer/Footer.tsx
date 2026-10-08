import React from "react";
import Link from "next/link";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { SiteLogo } from "@/components/svg";
import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  HRD_LOGIN_URL,
  HRD_REGISTER_STARTER_URL,
  WHATSAPP_CONTACTS,
} from "@/lib/site";
import Container from "../shared/Container";
import { footer } from "@/content/landing";


/** Footer navy - menyambung Final CTA. Tanpa motion. */
export default function Footer() {
  return (
    <footer data-tone="dark" data-cta-end="" className="relative bg-rs-night pb-10 pt-16 text-rs-night-muted md:pt-20">
      <Container wide>
        <div className="grid gap-12 border-t border-rs-night-border pt-14 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2.5" aria-label="Rekastaff - beranda">
              <SiteLogo className="h-9 w-9 text-sky-400" />
              <span className="text-[22px] font-extrabold tracking-[-0.02em] text-white">Rekastaff</span>
            </Link>
            <p className="mt-4 max-w-[360px] text-[15px] leading-relaxed">{footer.description}</p>
            <a
              href={HRD_REGISTER_STARTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex h-11 items-center rounded-rs-md bg-rs-primary px-5 text-[15px] font-bold text-white shadow-glow transition-colors hover:bg-rs-primary-strong"
            >
              {footer.cta}
              <span className="sr-only"> (membuka tab baru)</span>
            </a>
          </div>

          <nav aria-label={footer.product} className="lg:col-span-2">
            <h2 className="text-[13px] font-bold uppercase tracking-[0.08em] text-white">{footer.product}</h2>
            <ul className="mt-5 space-y-1">
              {footer.productLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="inline-flex min-h-[40px] items-center text-[15px] transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={footer.help} className="lg:col-span-2">
            <h2 className="text-[13px] font-bold uppercase tracking-[0.08em] text-white">{footer.help}</h2>
            <ul className="mt-5 space-y-1">
              {footer.helpLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="inline-flex min-h-[40px] items-center text-[15px] transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href={HRD_REGISTER_STARTER_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[40px] items-center text-[15px] transition-colors hover:text-white">
                  {footer.register}
                </a>
              </li>
              <li>
                <a href={HRD_LOGIN_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[40px] items-center text-[15px] transition-colors hover:text-white">
                  {footer.login}
                </a>
              </li>
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <h2 className="text-[13px] font-bold uppercase tracking-[0.08em] text-white">{footer.contact}</h2>
            <ul className="mt-5 space-y-3 text-[15px]">
              <li className="flex items-start gap-3">
                <MapPin aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-sky-300" />
                <span className="leading-relaxed">{CONTACT_ADDRESS}</span>
              </li>
              {WHATSAPP_CONTACTS.map((c) => (
                <li key={c.e164}>
                  <a href={c.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[40px] items-center gap-3 transition-colors hover:text-white">
                    <MessageCircle aria-hidden="true" className="h-4 w-4 text-emerald-300" />
                    WhatsApp {c.display}
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex min-h-[40px] items-center gap-3 break-all transition-colors hover:text-white">
                  <Mail aria-hidden="true" className="h-4 w-4 shrink-0 text-sky-300" />
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* pb ekstra: baris terakhir tidak tertutup tombol Bantuan / sticky CTA */}
        <div className="mt-14 flex flex-col items-start gap-4 border-t border-rs-night-border pb-16 pt-8 text-[13.5px] sm:flex-row sm:items-center sm:gap-8 sm:pb-12">
          <p>&copy; {new Date().getFullYear()} {footer.copyright}</p>
        </div>
      </Container>
    </footer>
  );
}
