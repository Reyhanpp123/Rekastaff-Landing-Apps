/**
 * Sumber tunggal data FAQ.
 *
 * Dipakai oleh FaqSection (tampilan) dan structured data FAQPage (JSON-LD).
 * Google mensyaratkan isi schema FAQPage sama persis dengan yang terlihat di
 * halaman — jadi jangan duplikasi datanya, cukup impor dari sini.
 */
export interface FaqItem {
  /** Id stabil untuk analytics widget bantuan. Tidak ikut JSON-LD. */
  id?: string;
  question: string;
  answer: string;
}

export const faqs: FaqItem[] = [
  {
    id: "coba-gratis",
    question: "Apakah Rekastaff bisa dicoba gratis?",
    answer:
      "Ya. Tersedia paket Starter gratis untuk mulai mengelola absensi, cuti, dan data karyawan tanpa biaya di awal. Anda bisa upgrade kapan saja saat tim bertambah.",
  },
  {
    id: "beda-starter-pro",
    question: "Apa beda paket Starter dan Pro?",
    answer:
      "Starter gratis untuk maksimal 5 karyawan dan 1 cabang, dengan absensi GPS, cuti, database karyawan, kalender kerja, pengumuman, dan dashboard kehadiran. Pro mencakup semua fitur Starter, ditambah manajemen shift, lembur dan koreksi kehadiran, slip gaji dengan komponen gaji fleksibel, kas karyawan, laporan, multi cabang, divisi dan posisi, kontrol akses berbasis peran, serta import massal data pegawai dan shift.",
  },
  {
    id: "harga-pro",
    question: "Berapa biaya paket Pro?",
    answer:
      "Rp5.000 per karyawan per bulan dengan minimum kuota 30 karyawan, jadi tagihan minimal Rp150.000 per bulan. Kuota bisa ditambah tanpa batas sesuai kebutuhan.",
  },
  {
    id: "batas-starter",
    question: "Apa yang terjadi jika karyawan melebihi batas paket Starter?",
    answer:
      "Paket Starter tidak bisa menambah karyawan di atas 5 orang. Untuk menambah karyawan, upgrade ke paket Pro.",
  },
  {
    id: "pro-berakhir",
    question: "Bagaimana jika paket Pro saya berakhir?",
    answer:
      "Data perusahaan dan karyawan tetap tersimpan, tetapi penggunaan fitur dibatasi sampai Anda memperpanjang paket.",
  },
  {
    id: "addon-rekrutmen-dinas",
    question: "Apa itu add-on Rekrutmen dan Perjalanan Dinas?",
    answer:
      "Add-on adalah fitur tambahan seharga Rp100.000 sekali bayar dan berlaku selamanya, per perusahaan. Rekrutmen mencakup halaman karier publik, lowongan, form pelamar, seleksi, tes online, jadwal interview, dan onboarding. Perjalanan Dinas mencakup permohonan dengan persetujuan berjenjang, pencatatan pengeluaran dan reimburse, laporan, serta riwayat dinas per karyawan. Add-on hanya bisa dibeli setelah berlangganan paket Pro.",
  },
  {
    id: "setup-awal",
    question: "Berapa lama proses setup awal?",
    answer:
      "Umumnya cukup dalam hitungan jam. Setelah daftar, Anda membuat profil perusahaan, menambah karyawan, lalu langsung bisa pakai fitur inti seperti absensi dan pengajuan cuti.",
  },
  {
    id: "keamanan-data",
    question: "Apakah data karyawan aman?",
    answer:
      "Data disimpan di infrastruktur terenkripsi dengan kontrol akses berbasis peran. Setiap perusahaan memiliki ruang data terpisah, sehingga informasi hanya bisa diakses oleh akun yang berwenang.",
  },
  {
    id: "payroll-bpjs-pph21",
    question: "Apakah termasuk payroll, BPJS, dan PPh 21?",
    answer:
      "Ya, modul penggajian mendukung perhitungan gaji, BPJS, dan PPh 21 sesuai konfigurasi perusahaan. Untuk kebutuhan lanjutan, tersedia juga modul add-on pada paket Pro+.",
  },
  {
    id: "import-excel",
    question: "Bisakah data karyawan diimpor dari Excel?",
    answer:
      "Bisa. Setelah mendaftar, unduh template Excel di menu Import Pegawai, isi data karyawan, lalu unggah kembali. Cara yang sama tersedia untuk jadwal shift.",
  },
  {
    id: "multi-cabang",
    question: "Apakah bisa untuk perusahaan dengan beberapa cabang?",
    answer:
      "Bisa. Cabang dikelola dalam satu akun perusahaan, dan komponen gaji (tunjangan maupun potongan) dapat diatur per cabang.",
  },
  {
    id: "karyawan-bertambah",
    question: "Bagaimana jika jumlah karyawan bertambah?",
    answer:
      "Anda bisa upgrade paket atau menambah kuota sesuai skala tim. Perubahan berlaku tanpa migrasi ulang data — riwayat absensi, cuti, dan dokumen tetap aman.",
  },
  {
    id: "install-aplikasi",
    question: "Apakah karyawan perlu install aplikasi?",
    answer:
      "Karyawan dapat mengakses Rekastaff dari perangkat mobile untuk absensi, pengajuan cuti, dan melihat slip gaji, sementara HRD mengelola semuanya dari dashboard web.",
  },
];
