/**
 * Copy landing page - SATU-SATUNYA sumber teks promosi.
 *
 * Narasi memakai teks landing page lama (sebelum redesign) apa adanya.
 * Section yang tidak punya padanan lama (Problem, Dua Sisi, Keamanan) ditulis
 * dengan gaya lama tanpa klaim atau angka baru.
 *
 * Konvensi:
 * - Headline = { text, highlight }: `highlight` adalah bagian dari `text` yang
 *   diberi warna primary / gradient (pola lama). Dirender oleh <Headline>.
 * - Em dash & titik tengah ditulis sebagai escape (backslash-u2014, backslash-u00b7) agar file
 *   tetap ASCII namun teks yang tampil identik dengan teks lama.
 * - Harga TIDAK ditulis di sini: semua angka harga dibaca dari katalog billing.
 * - Nama & angka di mockup (components/landing/screens) adalah contoh tampilan.
 */

export interface Headline {
  text: string;
  highlight: string;
}

const DASH = "\u2014";
const DOT = "\u00b7";

export const hero = {
  eyebrow: "Platform HRIS All-in-One untuk Bisnis Indonesia",
  title: {
    text: "Kelola HR Perusahaan Lebih Cerdas dalam Satu Platform",
    highlight: "Lebih Cerdas",
  } satisfies Headline,
  sub: `Absensi GPS, pengajuan cuti, payroll dengan PPh 21 & BPJS, hingga manajemen shift ${DASH} semua otomatis, akurat, dan bisa diakses dari web maupun mobile. Fokus kembangkan bisnis, biar Rekastaff yang urus HR.`,
  primaryCta: "Coba Gratis Sekarang",
  secondaryCta: "Lihat Fitur",
  bullets: ["Gratis untuk tim kecil", "Tanpa kartu kredit", "Setup dalam hitungan jam"],
  chips: [
    { title: "Absensi GPS", detail: "Lokasi & selfie tervalidasi" },
    { title: "Payroll Otomatis", detail: "PPh 21 & BPJS sekali klik" },
  ],
  scrollHint: "Lihat alur kerja",
  srSummary:
    "Ilustrasi: dashboard HRD menampilkan rekap kehadiran hari ini, dan HP karyawan menampilkan clock-in yang tervalidasi GPS dan selfie.",
};

/** Value strip lama, tampil sebagai Proof Strip. */
export const proofStrip = {
  label: "Keunggulan Rekastaff",
  items: [
    {
      title: "Setup Kilat",
      body: "Onboarding perusahaan & karyawan selesai dalam hitungan jam, bukan minggu.",
    },
    {
      title: "Web & Mobile",
      body: "HRD kelola dari dashboard web, karyawan absen & ajukan cuti dari HP.",
    },
    {
      title: "Data Aman",
      body: "Infrastruktur terenkripsi dengan kontrol akses berbasis peran per perusahaan.",
    },
    {
      title: "Support Responsif",
      body: "Tim support siap bantu lewat WhatsApp dan email setiap hari kerja.",
    },
  ],
};

/** Section baru, gaya lama: isu rekap manual / spreadsheet. */
export const problem = {
  eyebrow: "Tantangan HR",
  title: {
    text: "Masih Rekap HR Pakai Spreadsheet?",
    highlight: "Pakai Spreadsheet",
  } satisfies Headline,
  fragments: [
    { kind: "chat", text: "Rekap absensi manual dari grup chat" },
    { kind: "chat", text: "Pengajuan cuti tercecer di percakapan" },
    { kind: "sheet", text: "Hitung PPh 21 & BPJS di spreadsheet" },
    { kind: "slip", text: "Slip gaji dikirim satu per satu" },
  ],
  resolve: "Rekastaff mengotomatiskan semuanya dalam satu platform.",
} as const;

export interface Chapter {
  id: string;
  /** Penanda waktu di visual (elemen desain, bukan copy promosi). */
  time: string;
  /** Label pendek untuk rail & jam raksasa. */
  rail: string;
  title: string;
  body: string;
  feed: string;
  device: "phone" | "laptop";
}

