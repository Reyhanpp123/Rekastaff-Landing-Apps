"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  X, 
  HelpCircle, 
  Sparkles, 
  Calculator,
  User, 
  Coins, 
  TrendingUp, 
  UserPlus, 
  Plane, 
  DollarSign, 
  FileText, 
  MessageSquare,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const formatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

export default function PricingSection() {
  const [duration, setDuration] = useState<number>(1); // 1, 3, 6, 12 months
  const [employeeCount, setEmployeeCount] = useState<number>(10);
  const [activeTab, setActiveTab] = useState<string>("plans"); // plans | addons

  const formatPrice = (val: number) => {
    return formatter.format(val);
  };

  // Pricing calculations
  const calculateProPrice = () => {
    const basePrice = 500000;
    const maxFreeEmployees = 105;
    let extraPrice = 0;
    
    if (employeeCount > maxFreeEmployees) {
      const extraCount = employeeCount - maxFreeEmployees;
      extraPrice = extraCount * 5000;
    }
    
    return (basePrice + extraPrice) * duration;
  };

  const calculateCustomPrice = () => {
    const minEmployees = 100;
    const count = Math.max(employeeCount, minEmployees);
    return count * 5000 * duration;
  };

  // Determine recommended plan based on employee count
  const getRecommendedPlan = () => {
    if (employeeCount <= 5) return "starter";
    if (employeeCount <= 105) return "pro";
    return "custom";
  };

  const recommendedPlan = getRecommendedPlan();

  const handleSliderChange = (value: number[]) => {
    if (value && value.length > 0) {
      setEmployeeCount(value[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= 1) {
      setEmployeeCount(val);
    } else if (e.target.value === "") {
      setEmployeeCount(1);
    }
  };

  const durations = [
    { value: 1, label: "1 Bulan" },
    { value: 3, label: "3 Bulan" },
    { value: 6, label: "6 Bulan" },
    { value: 12, label: "12 Bulan" },
  ];

  const addons = [
    {
      id: "payroll",
      name: "Payroll (Penggajian)",
      desc: "Proses penggajian otomatis, BPJS, PPh 21, dan cetak slip gaji secara akurat.",
      price: 299000,
      icon: Coins,
      color: "text-green-500",
      bg: "bg-green-500/10",
      features: ["Hitung Gaji Otomatis", "Potongan BPJS & Pajak", "Slip Gaji Digital", "Laporan Penggajian"]
    },
    {
      id: "performance",
      name: "Performance (Kinerja)",
      desc: "Kelola KPI, evaluasi kerja (appraisal) 360°, dan lacak target pencapaian karyawan.",
      price: 199000,
      icon: TrendingUp,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      features: ["Sistem KPI Karyawan", "Review Multi-Rater (360°)", "Target Tracking", "Laporan Evaluasi Kinerja"]
    },
    {
      id: "recruitment",
      name: "Recruitment",
      desc: "Kelola pipeline rekrutmen mulai dari registrasi kandidat, tahap seleksi, hingga onboarding.",
      price: 199000,
      icon: UserPlus,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      features: ["Portal Lowongan Kerja", "Pelacakan Kandidat (ATS)", "Jadwal Wawancara", "Onboarding Checklist"]
    },
    {
      id: "travel",
      name: "Travel (Perjalanan Dinas)",
      desc: "Kelola permohonan dinas luar kota, approval alur kerja, pengeluaran, dan klaim reimburse.",
      price: 149000,
      icon: Plane,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      features: ["Pengajuan Dinas Luar", "Multi-Level Approval", "Pencatatan Biaya (Reimburse)", "Laporan Perjalanan"]
    },
    {
      id: "finance",
      name: "Finance (Keuangan)",
      desc: "Manajemen transaksi internal, pengajuan pinjaman karyawan, kas bon, dan angsuran.",
      price: 199000,
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      features: ["Pinjaman & Kas Bon", "Skema Angsuran Gaji", "Klaim Pengeluaran", "Laporan Keuangan HR"]
    },
    {
      id: "documents",
      name: "Advanced Documents",
      desc: "Buat, tanda tangani, dan kelola kontrak kerja, kebijakan perusahaan, serta surat peringatan (SP).",
      price: 99000,
      icon: FileText,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      features: ["Template Kontrak Kerja", "E-Sign Digital", "Surat Peringatan & Teguran", "Repository Kebijakan"]
    },
    {
      id: "communication",
      name: "Internal Communication",
      desc: "Bagikan pengumuman perusahaan, direktori staf interaktif, dan pesan internal tim.",
      price: 99000,
      icon: MessageSquare,
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
      features: ["Papan Pengumuman Digital", "Direktori Kontak Pegawai", "Pesan Kilat Internal", "Notifikasi Instan"]
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-default-50/30 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      
      <div className="container px-4 sm:px-8 font-sans">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-4 text-xs px-4 py-1" color="default" variant="soft">
            <Sparkles className="h-3.5 w-3.5 mr-2 inline text-primary" /> Harga Fleksibel & Transparan
          </Badge>
          <h2 className="text-3xl md:text-5xl font-extrabold text-default-900 mb-6 leading-tight">
            Pilih Paket Terbaik untuk <span className="text-primary">Tim Anda</span>
          </h2>
          <p className="text-lg text-default-600">
            Mulai gratis untuk tim kecil, atau upgrade ke paket profesional dengan kuota yang fleksibel sesuai ukuran bisnis Anda.
          </p>
        </div>

        {/* Tab Selector: Plans vs Addons */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 bg-default-100 rounded-full border shadow-sm">
            <button
              onClick={() => setActiveTab("plans")}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab === "plans" 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-default-600 hover:text-primary"
              }`}
            >
              Paket Langganan Utama
            </button>
            <button
              onClick={() => setActiveTab("addons")}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab === "addons" 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-default-600 hover:text-primary"
              }`}
            >
              Modul Add-on Pro+
            </button>
          </div>
        </div>

        {activeTab === "plans" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-16"
          >
            {/* Interactive Calculator Section */}
            <div className="max-w-4xl mx-auto bg-card rounded-3xl border p-8 md:p-10 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none" />
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Calculator className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-default-900">Kalkulator Karyawan</h3>
                      <p className="text-sm text-default-500">Sesuaikan jumlah karyawan untuk menemukan paket & harga terbaik.</p>
                    </div>
                  </div>

                  {/* Slider Control */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-semibold text-default-700">Jumlah Karyawan:</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={employeeCount}
                          onChange={handleInputChange}
                          className="w-20 px-3 py-1.5 text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm font-bold bg-background text-foreground"
                          min="1"
                        />
                        <span className="text-sm text-default-500 font-semibold">Orang</span>
                      </div>
                    </div>
                    
                    <Slider
                      value={[employeeCount]}
                      min={1}
                      max={200}
                      step={1}
                      onValueChange={handleSliderChange}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-default-400 font-medium">
                      <span>1 Karyawan</span>
                      <span>50 Karyawan</span>
                      <span>105 Karyawan (Bonus Free)</span>
                      <span>200+ Karyawan</span>
                    </div>
                  </div>

                  {/* Duration Selector inside Calculator */}
                  <div className="space-y-3">
                    <span className="text-sm font-semibold text-default-700 block">Siklus Pembayaran:</span>
                    <div className="grid grid-cols-4 gap-2">
                      {durations.map((d) => (
                        <button
                          key={d.value}
                          onClick={() => setDuration(d.value)}
                          className={`py-2 px-3 border rounded-xl text-xs font-bold transition-all ${
                            duration === d.value
                              ? "bg-primary/10 border-primary text-primary shadow-sm"
                              : "bg-background border-default-200 text-default-600 hover:border-default-400"
                          }`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-default-50/50 p-6 md:p-8 rounded-2xl border flex flex-col justify-between h-full space-y-6">
                  <div>
                    <span className="text-xs font-bold text-default-500 uppercase tracking-wider">Rekomendasi Paket</span>
                    <h4 className="text-2xl font-extrabold text-default-900 mt-1 capitalize">
                      {recommendedPlan === "starter" ? "Starter (Free)" : recommendedPlan === "pro" ? "Professional (Pro)" : "Enterprise (Custom)"}
                    </h4>
                    <p className="text-sm text-default-600 mt-2">
                      {recommendedPlan === "starter" && "Sangat cocok untuk startup atau UMKM skala mikro."}
                      {recommendedPlan === "pro" && "Pilihan ideal untuk perusahaan menengah dengan fitur HR lengkap."}
                      {recommendedPlan === "custom" && "Solusi terbaik untuk perusahaan besar berskala enterprise."}
                    </p>
                  </div>

                  <div className="border-t border-dashed pt-4">
                    <span className="text-xs text-default-400 font-semibold block">Estimasi Biaya ({duration} Bulan):</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-3xl font-extrabold text-primary">
                        {recommendedPlan === "starter" ? "Gratis" : formatPrice(recommendedPlan === "pro" ? calculateProPrice() : calculateCustomPrice())}
                      </span>
                      {recommendedPlan !== "starter" && (
                        <span className="text-sm text-default-500 font-semibold">/ total</span>
                      )}
                    </div>
                    {recommendedPlan === "pro" && employeeCount > 105 && (
                      <span className="text-xs text-emerald-600 font-medium block mt-1">
                        *Termasuk biaya {employeeCount - 105} extra karyawan: {formatPrice((employeeCount - 105) * 5000 * duration)}
                      </span>
                    )}
                  </div>

                  <Link href="#contact" className="w-full">
                    <Button className="w-full font-bold group h-12 text-sm shadow-md">
                      Mulai Sekarang 
                      <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Three Main Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
              
              {/* STARTER PLAN */}
              <Card className={`flex flex-col relative transition-all duration-300 hover:shadow-xl border-t-4 ${
                recommendedPlan === "starter" 
                  ? "border-primary shadow-lg scale-105 md:scale-[1.03] z-10" 
                  : "border-default-200"
              }`}>
                {recommendedPlan === "starter" && (
                  <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2">
                    <Badge className="bg-primary text-primary-foreground font-bold px-3 py-1 text-xs">REKOMENDASI</Badge>
                  </div>
                )}
                <CardHeader className="p-8">
                  <CardTitle className="text-2xl font-bold text-default-900">Starter</CardTitle>
                  <CardDescription className="text-sm text-default-500 mt-2 min-h-[40px]">
                    Kelola administrasi HR dasar tim kecil Anda secara efisien.
                  </CardDescription>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-default-900">Rp 0</span>
                    <span className="text-default-500 text-sm font-semibold">/ gratis selamanya</span>
                  </div>
                </CardHeader>
                <CardContent className="p-8 pt-0 flex-grow border-t">
                  <ul className="space-y-4 text-sm text-default-600 mt-6">
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Maksimal <strong>5 karyawan</strong></span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Dashboard & Overview dasar</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Absensi Online (Clock In/Out) & GPS</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Kelola & Approval Cuti (Maks 3 jenis)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>1 Kantor Cabang</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Data Master Divisi & Posisi (Maks 5)</span>
                    </li>
                    <li className="flex items-start gap-3 text-default-300">
                      <X className="h-5 w-5 text-default-300 shrink-0 mt-0.5" />
                      <span className="line-through">Shift & Lembur Karyawan</span>
                    </li>
                    <li className="flex items-start gap-3 text-default-300">
                      <X className="h-5 w-5 text-default-300 shrink-0 mt-0.5" />
                      <span className="line-through">Laporan HR Lengkap (Excel/PDF)</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="p-8 border-t bg-default-50/50">
                  <Link href="#contact" className="w-full">
                    <Button variant="outline" className="w-full font-bold h-11 text-sm">
                      Daftar Gratis
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              {/* PRO PLAN */}
              <Card className={`flex flex-col relative transition-all duration-300 hover:shadow-2xl border-t-4 ${
                recommendedPlan === "pro" 
                  ? "border-primary shadow-xl scale-105 md:scale-[1.05] z-10" 
                  : "border-primary/50"
              }`}>
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 flex gap-1">
                  <Badge className="bg-amber-500 text-white font-bold px-3 py-1 text-xs">TERLARIS</Badge>
                  {recommendedPlan === "pro" && (
                    <Badge className="bg-primary text-primary-foreground font-bold px-3 py-1 text-xs">REKOMENDASI</Badge>
                  )}
                </div>
                
                <CardHeader className="p-8">
                  <CardTitle className="text-2xl font-bold text-default-900">Pro</CardTitle>
                  <CardDescription className="text-sm text-default-500 mt-2 min-h-[40px]">
                    Solusi HR lengkap untuk kemudahan operasional tim Anda.
                  </CardDescription>
                  <div className="mt-6 flex flex-col">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-default-900">
                        {formatPrice(500000 * duration)}
                      </span>
                      <span className="text-default-500 text-sm font-semibold">/ {duration} Bulan</span>
                    </div>
                    <span className="text-xs text-default-400 font-semibold mt-1">Setara {formatPrice(500000)} / bulan</span>
                  </div>
                </CardHeader>
                <CardContent className="p-8 pt-0 flex-grow border-t">
                  <ul className="space-y-4 text-sm text-default-600 mt-6">
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Maksimal <strong>105 karyawan</strong> (100 + 5 bonus Free)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Semua fitur paket <strong>Starter</strong></span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Manajemen Shift & Lembur Karyawan</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Cuti Tanpa Batas (Unlimited Jenis) & Kalender Cuti</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Kehadiran Manual & Workflow Resign / Onboarding</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Multi Kantor Cabang & Multi-user RBAC</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Laporan Lengkap & Ekspor / Impor Data Excel</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Extra karyawan: <strong>Rp 5.000 / kary / bulan</strong></span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="p-8 border-t bg-primary/[0.02]">
                  <Link href="#contact" className="w-full">
                    <Button className="w-full font-bold h-11 text-sm shadow-md">
                      Pilih Paket Pro
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              {/* CUSTOM PLAN */}
              <Card className={`flex flex-col relative transition-all duration-300 hover:shadow-xl border-t-4 ${
                recommendedPlan === "custom" 
                  ? "border-primary shadow-lg scale-105 md:scale-[1.03] z-10" 
                  : "border-default-200"
              }`}>
                {recommendedPlan === "custom" && (
                  <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2">
                    <Badge className="bg-primary text-primary-foreground font-bold px-3 py-1 text-xs">REKOMENDASI</Badge>
                  </div>
                )}
                <CardHeader className="p-8">
                  <CardTitle className="text-2xl font-bold text-default-900">Custom</CardTitle>
                  <CardDescription className="text-sm text-default-500 mt-2 min-h-[40px]">
                    Solusi fleksibel per karyawan untuk perusahaan skala besar.
                  </CardDescription>
                  <div className="mt-6 flex flex-col">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-default-900">Rp 5.000</span>
                      <span className="text-default-500 text-sm font-semibold">/ karyawan / bulan</span>
                    </div>
                    <span className="text-xs text-default-400 font-semibold mt-1">Minimal 100 karyawan (+5 bonus Free)</span>
                  </div>
                </CardHeader>
                <CardContent className="p-8 pt-0 flex-grow border-t">
                  <ul className="space-y-4 text-sm text-default-600 mt-6">
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Kapasitas karyawan sesuai kebutuhan (100+)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Semua fitur paket <strong>Pro</strong></span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Bonus kuota tetap <strong>+5 karyawan gratis</strong></span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Akses penuh ke semua master data tanpa batas</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Perpanjangan & aktivasi modul Pro+ instan</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Dedicated Support (Manajer Akun Khusus)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Service Level Agreement (SLA) terjamin</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="p-8 border-t bg-default-50/50">
                  <Link href="#contact" className="w-full">
                    <Button variant="outline" className="w-full font-bold h-11 text-sm">
                      Hubungi Sales
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-12 max-w-6xl mx-auto"
          >
            {/* Addons Info Banner */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
              <div className="space-y-2 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <h3 className="font-bold text-lg text-default-900">Modul Tambahan Pro+ (Add-on)</h3>
                </div>
                <p className="text-sm text-default-600 max-w-2xl">
                  Beli modul yang dibutuhkan secara terpisah. Pembayaran dilakukan **sekali untuk selamanya (lifetime access)**. Modul tetap dapat diakses meskipun masa berlangganan bulanan utama Anda habis.
                </p>
              </div>
              <div className="text-center md:text-right shrink-0 bg-primary text-primary-foreground px-5 py-3 rounded-xl shadow-md">
                <span className="text-xs uppercase font-bold tracking-wider opacity-90 block">Promo Paket Lengkap</span>
                <span className="text-xl font-black block mt-0.5">Hanya Rp 1.243.000</span>
                <span className="text-xs opacity-75 font-semibold">Untuk Semua 7 Modul Permanen</span>
              </div>
            </div>

            {/* Addons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {addons.map((addon) => {
                const IconComponent = addon.icon;
                return (
                  <Card key={addon.id} className="flex flex-col hover:shadow-md transition-shadow duration-300 border-none bg-card shadow-sm">
                    <CardHeader className="p-6 pb-4">
                      <div className="flex items-start justify-between">
                        <div className={`w-10 h-10 rounded-lg ${addon.bg} flex items-center justify-center`}>
                          <IconComponent className={`h-5 w-5 ${addon.color}`} />
                        </div>
                        <Badge className="bg-primary/10 text-primary border-none text-[10px] font-bold py-0.5 px-2">
                          ONE-TIME
                        </Badge>
                      </div>
                      <CardTitle className="text-lg font-bold text-default-900 mt-4">{addon.name}</CardTitle>
                      <CardDescription className="text-sm text-default-500 mt-1 min-h-[60px]">
                        {addon.desc}
                      </CardDescription>
                      <div className="mt-3">
                        <span className="text-xl font-bold text-primary">{formatPrice(addon.price)}</span>
                        <span className="text-xs text-default-400 font-semibold"> / sekali bayar</span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 flex-grow border-t">
                      <ul className="space-y-2.5 text-xs text-default-600 mt-4">
                        {addon.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
