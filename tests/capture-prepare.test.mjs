// Tes perilaku persiapan halaman sebelum screenshot: tutup tur produk dan
// samarkan data pribadi. Memakai halaman fixture di Edge headless (tanpa dashboard).
import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";
import { findEdge } from "../scripts/lib/browser.mjs";
import { prepareForCapture } from "../scripts/lib/prepare-page.mjs";

const NIK = "100120262350173";
const EMAIL = "pegawai.rahasia@example.com";

// Meniru dashboard: sidebar dengan email akun + avatar, tabel dengan kolom nama & NIK,
// dan tur produk (overlay + tombol "Lewati").
const fixture = ({ dismissibleTour = true } = {}) => `
<!doctype html><html lang="id"><body style="margin:0;font:16px sans-serif">
  <aside>
    <img id="avatar" alt="" width="48" height="48" src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=">
    <img id="logo" alt="logo" width="200" height="60" src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=">
    <p id="email">${EMAIL}</p>
  </aside>
  <table>
    <thead><tr><th>Nama</th><th>NIK</th><th>Jenis Cuti</th></tr></thead>
    <tbody>
      <tr><td id="name">Budi Santoso</td><td id="nik">${NIK}</td><td id="type">Cuti Tahunan</td></tr>
    </tbody>
  </table>
  <div id="tour" role="dialog" style="position:fixed;inset:0;background:rgba(0,0,0,.5)">
    <p>Kelola pengajuan cuti</p>
    <button id="skip" onclick="${dismissibleTour ? "document.getElementById('tour').remove()" : "void 0"}">Lewati</button>
  </div>
</body></html>`;

describe("prepareForCapture", () => {
  let browser;
  before(async () => {
    const edge = findEdge();
    assert.ok(edge, "Edge tidak ditemukan");
    browser = await puppeteer.launch({ executablePath: edge, headless: "new" });
  });
  after(async () => browser?.close());

  const open = async (opts) => {
    const page = await browser.newPage();
    await page.setContent(fixture(opts));
    return page;
  };
  const blurred = (page, sel) =>
    page.$eval(sel, (el) => /blur/.test(getComputedStyle(el).filter) || el.closest("[data-rs-masked]") !== null);

  test("menutup tur produk sehingga tidak ada overlay yang menutupi halaman", async () => {
    const page = await open();
    const result = await prepareForCapture(page);
    assert.equal(await page.$("#tour"), null, "overlay tur masih ada");
    assert.equal(result.tourDismissed, true);
  });

  test("mengaburkan NIK, email, dan kolom nama; data non-sensitif tetap terbaca", async () => {
    const page = await open();
    const result = await prepareForCapture(page);
    assert.equal(await blurred(page, "#nik"), true, "NIK harus kabur");
    assert.equal(await blurred(page, "#email"), true, "email harus kabur");
    assert.equal(await blurred(page, "#name"), true, "kolom nama harus kabur");
    assert.equal(await blurred(page, "#type"), false, "jenis cuti bukan data sensitif");
    assert.equal(await page.$eval("#type", (e) => e.textContent), "Cuti Tahunan");
    assert.ok(result.masked.nik >= 1 && result.masked.email >= 1 && result.masked.name >= 1);
  });

  test("mengaburkan foto avatar kecil, tetapi tidak logo", async () => {
    const page = await open();
    await prepareForCapture(page);
    assert.equal(await blurred(page, "#avatar"), true, "avatar harus kabur");
    assert.equal(await blurred(page, "#logo"), false, "logo tidak boleh dikaburkan");
  });

  test("gagal (bukan screenshot kotor) bila tur tidak bisa ditutup", async () => {
    const page = await open({ dismissibleTour: false });
    await assert.rejects(() => prepareForCapture(page, { tourTimeoutMs: 1500 }), /tur/i);
  });

  test("regresi: tur yang muncul terlambat tetap ditutup (bukan dianggap tidak ada)", async () => {
    const page = await browser.newPage();
    await page.setContent(fixture());
    // Tur baru dirender 1,2 detik setelah halaman dimuat (seperti halaman payroll).
    await page.evaluate(() => {
      const tour = document.getElementById("tour");
      tour.remove();
      setTimeout(() => document.body.appendChild(tour), 1200);
    });
    const result = await prepareForCapture(page, { tourAppearTimeoutMs: 4000 });
    assert.equal(await page.$("#tour"), null, "tur yang terlambat masih menutupi halaman");
    assert.equal(result.tourDismissed, true);
  });

  test("regresi: kolom 'Karyawan' berisi jumlah (bukan nama) tidak dikaburkan", async () => {
    const page = await browser.newPage();
    await page.setContent(`<table><thead><tr><th>Periode</th><th>Karyawan</th><th>Nama Pegawai</th></tr></thead>
      <tbody><tr><td>Sep 2026</td><td id="count">10</td><td id="real-name">Siti Aminah</td></tr></tbody></table>`);
    const result = await prepareForCapture(page, { tourAppearTimeoutMs: 0 });
    assert.equal(await blurred(page, "#count"), false, "jumlah karyawan tidak sensitif");
    assert.equal(await blurred(page, "#real-name"), true, "kolom Nama Pegawai tetap harus kabur");
    assert.equal(result.masked.name, 1);
  });

  test("regresi: kursor dipindah dari elemen interaktif agar tooltip hover tidak ikut tertangkap", async () => {
    const page = await browser.newPage();
    await page.setContent(`<style>#tip{display:none}#target:hover+#tip{display:block}</style>
      <button id="target" style="position:fixed;left:10px;top:10px;width:100px;height:40px">Pinjaman</button>
      <div id="tip">Pinjaman</div>`);
    await page.mouse.move(40, 30); // kursor diam di atas ikon sidebar, seperti saat capture
    const tipDisplay = () => page.$eval("#tip", (el) => getComputedStyle(el).display);
    assert.equal(await tipDisplay(), "block", "prasyarat: tooltip harus tampil saat di-hover");
    await prepareForCapture(page, { tourAppearTimeoutMs: 0 });
    assert.equal(await tipDisplay(), "none", "tooltip hover masih tampil di screenshot");
  });

  test("halaman tanpa tur tetap diproses tanpa error", async () => {
    const page = await open();
    await page.evaluate(() => document.getElementById("tour").remove());
    const result = await prepareForCapture(page);
    assert.equal(result.tourDismissed, false);
    assert.ok(result.masked.email >= 1);
  });
});
