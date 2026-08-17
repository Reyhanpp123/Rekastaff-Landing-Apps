export interface BillingPackage {
  pkg_idx: string;
  pkg_prd_idx?: string;
  pkg_paytype?: string;
  pkg_desc: string;
  pkg_duration_days?: number;
  pkg_duration_months?: number;
  /** Legacy alias — prefer pkg_duration_months */
  pkg_months?: number;
  /** package: total harga periode; personal: harga per karyawan / bulan */
  pkg_price: number;
  pkg_price_min?: number;
  pkg_status?: string;
}

export interface BillingProduct {
  prd_idx: string;
  prd_id?: string;
  prd_name: string;
  prd_desc?: string;
  prd_features?: string | string[];
  prd_paytype?: string;
  prd_min_employee?: number;
  prd_max_employee?: number;
  prd_price_extra_employee?: number;
  prd_status?: string;
  packages?: BillingPackage[];
}

export interface BillingAddon {
  addon_idx: string;
  addon_id?: string;
  addon_menu_id?: string;
  addon_name: string;
  addon_desc?: string;
  addon_features?: string | string[];
  addon_price: number;
  addon_status?: string;
}

export interface BillingCatalogData {
  products: BillingProduct[];
  addons?: BillingAddon[];
}

export interface BillingApiResponse<T = unknown> {
  data: T;
  meta: {
    code: number;
    status?: string;
    message?: string;
  };
}

export function parseFeatureList(raw?: string | string[] | null): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map((f) => String(f).trim()).filter(Boolean);
  }
  return String(raw)
    .split("|")
    .map((f) => f.trim())
    .filter(Boolean);
}

/** @deprecated use parseFeatureList */
export const parseProductFeatures = parseFeatureList;

export function getPackageMonths(pkg: BillingPackage): number {
  return Number(pkg.pkg_duration_months ?? pkg.pkg_months ?? 0);
}

export function isFreeProduct(product: BillingProduct): boolean {
  const name = (product.prd_name || "").toLowerCase();
  if (name.includes("starter") || name.includes("free") || name.includes("gratis")) {
    return true;
  }
  const packages = (product.packages || []).filter((p) => p.pkg_status !== "X");
  if (packages.length && packages.every((p) => Number(p.pkg_price) === 0)) {
    return true;
  }
  return (
    Number(product.prd_max_employee || 0) <= 5 &&
    Number(product.prd_price_extra_employee || 0) === 0 &&
    (!product.packages || product.packages.length === 0)
  );
}

export function getRecommendedProduct(
  products: BillingProduct[],
  employeeCount: number
): BillingProduct | null {
  if (!products.length) return null;

  const sorted = [...products].sort(
    (a, b) => Number(a.prd_max_employee || 0) - Number(b.prd_max_employee || 0)
  );

  const fit = sorted.find((p) => {
    const min = Number(p.prd_min_employee || 0);
    const max = Number(p.prd_max_employee || Number.MAX_SAFE_INTEGER);
    return employeeCount >= min && employeeCount <= max;
  });

  if (fit) return fit;
  return sorted[sorted.length - 1];
}

export function getPackageForDuration(
  product: BillingProduct,
  durationMonths: number
): BillingPackage | null {
  const packages = (product.packages || []).filter(
    (p) => p.pkg_status !== "X" && p.pkg_status !== "Z"
  );
  if (!packages.length) return null;
  return packages.find((p) => getPackageMonths(p) === durationMonths) || null;
}

/** Active package durations for the given product(s), sorted ascending. */
export function getAvailableDurations(
  products: BillingProduct[]
): { value: number; label: string }[] {
  const byMonths = new Map<number, string>();

  for (const product of products) {
    for (const pkg of product.packages || []) {
      if (pkg.pkg_status === "X" || pkg.pkg_status === "Z") continue;
      const months = getPackageMonths(pkg);
      if (months <= 0) continue;
      if (!byMonths.has(months)) {
        byMonths.set(months, pkg.pkg_desc?.trim() || `${months} Bulan`);
      }
    }
  }

  return Array.from(byMonths.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([value, label]) => ({ value, label }));
}

/**
 * Estimasi total biaya untuk durasi (bulan).
 * - package: pkg_price flat untuk periode (tidak × jumlah karyawan)
 * - personal: jumlah karyawan × pkg_price × months
 * - free → 0
 * Catatan: pkg_price_min tidak dipakai.
 */
