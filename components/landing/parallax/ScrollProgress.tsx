"use client";

import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

/** Garis progres scroll tipis di atas navbar — memberi orientasi posisi halaman. */
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gradient-to-r from-primary to-info"
    />
  );
};

export default ScrollProgress;
