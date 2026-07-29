import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { getCategoryPalette } from "@/lib/category-colors";

type Dict = {
  shop: {
    filters: string;
    clearAll: string;
    categories: string;
    all: string;
    priceRange: string;
    min: string;
    max: string;
    rating: string;
    anyRating: string;
    andUp: string;
    applyFilters: string;
  };
};

function Stars({ count }: { count: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`h-3.5 w-3.5 ${i < count ? "text-amber-400" : "text-neutral-200 dark:text-neutral-700"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

export function ProductFilterSidebar({
  categories,
  categoryCounts,
  activeCategory,
  minPrice,
  maxPrice,
  minRating,
  search,
  sort,
  dict,
}: {
  categories: string[];
  categoryCounts: Record<string, number>;
  activeCategory: string;
  minPrice: string;
  maxPrice: string;
  minRating: string;
  search: string;
  sort: string;
  dict: Dict;
}) {
  const ratingOptions = [
    { value: "0", stars: 0 },
    { value: "3", stars: 3 },
    { value: "4", stars: 4 },
    { value: "4.5", stars: 4 },
  ];

  return (
    <form action="/products" method="GET" className="w-full shrink-0 lg:w-64">
      {search && <input type="hidden" name="search" value={search} />}
      {sort && sort !== "newest" && <input type="hidden" name="sort" value={sort} />}

      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-bold">{dict.shop.filters}</h2>
        <Link href="/products" className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">
          {dict.shop.clearAll}
        </Link>
      </div>

      {/* Categories */}
      <details open className="group mb-3 overflow-hidden rounded-2xl border border-black/5 bg-white dark:border-white/10 dark:bg-neutral-900">
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3.5 font-semibold text-sm select-none">
          {dict.shop.categories}
          <ChevronDown className="h-4 w-4 text-neutral-400 transition group-open:rotate-180" />
        </summary>
        <div className="flex flex-col gap-1 px-4 pb-4">
          <label className="flex cursor-pointer items-center justify-between gap-2 rounded-lg px-1 py-1.5 text-sm transition hover:bg-black/3 dark:hover:bg-white/5">
            <span className="flex items-center gap-2">
              <input type="radio" name="category" value="" defaultChecked={!activeCategory} className="accent-indigo-600" />
              <span>{dict.shop.all}</span>
            </span>
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-semibold text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
              {Object.values(categoryCounts).reduce((a, b) => a + b, 0)}
            </span>
          </label>
          {categories.map((c) => {
            const palette = getCategoryPalette(c);
            return (
              <label key={c} className="flex cursor-pointer items-center justify-between gap-2 rounded-lg px-1 py-1.5 text-sm transition hover:bg-black/3 dark:hover:bg-white/5">
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="category"
                    value={c}
                    defaultChecked={activeCategory === c}
                    className="accent-indigo-600"
                  />
                  <span>{c}</span>
                </span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${palette.bg} ${palette.text}`}>
                  {categoryCounts[c] ?? 0}
                </span>
              </label>
            );
          })}
        </div>
      </details>

      {/* Price range */}
      <details open className="group mb-3 overflow-hidden rounded-2xl border border-black/5 bg-white dark:border-white/10 dark:bg-neutral-900">
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3.5 font-semibold text-sm select-none">
          {dict.shop.priceRange}
          <ChevronDown className="h-4 w-4 text-neutral-400 transition group-open:rotate-180" />
        </summary>
        <div className="px-4 pb-4">
          {(minPrice || maxPrice) && (
            <p className="mb-2 text-xs font-medium text-indigo-600 dark:text-indigo-400">
              AED {minPrice || "0"} – AED {maxPrice || "∞"}
            </p>
          )}
          <div className="flex items-center gap-2">
            <input
              type="number"
              name="minPrice"
              min="0"
              defaultValue={minPrice}
              placeholder={dict.shop.min}
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-800"
            />
            <span className="shrink-0 text-neutral-400">–</span>
            <input
              type="number"
              name="maxPrice"
              min="0"
              defaultValue={maxPrice}
              placeholder={dict.shop.max}
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-800"
            />
          </div>
        </div>
      </details>

      {/* Rating */}
      <details open className="group mb-4 overflow-hidden rounded-2xl border border-black/5 bg-white dark:border-white/10 dark:bg-neutral-900">
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3.5 font-semibold text-sm select-none">
          {dict.shop.rating}
          <ChevronDown className="h-4 w-4 text-neutral-400 transition group-open:rotate-180" />
        </summary>
        <div className="flex flex-col gap-1 px-4 pb-4">
          {ratingOptions.map(({ value, stars }) => (
            <label key={value} className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1.5 text-sm transition hover:bg-black/3 dark:hover:bg-white/5">
              <input
                type="radio"
                name="minRating"
                value={value}
                defaultChecked={(minRating || "0") === value}
                className="accent-indigo-600"
              />
              {value === "0" ? (
                <span>{dict.shop.anyRating}</span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Stars count={stars} />
                  <span className="text-xs text-neutral-500">
                    {value} {dict.shop.andUp}
                  </span>
                </span>
              )}
            </label>
          ))}
        </div>
      </details>

      <button
        type="submit"
        className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md"
      >
        {dict.shop.applyFilters}
      </button>
    </form>
  );
}
