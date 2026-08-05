"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Search, Zap } from "lucide-react";

export type HeroProduct = {
  id: string;
  slug: string;
  name: string;
  image: string;
};

// Campaign slot: set to null to hide, or populate for seasonal campaigns.
// Example: { label: "Ramadan Offers", tag: "Limited Time", href: "/products?search=ramadan" }
const ACTIVE_CAMPAIGN: { label: string; tag: string; href: string } | null = null;

const QUICK_SEARCHES = ["Scar gel", "Vitamin C", "Sunscreen SPF 50", "Collagen"];

export function Hero({
  leftProducts,
  rightProducts,
}: {
  leftProducts: HeroProduct[];
  rightProducts: HeroProduct[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const leftHeights = ["h-52 w-36", "h-64 w-44", "h-44 w-36"];
  const rightHeights = ["h-44 w-36", "h-64 w-44", "h-52 w-36"];

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/products?search=${encodeURIComponent(query.trim())}`);
  }

  return (
    <section className="relative overflow-hidden border-b border-black/5">
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-[1fr_420px_1fr]">

        {/* Left panel — Medicines */}
        <div className="hidden items-end justify-center gap-3 bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50 px-6 pb-0 pt-12 lg:flex">
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

        {/* Center panel */}
        <div className="flex flex-col items-center justify-center bg-white px-8 py-20 text-center lg:py-24">

          {/* Campaign pill — shown only when ACTIVE_CAMPAIGN is set */}
          {ACTIVE_CAMPAIGN && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="mb-5"
            >
              <Link
                href={ACTIVE_CAMPAIGN.href}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-orange-500 px-4 py-1.5 text-xs font-bold text-white shadow-md transition hover:opacity-90"
              >
                <Zap className="h-3.5 w-3.5" />
                {ACTIVE_CAMPAIGN.tag}: {ACTIVE_CAMPAIGN.label}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          )}

          {/* Label */}
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: ACTIVE_CAMPAIGN ? 0.1 : 0 }}
            className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-600"
          >
            Health &amp; Beauty Marketplace
          </motion.p>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-black leading-[1.08] tracking-tight xl:text-5xl"
          >
            Your{" "}
            <span className="text-indigo-600">Health</span>
            {" "}&amp;{" "}
            <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
              Beauty
            </span>
            <br />
            Destination
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-500"
          >
            Verified sellers. Genuine products. Fast delivery across all 7 Emirates.
          </motion.p>

          {/* Search bar */}
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.28 }}
            onSubmit={handleSearch}
            className="mt-7 w-full max-w-sm"
          >
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search medicines, skincare, vitamins…"
                className="w-full rounded-full border border-black/10 bg-neutral-50 py-3 pl-11 pr-24 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-700"
              >
                Search
              </button>
            </div>
            {/* Quick searches */}
            <div className="mt-2.5 flex flex-wrap justify-center gap-1.5">
              {QUICK_SEARCHES.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => router.push(`/products?search=${encodeURIComponent(q)}`)}
                  className="rounded-full border border-black/8 bg-white px-2.5 py-1 text-[11px] font-medium text-neutral-500 transition hover:border-indigo-300 hover:text-indigo-600"
                >
                  {q}
                </button>
              ))}
            </div>
          </motion.form>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.38 }}
            className="mt-7 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href="/products"
              className="flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-7 py-3 font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-700 hover:shadow-indigo-500/40"
            >
              Shop Now <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/products?category=Medicines"
              className="flex items-center justify-center gap-2 rounded-full border border-black/10 bg-neutral-50 px-7 py-3 font-semibold text-neutral-700 transition hover:bg-neutral-100"
            >
              Browse Medicines
            </Link>
          </motion.div>
        </div>

        {/* Right panel — Cosmetics */}
        <div className="hidden items-end justify-center gap-3 bg-gradient-to-bl from-purple-50 via-fuchsia-50 to-pink-50 px-6 pb-0 pt-12 lg:flex">
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
