/** Link navigasi utama. `tablet` = tetap tampil di 768-1023px (nav dipangkas). */
export const NAV_LINKS = [
  { id: "cerita", label: "Cara Kerja", tablet: true },
  { id: "fitur", label: "Fitur", tablet: false },
  { id: "keamanan", label: "Keamanan", tablet: false },
  { id: "harga", label: "Harga", tablet: true },
  { id: "faq", label: "FAQ", tablet: true },
] as const;