export const story = {
  eyebrow: "Alur Kerja",
  title: { text: "Sehari bersama Rekastaff", highlight: "Rekastaff" } satisfies Headline,
  sub: `Satu clock-in menggerakkan absensi, cuti, shift, hingga payroll ${DASH} tanpa rekap manual.`,
  chapters: [
    {
      id: "bab-clock-in",
      time: "08.02",
      rail: "08.02",
      title: "Karyawan clock-in dari HP",
      body: "Lokasi GPS dan foto selfie divalidasi otomatis saat absen.",
      feed: "GPS & selfie tervalidasi",
      device: "phone",
    },
    {
      id: "bab-rekap",
      time: "17.00",
      rail: "17.00",
      title: "Absensi terekap otomatis",
      body: "Kehadiran, keterlambatan, dan lembur langsung masuk rekap harian.",
      feed: "Rekap absensi hari ini siap",
      device: "laptop",
    },
    {
      id: "bab-cuti-shift",
      time: "Kapan saja",
      rail: "Cuti",
      title: "Cuti & shift ikut sinkron",
      body: "Cuti yang disetujui dan jadwal shift terbaca oleh sistem absensi.",
      feed: `Cuti disetujui ${DOT} Shift Pagi`,
      device: "phone",
    },
    {
      id: "bab-payroll",
      time: "Tgl 25",
      rail: "Tgl 25",
      title: "Payroll terhitung sendiri",
      body: "Gaji, tunjangan, potongan, BPJS, dan PPh 21 dihitung dalam sekali proses.",
      feed: "Payroll bulan ini dihitung",
      device: "laptop",
    },
    {
      id: "bab-slip",
      time: "Tgl 28",
      rail: "Tgl 28",
      title: "Slip gaji terkirim",
      body: "Setiap karyawan menerima slip gaji digital tanpa kirim satu per satu.",
      feed: "Slip gaji terkirim ke karyawan",
      device: "phone",
    },
  ] satisfies Chapter[],
  note: "Contoh tampilan. Tanggal gajian mengikuti pengaturan perusahaan.",
  outroTitle: { text: "Fokus Kembangkan Bisnis, Biar Rekastaff yang Urus HR", highlight: "Urus HR" } satisfies Headline,
  outroCta: "Coba Gratis Sekarang",
  outroSecondary: "Lihat Harga",
  skip: "Lewati alur kerja",
  railLabel: "Langkah alur kerja",
};

/** Section baru, gaya "Web & Mobile" lama. */
export const twoSides = {
  eyebrow: "Web & Mobile",
  title: { text: "HRD di Web, Karyawan di HP", highlight: "di HP" } satisfies Headline,
  sub: `HRD kelola dari dashboard web, karyawan absen & ajukan cuti dari HP ${DASH} semua tersinkron otomatis dalam satu platform.`,
  hrd: {
    label: "Untuk HRD",
    device: "Dashboard Web",
    points: [
      "Pantau kehadiran seluruh tim secara langsung",
      "Setujui pengajuan cuti dalam satu klik",
      "Atur jadwal kerja dan rotasi shift",
      "Hitung payroll dengan PPh 21 & BPJS",
    ],
  },
  employee: {
    label: "Untuk Karyawan",
    device: "Dari HP",
    points: [
      "Clock-in dengan validasi GPS & selfie",
      "Ajukan cuti langsung dari HP",
      "Lihat jadwal shift kerja",
      "Terima slip gaji digital",
    ],
  },
  tabs: { hrd: "HRD", employee: "Karyawan", label: "Pilih sisi" },
  incoming: { label: "Pengajuan baru", done: "Masuk", title: "Cuti 2 hari" },
  link: "Lihat semua fitur",
};

