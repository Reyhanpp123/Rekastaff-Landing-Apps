// Tes copywriting landing page: narasi lama dipakai di desain baru.
// Memeriksa HTML hasil render server (yang juga dibaca crawler).
// Jalankan: npm test   (butuh server di LANDING_URL, default http://localhost:3000/)
import { test, before } from "node:test";
import assert from "node:assert/strict";

const URL = process.env.LANDING_URL || "http://localhost:3000/";
let html = "";
let text = "";

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;|\u00a0/g, " ");

before(async () => {
  const res = await fetch(URL);
  assert.equal(res.status, 200, `landing tidak bisa diambil dari ${URL}`);
  html = await res.text();
  const body = html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ");
  // Tag inline (span) tidak menambah spasi di layar - buang tanpa spasi;
  // tag lain (blok) diganti spasi agar kata antar-elemen tidak menyatu.
  text = decode(
    body
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<\/?span[^>]*>/g, "")
      .replace(/<[^>]+>/g, " ")
  ).replace(/\s+/g, " ");
});

const D = "\u2014"; // em dash, persis seperti teks lama
const has = (s) => assert.ok(text.includes(s), `tidak ditemukan: "${s}"`);
const hasAll = (list) => list.forEach(has);
// Kata/frasa highlight harus dibungkus elemen sendiri (pola warna lama).
const highlighted = (s) =>
  assert.ok(new RegExp(`>\\s*${s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/&/g, "&amp;")}\\s*</span>`).test(html), `highlight tidak ditemukan: "${s}"`);

