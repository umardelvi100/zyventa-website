import Link from "next/link";
import { Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { ProductCard } from "@/components/product-card";
import { ProductFilterSidebar } from "@/components/products/product-filter-sidebar";
import { SortSelect } from "@/components/products/sort-select";
import { computeRating } from "@/lib/ratings";
import { getWishlistedIds } from "@/lib/wishlist";
import { getCategoryPalette } from "@/lib/category-colors";
import { getEffectiveCod } from "@/lib/cod";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/translations";

type ProductsSearchParams = {
  category?: string;
  subcategory?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  minRating?: string;
  sort?: string;
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<ProductsSearchParams>;
}) {
  const { category, subcategory, search, minPrice, maxPrice, minRating, sort } = await searchParams;
  const session = await auth();
  const dict = getDictionary(await getLocale());

  const minPriceFils = minPrice ? Math.round(Number(minPrice) * 100) : undefined;
  const maxPriceFils = maxPrice ? Math.round(Number(maxPrice) * 100) : undefined;
  const minRatingValue = minRating ? Number(minRating) : 0;
  const sortValue = sort ?? "newest";

  const [allMatching, categoryCountRows, subcategories, wishlistedIds] = await Promise.all([
    prisma.product.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(subcategory ? { subcategory } : {}),
        ...(minPriceFils !== undefined || maxPriceFils !== undefined
          ? {
              price: {
                ...(minPriceFils !== undefined ? { gte: minPriceFils } : {}),
                ...(maxPriceFils !== undefined ? { lte: maxPriceFils } : {}),
              },
            }
          : {}),
      },
      orderBy: { createdAt: "asc" },
      include: { reviews: { select: { rating: true } }, seller: { select: { codAvailable: true } } },
    }),
    prisma.product.groupBy({ by: ["category"], _count: { _all: true } }),
    category
      ? prisma.product.findMany({
          where: { category },
          distinct: ["subcategory"],
          select: { subcategory: true },
        })
      : Promise.resolve([]),
    getWishlistedIds(session?.user?.id),
  ]);

  const categories = categoryCountRows.map((row) => row.category);
  const categoryCounts = Object.fromEntries(categoryCountRows.map((row) => [row.category, row._count._all]));

  const subcategoryNames = subcategories
    .map((s) => s.subcategory)
    .filter((s): s is string => Boolean(s));

  const searchTerm = search?.trim().toLowerCase() ?? "";
  let products = (searchTerm
    ? allMatching.filter((p) =>
        [p.name, p.overview, p.description].some((field) => field.toLowerCase().includes(searchTerm)),
      )
    : allMatching
  ).map((p) => {
    const { avgRating, reviewCount } = computeRating(p.reviews);
    return { ...p, avgRating, reviewCount };
  });

  if (minRatingValue > 0) {
    products = products.filter((p) => p.avgRating >= minRatingValue);
  }

  products = [...products].sort((a, b) => {
    if (sortValue === "price-asc") return a.price - b.price;
    if (sortValue === "price-desc") return b.price - a.price;
    if (sortValue === "rating") return b.avgRating - a.avgRating;
    return 0; // "newest" — already orderBy createdAt asc from the query
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight">{dict.shop.shopAll}</h1>
        <p className="mt-2 text-neutral-500">
          {searchTerm ? (
            <>
              {products.length} {dict.shop.products} · {dict.shop.resultsFor} &quot;{search}&quot;
            </>
          ) : (
            <>
              {products.length} {dict.shop.products}
            </>
          )}
        </p>
      </div>

      <form action="/products" method="GET" className="mb-6 max-w-md">
        {category && <input type="hidden" name="category" value={category} />}
        <div className="relative w-full">
          <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            name="search"
            defaultValue={search ?? ""}
            placeholder={dict.shop.searchPlaceholder}
            className="w-full rounded-full border border-black/10 bg-white py-2.5 ps-10 pe-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-900"
          />
        </div>
      </form>

      {category && subcategoryNames.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-1.5">
          {subcategoryNames.map((sub) => {
            const palette = getCategoryPalette(category);
            const isActive = subcategory === sub;
            return (
              <Link
                key={sub}
                href={`/products?category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(sub)}`}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  isActive ? `${palette.bg} ${palette.text} ring-1 ${palette.ring}` : `${palette.bg} ${palette.text} opacity-60 hover:opacity-100`
                }`}
              >
                {sub}
              </Link>
            );
          })}
        </div>
      )}

      <div className="flex flex-col gap-8 lg:flex-row">
        <ProductFilterSidebar
          categories={categories}
          categoryCounts={categoryCounts}
          activeCategory={category ?? ""}
          minPrice={minPrice ?? ""}
          maxPrice={maxPrice ?? ""}
          minRating={minRating ?? ""}
          search={search ?? ""}
          sort={sortValue}
          dict={dict}
        />

        <div className="min-w-0 flex-1">
          <div className="mb-4 flex justify-end">
            <SortSelect />
          </div>

          {products.length === 0 ? (
            <p className="py-16 text-center text-neutral-500">{dict.shop.noProductsFound}</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
              {products.map((product, i) => (
                <ProductCard
                  key={product.id}
                  index={i}
                  product={{
                    ...product,
                    codAvailable: getEffectiveCod(product, product.seller),
                    isWishlisted: wishlistedIds.has(product.id),
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
