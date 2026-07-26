import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./assets/scss/globals.scss";
import "./assets/scss/theme.scss";

export const metadata: Metadata = {
  title: "Rekastaff — Sistem Informasi SDM",
  description:
    "Sistem informasi manajemen sumber daya manusia yang terintegrasi, aman, dan efisien untuk membantu perusahaan Anda berkembang.",
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
