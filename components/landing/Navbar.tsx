"use client";

import React from "react";
import Link from "next/link";
import { SiteLogo } from "@/components/svg";
import { Button } from "@/components/ui/button";
import { HRD_LOGIN_URL } from "@/lib/site";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <SiteLogo className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">Rekastaff</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="#features" className="transition-colors hover:text-primary">Fitur</Link>
          <Link href="#pricing" className="transition-colors hover:text-primary">Harga</Link>
          <Link href="#contact" className="transition-colors hover:text-primary">Hubungi Kami</Link>
        </nav>
        <div className="flex items-center gap-4">
          <a href={HRD_LOGIN_URL}>
            <Button variant="outline" size="sm">Masuk</Button>
          </a>
          <Link href="#contact">
            <Button size="sm">Coba Gratis</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
