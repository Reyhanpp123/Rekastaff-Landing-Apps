const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Rp 5.000 (format id-ID). */
export function formatRupiah(value: number): string {
  return rupiah.format(value);
}

const number = new Intl.NumberFormat("id-ID");

export function formatNumber(value: number): string {
  return number.format(value);
}

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

/**
 * Tanggal untuk mockup UI, dihitung di server saat render/revalidasi (ISR)
 * sehingga mockup tidak pernah menampilkan tanggal basi.
 * Memakai zona Asia/Jakarta agar tidak bergeser di server UTC.
 */
export interface MockDates {
  /** "Kamis, 8 Oktober 2026" */
  today: string;
  /** "Oktober 2026" */
  monthYear: string;
  /** "Oktober" */
  month: string;
  /** Nama hari pendek Senin-Minggu untuk kalender, mulai Senin. */
  weekDays: string[];
}

export function getMockDates(now = new Date()): MockDates {
  const jkt = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
  const month = MONTHS[jkt.getMonth()];
  return {
    today: `${DAYS[jkt.getDay()]}, ${jkt.getDate()} ${month} ${jkt.getFullYear()}`,
    monthYear: `${month} ${jkt.getFullYear()}`,
    month,
    weekDays: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
  };
}
