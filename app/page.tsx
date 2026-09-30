import React from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import HeroSection from "@/components/landing/HeroSection";
import FlowSection from "@/components/landing/FlowSection";
import SmoothScroll from "@/components/landing/parallax/SmoothScroll";
import TrustSection from "@/components/landing/TrustSection";
import FeatureSection from "@/components/landing/FeatureSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import PricingSection from "@/components/landing/PricingSection";
import TestimonialSection from "@/components/landing/TestimonialSection";
import FaqSection from "@/components/landing/FaqSection";
import CtaSection from "@/components/landing/CtaSection";
import { buildHomeJsonLd } from "@/lib/seo";

export default function HomePage() {
  // `<` di-escape agar string tidak bisa menutup tag <script> lebih awal.
  const jsonLd = JSON.stringify(buildHomeJsonLd()).replace(/</g, "\\u003c");

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <SmoothScroll />
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <TrustSection />
        <FeatureSection />
        <FlowSection />
        <HowItWorksSection />
        <PricingSection />
        <TestimonialSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
