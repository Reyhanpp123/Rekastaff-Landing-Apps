"use client";

import React, { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FaqItem } from "@/lib/faq";

interface SupportFaqListProps {
  items: FaqItem[];
  onOpen?: (item: FaqItem) => void;
}

const SupportFaqList = ({ items, onOpen }: SupportFaqListProps) => {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <ul className="flex flex-col gap-2">
      {items.map((faq, index) => {
        const isOpen = openIndex === index;
        const triggerId = `${baseId}-q-${index}`;
        const answerId = `${baseId}-a-${index}`;

        return (
          <li
            key={faq.id ?? faq.question}
            className={cn(
              "rounded-xl border bg-card transition-colors",
              isOpen ? "border-primary/30" : "hover:border-default-300"
            )}
          >
            <h4>
              <button
                id={triggerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={answerId}
                onClick={() => {
                  setOpenIndex(isOpen ? null : index);
                  if (!isOpen) onOpen?.(faq);
                }}
                className="flex min-h-[44px] w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-default-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  aria-hidden="true"
                  className={cn(
                    "h-4 w-4 shrink-0 text-default-500 transition-transform duration-200",
                    isOpen && "rotate-180 text-primary"
                  )}
                />
              </button>
            </h4>
            <div
              id={answerId}
              role="region"
              aria-labelledby={triggerId}
              hidden={!isOpen}
              className="px-4 pb-4 text-sm leading-relaxed text-default-600 motion-safe:animate-in motion-safe:fade-in-0"
            >
              {faq.answer}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default SupportFaqList;
