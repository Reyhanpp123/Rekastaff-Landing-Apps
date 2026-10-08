// Tes: (1) kontak WhatsApp kedua tampil di semua tempat kontak, (2) toggle
// "Kurangi animasi" dihapus tetapi preferensi reduced-motion dari OS tetap dihormati.
// Butuh server di LANDING_URL (default http://localhost:3000/).
import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";
import { findEdge } from "../scripts/lib/browser.mjs";

const URL = process.env.LANDING_URL || "http://localhost:3000/";
const FIRST = { display: "+62 812-8152-9300", wa: "wa.me/6281281529300", e164: "+6281281529300" };
const SECOND = { display: "+62 823-2028-2891", wa: "wa.me/6282320282891", e164: "+6282320282891" };

let html = "";
const section = (open, close) => {
  const s = html.indexOf(open);
  assert.ok(s >= 0, `bagian "${open}" tidak ditemukan`);
  return html.slice(s, html.indexOf(close, s));
};
const text = (s) => s.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ");

// `before` level atas tidak berlaku untuk blok describe, jadi dipasang per-describe.
const loadHtml = async () => {
  const res = await fetch(URL);
  assert.equal(res.status, 200, `landing tidak bisa diambil dari ${URL}`);
  html = await res.text();
  // Pengaman: HTML kosong / halaman error tidak boleh membuat tes "tidak ada X" lulus semu.
  assert.ok(html.includes("Kelola HR Perusahaan"), "HTML landing tidak berisi konten yang diharapkan");
};

describe("kontak WhatsApp", () => {
  before(loadHtml);
  test("footer menampilkan kedua nomor sebagai tautan WhatsApp", () => {
    const footer = section("<footer", "</footer>");
    for (const c of [FIRST, SECOND]) {
      assert.ok(text(footer).includes(c.display), `footer tidak menampilkan ${c.display}`);
      assert.ok(footer.includes(`href="https://${c.wa}`), `footer tidak punya tautan ${c.wa}`);
    }
  });

  test("kartu kontak FAQ menampilkan kedua nomor", () => {
    const faq = section('id="faq"', "</section>");
    for (const c of [FIRST, SECOND]) {
      assert.ok(text(faq).includes(c.display), `FAQ tidak menampilkan ${c.display}`);
      assert.ok(faq.includes(`https://${c.wa}`), `FAQ tidak punya tautan ${c.wa}`);
    }
  });

  test("structured data (JSON-LD) memuat kedua nomor telepon", () => {
    const ld = /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/.exec(html)?.[1];
    assert.ok(ld, "JSON-LD tidak ditemukan");
    const org = JSON.parse(ld)["@graph"].find((n) => n["@type"] === "Organization");
    assert.deepEqual(org.telephone, [FIRST.e164, SECOND.e164]);
    assert.equal(org.contactPoint.length, 2);
  });

  test("format nomor konsisten: +62 diikuti 3 kelompok digit", () => {
    for (const c of [FIRST, SECOND]) assert.match(c.display, /^\+62 \d{3}-\d{4}-\d{4}$/);
  });
});

describe("toggle 'Kurangi animasi' dihapus", () => {
  before(loadHtml);
  test("tidak ada toggle, switch, atau teks 'Kurangi animasi' di halaman", () => {
    assert.ok(!text(html).includes("Kurangi animasi"), "teks toggle masih tampil");
    assert.ok(!html.includes('role="switch"'), "elemen switch masih ada");
  });

  test("tidak ada skrip bootstrap preferensi (localStorage) yang tersisa", () => {
    assert.ok(!html.includes("rs-reduce-motion"), "kunci localStorage toggle masih ada di HTML");
  });
});

describe("regresi: reduced-motion dari OS tetap dihormati", () => {
  let browser;
  before(async () => {
    browser = await puppeteer.launch({ executablePath: findEdge(), headless: "new" });
  });
  after(async () => browser?.close());

  test("dengan prefers-reduced-motion: tanpa smooth scroll Lenis, tanpa reveal tersembunyi, tanpa pin", async () => {
    const page = await browser.newPage();
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(URL, { waitUntil: "networkidle0", timeout: 180000 });
    const r = await page.evaluate(() => ({
      lenis: document.documentElement.classList.contains("lenis"),
      pending: document.querySelectorAll(".rs-pending").length,
      problemHeight: document.getElementById("masalah").offsetHeight,
      vh: innerHeight,
    }));
    assert.equal(r.lenis, false, "Lenis masih aktif padahal reduced-motion");
    assert.equal(r.pending, 0, "ada elemen reveal yang tersembunyi");
    assert.ok(r.problemHeight < r.vh * 1.3, "section Problem masih di-pin");
  });

  test("tanpa reduced-motion di desktop: animasi tetap aktif (Lenis menyala)", async () => {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(URL, { waitUntil: "networkidle0", timeout: 180000 });
    await new Promise((r) => setTimeout(r, 800));
    const lenis = await page.evaluate(() => document.documentElement.classList.contains("lenis"));
    assert.equal(lenis, true, "motion desktop harus tetap berjalan");
  });
});
