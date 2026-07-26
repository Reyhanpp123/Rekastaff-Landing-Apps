import React from "react";
import { 
  MapPin, 
  CalendarRange, 
  Banknote, 
  FolderOpen, 
  Users, 
  CalendarClock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Absensi Online",
    description: "Pantau kehadiran karyawan secara real-time dengan validasi lokasi GPS dan foto selfie.",
    icon: MapPin,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    title: "Pengajuan Cuti",
    description: "Proses pengajuan dan persetujuan cuti yang cepat dan transparan dalam satu klik.",
    icon: CalendarRange,
    color: "text-orange-500",
    bg: "bg-orange-500/10"
  },
  {
    title: "Penggajian (Payroll)",
    description: "Otomatisasi hitung gaji, BPJS, PPh 21, dan cetak slip gaji secara akurat.",
    icon: Banknote,
    color: "text-green-500",
    bg: "bg-green-500/10"
  },
  {
    title: "Manajemen Dokumen",
    description: "Simpan dokumen penting karyawan dan perusahaan secara digital dan aman.",
    icon: FolderOpen,
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  {
    title: "Manajemen Karyawan",
    description: "Database terpusat untuk profil, kontrak, dan riwayat karir seluruh karyawan.",
    icon: Users,
    color: "text-pink-500",
    bg: "bg-pink-500/10"
  },
  {
    title: "Management Shift",
    description: "Atur jadwal kerja dan rotasi shift karyawan dengan mudah dan terorganisir.",
    icon: CalendarClock,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10"
  }
];

const FeatureSection = () => {
  return (
    <section id="features" className="py-24 bg-default-50/50">
      <div className="container px-4 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-default-900 mb-4">Fitur Lengkap untuk Segala Kebutuhan HR</h2>
          <p className="text-lg text-default-600">
            Dirancang untuk membantu perusahaan mengelola sumber daya manusia dengan lebih efisien dan modern.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${feature.bg} flex items-center justify-center mb-4`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-default-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
