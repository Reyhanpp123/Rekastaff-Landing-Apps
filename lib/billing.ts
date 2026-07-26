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
  return (
    packages.find((p) => getPackageMonths(p) === durationMonths) ||
    packages[0] ||
    null
  );
}

/**
 * Estimasi total biaya untuk durasi (bulan).
 * - package: pkg_price (+ extra karyawan di atas max × rate × months)
 * - personal: max(employees, min) × pkg_price × months (floor pkg_price_min)
 * - free → 0
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

  if (!pkg) {
    if (paytype === "personal" && extraRate > 0) {
      const count = Math.max(employeeCount, minEmp);
      return count * extraRate * durationMonths;
    }
    if (extraRate > 0 && employeeCount > maxEmp) {
      return (employeeCount - maxEmp) * extraRate * durationMonths;
    }
    return null;
  }

  const months = getPackageMonths(pkg) || durationMonths;

  if (paytype === "personal") {
    const rate = Number(pkg.pkg_price || extraRate || 0);
    if (rate <= 0) return null;
    const count = Math.max(employeeCount, minEmp);
    let total = count * rate * months;
    const priceMin = Number(pkg.pkg_price_min || 0);
    if (priceMin > 0) total = Math.max(total, priceMin);
    return total;
  }

  let total = Number(pkg.pkg_price || 0);
  if (employeeCount > maxEmp && extraRate > 0) {
    total += (employeeCount - maxEmp) * extraRate * months;
  }
  return total;
}
