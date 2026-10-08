# Landing Page Implementation Report

> Proyek: `rekastaff-landing-apps` (rekastaff.com)
> Acuan: `LANDING_PAGE_REDESIGN_PLAN.md` - konsep D "Dari 08.02 ke Hari Gajian"
> Tanggal: 8 Oktober 2026
> Status: belum di-commit, menunggu review.

## 1. Summary

Landing page lama diganti total dengan landing page baru yang dibangun sebagai satu cerita waktu: pagi 08.02, sore 17.00, cuti/shift, tanggal 25 (payroll), tanggal 28 (slip), lalu kembali ke pagi berikutnya di Final CTA.

- 14 section sesuai IA baru (plan bagian 14), dengan urutan Keamanan -> Bukti -> Onboarding -> Harga mengikuti plan bagian 18.
- 3 momen besar (Hero, Problem -> Story, Final CTA). Section keputusan (Keamanan, Harga, FAQ) sengaja tanpa parallax.
- Tidak ada dependency baru. Motion memakai framer-motion dan Lenis yang sudah terpasang.
- Lint dan type-check bersih. Production build berhasil.
- QA di browser (Chrome headless) pada 8 breakpoint: tidak ada horizontal overflow, tidak ada console error, CLS <= 0,003.
- Semua acceptance criteria yang diuji otomatis lulus (13/13).

## 2. Design Plan Coverage

| Plan | Status | Catatan |
|---|---|---|
| 01 Navigation | Selesai | Sticky 64px, hide/show sesuai arah scroll, tone swap di section gelap, link aktif (aria-current), rail 5 chapter saat di Story, skip link, menu mobile berupa dialog dengan focus trap dan Esc. Nav tablet dipangkas (Cara Kerja, Harga, FAQ). |
| 02 Hero "08.02" | Selesai | H1 baru, price line dari katalog, 6 layer parallax (L0-L5), entrance CSS <= 1,2 dtk, jam 08.01 -> 08.02, mouse tilt <= 4 derajat (khusus tier Full). Mobile: HP + 2 chip, dashboard disembunyikan. |
| 03 Proof Strip | Selesai | 4 fakta (Rp 0, Rp 5.000 dari katalog, hitungan jam, Web + HP) dengan count-up visual. Slot logo klien tidak dibuat karena belum ada logo berizin. |
| 04 Problem | Selesai | Fragmen chaos di 3 kedalaman, pin 120vh (tinggi section 220vh), terhisap jadi satu titik biru. Mobile/tablet/reduced-motion: daftar statis. |
| 05 Day-to-Payday | Selesai | 5 chapter x 70svh = 350svh, device morph HP <-> laptop tanpa layar kosong, jam raksasa, activity feed, atmosfer pagi -> malam, rail klik, "Lewati cerita", CTA kontekstual. Mobile: 5 kartu chapter. |
| 06 Dua Sisi | Selesai | Kartu "Cuti 2 hari" berpindah dari HP ke dashboard mengikuti scroll. Laptop (0.9) dan HP (1.1) saling mendekat. Mobile: tablist [HRD / Karyawan]. |
| 07 Bento + Add-on | Selesai | 2 kartu besar + 4 kecil dengan mini-UI. Daftar add-on dibaca dari katalog billing, jadi identik dengan tab harga. |
| 08 Keamanan | Selesai | Section gelap tanpa parallax. Diagram RBAC tergambar sekali. Hanya klaim yang sudah ada di FAQ/katalog. |
| 09 Onboarding | Selesai | Timeline 3 langkah, garis progres mengikuti scroll (horizontal di desktop, vertikal di mobile). |
| 10 Harga + Kalkulator | Selesai | Kalkulator sticky di kiri, satu badge dinamis, rumus kuota minimal eksplisit, slider non-linear 1-500, siklus 1/3/6/12 selalu terlihat (nonaktif saat Starter), aria-live dengan debounce 400ms, tab dengan roving tabindex. |
| 11 Bukti | Fallback jujur | Testimoni anonim lama dihapus. Ditampilkan 3 hal yang bisa dicek sendiri + CTA. Begitu `testimonials` di `content/landing.ts` diisi, layout editorial (1 besar + 2 kecil) otomatis tampil. |
| 12 FAQ | Selesai | Konten tetap dari `lib/faq.ts` (sama dengan JSON-LD). Memakai `<details>` native sehingga tetap bisa dibuka tanpa JS. |
| 13 Final CTA | Selesai | Malam -> fajar (crossfade layer), matahari naik, jam 23.59 -> 08.02, 2 CTA. |
| 14 Footer | Selesai | Navy, link produk/bantuan/kontak, toggle "Kurangi animasi". |

