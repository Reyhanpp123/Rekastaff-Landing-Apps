import React from "react";
import { fetchBillingCatalog } from "@/lib/billing-server";
import { getAvailableDurations } from "@/lib/billing";
import PricingContent from "./PricingContent";

/**
 * Server component: katalog diambil di server sehingga daftar paket, harga,
 * dan modul add-on ikut ter-render ke HTML. Interaktivitas (slider karyawan,
 * pilihan durasi, tab add-on) tetap berjalan di PricingContent.
 */
export default async function PricingSection() {
  const { products, addons, error } = await fetchBillingCatalog();

  // Durasi terpendek yang tersedia dipakai sebagai nilai awal agar harga yang
  // tampil di HTML sudah konkret, bukan fallback "Hubungi Sales".
  const initialDuration = getAvailableDurations(products)[0]?.value ?? 1;

  return (
    <PricingContent
      products={products}
      addons={addons}
      fetchError={error}
      initialDuration={initialDuration}
    />
  );
}
