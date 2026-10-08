// Tes: dashboard di landing memakai screenshot ASLI dari dashboard (setelah login),
// sesuai konteks, dan tidak stretch.
//
// Bagian 1-3 memeriksa berkas hasil capture (tanpa server).
// Bagian 4-5 memeriksa HTML hasil render (butuh server di LANDING_URL, default :3000).
// Jalankan: npm test
import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(ROOT, "public", "images", "dashboard");
const URL = process.env.LANDING_URL || "http://localhost:3000/";

// Konteks wajib: id -> kata kunci path halaman dashboard asal capture.
const REQUIRED = {
  attendance: /attendance|absen|kehadiran/i,
  leave: /leave|cuti|izin/i,
  payroll: /payroll|gaji|penggajian/i,
};
// Frame mockup di landing 16:10; capture viewport 1440x900 persis 16:10.
const FRAME_RATIO = 16 / 10;
const RATIO_TOLERANCE = 0.02;

const readManifest = () => JSON.parse(readFileSync(join(DIR, "manifest.json"), "utf8"));

function pngSize(buf) {
  const sig = buf.subarray(0, 8).toString("hex");
  assert.equal(sig, "89504e470d0a1a0a", "bukan berkas PNG yang valid");
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

describe("hasil capture", () => {
  test("manifest ada dan memuat semua konteks yang dibutuhkan", () => {
    assert.ok(existsSync(join(DIR, "manifest.json")), "manifest.json belum ada: jalankan npm run capture:dashboard");
    const ids = readManifest().shots.map((s) => s.id);
    for (const id of Object.keys(REQUIRED)) assert.ok(ids.includes(id), `screenshot "${id}" belum ada`);
  });

  test("setiap screenshot berasal dari halaman dashboard yang sesuai konteks", () => {
    for (const shot of readManifest().shots) {
      const path = new globalThis.URL(shot.sourceUrl).pathname;
      assert.match(path, REQUIRED[shot.id], `"${shot.id}" diambil dari ${path}, bukan halaman yang sesuai`);
    }
  });

  test("tidak ada screenshot halaman login / error", () => {
    const hashes = new Set();
    for (const shot of readManifest().shots) {
      assert.doesNotMatch(new globalThis.URL(shot.sourceUrl).pathname, /auth|login|register|404|error/i);
      const hash = createHash("sha256").update(readFileSync(join(DIR, shot.file))).digest("hex");
      assert.ok(!hashes.has(hash), `"${shot.id}" identik dengan screenshot lain (kemungkinan halaman yang sama)`);
      hashes.add(hash);
    }
  });

  test("privasi: tur ditutup dan email akun dikaburkan di setiap screenshot", () => {
    for (const shot of readManifest().shots) {
      assert.equal(shot.privacy?.masked?.email >= 1, true, `"${shot.id}": email akun belum dikaburkan`);
      // Semua halaman sumber memiliki tur produk; screenshot dengan tur yang tidak ditutup tidak boleh lolos.
      assert.equal(shot.privacy?.tourDismissed, true, `"${shot.id}": tur produk tidak tertutup di screenshot`);
    }
  });

  test("viewport capture 1280-1440px dan 16:10 (desktop penuh, kolom tabel tidak terpotong)", () => {
    // Diputuskan pemilik produk: 1440x900. Di 1280px kolom paling kanan tabel (Status kehadiran,
    // kolom Cuti) terpotong; di bawah 1280px layout dashboard bisa berubah ke mode ringkas.
    const { viewport } = readManifest();
    assert.ok(viewport.width >= 1280, `viewport ${viewport.width}px terlalu sempit: kolom tabel terpotong`);
    assert.ok(viewport.width <= 1440, `viewport ${viewport.width}px terlalu lebar: teks jadi terlalu kecil di landing`);
    assert.ok(Math.abs(viewport.width / viewport.height - FRAME_RATIO) <= RATIO_TOLERANCE, "viewport harus 16:10");
  });

  test("ukuran berkas = ukuran di manifest dan rasio 16:10 (tidak perlu di-stretch/crop)", () => {
    for (const shot of readManifest().shots) {
      const size = pngSize(readFileSync(join(DIR, shot.file)));
      assert.deepEqual(size, { width: shot.width, height: shot.height }, `ukuran ${shot.file} tidak sama dengan manifest`);
      assert.ok(shot.width >= 1440, `${shot.file} terlalu kecil (${shot.width}px) - akan buram di layar besar`);
      assert.ok(
        Math.abs(size.width / size.height - FRAME_RATIO) <= RATIO_TOLERANCE,
        `${shot.file} rasio ${(size.width / size.height).toFixed(3)}, harus 1.6`
      );
    }
  });
});

describe("skrip capture (validasi & authorization)", () => {
  const run = (env) =>
    spawnSync(process.execPath, ["scripts/capture-dashboard.mjs"], {
      cwd: ROOT,
      env: { PATH: process.env.PATH, SystemRoot: process.env.SystemRoot, ...env },
      encoding: "utf8",
      timeout: 60000,
    });

  const manifestText = () => (existsSync(join(DIR, "manifest.json")) ? readFileSync(join(DIR, "manifest.json"), "utf8") : null);

  // Mode login: "manual" (default; Edge tampil, pengguna mengetik login sendiri)
  // atau "env" (kredensial dari SCREENSHOT_EMAIL / SCREENSHOT_PASSWORD).
  test("mode env: berhenti jelas bila kredensial tidak diisi, tanpa menulis berkas", () => {
    const before = manifestText();
    const res = run({ SCREENSHOT_AUTH: "env", SCREENSHOT_ENV_FILE: "tidak-ada.env" });
    assert.equal(res.status, 2, `exit code ${res.status}; stderr: ${res.stderr}`);
    assert.match(res.stderr, /SCREENSHOT_EMAIL/);
    assert.equal(manifestText(), before, "manifest berubah padahal capture gagal");
  });

  test("mode manual: bila tidak ada yang login sampai batas waktu, gagal tanpa menulis berkas", () => {
    const before = manifestText();
    const res = run({
      SCREENSHOT_HEADLESS: "1",
      SCREENSHOT_LOGIN_TIMEOUT_MS: "3000",
      SCREENSHOT_DASHBOARD_URL: "http://127.0.0.1:9",
    });
    assert.notEqual(res.status, 0, "seharusnya gagal karena dashboard tidak terjangkau / tidak ada login");
    assert.equal(manifestText(), before, "manifest berubah padahal capture gagal");
  });

  test("tidak pernah mencetak password ke output", () => {
    const res = run({
      SCREENSHOT_AUTH: "env",
      SCREENSHOT_ENV_FILE: "tidak-ada.env",
      SCREENSHOT_EMAIL: "x@example.invalid",
      SCREENSHOT_PASSWORD: "RAHASIA-JANGAN-TAMPIL",
      SCREENSHOT_HEADLESS: "1",
      SCREENSHOT_LOGIN_TIMEOUT_MS: "3000",
      SCREENSHOT_DASHBOARD_URL: "http://127.0.0.1:9",
    });
    assert.notEqual(res.status, 0);
    assert.ok(!`${res.stdout}${res.stderr}`.includes("RAHASIA-JANGAN-TAMPIL"));
  });
});

describe("tampilan di landing", () => {
  let html = "";
  before(async () => {
    const res = await fetch(URL);
    assert.equal(res.status, 200, `landing tidak bisa diambil dari ${URL}`);
    html = await res.text();
  });

  const imgs = () =>
    [...html.matchAll(/<img\b[^>]*>/g)]
      .map((m) => m[0])
      .map((tag) => ({
        tag,
        src: (/src="([^"]+)"/.exec(tag)?.[1] ?? "")
          .replace(/&amp;/g, "&")
          .replace(/(%[0-9A-Fa-f]{2})+/g, (m) => {
            try {
              return decodeURIComponent(m);
            } catch {
              return m;
            }
          }),
        width: Number(/width="(\d+)"/.exec(tag)?.[1]),
        height: Number(/height="(\d+)"/.exec(tag)?.[1]),
      }))
      .filter((i) => i.src.includes("/images/dashboard/"));

  test("tiap konteks dashboard tampil sebagai gambar screenshot asli", () => {
    const shown = imgs();
    for (const shot of readManifest().shots) {
      const found = shown.filter((i) => i.src.includes(shot.file));
      assert.ok(found.length > 0, `screenshot "${shot.id}" tidak tampil di landing`);
      for (const img of found) {
        assert.equal(img.width, shot.width, "atribut width harus ukuran asli");
        assert.equal(img.height, shot.height, "atribut height harus ukuran asli");
        assert.doesNotMatch(img.tag, /object-cover|object-fill/, "gambar tidak boleh di-crop/di-stretch lewat object-fit");
        assert.match(img.tag, /h-auto/, "tinggi harus mengikuti rasio asli (h-auto)");
      }
    }
  });

  test("hero memakai screenshot attendance, bukan mockup HTML", () => {
    const hero = html.slice(html.indexOf('aria-labelledby="hero-title"'), html.indexOf('aria-label="Keunggulan Rekastaff"'));
    // next/image meng-encode URL sumber (%2Fimages%2Fdashboard%2F...) - decode per-potong agar aman.
    const decoded = hero.replace(/(%[0-9A-Fa-f]{2})+/g, (m) => {
      try {
        return decodeURIComponent(m);
      } catch {
        return m;
      }
    });
    assert.ok(decoded.includes("images/dashboard/attendance"), "hero tidak memakai screenshot attendance");
    assert.ok(!hero.includes("Tingkat kehadiran 7 hari"), "mockup HTML dashboard masih tampil di hero");
  });

  test("regresi: tidak ada mockup dashboard HTML yang tersisa", () => {
    for (const marker of ["Tingkat kehadiran 7 hari", "Persetujuan Cuti", "Kirim slip gaji"]) {
      assert.ok(!html.includes(marker), `mockup HTML masih ada: "${marker}"`);
    }
  });
});