## 3. Components Created

```text
components/landing/
  Navbar/        Navbar.tsx, MobileMenu.tsx, links.ts
  Hero/          Hero.tsx
  ProofStrip/    ProofStrip.tsx
  ProblemStory/  ProblemStory.tsx
  DayToPayday/   DayToPayday.tsx, DeviceStage.tsx, BigClock.tsx, ActivityFeed.tsx
  TwoSides/      TwoSides.tsx
  ModulesBento/  ModulesBento.tsx, Mini.tsx
  Security/      Security.tsx
  Onboarding/    Onboarding.tsx
  Pricing/       Pricing.tsx, pricing-math.ts
  Testimonials/  Testimonials.tsx
  FAQ/           FAQ.tsx
  FinalCTA/      FinalCTA.tsx
  Footer/        Footer.tsx, ReduceMotionToggle.tsx
  screens/       Screens.tsx   (5 mini-UI produk: clock-in, rekap, cuti & shift, payroll, slip)
  shared/        Container, Eyebrow, CtaLink, DeviceFrame (Phone/Laptop/Browser), StickyMobileCTA
components/motion/
  MotionProvider.tsx   (Lenis tier Full, scroll reveal, count-up - satu IntersectionObserver)
  Parallax.tsx         (layer parallax berbasis speed)
lib/motion/
  tokens.ts  tiers.ts  store.ts  scroll.ts
lib/format.ts          (format Rupiah, tanggal mockup Asia/Jakarta)
content/landing.ts     (seluruh copy, terpisah dari UI)
```

Server component dipakai di bagian yang tidak butuh JS: ProofStrip, ModulesBento, Security, Testimonials, FAQ, Footer.

## 4. Files Changed

| File | Perubahan | Alasan |
|---|---|---|
| `app/page.tsx` | Ditulis ulang | Susunan 14 section baru; katalog billing diambil sekali lalu dibagikan ke Hero, Proof, Bento, dan Harga. `revalidate = 3600`. |
| `app/layout.tsx` | Font + import CSS | Plus Jakarta Sans via `next/font/local`, `landing.scss`, themeColor `#2563EB`. |
| `app/kebijakan-privasi/page.tsx` | Import path + kelas | Memakai Navbar/Footer baru, `id="konten"` untuk skip link. |
| `tailwind.config.ts` | Extend | Token `rs-*`, font, shadow e1-e3/glow/night, radius, easing, varian `motion-ok` / `motion-off`. |
| `lib/billing.ts` | Tambah `getPricingFacts()` | Ringkasan harga untuk hero/proof dari katalog. Fungsi lama tidak diubah. |
| `app/assets/scss/landing.scss` | Baru | Token CSS, skala tipografi, keyframes entrance, reveal, container query mini-UI, slider, reduced-motion. |
| `app/fonts/` | Baru | `PlusJakartaSans-latin-wght.woff2` (27 KB) + lisensi OFL. |
| `.eslintrc.json` | Baru | `next lint` sebelumnya tidak punya config dan akan meminta setup interaktif. |
| 18 file lama di `components/landing/` | Dihapus | Digantikan komponen baru (HeroSection, FlowSection, PricingContent, `parallax/*`, dst.). Riwayatnya tetap ada di git. |

