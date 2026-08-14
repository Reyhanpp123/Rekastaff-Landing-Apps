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
  try {
    const res = await fetch(billingCatalogURL, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return { ...EMPTY, error: "Gagal memuat katalog" };
    }

    const json = (await res.json()) as BillingApiResponse<BillingCatalogData>;

    if (json?.meta?.code !== 200) {
      return { ...EMPTY, error: json?.meta?.message || "Gagal memuat katalog" };
    }

    return {
      products: (json.data?.products || []).filter(
        (p) => !HIDDEN_STATUS.includes(p.prd_status || "")
      ),
      addons: (json.data?.addons || []).filter(
        (a) => !HIDDEN_STATUS.includes(a.addon_status || "")
      ),
      error: null,
    };
  } catch {
    return { ...EMPTY, error: "Gagal memuat katalog" };
  }
}
