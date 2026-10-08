import React from "react";
import Image from "next/image";
import manifest from "@/public/images/dashboard/manifest.json";

type ShotId = "attendance" | "leave" | "payroll";

const ALT: Record<ShotId, string> = {
  attendance: "Tampilan Daftar Kehadiran di dashboard Rekastaff",
  leave: "Tampilan pengajuan Cuti di dashboard Rekastaff",
  payroll: "Tampilan Periode Payroll di dashboard Rekastaff",
};

/**
 * Screenshot ASLI dashboard (dibuat oleh `npm run capture:dashboard`).
 *
 * Anti-stretch: width/height diambil dari manifest (ukuran berkas sebenarnya)
 * dan kelas `h-auto w-full` membuat tinggi mengikuti rasio asli. Tidak ada
 * object-fit, jadi gambar tidak pernah di-crop atau dipaksa ke rasio lain.
 * Bingkai (BrowserFrame/LaptopFrame) memang 16:10 = rasio capture.
 *
 * Bila screenshot tidak ada di manifest, render (dan build) gagal - lebih baik
 * daripada menayangkan gambar kosong.
 */
export default function DashboardShot({
  id,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  className = "",
}: {
  id: ShotId;
  sizes?: string;
  className?: string;
}) {
  const shot = manifest.shots.find((s) => s.id === id);
  if (!shot) throw new Error(`Screenshot dashboard "${id}" tidak ada. Jalankan: npm run capture:dashboard`);
  return (
    <Image
      src={`/images/dashboard/${shot.file}`}
      width={shot.width}
      height={shot.height}
      alt={ALT[id]}
      sizes={sizes}
      className={`block h-auto w-full ${className}`.trim()}
    />
  );
}
