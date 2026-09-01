"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ProductCardData } from "@/components/product-card";
import { ProductCard } from "@/components/product-card";

interface PersonalizationShelfProps {
  title: string;
  subtitle?: string;
  tag?: string;
  products: ProductCardData[];
  viewAllHref?: string;
}

export function PersonalizationShelf({
  title,
  subtitle,
  tag = "Personalised",
  products,
  viewAllHref = "/products",
}: PersonalizationShelfProps) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-500" />
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-600">
              {tag}
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>}
        </div>
        <Link
          href={viewAllHref}
          className="hidden items-center gap-1 text-sm font-semibold text-indigo-600 hover:underline sm:flex"
        >
          View all <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4"
      >
        {products.slice(0, 4).map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </motion.div>
    </section>
  );
}
