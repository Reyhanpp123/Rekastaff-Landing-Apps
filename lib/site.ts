export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://rekastaff.com";

export const HRD_URL = process.env.NEXT_PUBLIC_HRD_URL;

export const HRD_LOGIN_URL = `${HRD_URL}/id/auth/login`;

export const HRD_REGISTER_URL = `${HRD_URL}/id/auth/register`;

/** Default STARTER product when user picks free / no plan context */
export const STARTER_PRD_IDX = "RS-PRD-001";

export function buildRegisterUrl(opts: {
  prd_idx: string;
  pkg_idx?: string | null;
}): string {
  const params = new URLSearchParams();
  params.set("prd_idx", opts.prd_idx);
  if (opts.pkg_idx) {
    params.set("pkg_idx", opts.pkg_idx);
  }
  return `${HRD_REGISTER_URL}?${params.toString()}`;
}

export const HRD_REGISTER_STARTER_URL = buildRegisterUrl({
  prd_idx: STARTER_PRD_IDX,
});

export const CONTACT_EMAIL = "rekastaff@gmail.com";

export const CONTACT_ADDRESS =
  "Graha Mulia Sejahtera, Jl. Terusan Jakarta No. I75 A, Antapani, Kota Bandung, Jawa Barat 40291";

export const CONTACT_ADDRESS_PARTS = {
  streetAddress: "Graha Mulia Sejahtera, Jl. Terusan Jakarta No. I75 A, Antapani",
  addressLocality: "Kota Bandung",
  addressRegion: "Jawa Barat",
  postalCode: "40291",
  addressCountry: "ID",
} as const;

export const WHATSAPP_CONTACTS = [
  // Sementara di-hide — aktifkan lagi nanti
  // {
  //   e164: "+6289618506101",
  //   display: "+62 896-1850-6101",
  //   href: "https://wa.me/6289618506101",
  // },
  {
    e164: "+6281281529300",
    display: "+62 812-8152-9300",
    href: "https://wa.me/6281281529300",
  },
  {
    e164: "+6282320282891",
    display: "+62 823-2028-2891",
    href: "https://wa.me/6282320282891",
  },
] as const;
