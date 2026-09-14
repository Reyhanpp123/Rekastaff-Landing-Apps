import React from "react";
import Link from "next/link";
import { MapPin, Mail, MessageCircle, ArrowRight } from "lucide-react";
import { SiteLogo } from "@/components/svg";
import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  HRD_REGISTER_STARTER_URL,
  WHATSAPP_CONTACTS,
} from "@/lib/site";

const productLinks = [
  { label: "Fitur", href: "/#features" },
  { label: "Cara Kerja", href: "/#how-it-works" },
  { label: "Harga & Paket", href: "/#pricing" },
  { label: "Modul Add-on Pro+", href: "/#pricing" },
];

const companyLinks = [
  { label: "Testimoni", href: "/#testimonials" },
  { label: "FAQ", href: "/#faq" },
  { label: "Kebijakan Privasi", href: "/kebijakan-privasi" },
];

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-default-900 pt-16 pb-8 text-default-100 md:pt-20">
      <div className="absolute -top-40 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />

      <div className="container relative px-4 sm:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link href="/" className="mb-5 flex items-center gap-2.5">
              <SiteLogo className="h-9 w-9 text-primary" />
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Rekastaff
                <span className="ml-1.5 rounded-md bg-primary/20 px-1.5 py-0.5 align-middle text-[10px] font-bold uppercase tracking-widest text-primary-300">
                  HRIS
                </span>
              </span>
            </Link>
            <p className="mb-6 max-w-sm text-sm leading-relaxed text-default-400">
              Sistem informasi manajemen sumber daya manusia yang terintegrasi,
              aman, dan efisien — membantu perusahaan Anda berkembang tanpa
              direpotkan urusan administrasi HR.
            </p>
            <a
              href={HRD_REGISTER_STARTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90"
            >
              Mulai Gratis
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          {/* Produk */}
          <div className="lg:col-span-2">
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">
              Produk
            </h3>
            <ul className="space-y-3.5 text-sm text-default-400">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-primary-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Perusahaan */}
          <div className="lg:col-span-2">
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">
              Bantuan
            </h3>
            <ul className="space-y-3.5 text-sm text-default-400">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-primary-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={HRD_REGISTER_STARTER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-primary-300"
                >
                  Daftar Gratis
                </a>
              </li>
            </ul>
          </div>

          {/* Kontak */}
          <div className="lg:col-span-4">
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">
              Hubungi Kami
            </h3>
            <ul className="space-y-4 text-sm text-default-400">
              <li className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5">
                  <MapPin className="h-4 w-4 text-primary-300" />
                </span>
                <span className="pt-2 leading-relaxed">{CONTACT_ADDRESS}</span>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="flex items-center gap-3 transition-colors hover:text-primary-300"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5">
                    <Mail className="h-4 w-4 text-primary-300" />
                  </span>
                  {CONTACT_EMAIL}
                </a>
              </li>
              {WHATSAPP_CONTACTS.map((contact) => (
                <li key={contact.e164}>
                  <a
                    href={contact.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 transition-colors hover:text-primary-300"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5">
                      <MessageCircle className="h-4 w-4 text-success" />
                    </span>
                    WhatsApp {contact.display}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-center text-xs text-default-500 sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} Rekastaff. All rights reserved.</p>
          <p>
            Dibuat dengan <span className="text-destructive">♥</span> untuk tim HR
            Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
