"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard, type ProductCardData } from "@/components/product-card";
import { getCategoryPalette } from "@/lib/category-colors";

export type CategoryRow = {
  category: string;
  count: number;
  products: ProductCardData[];
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  Medicines: "OTC & prescription medicines at best prices",
  Cosmetics: "Premium beauty & skincare for every skin type",
  Consumables: "Daily essentials & personal care must-haves",
};

export function CategoryBrowser({
  rows,
  viewAllLabel,
}: {
  rows: CategoryRow[];
  viewAllLabel: string;
}) {
  const [active, setActive] = useState(rows[0]?.category ?? "");
  const activeRow = rows.find((r) => r.category === active) ?? rows[0];

  if (!activeRow) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Shop by Category</h2>
          <p className="mt-1 text-sm text-neutral-500">
            {CATEGORY_DESCRIPTIONS[activeRow.category] ?? "Find exactly what you need"}
          </p>
        </div>
        <Link
          href={`/products?category=${encodeURIComponent(activeRow.category)}`}
          className="flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
        >
          {viewAllLabel} <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
        </Link>
      </div>

      <div className="mb-7 flex flex-wrap gap-2">
        {rows.map(({ category, count }) => {
          const isActive = category === activeRow.category;
          const palette = getCategoryPalette(category);
          return (
            <button
              key={category}
              type="button"
              onClick={() => setActive(category)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-black/10 bg-white text-neutral-600 hover:border-black/20"
              }`}
            >
              {category}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[11px] ${
                  isActive ? "bg-white/15 text-white" : `${palette.bg} ${palette.text}`
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
        {activeRow.products.map((product, i) => (
          <ProductCard key={product.id} index={i} product={product} />
        ))}
      </div>
    </section>
  );
}