Tidak disentuh: `app/api/lead`, `lib/faq.ts`, `lib/seo.ts`, `lib/site.ts`, `lib/billing-server.ts`, `components/support-widget/*`, `components/ui/*`, `next.config.js`, `Dockerfile`, file `.env*`.

## 5. Motion Implementation

- Token durasi/easing ada di `lib/motion/tokens.ts` dan `landing.scss`: expo-out `cubic-bezier(0.16,1,0.3,1)`, in-out `(0.65,0,0.35,1)`.
- Entrance hero memakai CSS keyframes, jadi berjalan sejak paint pertama tanpa menunggu hidrasi.
- Reveal bersifat progressive enhancement: state awal selalu terlihat. JS hanya menyembunyikan elemen yang masih di bawah viewport, lalu memunculkannya sekali.
- Animasi hanya `transform` dan `opacity`. Tidak ada animasi blur, width, atau top.
- Tier motion (`lib/motion/tiers.ts`): Full (>= 1024 + pointer halus), Reduced (tablet/pointer kasar, amplitudo 60%), Selective (< 768, hanya HP/chip, amplitudo 30%), Static (reduced-motion atau toggle).
- Lenis hanya aktif di tier Full. Mobile/tablet memakai scroll native (tanpa scroll-jacking).
- Toggle "Kurangi animasi" disimpan di localStorage (try/catch) dan diterapkan sebelum paint lewat script inline.
- Loop otomatis dibatasi maksimal 3 putaran (< 5 detik, WCAG 2.2.2).

## 6. Parallax Implementation

| Section | Layer | Teknik |
|---|---|---|
| Hero | L0 atmosfer 0.10, L1 peta 0.25, L2 dashboard 0.45, L3 copy 0.70 (hanya saat keluar + fade), L4 HP 0.90 + scale 1 -> 1.08, L5 chip 1.15 | `useScroll` per section, transform tanpa re-render |
| Problem | Fragmen depth 0.6 / 0.85 / 1.1, lalu konvergen ke titik | CSS `sticky` + progress scroll |
| Story | Jam raksasa (paling lambat), feed (sedikit), device sticky | CSS `sticky`, chapter aktif via IntersectionObserver |
| Dua Sisi | Laptop vs HP berlawanan arah + kartu di jalur melengkung | progress scroll |
| Final CTA | Langit, matahari naik, HP kecil | progress scroll |
| Bento, Keamanan, Harga, FAQ | Tidak ada (disengaja) | - |

Pin memakai CSS `position: sticky` dengan varian `lg:motion-ok:`, sehingga layout sudah benar sebelum JS jalan dan tidak menimbulkan CLS.

## 7. Responsive Implementation

- Mobile-first. Container 1200/1360, gutter 16/24/32.
- 375-430: hero bertumpuk, CTA full-width, Story berupa 5 kartu, Dua Sisi berupa tablist, sticky CTA di bawah (memberi ruang untuk tombol Bantuan).
- 768: nav dipangkas, dashboard hero parsial, Story berupa kartu.
- >= 1024: pin Problem & Story aktif, kalkulator sticky.
- Mini-UI memakai container query (`cqw`): mockup laptop di layar sempit memperbesar font dan menyembunyikan kolom sekunder agar tetap terbaca.
- Hasil QA: overflow horizontal = 0 di 375, 390, 430, 768, 1024, 1280, 1440, 1920.

## 8. Accessibility

