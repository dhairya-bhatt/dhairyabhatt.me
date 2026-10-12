"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -24 }}
        transition={{
          duration: 0.42,
          ease: [0.16, 1, 0.3, 1], // Custom snappy cubic bezier
        }}
        className="w-full flex-1 flex flex-col will-change-transform"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
