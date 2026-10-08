// Mengambil screenshot ASLI dashboard Rekastaff (setelah login) untuk landing page.
//
// Cara pakai:  npm run capture:dashboard
//   - Default (mode manual): Microsoft Edge dibuka dalam mode automation dan
//     TAMPIL di layar. Login sendiri di jendela itu; setelah login terdeteksi,
//     skrip membuka tiap halaman dan mengambil screenshot. Kredensial tidak
//     pernah melewati skrip ini.
//   - SCREENSHOT_AUTH=env: login otomatis memakai SCREENSHOT_EMAIL /
//     SCREENSHOT_PASSWORD (dari env atau .env.screenshot). Password tidak
//     pernah dicetak.
//
// Env: SCREENSHOT_DASHBOARD_URL (default http://localhost:3001),
//      SCREENSHOT_LOGIN_TIMEOUT_MS (default 300000), SCREENSHOT_HEADLESS=1,
//      SCREENSHOT_ENV_FILE (default .env.screenshot), SCREENSHOT_EDGE_PATH.
//
// Aturan: tidak ada berkas yang ditulis kecuali SEMUA screenshot berhasil.
// Exit code: 0 ok, 1 gagal, 2 konfigurasi salah, 3 Edge tidak ditemukan.
import puppeteer from "puppeteer-core";
import { existsSync, mkdirSync, readFileSync, writeFileSync, renameSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { mkdtempSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { findEdge } from "./lib/browser.mjs";
import { prepareForCapture } from "./lib/prepare-page.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "public", "images", "dashboard");

// Viewport 1440x900 = rasio 16:10, sama dengan frame mockup di landing,
// sehingga gambar tidak perlu di-crop atau di-stretch. Skala 2x agar tajam.
// 1440 (dipilih pemilik produk): semua kolom tabel muat. Di 1280 kolom paling kanan terpotong.
const VIEWPORT = { width: 1440, height: 900, deviceScaleFactor: 2 };

/** id -> halaman dashboard asal (konteks). Path harus cocok dengan tes. */
const SHOTS = [
  { id: "attendance", path: "/id/attendance/presence", note: "Kehadiran" },
  { id: "leave", path: "/id/manage/leave", note: "Persetujuan cuti" },
  { id: "payroll", path: "/id/payroll/processing", note: "Proses payroll" },
];

const log = (m) => console.log(`[capture] ${m}`);
const fail = (code, m) => {
  console.error(`[capture] ${m}`);
  process.exit(code);
};

function loadEnvFile() {
  const file = process.env.SCREENSHOT_ENV_FILE || join(ROOT, ".env.screenshot");
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = /^\s*([A-Z_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (m && !line.trim().startsWith("#") && process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

function pngSize(buf) {
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

const isAuthUrl = (url) => /\/auth\/|\/login|\/register/i.test(new URL(url).pathname);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function loginWithEnv(page, email, password) {
  // Selektor generik; bila form login berubah, sesuaikan di sini.
  await page.waitForSelector('input[type="password"]', { timeout: 30000 });
  const id = await page.$('input[type="email"], input[name*="email" i], input[type="text"]');
  if (!id) throw new Error("kolom email/username tidak ditemukan di halaman login");
  await id.type(email, { delay: 15 });
  await page.type('input[type="password"]', password, { delay: 15 });
  await Promise.all([page.keyboard.press("Enter")]);
}

async function waitForLogin(page, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (!isAuthUrl(page.url())) return;
    await sleep(500);
  }
  throw new Error(`login tidak terdeteksi dalam ${Math.round(timeoutMs / 1000)} detik`);
}

async function main() {
  loadEnvFile();
  const dashboard = (process.env.SCREENSHOT_DASHBOARD_URL || "http://localhost:3001").replace(/\/$/, "");
  const mode = process.env.SCREENSHOT_AUTH === "env" ? "env" : "manual";
  const timeoutMs = Number(process.env.SCREENSHOT_LOGIN_TIMEOUT_MS || 300000);
  const headless = process.env.SCREENSHOT_HEADLESS === "1";

  if (mode === "env" && (!process.env.SCREENSHOT_EMAIL || !process.env.SCREENSHOT_PASSWORD)) {
    fail(2, "Mode env: SCREENSHOT_EMAIL dan SCREENSHOT_PASSWORD wajib diisi (lihat .env.screenshot.example).");
  }
  const edge = findEdge();
  if (!edge) fail(3, "Microsoft Edge tidak ditemukan. Set SCREENSHOT_EDGE_PATH ke msedge.exe.");

  const browser = await puppeteer.launch({
    executablePath: edge,
    headless: headless ? "new" : false,
    defaultViewport: VIEWPORT,
    userDataDir: mkdtempSync(join(tmpdir(), "rs-capture-")), // profil sementara, bersih
    args: ["--no-first-run", "--no-default-browser-check", "--disable-notifications", `--window-size=${VIEWPORT.width + 16},${VIEWPORT.height + 140}`],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport(VIEWPORT);

    log(`membuka ${dashboard}/id/auth/login`);
    try {
      await page.goto(`${dashboard}/id/auth/login`, { waitUntil: "domcontentloaded", timeout: 60000 });
    } catch (err) {
      throw new Error(`dashboard tidak bisa dibuka di ${dashboard} (${err.message.split("\n")[0]})`);
    }

    if (mode === "env") {
      log("login otomatis memakai SCREENSHOT_EMAIL (password disembunyikan)");
      await loginWithEnv(page, process.env.SCREENSHOT_EMAIL, process.env.SCREENSHOT_PASSWORD);
    } else {
      log("Silakan LOGIN di jendela Edge yang terbuka. Skrip lanjut otomatis setelah login terdeteksi...");
    }
    await waitForLogin(page, timeoutMs);
    log("login terdeteksi");

    const taken = [];
    for (const shot of SHOTS) {
      const url = `${dashboard}${shot.path}`;
      log(`mengambil "${shot.id}" dari ${shot.path}`);
      await page.goto(url, { waitUntil: "networkidle2", timeout: 90000 }).catch(() => {
        // dev server menjaga koneksi HMR tetap terbuka; lanjut bila halaman sudah tampil
      });
      if (isAuthUrl(page.url())) throw new Error(`sesi hilang saat membuka ${shot.path} (dialihkan ke ${new URL(page.url()).pathname})`);
      if (!page.url().includes(shot.path)) throw new Error(`"${shot.id}" dialihkan ke ${new URL(page.url()).pathname}, bukan ${shot.path}`);

      // Sembunyikan overlay dev Next.js agar screenshot bersih; konten halaman tidak diubah.
      await page.addStyleTag({ content: "nextjs-portal,[data-nextjs-toast],[data-nextjs-dialog-overlay]{display:none!important}::-webkit-scrollbar{display:none!important}" });
      await sleep(2500); // beri waktu data tabel selesai dimuat dan tur produk muncul
      // Tutup tur + kaburkan data pribadi; gagal (throw) bila tur tidak bisa ditutup.
      const privacy = await prepareForCapture(page);
      log(`  privasi: tur ditutup=${privacy.tourDismissed}, dikaburkan=${JSON.stringify(privacy.masked)}`);
      // Puppeteer 23 mengembalikan Uint8Array; Buffer dibutuhkan untuk membaca header PNG.
      const buf = Buffer.from(await page.screenshot({ type: "png" }));
      taken.push({ shot, buf, sourceUrl: page.url(), privacy });
    }

    // Semua berhasil: baru tulis berkas (atomik per berkas).
    mkdirSync(OUT_DIR, { recursive: true });
    const capturedAt = new Date().toISOString();
    const shots = taken.map(({ shot, buf, sourceUrl, privacy }) => {
      const file = `${shot.id}.png`;
      const tmp = join(OUT_DIR, `${file}.tmp`);
      writeFileSync(tmp, buf);
      renameSync(tmp, join(OUT_DIR, file));
      const { width, height } = pngSize(buf);
      return { id: shot.id, file, width, height, sourceUrl, note: shot.note, capturedAt, privacy };
    });
    writeFileSync(join(OUT_DIR, "manifest.json"), JSON.stringify({ capturedAt, viewport: VIEWPORT, shots }, null, 2) + "\n");
    log(`selesai: ${shots.map((s) => `${s.file} ${s.width}x${s.height}`).join(", ")}`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => fail(1, `gagal: ${err.message}`));
