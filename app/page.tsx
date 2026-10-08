import React from "react";
import Navbar from "@/components/landing/Navbar/Navbar";
import Hero from "@/components/landing/Hero/Hero";
import ProofStrip from "@/components/landing/ProofStrip/ProofStrip";
import ProblemStory from "@/components/landing/ProblemStory/ProblemStory";
import DayToPayday from "@/components/landing/DayToPayday/DayToPayday";
import TwoSides from "@/components/landing/TwoSides/TwoSides";
import ModulesBento from "@/components/landing/ModulesBento/ModulesBento";
import Security from "@/components/landing/Security/Security";
import Testimonials from "@/components/landing/Testimonials/Testimonials";
import Onboarding from "@/components/landing/Onboarding/Onboarding";
import Pricing from "@/components/landing/Pricing/Pricing";
import FAQ from "@/components/landing/FAQ/FAQ";
import FinalCTA from "@/components/landing/FinalCTA/FinalCTA";
import Footer from "@/components/landing/Footer/Footer";
import StickyMobileCTA from "@/components/landing/shared/StickyMobileCTA";
import MotionProvider from "@/components/motion/MotionProvider";
import { fetchBillingCatalog } from "@/lib/billing-server";
import { getAvailableDurations } from "@/lib/billing";
import { getMockDates } from "@/lib/format";
import { buildHomeJsonLd } from "@/lib/seo";
import { HRD_REGISTER_STARTER_URL } from "@/lib/site";

// Katalog & tanggal mockup diperbarui tiap jam (ISR).
export const revalidate = 3600;

/**
 * Landing page "Dari 08.02 ke Hari Gajian" (LANDING_PAGE_REDESIGN_PLAN.md).
 * Urutan section mengikuti alur cerita bagian 18:
 * enter -> discover -> understand -> explore -> experience -> trust -> desire -> convert.
 */
export default async function HomePage() {
  // `<` di-escape agar string tidak bisa menutup tag <script> lebih awal.
  const jsonLd = JSON.stringify(buildHomeJsonLd()).replace(/</g, "\\u003c");

  // Satu kali ambil katalog: dipakai bento add-on dan section harga.
  const { products, addons, error } = await fetchBillingCatalog();
  const dates = getMockDates();
  const initialDuration = getAvailableDurations(products)[0]?.value ?? 1;
  const registerUrl = HRD_REGISTER_STARTER_URL;

  return (
    <div className="rs-landing flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <MotionProvider />
      <Navbar />
      <main id="konten" tabIndex={-1} className="flex-grow outline-none">
        <Hero dates={dates} registerUrl={registerUrl} />
        <ProofStrip />
        <ProblemStory />
        <DayToPayday dates={dates} registerUrl={registerUrl} />
        <TwoSides dates={dates} />
        <ModulesBento addons={addons} registerUrl={registerUrl} />
        <Security />
        <Testimonials registerUrl={registerUrl} />
        <Onboarding registerUrl={registerUrl} />
        <Pricing
          products={products}
          addons={addons}
          fetchError={error}
          initialDuration={initialDuration}
        />
        <FAQ />
        <FinalCTA registerUrl={registerUrl} dates={dates} />
      </main>
      <Footer />
      <StickyMobileCTA href={registerUrl} label="Coba Gratis" />
    </div>
  );
}