- Satu H1, urutan heading konsisten, landmark `header/nav/main/footer`, setiap section punya `aria-labelledby`.
- Skip link "Lewati ke konten". "Lewati cerita" memindahkan fokus ke heading Modul (AC-S3).
- Focus ring 3px di semua kontrol, termasuk versi terang di section gelap dan ring pada pilihan radio siklus.
- Mockup bersifat `aria-hidden` dengan ringkasan `sr-only`. Jam bergulir dekoratif.
- Kalkulator: label, `aria-valuetext` pada slider, `aria-live="polite"` dengan debounce 400ms.
- Tab harga dan Dua Sisi: `role=tab/tabpanel`, roving tabindex, panah kiri/kanan.
- Menu mobile: dialog modal, focus trap, Esc, fokus kembali ke tombol.
- Kontras: muted `#4B5A72` di putih 6,9:1. Night-muted `#9AA8C2` di `#0B1220` 7,8:1. Jam amber memakai `#B45309` di latar terang.
- Target sentuh >= 44px.

## 9. SEO

- Title, description, canonical, OG, Twitter, robots, sitemap, dan JSON-LD (Organization, WebSite, SoftwareApplication, FAQPage) tetap memakai `lib/seo.ts` yang sudah ada.
- Semua konten di-SSR dan ada di DOM, termasuk kedua tab harga dan jawaban FAQ.
- Anchor lama dipertahankan sebagai alias (`#features`, `#pricing`, `#testimonials`, `#how-it-works`, `#alur`) agar link eksternal lama tidak rusak.
- Tidak ada data bisnis baru yang dikarang.

## 10. Performance Optimization

- Hero tidak lagi memakai raster 1,3 MB (`banner.png`). Seluruh visual adalah HTML/CSS. Nol gambar di atas fold.
- Font: 1 file woff2 variable 27 KB, `display: swap`, preload, fallback metric-adjusted.
- First Load JS `/`: 173 KB (laporan `next build`).
- CLS terukur 0-0,003. LCP lokal (headless, tanpa throttling) 0,3-1,2 dtk.
- Satu IntersectionObserver global untuk reveal/count-up. Scroll listener hanya untuk arah header (pasif + rAF).

## 11. Dependencies Added

Tidak ada. Plan merekomendasikan GSAP + ScrollTrigger, tetapi project sudah memakai framer-motion (`useScroll`/`useTransform`) dan Lenis. Kombinasi ini plus CSS `sticky` cukup untuk pin, scrub, dan parallax, tanpa menambah ~40 KB gz. (Deviasi yang disengaja, sesuai aturan "gunakan library existing".)

## 12. Build Result

`npm run build` berhasil (Next 14.1.3). Semua halaman ter-prerender: `/`, `/kebijakan-privasi`, `/robots.txt`, `/sitemap.xml`, `/opengraph-image`, `/icon.svg`.

## 13. Lint Result

`npm run lint`: 0 error. Tersisa 1 warning existing di `app/opengraph-image.tsx` (`<img>` memang wajib untuk `ImageResponse`/satori). Tidak ada warning dari kode baru.

## 14. Type Check Result

`npx tsc --noEmit`: 0 error.

## 15. Visual QA Result

QA dijalankan dengan Chrome headless (puppeteer-core) terhadap `next start`. MCP chrome-devtools gagal terhubung di sesi ini.

| Cek | Hasil |
|---|---|
| 8 breakpoint (375-1920) | Tanpa overflow, 0 console error, CLS <= 0,003 |
| AC-S4 klik rail chapter 4 | PASS |
| AC-S3 Lewati cerita + fokus | PASS |
| AC-PR1 rumus "10 karyawan, ditagih kuota minimal 30 x Rp 5.000 x 1 bln = Rp 150.000" | PASS |
| AC-PR2 satu badge, berpindah ke Starter di 3 karyawan | PASS |
| AC-PR3 aria-live | PASS |
| AC-PR4 add-on bento = add-on harga | PASS |
| Tab harga dengan keyboard | PASS |
| Menu mobile (dialog, trap, Esc, fokus kembali) | PASS |
| AC-N2 sticky CTA mobile | PASS |
| AC-A3 tanpa JavaScript | PASS (5 chapter tampil, FAQ bisa dibuka, CTA ada) |
| AC-A1 reduced motion | PASS (tanpa pin, tanpa Lenis, Story menjadi kartu statis) |
| Halaman Kebijakan Privasi | Tanpa overflow/error |