export const modules = {
  eyebrow: "Fitur Unggulan",
  title: { text: "Semua Kebutuhan HR, Satu Platform", highlight: "Satu Platform" } satisfies Headline,
  sub: `Dirancang untuk membantu perusahaan mengelola sumber daya manusia dengan lebih efisien, akurat, dan modern ${DASH} dari absensi hingga payroll.`,
  core: [
    {
      key: "absensi",
      name: "Absensi",
      title: "Absensi Online Real-time",
      body: `Pantau kehadiran seluruh tim secara langsung. Karyawan cukup clock-in dari HP ${DASH} sistem memvalidasi lokasi dan wajah secara otomatis.`,
      tags: ["Validasi lokasi GPS", "Verifikasi foto selfie", "Rekap otomatis harian"],
    },
    {
      key: "payroll",
      name: "Payroll",
      title: "Payroll Otomatis & Akurat",
      body: "Hitung gaji, tunjangan, potongan, BPJS, hingga PPh 21 dalam sekali proses. Slip gaji langsung terkirim ke setiap karyawan.",
      tags: ["PPh 21 & BPJS otomatis", "Komponen gaji fleksibel", "Slip gaji digital"],
    },
    {
      key: "cuti",
      name: "Pengajuan Cuti & Izin",
      title: "Pengajuan Cuti & Izin",
      body: "Proses pengajuan dan persetujuan cuti yang cepat, transparan, dan tercatat rapi dalam satu klik.",
      tags: [],
    },
    {
      key: "karyawan",
      name: "Manajemen Karyawan",
      title: "Manajemen Karyawan",
      body: "Database terpusat untuk profil, kontrak, dan riwayat karir seluruh karyawan perusahaan.",
      tags: [],
    },
    {
      key: "shift",
      name: "Manajemen Shift",
      title: "Manajemen Shift",
      body: "Atur jadwal kerja dan rotasi shift karyawan dengan mudah, terorganisir, dan bebas bentrok.",
      tags: [],
    },
    {
      key: "dokumen",
      name: "Manajemen Dokumen",
      title: "Manajemen Dokumen",
      body: "Simpan dokumen penting karyawan dan perusahaan secara digital, aman, dan mudah dicari.",
      tags: [],
    },
  ],
  addonTitle: "Butuh lebih? Perluas dengan Modul Add-on Pro+",
  addonSub: `Bayar sekali, akses selamanya ${DASH} lihat detailnya di bagian harga.`,
  addonLink: "Lihat harga add-on",
  addonOnce: "sekali bayar",
  addonFree: "Gratis",
  cta: "Coba Semua Fitur Gratis",
};

/** Section baru: perluasan "Data Aman" + jawaban FAQ keamanan, tanpa klaim baru. */
export const security = {
  eyebrow: "Data Aman",
  title: { text: "Jaga Data Karyawan Tetap Aman", highlight: "Tetap Aman" } satisfies Headline,
  sub: "Data disimpan di infrastruktur terenkripsi dengan kontrol akses berbasis peran. Setiap perusahaan memiliki ruang data terpisah, sehingga informasi hanya bisa diakses oleh akun yang berwenang.",
  pillars: [
    {
      key: "enkripsi",
      title: "Infrastruktur Terenkripsi",
      body: "Data karyawan disimpan di infrastruktur terenkripsi.",
    },
    {
      key: "rbac",
      title: "Kontrol Akses Berbasis Peran",
      body: "Informasi hanya bisa diakses oleh akun yang berwenang.",
    },
    {
      key: "terpisah",
      title: "Ruang Data Terpisah",
      body: "Setiap perusahaan memiliki ruang data terpisah.",
    },
  ],
  diagram: {
    center: "Data karyawan",
    roles: [
      { title: "Admin HR", body: "Akses sesuai peran" },
      { title: "Atasan", body: "Akses sesuai peran" },
      { title: "Karyawan", body: "Akses sesuai peran" },
    ],
    label:
      "Diagram kontrol akses berbasis peran: setiap akun hanya mengakses data karyawan sesuai perannya.",
  },
  link: "Baca Kebijakan Privasi",
};