export function estimateProductTotal(
  product: BillingProduct,
  employeeCount: number,
  durationMonths: number
): number | null {
  if (isFreeProduct(product)) return 0;

  const pkg = getPackageForDuration(product, durationMonths);
  const extraRate = Number(product.prd_price_extra_employee || 0);
  const maxEmp = Number(product.prd_max_employee || 0);
  const minEmp = Number(product.prd_min_employee || 0);
  const paytype = (pkg?.pkg_paytype || product.prd_paytype || "package").toLowerCase();
  const count = Math.max(employeeCount, 1);

  if (!pkg) {
    if (paytype === "personal" && extraRate > 0) {
      return Math.max(count, minEmp) * extraRate * durationMonths;
    }
    if (extraRate > 0 && count > maxEmp) {
      return (count - maxEmp) * extraRate * durationMonths;
    }
    return null;
  }

  const months = getPackageMonths(pkg) || durationMonths;

  if (paytype === "personal") {
    const rate = Number(pkg.pkg_price || extraRate || 0);
    if (rate <= 0) return null;
    return count * rate * months;
  }

  let total = Number(pkg.pkg_price || 0);
  if (count > maxEmp && extraRate > 0) {
    total += (count - maxEmp) * extraRate * months;
  }
  return total;
}

export interface DurationDiscount {
  months: number;
  /** Persentase hemat dibanding membayar per bulan. */
  percent: number;
}

/** Selisih di bawah ambang ini dianggap pembulatan, bukan diskon. */
const MIN_DISCOUNT_PERCENT = 0.5;

/**
 * Diskon sebuah durasi, diturunkan dari data — bukan angka tetap.
 *
 * Pembandingnya adalah harga bila membayar bulanan selama periode yang sama:
 * tarif paket 1 bulan × jumlah bulan. Karena persentasenya dihitung dari
 * pkg_price, angka yang tampil otomatis mengikuti berapa pun harga yang diset
 * admin — termasuk bila diskonnya diubah atau dihapus.
 *
 * Mengembalikan null bila paket 1 bulan tidak ada (tidak ada pembanding),
 * atau bila harga periode ternyata tidak lebih murah.
 */
export function getDurationDiscount(
  product: BillingProduct,
  durationMonths: number
): number | null {
  if (durationMonths <= 1) return null;

  const monthly = getPackageForDuration(product, 1);
  const target = getPackageForDuration(product, durationMonths);
  if (!monthly || !target) return null;

  const monthlyRate = Number(monthly.pkg_price || 0);
  const targetPrice = Number(target.pkg_price || 0);
  if (monthlyRate <= 0 || targetPrice <= 0) return null;

  const paytype = (
    target.pkg_paytype ||
    product.prd_paytype ||
    "package"
  ).toLowerCase();
  const months = getPackageMonths(target) || durationMonths;

  // personal → pkg_price adalah tarif per karyawan/bulan, jadi dibandingkan langsung.
  // package  → pkg_price adalah total periode, jadi pembandingnya tarif bulanan × bulan.
  const listPrice = paytype === "personal" ? monthlyRate : monthlyRate * months;
  if (listPrice <= 0) return null;

  const percent = (1 - targetPrice / listPrice) * 100;
  return percent >= MIN_DISCOUNT_PERCENT ? percent : null;
}

/** Diskon terbesar di seluruh katalog — dipakai untuk banner promosi. */
export function getBestDurationDiscount(
  products: BillingProduct[]
): DurationDiscount | null {
  let best: DurationDiscount | null = null;

  for (const product of products) {
    for (const pkg of product.packages || []) {
      if (pkg.pkg_status === "X" || pkg.pkg_status === "Z") continue;
      const months = getPackageMonths(pkg);
      const percent = getDurationDiscount(product, months);
      if (percent == null) continue;
      if (!best || percent > best.percent) best = { months, percent };
    }
  }

  return best;
}

/**
 * Nominal yang dihemat untuk kombinasi paket, jumlah karyawan, dan durasi
 * tertentu — dibanding membayar bulanan selama periode yang sama.
 */
export function estimateSavings(
  product: BillingProduct,
  employeeCount: number,
  durationMonths: number
): number | null {
  if (durationMonths <= 1) return null;

  const actual = estimateProductTotal(product, employeeCount, durationMonths);
  const monthly = estimateProductTotal(product, employeeCount, 1);
  if (actual == null || monthly == null || monthly <= 0) return null;

  const saving = monthly * durationMonths - actual;
  return saving > 0 ? saving : null;
}

/** Label ringkas sebuah durasi, mis. 12 → "1 Tahun". */
export function formatDurationLabel(months: number): string {
  if (months >= 12 && months % 12 === 0) {
    const years = months / 12;
    return years === 1 ? "1 Tahun" : `${years} Tahun`;
  }
  return `${months} Bulan`;
}
