import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Package, Pill, Sparkles, ShoppingBag, TrendingUp, Users, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Hero } from "@/components/hero";
import { TrustStrip } from "@/components/trust-strip";
import { SellerCtaBanner } from "@/components/seller-cta-banner";
import { ProductCard } from "@/components/product-card";
import { FeaturedCollections } from "@/components/home/featured-collections";
import { WhyZyventa } from "@/components/home/why-zyventa";
import { CustomerReviews } from "@/components/home/customer-reviews";
import { ArticlesSection } from "@/components/home/articles-section";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { PersonalizationShelf } from "@/components/home/personalization-shelf";
import { AnnouncementBar } from "@/components/home/announcement-bar";
import { HeroSlideshow, type Slide } from "@/components/home/hero-slideshow";
import { BrandShowcase } from "@/components/home/brand-showcase";
import { computeRating } from "@/lib/ratings";
import { getWishlistedIds } from "@/lib/wishlist";
import { getCategoryPalette } from "@/lib/category-colors";
import { getEffectiveCod } from "@/lib/cod";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/translations";
import { getHomepageConfig, getActivePromoBanners } from "@/lib/homepage/config";

const DEFAULT_SLIDES: Slide[] = [
  {
    id: "default-medicines",
    tag: "Trusted Pharmacy",
    title: "Genuine Medicines, Delivered Fast",
    subtitle: "OTC & prescription essentials from verified pharmacies across the UAE.",
    ctaText: "Shop Medicines",
    ctaLink: "/products?category=Medicines",
    image: "https://picsum.photos/seed/zyventa-slide-medicines/1600/900",
    bgFrom: "#4f46e5",
    bgTo: "#0ea5e9",
  },
  {
    id: "default-cosmetics",
    tag: "New In",
    title: "Beauty & Skincare You Can Trust",
    subtitle: "Curated cosmetics from authorised distributors — 100% authentic, every time.",
    ctaText: "Shop Cosmetics",
    ctaLink: "/products?category=Cosmetics",
    image: "https://picsum.photos/seed/zyventa-slide-cosmetics/1600/900",
    bgFrom: "#a21caf",
    bgTo: "#f97316",
  },
  {
    id: "default-consumables",
    tag: "Everyday Essentials",
    title: "Wellness Must-Haves, Same-Day Delivery",
    subtitle: "From first aid to daily care — stocked, verified, and delivered fast.",
    ctaText: "Shop Consumables",
    ctaLink: "/products?category=Consumables",
    image: "https://picsum.photos/seed/zyventa-slide-consumables/1600/900",
    bgFrom: "#0f766e",
    bgTo: "#059669",
  },
];

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

  const [cfg, activeBanners, allProducts, categories, wishlistedIds, sellerCount] = await Promise.all([
    getHomepageConfig(),
    getActivePromoBanners(),
    prisma.product.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        reviews: { select: { rating: true } },
        seller: { select: { codAvailable: true } },
      },
    }),
    prisma.product.findMany({
      distinct: ["category"],
      select: { category: true },
    }),
    getWishlistedIds(userId),
    prisma.seller.count({ where: { verificationStatus: "approved" } }),
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

  // Best sellers: top by rating × review count
  const bestSellers = [...withMeta]
    .sort((a, b) => b.avgRating * b.reviewCount - a.avgRating * a.reviewCount)
    .slice(0, 4);

  // New arrivals: last 4 by createdAt
  const newArrivals = [...withMeta]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const leftProducts = withMeta
    .filter((p) => p.category === "Medicines")
    .slice(0, 3)
    .map(({ id, slug, name, image }) => ({ id, slug, name, image }));

  const rightProducts = withMeta
    .filter((p) => p.category === "Cosmetics")
    .slice(0, 3)
    .map(({ id, slug, name, image }) => ({ id, slug, name, image }));

  const fallback = withMeta
    .sort((a, b) => b.avgRating * b.reviewCount - a.avgRating * a.reviewCount)
    .slice(0, 3)
    .map(({ id, slug, name, image }) => ({ id, slug, name, image }));

  const totalReviews = allProducts.reduce(
    (acc, p) => acc + computeRating(p.reviews).reviewCount,
    0,
  );

  const heroConfig = {
    title: cfg.heroTitle,
    subtitle: cfg.heroSubtitle,
    cta1Text: cfg.heroCta1Text,
    cta1Link: cfg.heroCta1Link,
    cta2Text: cfg.heroCta2Text,
    cta2Link: cfg.heroCta2Link,
    promoLabel: cfg.heroPromoLabel,
    promoTag: cfg.heroPromoTag,
    promoLink: cfg.heroPromoLink,
  };

  const slides: Slide[] =
    activeBanners.length > 0
      ? activeBanners.map((b) => ({
          id: b.id,
          tag: b.tag,
          title: b.title,
          subtitle: b.subtitle,
          ctaText: b.ctaText,
          ctaLink: b.ctaLink,
          bgFrom: b.bgFrom,
          bgTo: b.bgTo,
        }))
      : DEFAULT_SLIDES;

  return (
    <>
      {/* ── Announcement Bar ──────────────────────────────────────────────── */}
      {cfg.announcementText && (
        <AnnouncementBar
          text={cfg.announcementText}
          link={cfg.announcementLink}
          color={cfg.announcementColor}
        />
      )}

      {/* ── Hero Slideshow ────────────────────────────────────────────────── */}
      <HeroSlideshow slides={slides} />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <Hero
        leftProducts={leftProducts.length >= 2 ? leftProducts : fallback}
        rightProducts={rightProducts.length >= 2 ? rightProducts : fallback}
        config={heroConfig}
      />

      {/* ── Trust Strip ───────────────────────────────────────────────────── */}
      <TrustStrip />

      {/* ── Marketplace stats ─────────────────────────────────────────────── */}
      {allProducts.length > 0 && (
        <section className="border-b border-t border-black/[0.05] bg-white py-5">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-8 px-4 sm:gap-12 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <ShoppingBag className="h-4 w-4" />
              </span>
              <div className="leading-none">
                <p className="text-lg font-black tracking-tight">{allProducts.length}+</p>
                <p className="text-xs text-neutral-500">Products</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Users className="h-4 w-4" />
              </span>
              <div className="leading-none">
                <p className="text-lg font-black tracking-tight">{sellerCount}</p>
                <p className="text-xs text-neutral-500">Verified Sellers</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Star className="h-4 w-4" />
              </span>
              <div className="leading-none">
                <p className="text-lg font-black tracking-tight">{totalReviews}+</p>
                <p className="text-xs text-neutral-500">Verified Reviews</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <TrendingUp className="h-4 w-4" />
              </span>
              <div className="leading-none">
                <p className="text-lg font-black tracking-tight">UAE</p>
                <p className="text-xs text-neutral-500">Same-day Delivery</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Collections (editorial) ──────────────────────────────── */}
      <FeaturedCollections />

      {/* ── Shop by Category ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-4 pt-4 sm:px-6 lg:px-8">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{dict.home.shopByCategory}</h2>
            <p className="mt-1 text-sm text-neutral-500">Find exactly what you need</p>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:underline"
          >
            {dict.common.viewAll} <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {categoryRows.map(({ category, count, thumbnail }) => {
            const palette = getCategoryPalette(category);
            const Icon = CATEGORY_ICONS[category] ?? ShoppingBag;
            const description = CATEGORY_DESCRIPTIONS[category] ?? "";
            return (
              <Link
                key={category}
                href={`/products?category=${encodeURIComponent(category)}`}
                className="group flex items-center justify-between overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm transition-all duration-200 hover:border-black/[0.1] hover:shadow-lg hover:shadow-black/[0.06]"
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
                    <p className="mt-2.5 flex items-center gap-1 text-xs font-semibold text-indigo-600">
                      {count} {dict.shop.products}{" "}
                      <ArrowRight className="h-3 w-3 transition-transform duration-150 group-hover:translate-x-0.5 rtl:rotate-180" />
                    </p>
                  </div>
                </div>
                {thumbnail && (
                  <div className="relative ms-4 h-20 w-20 shrink-0 overflow-hidden rounded-xl shadow-sm">
                    <Image
                      src={thumbnail}
                      alt={category}
                      fill
                      sizes="80px"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Best Sellers ──────────────────────────────────────────────────── */}
      {cfg.showBestSellers && bestSellers.length > 0 && (
        <PersonalizationShelf
          title="Best Sellers"
          subtitle="Our most loved products, trusted by thousands"
          tag="Top Rated"
          products={bestSellers}
          viewAllHref="/products?sort=rating"
        />
      )}

      {/* ── Why Zyventa ───────────────────────────────────────────────────── */}
      <WhyZyventa />

      {/* ── Brand Showcase ────────────────────────────────────────────────── */}
      {cfg.showBrands && <BrandShowcase />}

      {/* ── Category product rows ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-16">
          {categoryRows.map(({ category, products }) => {
            if (products.length === 0) return null;
            const palette = getCategoryPalette(category);
            return (
              <div key={category}>
                <div className="mb-7 flex items-end justify-between border-b border-black/[0.05] pb-4">
                  <div className="flex items-center gap-3">
                    <span className={`h-5 w-1.5 rounded-full bg-gradient-to-b ${palette.gradient}`} />
                    <div>
                      <h3 className="text-xl font-black tracking-tight">{category}</h3>
                      <p className="mt-0.5 text-xs text-neutral-500">{CATEGORY_DESCRIPTIONS[category] ?? ""}</p>
                    </div>
                  </div>
                  <Link
                    href={`/products?category=${encodeURIComponent(category)}`}
                    className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:underline"
                  >
                    {dict.common.viewAll} <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
                  {products.map((product, i) => (
                    <ProductCard key={product.id} index={i} product={product} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── New Arrivals ──────────────────────────────────────────────────── */}
      {cfg.showNewArrivals && newArrivals.length > 0 && (
        <PersonalizationShelf
          title="New Arrivals"
          subtitle="The latest additions to our marketplace"
          tag="Just In"
          products={newArrivals}
          viewAllHref="/products?sort=newest"
        />
      )}

      {/* ── Customer Reviews ──────────────────────────────────────────────── */}
      {cfg.showTestimonials && <CustomerReviews />}

      {/* ── Health Journal / Articles ─────────────────────────────────────── */}
      {cfg.showArticles && <ArticlesSection />}

      {/* ── Newsletter ────────────────────────────────────────────────────── */}
      {cfg.showNewsletter && <NewsletterSection />}

      {/* ── Seller CTA ────────────────────────────────────────────────────── */}
      <SellerCtaBanner />
    </>
  );
}
