"use client";

import React, { useRef } from "react";
import { story, type Chapter } from "@/content/landing";
import type { MockDates } from "@/lib/format";
import { cn } from "@/lib/utils";
import { LaptopFrame, PhoneFrame } from "../shared/DeviceFrame";
import DashboardShot from "../shared/DashboardShot";
import {
  ClockInScreen,
  LeaveShiftScreen,
  PayslipScreen,
} from "../screens/Screens";

// Layar HRD (laptop) = screenshot asli dashboard; layar karyawan (HP) = mockup HTML
// karena aplikasi mobile tidak bisa di-screenshot dari dashboard web.
const AttendanceShot = () => <DashboardShot id="attendance" sizes="(min-width: 1024px) 40vw, 90vw" />;
const PayrollShot = () => <DashboardShot id="payroll" sizes="(min-width: 1024px) 40vw, 90vw" />;

const SCREENS = [ClockInScreen, AttendanceShot, LeaveShiftScreen, PayrollShot, PayslipScreen];

/** Layar final satu chapter dalam bingkainya (dipakai kartu mobile). */
export function ChapterScreen({
  chapter,
  index,
  dates,
  compact = false,
}: {
  chapter: Chapter;
  index: number;
  dates: MockDates;
  compact?: boolean;
}) {
  const Screen = SCREENS[index];
  if (chapter.device === "laptop") {
    return (
      <LaptopFrame className={cn("mx-auto", compact ? "w-[94%] max-w-[520px]" : "w-full")}>
        <Screen dates={dates} />
      </LaptopFrame>
    );
  }
  return (
    <PhoneFrame className={cn("mx-auto", compact ? "w-[200px] sm:w-[220px]" : "w-full")}>
      <Screen dates={dates} />
    </PhoneFrame>
  );
}

const phoneChapters = story.chapters
  .map((c, i) => (c.device === "phone" ? i : -1))
  .filter((i) => i >= 0);
const laptopChapters = story.chapters
  .map((c, i) => (c.device === "laptop" ? i : -1))
  .filter((i) => i >= 0);

/**
 * Panggung device sticky. HP (karyawan) dan laptop (HRD) selalu dirender;
 * pergantian device = crossfade + skala (morph), pergantian layar = crossfade
 * dengan overlap. Layar baru masuk sebelum yang lama hilang, sehingga tidak
 * pernah ada frame dengan layar kosong (AC-S2). Hanya opacity & transform.
 */
export default function DeviceStage({ active, dates }: { active: number; dates: MockDates }) {
  const device = story.chapters[active].device;
  // Saat device sedang disembunyikan, ia tetap menampilkan layar terakhirnya
  // (bukan meloncat ke layar berikutnya) supaya crossfade terasa natural.
  const lastPhone = useRef(phoneChapters[0]);
  const lastLaptop = useRef(laptopChapters[0]);
  if (device === "phone") lastPhone.current = active;
  else lastLaptop.current = active;

  return (
    <div className="relative h-full w-full">
      {/* Laptop - sisi HRD */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-[opacity,transform] duration-700 ease-rs-in-out",
          device === "laptop" ? "scale-100 opacity-100" : "pointer-events-none scale-[0.86] opacity-0"
        )}
      >
        <LaptopFrame className="w-full max-w-[600px]">
          {laptopChapters.map((i) => {
            const Screen = SCREENS[i];
            const on = lastLaptop.current === i;
            return (
              <div
                key={i}
                className={cn(
                  "absolute inset-0 transition-[opacity,transform] duration-500 ease-rs-in-out",
                  on ? "scale-100 opacity-100" : "scale-[0.98] opacity-0"
                )}
              >
                <Screen dates={dates} />
              </div>
            );
          })}
        </LaptopFrame>
      </div>

      {/* HP - sisi karyawan */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-[opacity,transform] duration-700 ease-rs-in-out",
          device === "phone" ? "scale-100 opacity-100" : "pointer-events-none scale-[1.08] opacity-0"
        )}
      >
        <PhoneFrame className="h-[min(560px,72svh)] w-auto">
          {phoneChapters.map((i) => {
            const Screen = SCREENS[i];
            const on = lastPhone.current === i;
            return (
              <div
                key={i}
                className={cn(
                  "absolute inset-0 transition-[opacity,transform] duration-500 ease-rs-in-out",
                  on ? "scale-100 opacity-100" : "scale-[0.98] opacity-0"
                )}
              >
                <Screen dates={dates} />
              </div>
            );
          })}
        </PhoneFrame>
      </div>
    </div>
  );
}
