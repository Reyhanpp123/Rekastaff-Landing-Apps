import React from "react";
import { Check, MessageCircle, Quote } from "lucide-react";
import { proof, testimonialSection, testimonials, type Testimonial } from "@/content/landing";
import { SUPPORT_WHATSAPP_URL } from "@/lib/support";
import Container from "../shared/Container";
import Eyebrow from "../shared/Eyebrow";
import CtaLink from "../shared/CtaLink";
import Headline from "../shared/Headline";
import Parallax from "@/components/motion/Parallax";

/**
 * Testimoni (bagian 16-11): 1 kutipan editorial besar + 2 kecil.
 * Bila daftar testimoni kosong, tampil fallback berisi hal yang bisa dicek
 * sendiri oleh pengunjung.
 */
export default function Testimonials({ registerUrl }: { registerUrl: string }) {
  return (
    <section id="testimoni" aria-labelledby="testimoni-title" className="relative overflow-hidden bg-white py-24 md:py-32">
      <span id="testimonials" aria-hidden="true" className="absolute top-0" />
      {testimonials.length > 0 ? (
        <Verified items={testimonials} registerUrl={registerUrl} />
      ) : (
        <Container wide>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5" data-reveal="">
              <SectionHeader />
              <div data-cta-end="" className="mt-8 flex flex-col gap-3 sm:flex-row">
                <CtaLink href={registerUrl} external arrow size="md">
                  {testimonialSection.cta}
                </CtaLink>
                <CtaLink
                  href={SUPPORT_WHATSAPP_URL}
                  external
                  variant="secondary"
                  size="md"
                  icon={<MessageCircle aria-hidden="true" className="h-4 w-4 text-rs-success" />}
                >
                  {proof.contact}
                </CtaLink>
              </div>
            </div>
            <ol className="grid gap-4 lg:col-span-7">
              {proof.checks.map((c, i) => (
                <li
                  key={c.title}
                  data-reveal=""
                  data-reveal-delay={String(i * 80)}
                  className="flex gap-5 rounded-rs-lg border border-rs-border bg-rs-surface p-6 sm:p-7"
                >
                  <span className="tabular flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[15px] font-extrabold text-rs-primary-strong ring-1 ring-rs-border">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="flex items-center gap-2 text-[18px] font-bold text-rs-text">
                      {c.title}
                      <Check aria-hidden="true" className="h-4 w-4 text-rs-success" strokeWidth={3} />
                    </h3>
                    <p className="mt-1.5 text-[15.5px] leading-relaxed text-rs-muted">{c.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      )}
    </section>
  );
}

function SectionHeader() {
  return (
    <>
      <Eyebrow>{testimonialSection.eyebrow}</Eyebrow>
      <h2 id="testimoni-title" className="rs-h2 mt-4 text-rs-text">
        <Headline copy={testimonialSection.title} />
      </h2>
      <p className="rs-lead mt-5 text-rs-muted">{testimonialSection.sub}</p>
    </>
  );
}

function Verified({ items, registerUrl }: { items: Testimonial[]; registerUrl: string }) {
  const [feature, ...rest] = items;
  return (
    <Container wide>
      <Parallax speed={0.6} distance={160} className="pointer-events-none absolute -top-6 left-0 hidden lg:block">
        <Quote className="h-40 w-40 text-rs-primary/[0.07]" />
      </Parallax>
      <div className="max-w-[720px]" data-reveal="">
        <SectionHeader />
      </div>
      <figure className="mt-12 max-w-[920px]" data-reveal="">
        <blockquote className="text-[clamp(22px,2.4vw,30px)] font-semibold leading-[1.4] tracking-[-0.015em] text-rs-text">
          &quot;{feature.quote}&quot;
        </blockquote>
        <figcaption className="mt-6 text-[15px] text-rs-muted">
          <span className="font-bold text-rs-text">{feature.name}</span> - {feature.role}, {feature.company}
          {feature.metric && <span className="mt-1 block font-semibold text-rs-primary-strong">{feature.metric}</span>}
        </figcaption>
      </figure>
      {rest.length > 0 && (
        <ul className="-mx-4 mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0">
          {rest.map((t) => (
            <li key={t.name} className="w-[85%] shrink-0 snap-start md:w-auto">
              <figure className="h-full rounded-rs-lg border border-rs-border bg-rs-surface p-7">
                <blockquote className="text-[17px] leading-relaxed text-rs-text">&quot;{t.quote}&quot;</blockquote>
                <figcaption className="mt-5 text-[14px] text-rs-muted">
                  <span className="font-bold text-rs-text">{t.name}</span> - {t.role}, {t.company}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      )}
      <div data-cta-end="" className="mt-12 flex justify-center">
        <CtaLink href={registerUrl} external arrow>
          {testimonialSection.cta}
        </CtaLink>
      </div>
    </Container>
  );
}
