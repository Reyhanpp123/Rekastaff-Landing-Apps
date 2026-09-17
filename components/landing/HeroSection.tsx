"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  PlayCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HRD_REGISTER_STARTER_URL } from "@/lib/site";

const heroHighlights = [
  "Gratis untuk tim kecil",
  "Tanpa kartu kredit",
  "Setup dalam hitungan jam",
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 lg:pt-28">
      {/* Background dekoratif */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--default-200)/0.4)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--default-200)/0.4)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_60%,transparent_100%)]" />
        <div className="absolute -top-32 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />
        <div className="absolute top-1/3 -right-24 h-[350px] w-[350px] rounded-full bg-info/10 blur-[120px]" />
      </div>

      <div className="container px-4 sm:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center"
        >
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold text-primary sm:text-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Platform HRIS All-in-One untuk Bisnis Indonesia
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl font-extrabold leading-[1.1] tracking-tight text-default-900 sm:text-5xl md:text-6xl lg:text-[64px]"
          >
            Kelola HR Perusahaan{" "}
            <span className="relative whitespace-nowrap">
              <span className="bg-gradient-to-r from-primary via-primary-600 to-info bg-clip-text text-transparent">
                Lebih Cerdas
              </span>
              <svg
                aria-hidden="true"
                viewBox="0 0 418 42"
                className="absolute left-0 top-full mt-1 h-[0.4em] w-full fill-primary/30"
                preserveAspectRatio="none"
              >
                <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
              </svg>
            </span>{" "}
            dalam Satu Platform
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="max-w-2xl text-base leading-relaxed text-default-600 sm:text-lg md:text-xl"
          >
            Absensi GPS, pengajuan cuti, payroll dengan PPh 21 & BPJS, hingga
            manajemen shift — semua otomatis, akurat, dan bisa diakses dari web
            maupun mobile. Fokus kembangkan bisnis, biar Rekastaff yang urus HR.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4"
          >
            <a
              href={HRD_REGISTER_STARTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button
                size="xl"
                className="group h-14 w-full px-8 text-base font-bold shadow-lg shadow-primary/30 sm:w-auto"
              >
                Coba Gratis Sekarang
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </a>
            <Link href="#features" className="w-full sm:w-auto">
              <Button
                size="xl"
                variant="outline"
                className="h-14 w-full px-8 text-base font-bold text-default-700 border-default-300 hover:border-primary hover:bg-primary hover:text-primary-foreground sm:w-auto"
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                Lihat Fitur
              </Button>
            </Link>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
          >
            {heroHighlights.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-default-500 sm:text-sm"
              >
                <CheckCircle2 className="h-4 w-4 text-success" />
                {item}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Preview dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative mx-auto mt-14 max-w-5xl md:mt-20"
        >
          <div className="absolute -inset-x-8 top-8 -z-10 h-full rounded-[40px] bg-gradient-to-t from-primary/20 via-primary/5 to-transparent blur-2xl" />

          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          >
            <Image
              src="/images/all-img/banner.png"
              alt="Preview Dashboard Rekastaff HRIS"
              width={1536}
              height={1024}
              className="block h-auto w-full"
              priority
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
