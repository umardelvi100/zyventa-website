import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { SellerCtaBanner } from "@/components/seller-cta-banner";
import { FeaturedCollections } from "@/components/home/featured-collections";
import { WhyZyventa } from "@/components/home/why-zyventa";
import { CustomerReviews } from "@/components/home/customer-reviews";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { PersonalizationShelf } from "@/components/home/personalization-shelf";
import { AnnouncementBar } from "@/components/home/announcement-bar";
import { HeroSlideshow, type Slide } from "@/components/home/hero-slideshow";
import { SearchStrip } from "@/components/home/search-strip";
import { TrustStatsBar } from "@/components/home/trust-stats-bar";
import { CategoryBrowser } from "@/components/home/category-browser";
import { computeRating } from "@/lib/ratings";
import { getWishlistedIds } from "@/lib/wishlist";
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

export default async function Home() {
  const session = await auth();
  const userId = session?.user?.id;
  const dict = getDictionary(await getLocale());

  const [cfg, activeBanners, allProducts, categories, wishlistedIds, sellerCount, brands] = await Promise.all([
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
    prisma.seller.findMany({
      where: { verificationStatus: "approved" },
      select: { id: true, storeName: true },
      take: 6,
    }),
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

  const totalReviews = allProducts.reduce(
    (acc, p) => acc + computeRating(p.reviews).reviewCount,
    0,
  );

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

      {/* ── Search strip ──────────────────────────────────────────────────── */}
      <SearchStrip />

      {/* ── Trust + stats ─────────────────────────────────────────────────── */}
      {allProducts.length > 0 && (
        <TrustStatsBar productCount={allProducts.length} sellerCount={sellerCount} reviewCount={totalReviews} />
      )}

      {/* ── Featured Collections (editorial) ──────────────────────────────── */}
      <FeaturedCollections />

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

      {/* ── Category browser (tabbed) ───────────────────────────────────── */}
      <CategoryBrowser rows={categoryRows} viewAllLabel={dict.common.viewAll} />

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

      {/* ── Why Zyventa + Brand Showcase ────────────────────────────────── */}
      <WhyZyventa brands={brands} showBrands={cfg.showBrands} />

      {/* ── Customer Reviews ──────────────────────────────────────────────── */}
      {cfg.showTestimonials && <CustomerReviews />}

      {/* ── Newsletter ────────────────────────────────────────────────────── */}
      {cfg.showNewsletter && <NewsletterSection />}

      {/* ── Seller CTA ────────────────────────────────────────────────────── */}
      <SellerCtaBanner />
    </>
  );
}
