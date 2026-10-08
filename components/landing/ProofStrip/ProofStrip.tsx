import React from "react";
import { proofStrip } from "@/content/landing";
import Container from "../shared/Container";

/**
 * Proof Strip (bagian 16-03): 4 keunggulan dari value strip landing lama.
 * Tanpa parallax - jeda "tarikan napas" setelah hero yang bergerak.
 */
export default function ProofStrip() {
  return (
    <section aria-label={proofStrip.label} className="relative border-y border-rs-border bg-white">
      <Container wide>
        <ul className="grid grid-cols-2 lg:grid-cols-4">
          {proofStrip.items.map((item, i) => (
            <li
              key={item.title}
              data-reveal=""
              data-reveal-delay={String(i * 60)}
              className="border-rs-border px-4 py-7 sm:px-6 sm:py-9 lg:px-8 [&:nth-child(even)]:border-l [&:nth-child(n+3)]:border-t lg:border-l lg:first:border-l-0 lg:[&:nth-child(n+3)]:border-t-0"
            >
              <h3 className="text-[clamp(19px,2vw,26px)] font-extrabold leading-tight tracking-[-0.02em] text-rs-text">
                {item.title}
              </h3>
              <p className="mt-1.5 text-[14px] leading-snug text-rs-muted sm:text-[15px]">{item.body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
