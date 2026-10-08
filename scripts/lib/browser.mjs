import { existsSync } from "node:fs";

/** Lokasi Microsoft Edge (Windows). Bisa dioverride lewat SCREENSHOT_EDGE_PATH. */
export function findEdge() {
  const candidates = [
    process.env.SCREENSHOT_EDGE_PATH,
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  ].filter(Boolean);
  return candidates.find((p) => existsSync(p));
}
