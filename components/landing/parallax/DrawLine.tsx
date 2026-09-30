"use client";

import React, { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/** Garis penghubung yang "tergambar" mengikuti progres scroll section. */
const DrawLine = ({ className }: { className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "start 40%"] });
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} aria-hidden="true" className={className}>
      <motion.div
        style={{ scaleX: reduceMotion ? 1 : scaleX }}
        className="h-full w-full origin-left rounded-full bg-gradient-to-r from-primary/20 via-primary to-primary/20"
      />
    </div>
  );
};

export default DrawLine;
