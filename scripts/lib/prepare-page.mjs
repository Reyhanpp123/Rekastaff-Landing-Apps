// Menyiapkan halaman dashboard sebelum di-screenshot untuk landing (tayang publik):
//  1. menutup tur produk ("Lewati") agar overlay tidak ikut tertangkap;
//  2. mengaburkan data pribadi: NIK, email, kolom nama pegawai, dan foto avatar.
// Hanya menambahkan filter blur; teks dan layout halaman tidak diubah.
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Klik tombol "Lewati" yang terlihat. Mengembalikan true bila ada yang diklik. */
const clickSkip = (page) =>
  page.evaluate(() => {
    const visible = (el) => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none";
    };
    const btn = [...document.querySelectorAll("button, [role='button'], a")].find(
      (el) => /^lewati$/i.test((el.textContent || "").trim()) && visible(el)
    );
    if (!btn) return false;
    btn.click();
    return true;
  });

const skipStillVisible = (page) =>
  page.evaluate(() =>
    [...document.querySelectorAll("button, [role='button'], a")].some((el) => {
      const r = el.getBoundingClientRect();
      return /^lewati$/i.test((el.textContent || "").trim()) && r.width > 0 && r.height > 0;
    })
  );

/** Tur sering dirender terlambat: tunggu sebentar sebelum menyimpulkan "tidak ada tur". */
async function waitForTour(page, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  do {
    if (await skipStillVisible(page)) return true;
    await sleep(250);
  } while (Date.now() < deadline);
  return false;
}

async function dismissTour(page, appearTimeoutMs, timeoutMs) {
  if (!(await waitForTour(page, appearTimeoutMs))) return false;
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    await clickSkip(page);
    await sleep(400);
    if (!(await skipStillVisible(page))) {
      await sleep(400); // beri waktu animasi tutup selesai
      return true;
    }
  }
  throw new Error("tur produk tidak bisa ditutup (tombol \"Lewati\" tetap tampil); screenshot dibatalkan");
}

function maskSensitive() {
  const BLUR = "blur(6px)";
  const counts = { nik: 0, email: 0, name: 0, avatar: 0 };
  const seen = new Set();
  const mask = (el, kind) => {
    if (!el || seen.has(el)) return;
    seen.add(el);
    el.style.filter = BLUR;
    el.style.userSelect = "none";
    el.setAttribute("data-rs-masked", kind);
    counts[kind] += 1;
  };

  // 1) NIK & email: cari di semua node teks.
  const EMAIL = /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/;
  const NIK = /\b\d{10,20}\b/;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const el = n.parentElement;
    if (!el || ["SCRIPT", "STYLE", "NOSCRIPT"].includes(el.tagName)) continue;
    const text = n.nodeValue || "";
    if (EMAIL.test(text)) mask(el, "email");
    else if (NIK.test(text)) mask(el, "nik");
  }

  // 2) Kolom nama pegawai di tabel (berdasarkan teks header).
  // Hanya header yang jelas berisi nama orang; "Karyawan" saja bisa berarti jumlah.
  const NAME_HEADER = /^(nama|nama pegawai|nama karyawan|pegawai|employee name|name)$/i;
  for (const table of document.querySelectorAll("table")) {
    const headers = [...table.querySelectorAll("thead th")];
    headers.forEach((th, index) => {
      if (!NAME_HEADER.test((th.textContent || "").trim())) return;
      for (const row of table.querySelectorAll("tbody tr")) {
        mask(row.children[index], "name");
      }
    });
  }

  // 3) Foto avatar: gambar kecil (<= 80px) yang bukan logo / svg.
  for (const img of document.querySelectorAll("img")) {
    const r = img.getBoundingClientRect();
    if (r.width === 0 || r.width > 80 || r.height > 80) continue;
    const hint = `${img.alt} ${img.currentSrc || img.src}`;
    if (/logo/i.test(hint) || /\.svg(\?|$)/i.test(hint) || /^data:image\/svg/i.test(hint)) continue;
    mask(img, "avatar");
  }
  return counts;
}

/**
 * @param {import("puppeteer-core").Page} page
 * @returns {Promise<{tourDismissed: boolean, masked: {nik:number,email:number,name:number,avatar:number}}>}
 */
export async function prepareForCapture(page, { tourTimeoutMs = 8000, tourAppearTimeoutMs = 4000 } = {}) {
  const tourDismissed = await dismissTour(page, tourAppearTimeoutMs, tourTimeoutMs);
  const masked = await page.evaluate(maskSensitive);
  // Pindahkan kursor ke tepi bawah tengah (area footer, non-interaktif) agar tooltip
  // hover (mis. label ikon sidebar) tidak ikut tertangkap.
  const view = page.viewport() ?? { width: 800, height: 600 };
  await page.mouse.move(Math.round(view.width / 2), view.height - 2);
  await sleep(500); // biarkan filter blur & hover-out ter-render sebelum screenshot
  return { tourDismissed, masked };
}
