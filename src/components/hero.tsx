"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Truck, BadgeCheck } from "lucide-react";

export type HeroProduct = {
  id: string;
  slug: string;
  name: string;
  image: string;
};

const TRUST = [
  { icon: BadgeCheck, text: "100% Authentic Products" },
  { icon: Truck, text: "Fast Delivery Across UAE" },
  { icon: ShieldCheck, text: "Verified Sellers Only" },
] as const;

export function Hero({
  leftProducts,
  rightProducts,
}: {
  leftProducts: HeroProduct[];
  rightProducts: HeroProduct[];
}) {
  const leftHeights = ["h-52 w-36", "h-64 w-44", "h-44 w-36"];
  const rightHeights = ["h-44 w-36", "h-64 w-44", "h-52 w-36"];

  return (
    <section className="relative overflow-hidden border-b border-black/5 dark:border-white/5">
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-[1fr_380px_1fr]">
        {/* Left panel — Medicines */}
        <div className="hidden items-end justify-center gap-3 bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50 px-6 pb-0 pt-12 dark:from-teal-950/25 dark:via-cyan-950/20 dark:to-emerald-950/15 lg:flex">
          {leftProducts.slice(0, 3).map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 + i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`relative shrink-0 overflow-hidden rounded-2xl shadow-xl ${leftHeights[i]}`}
              style={{ marginBottom: i === 1 ? "0" : i === 0 ? "16px" : "8px" }}
            >
              <Image src={p.image} alt={p.name} fill className="object-cover" sizes="176px" />
            </motion.div>
          ))}
        </div>

        {/* Center panel — Headline */}
        <div className="flex flex-col items-center justify-center bg-white px-8 py-20 text-center dark:bg-neutral-950 lg:py-28">
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-600 dark:text-indigo-400"
          >
            Health &amp; Beauty Marketplace
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-black leading-[1.1] tracking-tight xl:text-5xl"
          >
            Your{" "}
            <span className="text-indigo-600 dark:text-indigo-400">Health</span>
            {" "}&amp;{" "}
            <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
              Beauty
            </span>
            <br />
            Destination
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.25 }}
            className="mt-8 flex flex-col items-center gap-3.5"
          >
            {TRUST.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950/50">
                  <Icon className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                </span>
                {text}
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.38 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href="/products"
              className="flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-7 py-3 font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-700 hover:shadow-indigo-500/40"
            >
              Shop Now <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/products?category=Medicines"
              className="flex items-center justify-center gap-2 rounded-full border border-black/10 bg-neutral-50 px-7 py-3 font-semibold text-neutral-700 transition hover:bg-neutral-100 dark:border-white/15 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
            >
              Browse Medicines
            </Link>
          </motion.div>
        </div>

        {/* Right panel — Cosmetics */}
        <div className="hidden items-end justify-center gap-3 bg-gradient-to-bl from-purple-50 via-fuchsia-50 to-pink-50 px-6 pb-0 pt-12 dark:from-purple-950/25 dark:via-fuchsia-950/15 dark:to-pink-950/15 lg:flex">
          {rightProducts.slice(0, 3).map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.14 + i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`relative shrink-0 overflow-hidden rounded-2xl shadow-xl ${rightHeights[i]}`}
              style={{ marginBottom: i === 1 ? "0" : i === 2 ? "16px" : "8px" }}
            >
              <Image src={p.image} alt={p.name} fill className="object-cover" sizes="176px" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