// Hero ditulis ulang agar terdengar manusiawi (bukan slogan generik), dengan konteks tujuan tetap.
const heroText = () => {
  const start = html.indexOf('aria-labelledby="hero-title"');
  const end = html.indexOf('aria-label="Keunggulan Rekastaff"');
  assert.ok(start >= 0 && end > start, "section hero tidak ditemukan di HTML");
  const section = html.slice(start, end).replace(/<script[\s\S]*?<\/script>/g, " ");
  return decode(section.replace(/<\/?span[^>]*>/g, "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ");
};

test("hero memakai teks baru yang natural", () => {
  hasAll([
    "HRIS untuk bisnis Indonesia",
    // Judul hero memakai narasi sebelumnya (permintaan pemilik produk); sisanya ditulis ulang.
    "Kelola HR Perusahaan Lebih Cerdas dalam Satu Platform",
    "Karyawan absen dari HP, lengkap dengan lokasi GPS dan selfie. Cuti dan jadwal shift tercatat rapi, gaji dihitung lengkap dengan PPh 21 dan BPJS. HRD tinggal memantau dari web.",
    "Coba gratis",
    "Lihat fiturnya",
    "Gratis untuk tim kecil",
    "Tanpa kartu kredit",
    "Setup dalam hitungan jam",
    "Absen pakai GPS",
    "Lokasi dan selfie dicek saat clock-in",
    "Gaji dihitung sendiri",
    "PPh 21 dan BPJS ikut masuk",
  ]);
  highlighted("Lebih Cerdas");
});

test("hero tidak lagi memakai frasa slogan khas AI", () => {
  const hero = heroText();
  assert.ok(hero.length > 200, "bagian hero tidak ditemukan di teks halaman");
  for (const banned of [
    "All-in-One",
    "semua otomatis, akurat",
    "Fokus kembangkan bisnis",
    "Coba Gratis Sekarang",
    "Lihat Fitur",
    "sekali klik",
    "tervalidasi",
    D, // tanda pisah em dash
  ]) {
    assert.ok(!hero.includes(banned), `hero masih memakai frasa generik: "${banned}"`);
  }
});

test("hero tetap menjelaskan tujuan produk (konteks tidak hilang)", () => {
  const hero = heroText().toLowerCase();
  for (const keyword of ["hris", "absen", "cuti", "gaji", "gps", "selfie", "shift", "pph 21", "bpjs", "web", "hp", "gratis", "coba"]) {
    assert.ok(hero.includes(keyword), `konteks hilang dari hero: "${keyword}"`);
  }
});

test("tombol hero singkat dan jelas (maksimal 3 kata, aksi di depan)", () => {
  for (const label of ["Coba gratis", "Lihat fiturnya"]) {
    assert.ok(label.split(" ").length <= 3, `label "${label}" terlalu panjang`);
  }
  // Tombol hero tidak boleh lagi memakai label panjang gaya lama.
  assert.ok(!heroText().includes("Coba Gratis Sekarang"));
});

test("proof strip memakai value strip lama", () => {
  hasAll([
    "Setup Kilat",
    "Onboarding perusahaan & karyawan selesai dalam hitungan jam, bukan minggu.",
    "Web & Mobile",
    "HRD kelola dari dashboard web, karyawan absen & ajukan cuti dari HP.",
    "Data Aman",
    "Infrastruktur terenkripsi dengan kontrol akses berbasis peran per perusahaan.",
    "Support Responsif",
    "Tim support siap bantu lewat WhatsApp dan email setiap hari kerja.",
  ]);
});

test("fitur memakai narasi lama", () => {
  hasAll([
    "Fitur Unggulan",
    "Semua Kebutuhan HR, Satu Platform",
    `Dirancang untuk membantu perusahaan mengelola sumber daya manusia dengan lebih efisien, akurat, dan modern ${D} dari absensi hingga payroll.`,
    "Absensi Online Real-time",
    `Pantau kehadiran seluruh tim secara langsung. Karyawan cukup clock-in dari HP ${D} sistem memvalidasi lokasi dan wajah secara otomatis.`,
    "Validasi lokasi GPS",
    "Verifikasi foto selfie",
    "Rekap otomatis harian",
    "Payroll Otomatis & Akurat",
    "Hitung gaji, tunjangan, potongan, BPJS, hingga PPh 21 dalam sekali proses. Slip gaji langsung terkirim ke setiap karyawan.",
    "PPh 21 & BPJS otomatis",
    "Komponen gaji fleksibel",
    "Slip gaji digital",
    "Pengajuan Cuti & Izin",
    "Proses pengajuan dan persetujuan cuti yang cepat, transparan, dan tercatat rapi dalam satu klik.",
    "Manajemen Karyawan",
    "Database terpusat untuk profil, kontrak, dan riwayat karir seluruh karyawan perusahaan.",
    "Manajemen Shift",
    "Atur jadwal kerja dan rotasi shift karyawan dengan mudah, terorganisir, dan bebas bentrok.",
    "Manajemen Dokumen",
    "Simpan dokumen penting karyawan dan perusahaan secara digital, aman, dan mudah dicari.",
    "Butuh lebih? Perluas dengan Modul Add-on Pro+",
    `Bayar sekali, akses selamanya ${D} lihat detailnya di bagian harga.`,
    "Coba Semua Fitur Gratis",
  ]);
  highlighted("Satu Platform");
});

test("alur kerja (Day-to-Payday) memakai narasi lama", () => {
  hasAll([
    "Alur Kerja",
    "Sehari bersama Rekastaff",
    `Satu clock-in menggerakkan absensi, cuti, shift, hingga payroll ${D} tanpa rekap manual.`,
    "Karyawan clock-in dari HP",
    "Lokasi GPS dan foto selfie divalidasi otomatis saat absen.",
    "Absensi terekap otomatis",
    "Kehadiran, keterlambatan, dan lembur langsung masuk rekap harian.",
    "Cuti & shift ikut sinkron",
    "Cuti yang disetujui dan jadwal shift terbaca oleh sistem absensi.",
    "Payroll terhitung sendiri",
    "Gaji, tunjangan, potongan, BPJS, dan PPh 21 dihitung dalam sekali proses.",
    "Slip gaji terkirim",
    "Setiap karyawan menerima slip gaji digital tanpa kirim satu per satu.",
    "GPS & selfie tervalidasi",
    "Rekap absensi hari ini siap",
    "Cuti disetujui \u00b7 Shift Pagi",
    "Payroll bulan ini dihitung",
    "Slip gaji terkirim ke karyawan",
  ]);
  highlighted("Rekastaff");
});

test("cara kerja / onboarding memakai narasi lama", () => {
  hasAll([
    "Cara Kerja",
    "Mulai dalam 3 Langkah Mudah",
    "Tidak perlu tim IT atau proses implementasi berbulan-bulan. Rekastaff dirancang agar perusahaan Anda bisa langsung jalan hari ini juga.",
    "Daftar Akun Gratis",
    `Buat akun perusahaan dalam beberapa menit. Tanpa kartu kredit, tanpa komitmen ${D} langsung aktif.`,
    "Setup Perusahaan & Karyawan",
    "Lengkapi profil perusahaan, atur struktur organisasi, lalu tambahkan data karyawan Anda.",
    "Mulai Kelola HR",
    "Absensi, cuti, shift, hingga payroll langsung siap dipakai. Tim Anda bisa akses dari web dan mobile.",
    "Daftar & Mulai Hari Ini",
  ]);
  highlighted("3 Langkah Mudah");
});

test("harga memakai narasi lama", () => {
  hasAll([
    "Harga Fleksibel & Transparan",
    "Pilih Paket Terbaik untuk Tim Anda",
    "Mulai gratis untuk tim kecil, atau upgrade ke paket profesional dengan kuota yang fleksibel sesuai ukuran bisnis Anda.",
    "Semakin panjang siklus pembayaran, semakin besar potongannya.",
    "Paket Langganan Utama",
    "Modul Add-on Pro+",
    "Kalkulator Karyawan",
    "Sesuaikan jumlah karyawan untuk menemukan paket & harga terbaik.",
    "Daftar Gratis",
    "Mulai Sekarang",
  ]);
  // Persentase & durasi banner dihitung dari katalog, bukan diketik manual.
  assert.match(text, /Hemat hingga \d+% dengan berlangganan /);
  highlighted("Tim Anda");
});

test("testimoni lama tampil", () => {
  hasAll([
    "Testimoni",
    "Dipercaya Tim HR di Berbagai Industri",
    `Dari retail hingga manufaktur ${D} lihat bagaimana Rekastaff membantu pekerjaan HR jadi lebih ringan setiap harinya.`,
    "Rekap absensi yang dulu makan waktu berhari-hari sekarang selesai otomatis.",
    "Ratna Dewi",
    "Andi Wijaya",
    "Siti Rahma",
    "Gabung Sekarang, Gratis",
  ]);
  highlighted("Berbagai Industri");
});

test("FAQ memakai narasi lama", () => {
  hasAll([
    "Pertanyaan yang Sering Diajukan",
    "Jawaban singkat seputar paket, setup, keamanan data, dan cara memulai Rekastaff.",
    "Masih ada pertanyaan?",
    `Ceritakan kebutuhan HR perusahaan Anda ${D} tim kami bantu arahkan paket yang paling sesuai.`,
    "Apakah Rekastaff bisa dicoba gratis?",
  ]);
  highlighted("Sering Diajukan");
});

test("CTA akhir & footer memakai narasi lama", () => {
  hasAll([
    "Siap Membuat Pekerjaan HR Jadi Lebih Ringan?",
    `Bergabunglah dengan perusahaan yang sudah beralih dari spreadsheet ke Rekastaff. Mulai gratis hari ini ${D} upgrade kapan saja saat tim Anda bertambah.`,
    "Konsultasi via WhatsApp",
    "Bantuan setup dari tim kami",
    `Sistem informasi manajemen sumber daya manusia yang terintegrasi, aman, dan efisien ${D} membantu perusahaan Anda berkembang tanpa direpotkan urusan administrasi HR.`,
    "Mulai Gratis",
  ]);
  highlighted("Lebih Ringan");
});

test("section baru ditulis dengan gaya lama", () => {
  has("Masih Rekap HR Pakai Spreadsheet?");
  highlighted("Pakai Spreadsheet");
  has("HRD di Web, Karyawan di HP");
  highlighted("di HP");
});

test("copy versi redesign sudah tidak tampil", () => {
  for (const s of [
    "Absen jam 08.02.",
    "Semua beres otomatis.",
    "Tanpa sistem, akhir bulan selalu sama.",
    "Satu clock-in menggerakkan semuanya.",
    "Satu data, dua layar.",
    "Jangan percaya kata kami.",
    "Bisa jalan hari ini.",
    "Harga yang bisa dilihat sebelum mendaftar.",
    "Besok pagi jam 08.02, biar Rekastaff yang mulai.",
    "Paling cocok untukmu",
  ]) {
    assert.ok(!text.includes(s), `copy redesign masih tampil: "${s}"`);
  }
});
