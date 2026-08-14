import React from "react";
import { Zap, MonitorSmartphone, ShieldCheck, Headphones } from "lucide-react";
import Reveal from "./Reveal";

const trustPoints = [
  {
    icon: Zap,
    title: "Setup Kilat",
    description: "Onboarding perusahaan & karyawan selesai dalam hitungan jam, bukan minggu.",
  },
  {
    icon: MonitorSmartphone,
    title: "Web & Mobile",
    description: "HRD kelola dari dashboard web, karyawan absen & ajukan cuti dari HP.",
  },
  {
    icon: ShieldCheck,
    title: "Data Aman",
    description: "Infrastruktur terenkripsi dengan kontrol akses berbasis peran per perusahaan.",
  },
  {
    icon: Headphones,
    title: "Support Responsif",
    description: "Tim support siap bantu lewat WhatsApp dan email setiap hari kerja.",
  },
];

const TrustSection = () => {
  return (
    <section className="border-y bg-default-50/60 py-12 md:py-16">
      <div className="container px-4 sm:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {trustPoints.map((point, index) => (
            <Reveal key={point.title} delay={index * 0.08}>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary/5">
                  <point.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-default-900">{point.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-default-500">
                    {point.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
