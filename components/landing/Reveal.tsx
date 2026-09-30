"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

type Direction = "up" | "left" | "right" | "scale";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Jarak geser awal (px) untuk direction up/left/right. */
  y?: number;
  /** Arah animasi masuk saat elemen di-scroll ke viewport. */
  direction?: Direction;
}

/** Scroll-triggered reveal: fade + slide / scale. Hanya berjalan sekali per elemen. */
const Reveal = ({
  children,
  className,
  delay = 0,
  y = 28,
  direction = "up",
}: RevealProps) => {
  const reduceMotion = useReducedMotion();

  const hidden = {
    opacity: 0,
    y: direction === "up" ? y : 0,
    x: direction === "left" ? -y * 1.5 : direction === "right" ? y * 1.5 : 0,
    scale: direction === "scale" ? 0.92 : 1,
  };

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : hidden}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
