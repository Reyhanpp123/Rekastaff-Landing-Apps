# TDD Evidence - Kembalikan copywriting ke narasi lama

- Tanggal: 2026-10-08
- Sumber: permintaan pemilik produk (teks lama sebagai sumber kebenaran). Tidak ada `*.plan.md`.
- Ruang lingkup: hanya teks. Desain, layout, motion, dan urutan section redesign tetap.

## User journeys

1. Sebagai calon pelanggan, saya membaca narasi promosi lama di desain baru, agar pesan brand konsisten.
2. Sebagai pemilik produk, saya ingin frasa akhir headline tetap di-highlight (primary / gradient #2563EB -> #06B6D4).
3. Sebagai pemilik produk, saya tidak ingin copy versi redesign masih tampil.

## Test runner

Project tidak punya runner. Dipakai `node --test` (bawaan Node, tanpa dependency baru):
`npm test` -> `node --test tests/`. Tes mengambil HTML hasil render server dari
`LANDING_URL` (default `http://localhost:3000/`) dan memeriksa teks yang tampil serta
elemen `<span>` highlight.

## RED / GREEN

| Tahap | Perintah | Hasil |
|---|---|---|
| RED | `npm test` (sebelum perubahan copy) | 11 tes, 0 pass, 11 fail - semua karena teks lama tidak ditemukan / teks redesign masih tampil |
| GREEN | `npm test` (setelah perubahan) | 11 tes, 9 pass, 2 fail - false negative: tes mengganti `</span>` dengan spasi ("Lebih Ringan ?"). Tes diperbaiki (tag inline dibuang tanpa spasi) |
| GREEN | `npm test` | 11 tes, 11 pass, 0 fail |
| Refactor (escape ASCII di content, font tab mobile) | `npm test` | 11 pass, 0 fail |

Checkpoint commit tidak dibuat: redesign yang menjadi dasar perubahan ini belum di-commit dan masih menunggu review, sehingga commit sekarang akan ikut mengunci redesign tersebut.

## Test specification

| # | Yang dijamin | Tes | Tipe | Hasil |
|---|---|---|---|---|
| 1 | Hero memakai eyebrow, H1, sub, CTA, bullet, chip lama; "Lebih Cerdas" di-highlight | `tests/landing-copy.test.mjs: hero memakai narasi lama` | integration (SSR HTML) | PASS |
| 2 | Proof strip = value strip lama (4 item) | `proof strip memakai value strip lama` | integration | PASS |
| 3 | Fitur: judul, deskripsi, tag, add-on, CTA lama; "Satu Platform" di-highlight | `fitur memakai narasi lama` | integration | PASS |
| 4 | 5 chapter + feed memakai teks alur kerja lama | `alur kerja (Day-to-Payday) memakai narasi lama` | integration | PASS |
| 5 | Onboarding: 3 langkah + CTA lama | `cara kerja / onboarding memakai narasi lama` | integration | PASS |
| 6 | Harga: header, tab, kalkulator, CTA lama; banner diskon dihitung dari katalog | `harga memakai narasi lama` | integration | PASS |
| 7 | 3 testimoni lama + header & CTA lama | `testimoni lama tampil` | integration | PASS |
| 8 | FAQ header & kartu kontak lama (Q&A tetap dari lib/faq.ts) | `FAQ memakai narasi lama` | integration | PASS |
| 9 | Final CTA & footer lama | `CTA akhir & footer memakai narasi lama` | integration | PASS |
| 10 | Section baru (Problem, Dua Sisi) bergaya lama dengan highlight | `section baru ditulis dengan gaya lama` | integration | PASS |
| 11 | Headline/label versi redesign tidak tampil lagi | `copy versi redesign sudah tidak tampil` | integration | PASS |

## Regresi & verifikasi lain

- `npx tsc --noEmit`: 0 error.
- `npm run lint`: 0 error (1 warning lama di `app/opengraph-image.tsx`).
- `next build` ke `distDir` terpisah (`NEXT_DIST_DIR=.next-verify`) agar `.next` dev server tidak tertimpa: berhasil. Folder sementara dihapus, `tsconfig.json` yang diubah otomatis oleh Next dikembalikan.
- Tes interaksi (scratchpad, Chrome headless): 13/13 PASS setelah dua selector tes disesuaikan dengan label baru ("Modul Add-on Pro+", heading add-on).
- Overflow horizontal: tidak ada di 375, 390, 430, 768, 1024, 1280, 1440, 1920. Console error: 0.

## Known gaps

- Tes bergantung pada server yang berjalan (dev atau `next start`); belum ada di CI.
- Coverage % tidak diukur (tes level HTML, bukan unit).
- 3 testimoni lama dikembalikan atas permintaan; sumbernya di repo lama bertanda TODO placeholder. Ganti dengan pelanggan terverifikasi bila tersedia.
