import React from "react";
import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HRD_REGISTER_STARTER_URL, WHATSAPP_CONTACTS } from "@/lib/site";
import Reveal from "./Reveal";
import ParallaxLayer from "./parallax/ParallaxLayer";

const ctaPoints = ["Gratis untuk tim kecil", "Tanpa kartu kredit", "Bantuan setup dari tim kami"];

const CtaSection = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container px-4 sm:px-8">
        <Reveal direction="scale">
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-primary-700 via-primary to-primary-600 px-6 py-14 text-center shadow-2xl shadow-primary/30 md:px-16 md:py-20">
            {/* Dekorasi background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:40px_40px]" />
            <ParallaxLayer range={-60} className="absolute -left-20 -top-20">
              <div className="h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            </ParallaxLayer>
            <ParallaxLayer range={60} className="absolute -bottom-24 -right-16">
              <div className="h-72 w-72 rounded-full bg-primary-950/40 blur-3xl" />
            </ParallaxLayer>

            <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6">
              <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white md:text-5xl">
                Siap Membuat Pekerjaan HR Jadi Lebih Ringan?
              </h2>
              <p className="max-w-2xl text-base leading-relaxed text-white md:text-lg">
                Bergabunglah dengan perusahaan yang sudah beralih dari spreadsheet
                ke Rekastaff. Mulai gratis hari ini — upgrade kapan saja saat tim
                Anda bertambah.
              </p>

              <div className="flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
                <a
                  href={HRD_REGISTER_STARTER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button
                    size="xl"
                    className="group h-14 w-full bg-white px-8 text-base font-bold text-primary shadow-lg hover:bg-white/90 sm:w-auto"
                  >
                    Coba Gratis Sekarang
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </a>
                <a
                  href={WHATSAPP_CONTACTS[0].href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button
                    size="xl"
                    className="h-14 w-full border border-white/40 bg-transparent px-8 text-base font-bold text-white hover:bg-white/10 sm:w-auto"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Konsultasi via WhatsApp
                  </Button>
                </a>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                {ctaPoints.map((point) => (
                  <span
                    key={point}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80 sm:text-sm"
                  >
                    <CheckCircle2 className="h-4 w-4 text-white" />
                    {point}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default CtaSection;
