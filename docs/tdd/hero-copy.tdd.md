# TDD Evidence - Tulis ulang teks hero dan tombol agar tidak terdengar seperti AI

- Tanggal: 2026-10-09
- Sumber: permintaan pemilik produk. Tidak ada `*.plan.md`.
- Ruang lingkup: hanya section hero (eyebrow, judul, sub, dua tombol, chip).

## Teks

| Elemen | Sebelum | Sesudah |
|---|---|---|
| Eyebrow | Platform HRIS All-in-One untuk Bisnis Indonesia | HRIS untuk bisnis Indonesia |
| Judul | Kelola HR Perusahaan Lebih Cerdas dalam Satu Platform | Urus absensi, cuti, dan gaji tanpa rekap manual |
| Sub | Absensi GPS, pengajuan cuti, payroll ... semua otomatis, akurat ... | Karyawan absen dari HP, lengkap dengan lokasi GPS dan selfie. Cuti dan jadwal shift tercatat rapi, gaji dihitung lengkap dengan PPh 21 dan BPJS. HRD tinggal memantau dari web. |
| Tombol utama | Coba Gratis Sekarang | Coba gratis |
| Tombol kedua | Lihat Fitur | Lihat fiturnya |
| Chip | Absensi GPS / Lokasi & selfie tervalidasi; Payroll Otomatis / PPh 21 & BPJS sekali klik | Absen pakai GPS / Lokasi dan selfie dicek saat clock-in; Gaji dihitung sendiri / PPh 21 dan BPJS ikut masuk |

Kata kosong dan slogan dibuang. Konteks tujuan produk tetap ada.

## Given / When / Then

| # | Given / When / Then | Tes |
|---|---|---|
| 1 | Given halaman landing, Then hero menampilkan teks baru dan "tanpa rekap manual" di-highlight | `hero memakai teks baru yang natural` |
| 2 | Given hero, Then tidak ada frasa generik lama dan tanda pisah panjang | `hero tidak lagi memakai frasa slogan khas AI` |
| 3 | Given hero, Then kata konteks tetap ada (hris, absen, cuti, gaji, gps, selfie, shift, pph 21, bpjs, web, hp, gratis, coba) | `hero tetap menjelaskan tujuan produk` |
| 4 | Given tombol hero, Then labelnya maksimal 3 kata | `tombol hero singkat dan jelas` |

## RED / GREEN

| Tahap | Hasil |
|---|---|
| RED | 4 tes hero baru gagal sebelum perubahan teks (teks lama masih tampil) |
| GREEN | 4 tes hero lulus setelah `content/landing.ts` diubah |
| Lingkungan | `npm test` diubah ke `node --test` karena `node --test tests/` gagal di Node 23 |
| Akhir | `npm test`: 42 tes, 40 lulus, 2 gagal |

## Dua tes gagal (bukan karena perubahan ini)

`fitur memakai narasi lama` dan `harga memakai narasi lama` bergantung pada katalog harga dari API billing (`127.0.0.1:8000`) yang sedang mati saat pengujian. Keduanya lulus saat API hidup.

## Verifikasi lain

- `npx tsc --noEmit`: 0 error. `npm run lint`: 0 error.
- Hero diperiksa di 375, 768, 1440, 1920px: tanpa overflow horizontal, 0 error konsol.

## Known gaps

- Judul meta SEO (`lib/seo.ts`) masih kalimat lama.
- Tombol "Coba Gratis" di navbar, sticky mobile, dan CTA di bagian lain tidak diubah.
