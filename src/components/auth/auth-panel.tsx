"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Sparkles, Truck } from "lucide-react";

const features = [
  { icon: ShoppingBag, text: "Curated products across every category" },
  { icon: Sparkles, text: "Personalized picks based on what you love" },
  { icon: Truck, text: "Free shipping on orders over AED 200" },
];

export function AuthPanel() {
  return (
    <div className="relative hidden overflow-hidden bg-gradient-to-br from-indigo-600 via-orange-500 to-amber-400 lg:flex lg:flex-col lg:justify-center lg:px-16">
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-black/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 }}
        className="relative z-10 max-w-md text-white"
      >
        <h2 className="text-4xl font-black leading-tight">
          Join thousands shopping smarter with Zyventa
        </h2>
        <div className="mt-10 flex flex-col gap-5">
          {features.map(({ icon: Icon, text }, i) => (
            <motion.div
              key={text}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.1 }}
              className="flex items-center gap-3"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                <Icon className="h-5 w-5" />
              </span>
              <span className="font-medium">{text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
