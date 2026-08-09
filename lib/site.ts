export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://rekastaff.com";

export const HRD_URL = process.env.NEXT_PUBLIC_HRD_URL;

export const HRD_LOGIN_URL = `${HRD_URL}/en/auth/login`;

export const HRD_REGISTER_URL = `${HRD_URL}/en/auth/register`;

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

export const CONTACT_EMAIL = "info@rekastaff.com";

export const WHATSAPP_CONTACTS = [
  {
    e164: "+6289618506101",
    display: "+62 896-1850-6101",
    href: "https://wa.me/6289618506101",
  },
  {
    e164: "+6281281529300",
    display: "+62 812-8152-9300",
    href: "https://wa.me/6281281529300",
  },
] as const;
