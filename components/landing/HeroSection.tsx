import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="py-20 md:py-32 overflow-hidden bg-gradient-to-b from-primary/5 to-transparent">
      <div className="container px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-default-900 leading-tight">
              Solusi <span className="text-primary">HRIS Terpadu</span> untuk Perusahaan Masa Kini
            </h1>
            <p className="text-lg md:text-xl text-default-600 max-w-2xl mx-auto lg:mx-0">
              Kelola absensi, penggajian, cuti, dan manajemen karyawan dalam satu platform yang mudah digunakan. Fokus pada pertumbuhan bisnis Anda, biar Rekastaff yang urus HR.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="#pricing">
                <Button size="lg" className="px-8 text-lg h-14">Mulai Sekarang</Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="px-8 text-lg h-14">Lihat Fitur</Button>
              </Link>
            </div>
          </div>
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[600px] rounded-2xl border bg-card shadow-2xl overflow-hidden transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
              <Image
                src="/images/all-img/banner.png"
                alt="Dashboard Preview"
                width={1200}
                height={800}
                className="w-full h-auto block"
                priority
              />
            </div>
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