Bug yang ditemukan saat QA dan sudah diperbaiki:
- Panggung Story terlepas sebelum chapter 5 sampai di tengah layar.
- Transform framer-motion menimpa kelas `translate`/`rotate` Tailwind (titik biru, matahari, HP Final CTA).
- Panel tab Dua Sisi tampil dua-duanya di mobile.
- Tombol navbar wrap di 375px.
- H1 wrap di 1920px.
- Titik pemisah price line menggantung.
- Sticky CTA bertumpuk dengan CTA di konten.
- Toggle footer tertutup tombol Bantuan.

## 16. Known Issues

1. Uji performa belum dilakukan di perangkat Android nyata atau dengan throttling 4G. LCP/INP p75 (AC-PF1) perlu diukur dengan Lighthouse/RUM setelah deploy.
2. Safari iOS belum diuji langsung (pin hanya aktif >= 1024px, jadi risikonya rendah).
3. Tablet 768-1023 memakai layout kartu untuk Story, bukan pin 250vh seperti di plan. Ini disederhanakan demi keandalan.
4. Snap ScrollTrigger dan morph clip-path tidak dipakai. Morph dibuat dengan crossfade + scale.
5. Analytics (T20: chapter_view, cta_click, calculator_change) belum dipasang karena landing belum punya tool analytics. `trackSupportEvent` yang sudah ada bisa dipakai sebagai pola.
6. `HRD_URL` tanpa fallback (sudah begitu sejak sebelumnya): bila `NEXT_PUBLIC_HRD_URL` kosong, link menjadi `undefined/id/auth/...`.
7. File gambar lama `public/images/all-img/banner*.png` (2,7 MB) tidak lagi dipakai halaman. Belum dihapus, menunggu keputusan.
8. `LANDING_PAGE_REDESIGN_PLAN.md` tidak ada di repo ini (hanya dilampirkan di percakapan).

## 17. Vercel Readiness

| Aspek | Status |
|---|---|
| Framework | Next.js App Router, terdeteksi otomatis |
| Build command | `npm run build` (default) |
| Node | Next 14.1 butuh Node >= 18.17. Default Vercel (20/22) aman. |
| `output: "standalone"` | Tidak mengganggu Vercel. Tetap dipakai Docker/Jenkins. |
| Font | Self-host. Build tidak butuh akses Google Fonts. |
| Gambar | Tidak ada `next/image` remote. Tidak perlu config tambahan. |
| Env vars | Wajib di-set di Vercel: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_HRD_URL`, `NEXT_PUBLIC_API_URL`. Catatan: build lokal membaca `.env.local` (API `127.0.0.1:8000`). |
| Katalog harga | Diambil saat build/ISR (1 jam). Bila API tidak terjangkau, section harga menampilkan pesan + link WhatsApp, dan build tidak gagal. |
| Rewrites/redirects/headers | Tidak ada, dan tidak dibutuhkan. |
| Secret | Tidak ada secret yang di-hardcode. |

Belum ada deployment yang dilakukan.

## 18. Recommended Next Steps

1. Konfirmasi bisnis (plan bagian 32.3) yang memengaruhi copy:
   - Apakah PRO mencakup PPh 21 & BPJS? Hero dan Story memakai klaim yang sudah ada di situs lama.
   - Apakah Starter gratis permanen? Katalog mencatatnya sebagai paket "1 Bulan" Rp0, jadi klaim "bukan trial" sengaja tidak dipakai.
   - Email domain resmi.
   - Testimoni/logo berizin.
2. Isi `testimonials` di `content/landing.ts` dengan pelanggan terverifikasi.
3. Ukur Lighthouse mobile dan RUM web-vitals setelah deploy. Rilis bertahap dan bandingkan CTR hero serta register rate dengan versi lama.
4. Pasang event analytics (T20).
5. Putuskan nasib `banner.png` / `banner_2.png`.
