import React from "react";
import { UserPlus, Building2, Rocket, ArrowRight, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HRD_REGISTER_STARTER_URL } from "@/lib/site";
import Reveal from "./Reveal";
import SectionLabel from "./parallax/SectionLabel";
import DrawLine from "./parallax/DrawLine";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Daftar Akun Gratis",
    description:
      "Buat akun perusahaan dalam beberapa menit. Tanpa kartu kredit, tanpa komitmen — langsung aktif.",
  },
  {
    number: "02",
    icon: Building2,
    title: "Setup Perusahaan & Karyawan",
    description:
      "Lengkapi profil perusahaan, atur struktur organisasi, lalu tambahkan data karyawan Anda.",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Mulai Kelola HR",
    description:
      "Absensi, cuti, shift, hingga payroll langsung siap dipakai. Tim Anda bisa akses dari web dan mobile.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="border-y bg-default-50/60 py-20 md:py-28">
      <div className="container px-4 sm:px-8">
        <Reveal className="mx-auto mb-14 max-w-3xl text-center md:mb-20">
          <SectionLabel icon={Workflow} className="mb-4">Cara Kerja</SectionLabel>
          <h2 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-default-900 md:text-5xl">
            Mulai dalam <span className="text-primary">3 Langkah Mudah</span>
          </h2>
          <p className="text-base text-default-600 md:text-lg">
            Tidak perlu tim IT atau proses implementasi berbulan-bulan. Rekastaff
            dirancang agar perusahaan Anda bisa langsung jalan hari ini juga.
          </p>
        </Reveal>

        <div className="relative mx-auto max-w-5xl">
          {/* Garis penghubung (desktop) */}
          <DrawLine className="absolute left-[16%] right-[16%] top-10 hidden h-0.5 lg:block" />

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8">
            {steps.map((step, index) => (
              <Reveal key={step.number} delay={index * 0.15}>
                <div className="relative flex flex-col items-center text-center">
                  <div className="relative z-10 mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-primary/20 bg-background shadow-lg shadow-primary/10">
                    <step.icon className="h-9 w-9 text-primary" />
                    <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[11px] font-extrabold text-primary-foreground shadow-md">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-default-900">
                    {step.title}
                  </h3>
                  <p className="max-w-xs text-sm leading-relaxed text-default-600">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.3} className="mt-14 flex justify-center">
          <a href={HRD_REGISTER_STARTER_URL} target="_blank" rel="noopener noreferrer">
            <Button size="xl" className="group h-14 px-8 text-base font-bold shadow-lg shadow-primary/25">
              Daftar & Mulai Hari Ini
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </a>
        </Reveal>
      </div>
    </section>
  );
};

export default HowItWorksSection;
