"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, Truck, RotateCcw } from "lucide-react";
import { useLocale } from "@/components/locale-provider";

export function TrustStrip() {
  const { dict } = useLocale();

  const items = [
    { icon: ShieldCheck, title: dict.home.trustVerifiedSellers, desc: dict.home.trustVerifiedSellersDesc, gradient: "from-indigo-500 to-blue-500" },
    { icon: Lock, title: dict.home.trustSecureCheckout, desc: dict.home.trustSecureCheckoutDesc, gradient: "from-emerald-500 to-teal-400" },
    { icon: Truck, title: dict.home.trustFastDelivery, desc: dict.home.trustFastDeliveryDesc, gradient: "from-orange-500 to-amber-400" },
    { icon: RotateCcw, title: dict.home.trustEasyReturns, desc: dict.home.trustEasyReturnsDesc, gradient: "from-purple-500 to-pink-400" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 pb-4 pt-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {items.map(({ icon: Icon, title, desc, gradient }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="flex flex-col items-start gap-3 rounded-2xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-neutral-900"
          >
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white`}>
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-bold">{title}</p>
              <p className="mt-0.5 text-sm text-neutral-500">{desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
