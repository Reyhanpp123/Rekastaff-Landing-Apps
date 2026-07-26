import React from "react";
import { SiteLogo } from "@/components/svg";
import Link from "next/link";
import { CONTACT_EMAIL, HRD_LOGIN_URL, WHATSAPP_CONTACTS } from "@/lib/site";

const Footer = () => {
  return (
    <footer className="bg-default-900 text-default-100 py-12">
      <div className="container px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <SiteLogo className="h-10 w-10 text-primary" />
              <span className="text-2xl font-bold text-white">Rekastaff</span>
            </Link>
            <p className="text-default-400 max-w-sm">
              Sistem informasi manajemen sumber daya manusia yang terintegrasi, aman, dan efisien untuk membantu perusahaan Anda berkembang.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Navigasi</h3>
            <ul className="space-y-4 text-default-400">
              <li><Link href="/" className="hover:text-primary transition-colors">Beranda</Link></li>
              <li><Link href="#features" className="hover:text-primary transition-colors">Fitur</Link></li>
              <li><Link href="#pricing" className="hover:text-primary transition-colors">Harga</Link></li>
              <li><Link href="#faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li>
                <a href={HRD_LOGIN_URL} className="hover:text-primary transition-colors">
                  Login Admin
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Hubungi Kami</h3>
            <ul className="space-y-4 text-default-400">
              <li>Jakarta, Indonesia</li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="hover:text-primary transition-colors"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
              {WHATSAPP_CONTACTS.map((contact) => (
                <li key={contact.e164}>
                  <a
                    href={contact.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    WhatsApp {contact.display}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-default-800 mt-12 pt-8 text-center text-default-500 text-sm">
          <p>© {new Date().getFullYear()} Rekastaff. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
