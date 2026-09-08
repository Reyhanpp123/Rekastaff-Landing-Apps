/**
 * Sumber konten Kebijakan Privasi.
 *
 * Dipisah dari tampilan (app/kebijakan-privasi/page.tsx) supaya isi kebijakan
 * bisa direvisi tanpa menyentuh markup, dan tanggal berlaku hanya perlu
 * diubah di satu tempat.
 */

export const PRIVACY_POLICY_EFFECTIVE_DATE = "9 September 2026";

export interface PrivacyPolicySection {
  id: string;
  title: string;
  paragraphs?: string[];
  list?: string[];
}

export const privacyPolicySections: PrivacyPolicySection[] = [
  {
    id: "pendahuluan",
    title: "1. Pendahuluan",
    paragraphs: [
      "Kebijakan Privasi ini menjelaskan bagaimana Rekastaff (\"kami\") mengumpulkan, menggunakan, menyimpan, dan melindungi data pribadi yang diperoleh melalui situs rekastaff.com serta aplikasi HRIS Rekastaff (\"Layanan\").",
      "Kebijakan ini berlaku bagi pengunjung situs, admin/HRD perusahaan pelanggan yang mendaftar dan mengelola akun (\"Pelanggan\"), serta karyawan dari Pelanggan yang datanya diinput ke dalam Layanan (\"Pengguna Akhir\"). Dengan menggunakan Layanan, Anda menyetujui praktik yang dijelaskan dalam kebijakan ini.",
      "Kami menyusun kebijakan ini mengacu pada Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP).",
    ],
  },
  {
    id: "data-yang-dikumpulkan",
    title: "2. Data yang Kami Kumpulkan",
    paragraphs: [
      "Jenis data yang kami kumpulkan tergantung bagaimana Anda berinteraksi dengan Layanan:",
    ],
    list: [
      "Data akun Pelanggan: nama perusahaan, nama penanggung jawab, alamat email, nomor telepon/WhatsApp, dan kredensial login.",
      "Data kepegawaian yang diinput Pelanggan ke dalam sistem: nama, NIK, alamat, jabatan, unit kerja, status kepegawaian, nomor rekening bank, NPWP, dan nomor kepesertaan BPJS Ketenagakerjaan/Kesehatan.",
      "Data absensi: titik lokasi (GPS), foto selfie saat check-in/check-out, waktu dan tanggal presensi, serta riwayat pengajuan cuti dan izin.",
      "Data penggajian: komponen gaji, potongan, perhitungan PPh 21, dan slip gaji yang dihasilkan sistem.",
      "Data teknis situs: alamat IP, jenis perangkat dan browser, halaman yang dikunjungi, serta cookies (lihat bagian Cookies).",
      "Data komunikasi: isi pesan saat Anda menghubungi tim kami lewat formulir, email, atau WhatsApp.",
    ],
  },
  {
    id: "tujuan-penggunaan",
    title: "3. Tujuan Penggunaan Data",
    paragraphs: ["Data yang kami kumpulkan digunakan untuk:"],
    list: [
      "Menyediakan dan mengoperasikan fitur Layanan: absensi, cuti/izin, manajemen shift, dan payroll.",
      "Memverifikasi kehadiran karyawan melalui validasi lokasi GPS dan foto selfie.",
      "Menghitung penggajian, BPJS, dan PPh 21 sesuai konfigurasi yang ditetapkan Pelanggan.",
      "Mengelola akun, autentikasi login, dan kontrol akses berbasis peran (role-based access).",
      "Berkomunikasi terkait dukungan pelanggan, pembaruan Layanan, dan informasi tagihan.",
      "Menjaga keamanan sistem, mencegah penyalahgunaan, dan memenuhi kewajiban hukum yang berlaku.",
    ],
  },
  {
    id: "dasar-hukum",
    title: "4. Dasar Hukum Pemrosesan",
    paragraphs: [
      "Kami memproses data pribadi berdasarkan salah satu dari: (a) persetujuan yang diberikan Pelanggan atau Pengguna Akhir, (b) pelaksanaan kontrak layanan antara Rekastaff dan Pelanggan, (c) kepentingan sah dalam mengoperasikan dan mengamankan Layanan, atau (d) pemenuhan kewajiban hukum, misalnya kewajiban perpajakan dan pelaporan BPJS.",
      "Untuk data kepegawaian, Pelanggan bertindak sebagai pengendali data (data controller) yang bertanggung jawab atas keabsahan dan dasar hukum penginputan data karyawannya, sedangkan Rekastaff bertindak sebagai pemroses data (data processor) yang mengolah data tersebut sesuai instruksi Pelanggan.",
    ],
  },
  {
    id: "berbagi-data",
    title: "5. Pembagian Data dengan Pihak Ketiga",
    paragraphs: [
      "Kami tidak menjual atau menyewakan data pribadi Anda kepada pihak ketiga untuk kepentingan pemasaran. Data hanya dibagikan dalam situasi berikut:",
    ],
    list: [
      "Penyedia infrastruktur cloud dan hosting yang membantu kami menyimpan dan mengoperasikan Layanan secara aman.",
      "Penyedia layanan pembayaran, untuk memproses transaksi langganan.",
      "Instansi pemerintah atau otoritas yang berwenang, apabila diwajibkan oleh peraturan perundang-undangan yang berlaku (misalnya kewajiban pajak atau proses hukum).",
      "Pihak ketiga lain hanya dengan persetujuan eksplisit dari Pelanggan terkait.",
    ],
  },
  {
    id: "penyimpanan-keamanan",
    title: "6. Penyimpanan dan Keamanan Data",
    paragraphs: [
      "Data disimpan di infrastruktur yang terenkripsi dengan kontrol akses berbasis peran, sehingga setiap pengguna hanya dapat mengakses data sesuai wewenangnya. Data setiap perusahaan pelanggan dipisahkan secara logis (multi-tenant) dari data perusahaan lain.",
      "Kami menyimpan data selama akun Pelanggan aktif dan selama diperlukan untuk memenuhi tujuan pada kebijakan ini atau kewajiban hukum (misalnya retensi dokumen ketenagakerjaan dan perpajakan). Data akan dihapus atau dianonimkan setelah masa retensi berakhir atau atas permintaan penghapusan yang sah dari Pelanggan.",
      "Meskipun kami menerapkan langkah-langkah keamanan yang wajar, tidak ada sistem elektronik yang sepenuhnya bebas risiko. Kami akan memberi tahu Pelanggan sesuai ketentuan yang berlaku apabila terjadi insiden keamanan yang berdampak pada data pribadi.",
    ],
  },
  {
    id: "hak-anda",
    title: "7. Hak Anda sebagai Subjek Data",
    paragraphs: [
      "Sesuai UU PDP, Anda berhak untuk:",
    ],
    list: [
      "Mendapatkan informasi mengenai kejelasan identitas, dasar hukum, dan tujuan pemrosesan data Anda.",
      "Mengakses dan memperoleh salinan data pribadi Anda.",
      "Melengkapi, memperbarui, atau memperbaiki data pribadi yang tidak akurat.",
      "Menarik persetujuan dan meminta penghapusan data pribadi, sepanjang tidak bertentangan dengan kewajiban hukum lain (misalnya arsip perpajakan).",
      "Mengajukan keberatan atas tindakan pengambilan keputusan otomatis yang berdampak signifikan bagi Anda.",
      "Mengajukan pengaduan atas dugaan pelanggaran pemrosesan data pribadi Anda.",
    ],
  },
  {
    id: "peran-pelanggan",
    title: "8. Peran Pelanggan (Perusahaan) atas Data Karyawan",
    paragraphs: [
      "Karena data kepegawaian diinput dan dikelola langsung oleh Pelanggan, permintaan akses, koreksi, atau penghapusan data dari karyawan (Pengguna Akhir) sebaiknya pertama-tama diajukan kepada HRD/admin perusahaan tempat mereka bekerja, yang memiliki kendali operasional atas data tersebut di dalam sistem. Rekastaff akan membantu memfasilitasi permintaan tersebut melalui Pelanggan terkait.",
    ],
  },
  {
    id: "cookies",
    title: "9. Cookies pada Situs",
    paragraphs: [
      "Situs rekastaff.com menggunakan cookies dan teknologi serupa untuk mengingat preferensi, menjaga sesi login tetap aman, serta memahami bagaimana pengunjung menggunakan situs guna meningkatkan pengalaman pengguna. Anda dapat mengatur browser untuk menolak cookies, namun beberapa fitur situs mungkin tidak berfungsi optimal.",
    ],
  },
  {
    id: "perubahan-kebijakan",
    title: "10. Perubahan Kebijakan Privasi",
    paragraphs: [
      "Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu mengikuti perkembangan Layanan atau peraturan yang berlaku. Perubahan material akan diinformasikan melalui situs atau kanal komunikasi resmi kami, dengan tanggal pembaruan tercantum di bagian atas halaman ini.",
    ],
  },
  {
    id: "kontak",
    title: "11. Hubungi Kami",
    paragraphs: [
      "Jika Anda memiliki pertanyaan, permintaan, atau keluhan terkait Kebijakan Privasi ini atau pemrosesan data pribadi Anda, silakan hubungi kami melalui:",
    ],
  },
];
