"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

export function SuccessAnimation() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/30"
    >
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 15 }}
      >
        <Check className="h-11 w-11 text-white" strokeWidth={3} />
      </motion.div>
    </motion.div>
  );
}
