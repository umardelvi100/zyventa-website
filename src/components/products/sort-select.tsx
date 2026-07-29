"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "@/components/locale-provider";

export function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { dict } = useLocale();

  const currentSort = searchParams.get("sort") ?? "newest";

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    router.push(`/products?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <label htmlFor="sort-select" className="font-medium text-neutral-500">
        {dict.shop.sortBy}
      </label>
      <select
        id="sort-select"
        value={currentSort}
        onChange={handleChange}
        className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-900"
      >
        <option value="newest">{dict.shop.sortNewest}</option>
        <option value="price-asc">{dict.shop.sortPriceLowHigh}</option>
        <option value="price-desc">{dict.shop.sortPriceHighLow}</option>
        <option value="rating">{dict.shop.sortRating}</option>
      </select>
    </div>
  );
}
