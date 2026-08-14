/**
 * Sumber tunggal data FAQ.
 *
 * Dipakai oleh FaqSection (tampilan) dan structured data FAQPage (JSON-LD).
 * Google mensyaratkan isi schema FAQPage sama persis dengan yang terlihat di
 * halaman — jadi jangan duplikasi datanya, cukup impor dari sini.
 */
export interface FaqItem {
  question: string;
  answer: string;
}

export const faqs: FaqItem[] = [
  {
    question: "Apakah Rekastaff bisa dicoba gratis?",
    answer:
      "Ya. Tersedia paket Starter gratis untuk mulai mengelola absensi, cuti, dan data karyawan tanpa biaya di awal. Anda bisa upgrade kapan saja saat tim bertambah.",
  },
  {
    question: "Berapa lama proses setup awal?",
    answer:
      "Umumnya cukup dalam hitungan jam. Setelah daftar, Anda membuat profil perusahaan, menambah karyawan, lalu langsung bisa pakai fitur inti seperti absensi dan pengajuan cuti.",
  },
  {
    question: "Apakah data karyawan aman?",
    answer:
      "Data disimpan di infrastruktur terenkripsi dengan kontrol akses berbasis peran. Setiap perusahaan memiliki ruang data terpisah, sehingga informasi hanya bisa diakses oleh akun yang berwenang.",
  },
  {
    question: "Apakah termasuk payroll, BPJS, dan PPh 21?",
    answer:
      "Ya, modul penggajian mendukung perhitungan gaji, BPJS, dan PPh 21 sesuai konfigurasi perusahaan. Untuk kebutuhan lanjutan, tersedia juga modul add-on pada paket Pro+.",
  },
  {
    question: "Bagaimana jika jumlah karyawan bertambah?",
    answer:
      "Anda bisa upgrade paket atau menambah kuota sesuai skala tim. Perubahan berlaku tanpa migrasi ulang data — riwayat absensi, cuti, dan dokumen tetap aman.",
  },
  {
    question: "Apakah karyawan perlu install aplikasi?",
    answer:
      "Karyawan dapat mengakses Rekastaff dari perangkat mobile untuk absensi, pengajuan cuti, dan melihat slip gaji, sementara HRD mengelola semuanya dari dashboard web.",
  },
];
