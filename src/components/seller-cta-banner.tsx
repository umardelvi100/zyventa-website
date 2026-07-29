"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Store } from "lucide-react";
import { useLocale } from "@/components/locale-provider";

export function SellerCtaBanner() {
  const { dict } = useLocale();

  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-orange-500 px-6 py-12 text-center sm:px-12"
      >
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute -end-10 -top-10 h-56 w-56 rounded-full bg-white blur-3xl" />
          <div className="absolute -start-10 -bottom-10 h-56 w-56 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative flex flex-col items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">
            <Store className="h-7 w-7" />
          </span>
          <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">{dict.home.sellerCtaTitle}</h2>
          <p className="max-w-lg text-balance text-indigo-50">{dict.home.sellerCtaSubtitle}</p>
          <Link href="/sell">
            <motion.span
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="mt-2 flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-indigo-700 shadow-lg transition hover:shadow-xl"
            >
              {dict.nav.becomeASeller} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </motion.span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
