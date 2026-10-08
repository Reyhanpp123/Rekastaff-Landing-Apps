import React from "react";
import { Banknote, CalendarCheck2, CalendarRange, FileCheck2, MapPin } from "lucide-react";
import { story } from "@/content/landing";
import { cn } from "@/lib/utils";

const ICONS = [MapPin, CalendarCheck2, CalendarRange, Banknote, FileCheck2];

/**
 * Feed notifikasi yang bertumpuk per chapter (dipertahankan dari desain lama).
 * Kartu baru masuk dengan y 16 -> 0 + opacity (320ms, expo-out).
 */
export default function ActivityFeed({ active, night }: { active: number; night: boolean }) {
  return (
    <ol className="space-y-2.5">
      {story.chapters.map((c, i) => {
        const Icon = ICONS[i];
        const shown = i <= active;
        const current = i === active;
        return (
          <li
            key={c.id}
            className={cn(
              "flex items-center gap-3 rounded-rs-md border px-3.5 py-3 transition-[opacity,transform,background-color,border-color] duration-300 ease-rs-out",
              shown ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
              night
                ? "border-white/10 bg-rs-night-raised/90 text-rs-night-text"
                : "border-rs-border bg-white/90 text-rs-text",
              current && (night ? "border-amber-300/50 shadow-night" : "border-rs-primary/30 shadow-e2"),
              !current && shown && "opacity-80"
            )}
          >
            <span
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-rs-sm",
                current
                  ? night
                    ? "bg-amber-300 text-rs-night"
                    : "bg-rs-primary text-white"
                  : night
                    ? "bg-white/10 text-rs-night-muted"
                    : "bg-rs-primary/10 text-rs-primary-strong"
              )}
            >
              <Icon className="h-[18px] w-[18px]" />
            </span>
            <span className="min-w-0">
              <span className={cn("tabular block text-[11px] font-bold uppercase tracking-[0.06em]", night ? "text-rs-night-muted" : "text-rs-muted")}>
                {c.time}
              </span>
              <span className="block text-[13.5px] font-semibold leading-snug">{c.feed}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
