"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { SiteLogo } from "@/components/svg";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ScrollProgress from "./parallax/ScrollProgress";
import { HRD_LOGIN_URL, HRD_REGISTER_STARTER_URL } from "@/lib/site";

const navLinks = [
  { label: "Fitur", href: "/#features" },
  { label: "Cara Kerja", href: "/#how-it-works" },
  { label: "Harga", href: "/#pricing" },
  { label: "Testimoni", href: "/#testimonials" },
  { label: "FAQ", href: "/#faq" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b bg-background/80 backdrop-blur-xl shadow-sm"
          : "border-b border-transparent bg-background/60 backdrop-blur-sm"
      )}
    >
      <div className="container flex h-16 md:h-[72px] items-center justify-between px-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <SiteLogo className="h-8 w-8 text-primary" />
          <span className="text-xl font-extrabold tracking-tight text-default-900">
            Rekastaff
            <span className="ml-1.5 rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary align-middle">
              HRIS
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-default-600 transition-colors hover:bg-primary/5 hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a href={HRD_LOGIN_URL} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="sm" className="font-semibold text-default-700 hover:bg-default-100 hover:text-primary">
              Masuk
            </Button>
          </a>
          <a href={HRD_REGISTER_STARTER_URL} target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="group h-10 px-5 font-bold shadow-md shadow-primary/25">
              Coba Gratis
              <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-default-200 text-default-700 transition-colors hover:bg-default-100"
          aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <ScrollProgress />

      <div
        className={cn(
          "lg:hidden overflow-hidden border-b bg-background/95 backdrop-blur-xl transition-[max-height,opacity] duration-300 ease-out",
          mobileOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0 border-transparent"
        )}
      >
        <nav className="container flex flex-col gap-1 px-4 py-4 sm:px-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-semibold text-default-700 transition-colors hover:bg-primary/5 hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 flex flex-col gap-2.5 border-t pt-4">
            <a href={HRD_LOGIN_URL} target="_blank" rel="noopener noreferrer" className="w-full">
              <Button variant="outline" className="w-full font-semibold">
                Masuk
              </Button>
            </a>
            <a href={HRD_REGISTER_STARTER_URL} target="_blank" rel="noopener noreferrer" className="w-full">
              <Button className="w-full font-bold">
                Coba Gratis Sekarang
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
