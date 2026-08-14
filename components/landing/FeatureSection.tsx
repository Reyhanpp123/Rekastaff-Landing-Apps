import React from "react";
import {
  MapPin,
  CalendarRange,
  Banknote,
  FolderOpen,
  Users,
  CalendarClock,
  Camera,
  Navigation,
  FileCheck2,
  TrendingUp,
  UserPlus,
  Plane,
  Wallet,
  MessageSquare,
  Sparkles,
  Check,
} from "lucide-react";
import Reveal from "./Reveal";

const highlightFeatures = [
  {
    title: "Absensi Online Real-time",
    description:
      "Pantau kehadiran seluruh tim secara langsung. Karyawan cukup clock-in dari HP — sistem memvalidasi lokasi dan wajah secara otomatis.",
    icon: MapPin,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    points: [
      { icon: Navigation, label: "Validasi lokasi GPS" },
      { icon: Camera, label: "Verifikasi foto selfie" },
      { icon: CalendarClock, label: "Rekap otomatis harian" },
    ],
  },
  {
    title: "Payroll Otomatis & Akurat",
    description:
      "Hitung gaji, tunjangan, potongan, BPJS, hingga PPh 21 dalam sekali proses. Slip gaji langsung terkirim ke setiap karyawan.",
    icon: Banknote,
    color: "text-green-500",
    bg: "bg-green-500/10",
    points: [
      { icon: FileCheck2, label: "PPh 21 & BPJS otomatis" },
      { icon: Wallet, label: "Komponen gaji fleksibel" },
      { icon: Check, label: "Slip gaji digital" },
    ],
  },
];

const features = [
  {
    title: "Pengajuan Cuti & Izin",
    description:
      "Proses pengajuan dan persetujuan cuti yang cepat, transparan, dan tercatat rapi dalam satu klik.",
    icon: CalendarRange,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    title: "Manajemen Karyawan",
    description:
      "Database terpusat untuk profil, kontrak, dan riwayat karir seluruh karyawan perusahaan.",
    icon: Users,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
  },
  {
    title: "Manajemen Shift",
    description:
      "Atur jadwal kerja dan rotasi shift karyawan dengan mudah, terorganisir, dan bebas bentrok.",
    icon: CalendarClock,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
  {
    title: "Manajemen Dokumen",
    description:
      "Simpan dokumen penting karyawan dan perusahaan secara digital, aman, dan mudah dicari.",
    icon: FolderOpen,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

const addonModules = [
  { icon: TrendingUp, label: "KPI & Kinerja" },
  { icon: UserPlus, label: "Rekrutmen" },
  { icon: Plane, label: "Perjalanan Dinas" },
  { icon: Wallet, label: "Keuangan" },
  { icon: MessageSquare, label: "Komunikasi Internal" },
];

const FeatureSection = () => {
  return (
    <section id="features" className="relative overflow-hidden py-20 md:py-28">
      <div className="absolute top-0 left-1/2 -z-10 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-primary/5 blur-[140px]" />

      <div className="container px-4 sm:px-8">
        <Reveal className="mx-auto mb-14 max-w-3xl text-center md:mb-20">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold text-primary sm:text-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Fitur Unggulan
          </span>
          <h2 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-default-900 md:text-5xl">
            Semua Kebutuhan HR,{" "}
            <span className="text-primary">Satu Platform</span>
          </h2>
          <p className="text-base text-default-600 md:text-lg">
            Dirancang untuk membantu perusahaan mengelola sumber daya manusia
            dengan lebih efisien, akurat, dan modern — dari absensi hingga payroll.
          </p>
        </Reveal>

        {/* Highlight: 2 kartu besar */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {highlightFeatures.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 0.1}>
              <div className="group relative h-full overflow-hidden rounded-3xl border bg-card p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 md:p-10">
                <div
                  className={`absolute -right-10 -top-10 h-40 w-40 rounded-full ${feature.bg} blur-3xl transition-opacity opacity-60 group-hover:opacity-100`}
                />
                <div
                  className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${feature.bg}`}
                >
                  <feature.icon className={`h-7 w-7 ${feature.color}`} />
                </div>
                <h3 className="mb-3 text-xl font-bold text-default-900 md:text-2xl">
                  {feature.title}
                </h3>
                <p className="mb-6 leading-relaxed text-default-600">
                  {feature.description}
                </p>
                <ul className="flex flex-wrap gap-2.5">
                  {feature.points.map((point) => (
                    <li
                      key={point.label}
                      className="inline-flex items-center gap-1.5 rounded-full border bg-default-50 px-3 py-1.5 text-xs font-semibold text-default-700"
                    >
                      <point.icon className="h-3.5 w-3.5 text-primary" />
                      {point.label}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Grid 4 fitur */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 0.08}>
              <div className="group h-full rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg} transition-transform duration-300 group-hover:scale-110`}
                >
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="mb-2 text-lg font-bold text-default-900">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-default-600">
                  {feature.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Modul add-on */}
        <Reveal delay={0.15}>
          <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-primary/30 bg-primary/[0.03] px-6 py-8 text-center md:mt-16">
            <p className="text-sm font-bold uppercase tracking-wider text-primary">
              Butuh lebih? Perluas dengan Modul Add-on Pro+
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {addonModules.map((mod) => (
                <span
                  key={mod.label}
                  className="inline-flex items-center gap-1.5 rounded-full border bg-background px-4 py-2 text-xs font-semibold text-default-700 shadow-sm"
                >
                  <mod.icon className="h-3.5 w-3.5 text-primary" />
                  {mod.label}
                </span>
              ))}
            </div>
            <p className="text-xs text-default-500">
              Bayar sekali, akses selamanya — lihat detailnya di bagian harga.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default FeatureSection;
