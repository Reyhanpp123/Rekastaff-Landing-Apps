import {
  type BillingProduct,
  estimateProductTotal,
  getPackageForDuration,
  getPackageMonths,
  isFreeProduct,
} from "@/lib/billing";
import { formatNumber, formatRupiah } from "@/lib/format";

/**
 * Slider non-linear 1-500 (bagian 20): langkah 1 sampai 50, langkah 5 sampai
 * 200, langkah 10 sesudahnya. Posisi slider 0..SLIDER_MAX.
 */
export const SLIDER_MAX = 109;

export function positionToCount(pos: number): number {
  if (pos < 50) return pos + 1; // 1..50
  if (pos < 80) return 50 + (pos - 49) * 5; // 55..200
  return 200 + (pos - 79) * 10; // 210..500
}

export function countToPosition(count: number): number {
  if (count <= 50) return Math.max(0, count - 1);
  if (count <= 200) return 49 + Math.round((count - 50) / 5);
  return Math.min(SLIDER_MAX, 79 + Math.round((count - 200) / 10));
}

export interface Quote {
  total: number | null;
  /** Rumus yang ditampilkan apa adanya ke pengguna. */
  formula: string | null;
  perMonth: number | null;
  billable: number;
  belowMinimum: boolean;
}

/**
 * Hitung estimasi + rumus eksplisit. Total memakai estimateProductTotal yang
 * sama dengan sebelumnya, sehingga angka tidak berubah - hanya penjelasannya
 * yang kini terlihat (mis. "ditagih kuota minimal 30 x Rp 5.000").
 */
export function quote(product: BillingProduct, employees: number, months: number): Quote {
  const total = estimateProductTotal(product, employees, months);
  if (isFreeProduct(product)) {
    return { total: 0, formula: null, perMonth: 0, billable: employees, belowMinimum: false };
  }
  const pkg = getPackageForDuration(product, months);
  const paytype = (pkg?.pkg_paytype || product.prd_paytype || "package").toLowerCase();
  const min = Math.max(1, Number(product.prd_min_employee || 0));
  const billable = Math.max(employees, min, 1);
  const pkgMonths = pkg ? getPackageMonths(pkg) || months : months;

  if (!pkg || total == null) {
    return { total: null, formula: null, perMonth: null, billable, belowMinimum: false };
  }

  if (paytype === "personal") {
    const rate = Number(pkg.pkg_price || 0);
    const below = employees < min;
    const head = below
      ? `${formatNumber(employees)} karyawan, ditagih kuota minimal ${formatNumber(min)}`
      : `${formatNumber(billable)} karyawan`;
    return {
      total,
      formula: `${head} x ${formatRupiah(rate)} x ${pkgMonths} bln = ${formatRupiah(total)}`,
      perMonth: Math.round(total / pkgMonths),
      billable,
      belowMinimum: below,
    };
  }

  return {
    total,
    formula: `Harga paket ${pkgMonths} bln = ${formatRupiah(total)}`,
    perMonth: Math.round(total / pkgMonths),
    billable,
    belowMinimum: false,
  };
}
