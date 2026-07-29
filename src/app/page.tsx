import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Package, Pill, Sparkles, ShoppingBag } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Hero } from "@/components/hero";
import { TrustStrip } from "@/components/trust-strip";
import { SellerCtaBanner } from "@/components/seller-cta-banner";
import { ProductCard } from "@/components/product-card";
import { computeRating } from "@/lib/ratings";
import { getWishlistedIds } from "@/lib/wishlist";
import { getCategoryPalette } from "@/lib/category-colors";
import { getEffectiveCod } from "@/lib/cod";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/translations";

const CATEGORY_ICONS: Record<string, typeof Package> = {
  Medicines: Pill,
  Cosmetics: Sparkles,
  Consumables: Package,
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  Medicines: "OTC & prescription medicines at best prices",
  Cosmetics: "Premium beauty & skincare for every skin type",
  Consumables: "Daily essentials & personal care must-haves",
};

export default async function Home() {
  const session = await auth();
  const userId = session?.user?.id;
  const dict = getDictionary(await getLocale());

  const [allProducts, categories, wishlistedIds] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: "asc" },
      include: { reviews: { select: { rating: true } }, seller: { select: { codAvailable: true } } },
    }),
    prisma.product.findMany({
      distinct: ["category"],
      select: { category: true },
    }),
    getWishlistedIds(userId),
  ]);

  const withMeta = allProducts.map((p) => {
    const { avgRating, reviewCount } = computeRating(p.reviews);
    return {
      ...p,
      avgRating,
      reviewCount,
      codAvailable: getEffectiveCod(p, p.seller),
      isWishlisted: wishlistedIds.has(p.id),
    };
  });

  const categoryRows = categories.map(({ category }) => {
    const categoryProducts = withMeta.filter((p) => p.category === category);
    return {
      category,
      count: categoryProducts.length,
      thumbnail: categoryProducts[0]?.image ?? null,
      products: categoryProducts.slice(0, 4),
    };
  });

  const leftProducts = withMeta
    .filter((p) => p.category === "Medicines")
    .slice(0, 3)
    .map(({ id, slug, name, image }) => ({ id, slug, name, image }));

  const rightProducts = withMeta
    .filter((p) => p.category === "Cosmetics")
    .slice(0, 3)
    .map(({ id, slug, name, image }) => ({ id, slug, name, image }));

  // Fallback: use top-rated if category is empty
  const fallback = withMeta
    .sort((a, b) => b.avgRating * b.reviewCount - a.avgRating * a.reviewCount)
    .slice(0, 3)
    .map(({ id, slug, name, image }) => ({ id, slug, name, image }));

  return (
    <>
      <Hero
        leftProducts={leftProducts.length >= 2 ? leftProducts : fallback}
        rightProducts={rightProducts.length >= 2 ? rightProducts : fallback}
      />

      <TrustStrip />

      {/* Category tiles — horizontal style */}
      <section className="mx-auto max-w-7xl px-4 pb-4 pt-14 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">{dict.home.shopByCategory}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {categoryRows.map(({ category, count, thumbnail }) => {
            const palette = getCategoryPalette(category);
            const Icon = CATEGORY_ICONS[category] ?? ShoppingBag;
            const description = CATEGORY_DESCRIPTIONS[category] ?? "";
            return (
              <Link
                key={category}
                href={`/products?category=${encodeURIComponent(category)}`}
                className="group flex items-center justify-between overflow-hidden rounded-2xl border border-black/5 bg-white p-5 transition hover:border-black/10 hover:shadow-lg hover:shadow-black/5 dark:border-white/10 dark:bg-neutral-900 dark:hover:border-white/15"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${palette.gradient} text-white shadow-sm`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-bold tracking-tight">{category}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-neutral-500">{description}</p>
                    <p className="mt-2.5 flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      {count} {dict.shop.products} <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5 rtl:rotate-180" />
                    </p>
                  </div>
                </div>
                {thumbnail && (
                  <div className="relative ms-4 h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={thumbnail}
                      alt={category}
                      fill
                      sizes="80px"
                      className="object-cover transition duration-500 group-hover:scale-110"
                    />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Category product rows */}
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-16">
          {categoryRows.map(({ category, products }) => {
            if (products.length === 0) return null;
            const palette = getCategoryPalette(category);
            return (
              <div key={category}>
                <div className="mb-6 flex items-center justify-between border-b border-black/5 pb-4 dark:border-white/10">
                  <div className="flex items-center gap-3">
                    <span className={`h-5 w-1.5 rounded-full bg-gradient-to-b ${palette.gradient}`} />
                    <h3 className="text-xl font-bold tracking-tight">{category}</h3>
                  </div>
                  <Link
                    href={`/products?category=${encodeURIComponent(category)}`}
                    className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    {dict.common.viewAll} <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
                  {products.map((product, i) => (
                    <ProductCard key={product.id} index={i} product={product} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <SellerCtaBanner />
    </>
  );
}
