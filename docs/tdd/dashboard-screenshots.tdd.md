# TDD Evidence - Screenshot asli dashboard di landing

- Tanggal: 2026-10-08
- Sumber: permintaan pemilik produk. Tidak ada `*.plan.md`.
- Requirement: dashboard di landing menampilkan screenshot sebenarnya (setelah login).
- Business rules: screenshot sesuai konteks; ukuran sesuai dan tidak stretch.

## Test architecture (existing, tidak ada framework baru)

- Landing: `node --test tests/` (`npm test`), dibuat di tugas copywriting sebelumnya.
- Dashboard (`REKASTAFF-Web-Apps`): `node scripts/run-unit-tests.js` - tidak disentuh.
- Satu devDependency baru: `puppeteer-core` (library kontrol browser, tidak mengunduh browser; memakai Microsoft Edge yang terpasang).

## Cara pengambilan

`npm run capture:dashboard`: Edge dibuka dalam mode automation dan tampil di layar; pengguna login sendiri (kredensial tidak lewat skrip). Setelah login terdeteksi, skrip membuka `/id/attendance/presence`, `/id/manage/leave`, `/id/payroll/processing`, menutup tur produk, mengaburkan data pribadi, lalu screenshot 1440x900 @2x (2880x1800, 16:10). Berkas hanya ditulis bila ketiganya berhasil.

## Given / When / Then

| # | Given / When / Then | Tes |
|---|---|---|
| 1 | Given capture selesai, Then manifest memuat attendance, leave, payroll | `hasil capture: manifest ada...` |
| 2 | Given tiap screenshot, Then path asalnya sesuai konteks (payroll dari /payroll/...) | `...sesuai konteks` |
| 3 | Given hasil capture, Then bukan halaman login/error dan tidak ada dua gambar identik | `tidak ada screenshot halaman login / error` |
| 4 | Given capture, Then tur ditutup dan email dikaburkan di semua screenshot | `privasi: tur ditutup...` |
| 5 | Given berkas PNG, Then ukuran = manifest, lebar >= 1440, rasio 16:10 | `ukuran berkas = ukuran di manifest...` |
| 6 | Given kredensial mode env kosong, Then exit 2 tanpa menulis berkas | `mode env: berhenti jelas...` |
| 7 | Given tidak ada yang login sampai batas waktu, Then gagal tanpa menulis berkas | `mode manual: ...` |
| 8 | Given password diberikan, Then tidak pernah muncul di output | `tidak pernah mencetak password` |
| 9 | Given halaman landing, Then tiap konteks tampil sebagai `<img>` screenshot dengan width/height asli, `h-auto`, tanpa object-fit | `tiap konteks dashboard tampil...` |
| 10 | Given hero, Then memakai screenshot attendance, bukan mockup HTML | `hero memakai screenshot attendance...` |
| 11 | Given landing, Then tidak ada teks mockup dashboard HTML tersisa (regresi) | `regresi: tidak ada mockup dashboard HTML...` |
| 12-19 | Persiapan halaman: tutup tur; blur NIK/email/nama/avatar; logo & data non-sensitif tidak blur; gagal bila tur tidak bisa ditutup; tur terlambat tetap ditutup; kolom "Karyawan" (jumlah) tidak blur; tooltip hover tidak tertangkap; halaman tanpa tur OK | `tests/capture-prepare.test.mjs` (8 tes) |
| 20 | Viewport capture 1280-1440px dan 16:10 (kolom tabel tidak terpotong) | `viewport capture 1280-1440px...` |

## RED / GREEN

| Tahap | Hasil |
|---|---|
| RED #1 | `node --test tests/dashboard-screenshots.test.mjs`: 10 tes, 2 pass (semu: skrip belum ada), 8 fail (manifest, screenshot, mockup masih tampil) |
| RED #2 | `capture-prepare.test.mjs`: modul `scripts/lib/*` belum ada (compile-time RED) |
| GREEN #2 | 5/5 setelah `prepare-page.mjs` dibuat |
| Temuan live #1 | Capture pertama gagal: `buf.readUInt32BE is not a function` (Puppeteer 23 mengembalikan Uint8Array). Tidak ada berkas tertulis (atomik). Diperbaiki dengan `Buffer.from`. |
| Temuan live #2 | Screenshot kedua: tur menutupi semua halaman + NIK, nama, dan email nyata terlihat. Berkas dihapus, lalu persiapan halaman (tes #12-18) ditambahkan. |
| Temuan live #3 | Screenshot ketiga: tur payroll muncul terlambat tetap tertangkap, dan kolom "Karyawan" (jumlah) ikut kabur. Dua tes regresi ditambahkan (RED 5/7) lalu diperbaiki (7/7). Tes manifest diperketat: `tourDismissed === true` wajib. |
| Temuan live #4 | Capture 1280x800 (percobaan agar teks lebih besar): kolom paling kanan tabel terpotong (Status kehadiran, kolom Cuti) dan tooltip "Pinjaman" tertangkap karena kursor diam di sidebar. Pemilik produk memilih kembali ke 1440x900. Tes tooltip ditambahkan (RED: tooltip tetap tampil) lalu `prepareForCapture` memindahkan kursor ke area footer (GREEN). |
| GREEN akhir | `npm test`: 39 tes, 39 pass, 0 fail (termasuk 11 tes copy, 8 tes kontak/reduced-motion, dan 8 tes persiapan halaman sebagai regresi) |

## Verifikasi lain

- Rasio tampil vs rasio asli diukur di Edge pada 375, 768, 1440px: semua gambar yang tampil 1,60 vs 1,60, tanpa overflow horizontal, 0 console error.
- `npx tsc --noEmit`: 0 error. `npm run lint`: 0 error (1 warning lama di `opengraph-image.tsx`).
- `next build` (distDir terpisah): berhasil, halaman `/` 33,3 kB, First Load JS 177 kB.
- Kode mockup dashboard HTML (RecapScreen, PayrollScreen, ApprovalScreen, DashboardShell, TrendCard, dan CSS `rs-dash`) dihapus karena tidak lagi dipakai; layar HP tetap mockup.

## Known gaps

- Layar HP (clock-in, cuti, slip gaji) tetap mockup HTML: tidak bisa di-screenshot dari dashboard web.
- Mode login `env` (otomatis) hanya diuji untuk validasi, belum diuji login sungguhan.
- Keterbacaan: dashboard 1440px yang ditampilkan di lebar ~400-585px membuat teks kecil. Viewport 1280px mencoba memperbaiki ini tetapi memotong kolom tabel, jadi 1440px dipilih (keputusan pemilik produk).
- Data tenant: kolom Divisi/Posisi (mis. nama SPBU) tidak dikaburkan, karena bukan data pribadi perorangan; periksa apakah itu boleh tayang.
- Tes landing butuh server hidup di `LANDING_URL`; belum ada di CI.
