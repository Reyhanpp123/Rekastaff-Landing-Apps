import type { Metadata, Viewport } from "next";
import { Toaster } from "react-hot-toast";
import { SITE_URL } from "@/lib/site";
import {
  SEO_DESCRIPTION,
  SEO_KEYWORDS,
  SEO_TITLE,
  SITE_NAME,
  SOCIAL_TITLE,
} from "@/lib/seo";
import "./assets/scss/globals.scss";
import "./assets/scss/theme.scss";
// Harus terakhir: mengunci tema biru agar tidak kalah dari :root bawaan template.
import "./assets/scss/theme-lock.scss";

export const metadata: Metadata = {
  // Wajib agar path relatif (OG image, canonical) resolve ke URL absolut.
  metadataBase: new URL(SITE_URL),
  title: {
    default: SEO_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SEO_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: SEO_KEYWORDS,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: SITE_NAME,
    title: SOCIAL_TITLE,
    description: SEO_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SOCIAL_TITLE,
    description: SEO_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#137EE9",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="theme-blue">
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
