import { billingCatalogURL } from "@/config/apis";
import type {
  BillingAddon,
  BillingApiResponse,
  BillingCatalogData,
  BillingProduct,
} from "@/lib/billing";

export interface BillingCatalogResult {
  products: BillingProduct[];
  addons: BillingAddon[];
  /** null bila sukses; berisi pesan bila katalog gagal dimuat. */
  error: string | null;
}

const EMPTY: BillingCatalogResult = { products: [], addons: [], error: null };

/** Status yang menandakan record dihapus / diarsipkan. */
const HIDDEN_STATUS = ["X", "Z"];

/**
 * Ambil katalog billing di server agar isinya ikut ter-render ke HTML
 * (penting untuk SEO — crawler tidak perlu mengeksekusi JavaScript).
 *
 * Memakai ISR: hasilnya di-cache dan divalidasi ulang tiap jam. Kegagalan
 * jaringan sengaja tidak dilempar supaya build tidak ikut gagal saat API
 * sedang tidak bisa dijangkau — halaman tetap tayang, katalog menyusul pada
 * revalidasi berikutnya.
 */
export async function fetchBillingCatalog(): Promise<BillingCatalogResult> {
  const startedAt = Date.now();

  try {
    const res = await fetch(billingCatalogURL, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
      // next: { revalidate: 1 },
    });

    const elapsed = Date.now() - startedAt;

    if (!res.ok) {
      logCatalog(`HTTP ${res.status}`, elapsed);
      return { ...EMPTY, error: "Gagal memuat katalog" };
    }

    const json = (await res.json()) as BillingApiResponse<BillingCatalogData>;

    if (json?.meta?.code !== 200) {
      logCatalog(`meta.code=${json?.meta?.code}`, elapsed, json);
      return { ...EMPTY, error: json?.meta?.message || "Gagal memuat katalog" };
    }

    const products = (json.data?.products || []).filter(
      (p) => !HIDDEN_STATUS.includes(p.prd_status || "")
    );
    const addons = (json.data?.addons || []).filter(
      (a) => !HIDDEN_STATUS.includes(a.addon_status || "")
    );

    logCatalog(`${products.length} produk, ${addons.length} addon`, elapsed, json);

    return { products, addons, error: null };
  } catch (err) {
    logCatalog(
      `ERROR ${err instanceof Error ? err.message : "unknown"}`,
      Date.now() - startedAt
    );
    return { ...EMPTY, error: "Gagal memuat katalog" };
  }
}

/**
 * Log ke stdout server (terminal `next dev` / log container), BUKAN ke konsol
 * browser — fetch ini memang tidak pernah keluar dari sisi klien.
 *
 * Baris ini hanya muncul saat fetch benar-benar menembus jaringan. Bila tidak
 * muncul pada reload, artinya hasilnya masih dilayani dari cache Next.js.
 *
 * Body JSON mentah ikut dicetak saat NODE_ENV bukan production, supaya log
 * server produksi tidak dibanjiri payload penuh setiap revalidasi.
 */
function logCatalog(summary: string, elapsedMs: number, payload?: unknown) {
  const at = new Date().toISOString().slice(11, 23);
  console.log(
    `[billing:catalog] ${at}  HIT API  ${billingCatalogURL}  →  ${summary}  (${elapsedMs}ms)`
  );

  // if (payload !== undefined && process.env.NODE_ENV !== "production") {
  //   console.log(
  //     `[billing:catalog] response JSON:\n${JSON.stringify(payload, null, 2)}`
  //   );
  // }
}