export const onboarding = {
  eyebrow: "Cara Kerja",
  title: { text: "Mulai dalam 3 Langkah Mudah", highlight: "3 Langkah Mudah" } satisfies Headline,
  sub: "Tidak perlu tim IT atau proses implementasi berbulan-bulan. Rekastaff dirancang agar perusahaan Anda bisa langsung jalan hari ini juga.",
  steps: [
    {
      label: "Langkah 01",
      title: "Daftar Akun Gratis",
      body: `Buat akun perusahaan dalam beberapa menit. Tanpa kartu kredit, tanpa komitmen ${DASH} langsung aktif.`,
    },
    {
      label: "Langkah 02",
      title: "Setup Perusahaan & Karyawan",
      body: "Lengkapi profil perusahaan, atur struktur organisasi, lalu tambahkan data karyawan Anda.",
    },
    {
      label: "Langkah 03",
      title: "Mulai Kelola HR",
      body: "Absensi, cuti, shift, hingga payroll langsung siap dipakai. Tim Anda bisa akses dari web dan mobile.",
    },
  ],
  cta: "Daftar & Mulai Hari Ini",
};

export const pricing = {
  eyebrow: "Harga Fleksibel & Transparan",
  title: { text: "Pilih Paket Terbaik untuk Tim Anda", highlight: "Tim Anda" } satisfies Headline,
  sub: "Mulai gratis untuk tim kecil, atau upgrade ke paket profesional dengan kuota yang fleksibel sesuai ukuran bisnis Anda.",
  /** Persentase & durasi dihitung dari katalog. */
  discountBanner: (percent: number, duration: string) =>
    `Hemat hingga ${percent}% dengan berlangganan ${duration}. Semakin panjang siklus pembayaran, semakin besar potongannya.`,
  tabs: { plans: "Paket Langganan Utama", addons: "Modul Add-on Pro+", label: "Jenis harga" },
  calculator: {
    title: "Kalkulator Karyawan",
    sub: "Sesuaikan jumlah karyawan untuk menemukan paket & harga terbaik.",
    employees: "Jumlah Karyawan:",
    slider: "Geser jumlah karyawan",
    cycle: "Siklus Pembayaran:",
    cycleFree: "Paket gratis tidak memerlukan siklus pembayaran.",
    recommended: "Rekomendasi Paket",
    free: "Gratis",
    contact: "Hubungi Sales",
    minimumNote: (min: string) =>
      `Paket ini ditagih minimal ${min} kuota karyawan. Sisa kuota bisa dipakai saat tim bertambah.`,
    savings: (amount: string) => `Hemat ${amount} dibanding bayar bulanan`,
  },
  badge: "REKOMENDASI",
  perEmployee: "/ karyawan / bulan",
  ctaFree: "Daftar Gratis",
  ctaPlan: (name: string) => `Pilih Paket ${name}`,
  ctaStart: "Mulai Sekarang",
  addon: {
    title: "Modul Tambahan Pro+ (Add-on)",
    body: "Beli modul yang dibutuhkan secara terpisah. Pembayaran dilakukan sekali untuk selamanya (lifetime access). Modul tetap dapat diakses meskipun masa berlangganan bulanan utama Anda habis.",
    total: "Total Semua Modul",
    once: "sekali bayar",
    empty: "Belum ada modul add-on tersedia.",
  },
  error: {
    title: "Daftar harga sedang tidak dapat dimuat.",
    body: "Silakan muat ulang halaman, atau tanyakan harga langsung ke tim kami.",
    cta: "Tanya via WhatsApp",
  },
};

export const testimonialSection = {
  eyebrow: "Testimoni",
  title: { text: "Dipercaya Tim HR di Berbagai Industri", highlight: "Berbagai Industri" } satisfies Headline,
  sub: `Dari retail hingga manufaktur ${DASH} lihat bagaimana Rekastaff membantu pekerjaan HR jadi lebih ringan setiap harinya.`,
  cta: "Gabung Sekarang, Gratis",
};

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  metric?: string;
}

