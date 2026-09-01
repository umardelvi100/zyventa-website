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

export type HeroConfig = {
  title: string;
  subtitle: string;
  cta1Text: string;
  cta1Link: string;
  cta2Text: string;
  cta2Link: string;
  promoLabel: string | null;
  promoTag: string | null;
  promoLink: string | null;
};

const QUICK_SEARCHES = ["Scar gel", "Vitamin C", "Sunscreen SPF 50", "Collagen"];

const DEFAULT_CONFIG: HeroConfig = {
  title: "Your Health & Beauty Destination",
  subtitle: "Verified sellers. Genuine products. Fast delivery across all 7 Emirates.",
  cta1Text: "Shop Now",
  cta1Link: "/products",
  cta2Text: "Browse Medicines",
  cta2Link: "/products?category=Medicines",
  promoLabel: null,
  promoTag: null,
  promoLink: null,
};

export function Hero({
  leftProducts,
  rightProducts,
  config,
}: {
  leftProducts: HeroProduct[];
  rightProducts: HeroProduct[];
  config?: HeroConfig;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const cfg = config ?? DEFAULT_CONFIG;
  const isDefaultTitle = cfg.title === DEFAULT_CONFIG.title;
  const campaign =
    cfg.promoLabel
      ? { label: cfg.promoLabel, tag: cfg.promoTag ?? "", href: cfg.promoLink ?? "/products" }
      : null;

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
        <div className="hidden items-end justify-center gap-3 border-r border-black/5 bg-neutral-50 px-6 pb-0 pt-12 lg:flex">
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

          {/* Campaign pill */}
          {campaign && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="mb-5"
            >
              <Link
                href={campaign.href}
                className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-1.5 text-xs font-bold text-accent-foreground transition hover:opacity-90"
              >
                <Zap className="h-3.5 w-3.5" />
                {campaign.tag}: {campaign.label}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          )}

          {/* Label */}
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: campaign ? 0.1 : 0 }}
            className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-accent"
          >
            Health &amp; Beauty Marketplace
          </motion.p>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-neutral-950 xl:text-5xl"
          >
            {isDefaultTitle ? (
              <>
                Your Health &amp;{" "}
                <span className="text-accent">Beauty</span>
                <br />
                Destination
              </>
            ) : (
              cfg.title
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-500"
          >
            {cfg.subtitle}
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
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md bg-accent px-4 py-1.5 text-xs font-semibold text-accent-foreground transition hover:opacity-90"
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
              href={cfg.cta1Link}
              className="flex items-center justify-center gap-2 rounded-md bg-accent px-7 py-3 font-semibold text-accent-foreground transition hover:opacity-90"
            >
              {cfg.cta1Text} <ArrowRight className="h-4 w-4" />
            </Link>
            {cfg.cta2Text && (
              <Link
                href={cfg.cta2Link}
                className="flex items-center justify-center gap-2 rounded-md border border-black/10 px-7 py-3 font-semibold text-neutral-700 transition hover:bg-neutral-50"
              >
                {cfg.cta2Text}
              </Link>
            )}
          </motion.div>
        </div>

        {/* Right panel — Cosmetics */}
        <div className="hidden items-end justify-center gap-3 border-l border-black/5 bg-neutral-50 px-6 pb-0 pt-12 lg:flex">
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