/**
 * Testimoni dari landing lama (dikembalikan atas permintaan pemilik produk).
 * Catatan: sumbernya masih ditandai TODO placeholder di versi lama - ganti
 * dengan pelanggan terverifikasi bila sudah tersedia. Jangan dipakai untuk
 * structured data rating (lihat lib/seo.ts).
 */
export const testimonials: Testimonial[] = [
  {
    quote:
      "Rekap absensi yang dulu makan waktu berhari-hari sekarang selesai otomatis. Validasi GPS dan selfie juga bikin data kehadiran jauh lebih bisa dipercaya.",
    name: "Ratna Dewi",
    role: "HR Manager",
    company: "Perusahaan Retail",
  },
  {
    quote:
      "Proses payroll dengan PPh 21 dan BPJS yang biasanya bikin pusing tiap akhir bulan sekarang tinggal sekali klik. Slip gaji langsung terkirim ke semua karyawan.",
    name: "Andi Wijaya",
    role: "Finance & HR Lead",
    company: "Perusahaan Manufaktur",
  },
  {
    quote: `Karyawan kami tersebar di beberapa kota, dan Rekastaff memudahkan semuanya ${DASH} dari pengajuan cuti sampai pengaturan shift, semua transparan di satu aplikasi.`,
    name: "Siti Rahma",
    role: "Operations Director",
    company: "Perusahaan Jasa",
  },
];

/** Fallback bila `testimonials` dikosongkan. */
export const proof = {
  contact: "Konsultasi via WhatsApp",
  checks: [
    {
      title: "Gratis untuk tim kecil",
      body: "Mulai kelola absensi, cuti, dan data karyawan tanpa biaya di awal.",
    },
    {
      title: "Tanpa kartu kredit",
      body: "Daftar dan langsung aktif, upgrade kapan saja saat tim bertambah.",
    },
    {
      title: "Bantuan setup dari tim kami",
      body: "Tim support siap bantu lewat WhatsApp dan email setiap hari kerja.",
    },
  ],
};

export const faqSection = {
  eyebrow: "FAQ",
  title: { text: "Pertanyaan yang Sering Diajukan", highlight: "Sering Diajukan" } satisfies Headline,
  sub: "Jawaban singkat seputar paket, setup, keamanan data, dan cara memulai Rekastaff.",
  contactTitle: "Masih ada pertanyaan?",
  contactBody: `Ceritakan kebutuhan HR perusahaan Anda ${DASH} tim kami bantu arahkan paket yang paling sesuai.`,
};

export const finalCta = {
  title: { text: "Siap Membuat Pekerjaan HR Jadi Lebih Ringan?", highlight: "Lebih Ringan" } satisfies Headline,
  sub: `Bergabunglah dengan perusahaan yang sudah beralih dari spreadsheet ke Rekastaff. Mulai gratis hari ini ${DASH} upgrade kapan saja saat tim Anda bertambah.`,
  primary: "Coba Gratis Sekarang",
  secondary: "Konsultasi via WhatsApp",
  bullets: ["Gratis untuk tim kecil", "Tanpa kartu kredit", "Bantuan setup dari tim kami"],
};

export const footer = {
  description: `Sistem informasi manajemen sumber daya manusia yang terintegrasi, aman, dan efisien ${DASH} membantu perusahaan Anda berkembang tanpa direpotkan urusan administrasi HR.`,
  cta: "Mulai Gratis",
  product: "Produk",
  help: "Bantuan",
  contact: "Hubungi Kami",
  copyright: "Rekastaff. All rights reserved.",
  productLinks: [
    { label: "Fitur", href: "/#fitur" },
    { label: "Cara Kerja", href: "/#cerita" },
    { label: "Keamanan Data", href: "/#keamanan" },
    { label: "Harga & Paket", href: "/#harga" },
    { label: "Modul Add-on Pro+", href: "/#harga" },
  ],
  helpLinks: [
    { label: "Testimoni", href: "/#testimoni" },
    { label: "FAQ", href: "/#faq" },
    { label: "Kebijakan Privasi", href: "/kebijakan-privasi" },
  ],
  register: "Daftar Gratis",
  login: "Masuk",
};
