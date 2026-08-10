import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star, ShieldCheck, Truck, RotateCcw, Store, BadgeCheck,
  ZoomIn, ChevronDown, FlaskConical, Leaf, Award,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { formatPrice } from "@/lib/format";
import { getEffectivePrice, isPromotionActive } from "@/lib/pricing";
import { getEffectiveCod } from "@/lib/cod";
import { computeRating } from "@/lib/ratings";
import { getWishlistedIds } from "@/lib/wishlist";
import { ProductDetailActions } from "@/components/product-detail-actions";
import { ProductCard } from "@/components/product-card";
import { WishlistButton } from "@/components/wishlist-button";
import { ReviewList } from "@/components/reviews/review-list";
import { ReviewForm } from "@/components/reviews/review-form";
import { ProductGallery, type GalleryPhoto } from "@/components/product-gallery";

// AI-generated gallery photos for featured products
const PRODUCT_GALLERIES: Record<string, GalleryPhoto[]> = {
  "homehaven-spf50-sunscreen": [
    { src: "https://picsum.photos/seed/spf50-front/800/800",   label: "Front view" },
    { src: "https://picsum.photos/seed/spf50-texture/800/800", label: "Texture & formula" },
    { src: "https://picsum.photos/seed/spf50-apply1/800/800",  label: "Applying to face" },
    { src: "https://picsum.photos/seed/spf50-blend/800/800",   label: "Blending in" },
    { src: "https://picsum.photos/seed/spf50-outdoor/800/800", label: "Outdoor protection" },
    { src: "https://picsum.photos/seed/spf50-routine/800/800", label: "Morning routine" },
  ],
  "gulfmed-collagen-peptides": [
    { src: "https://picsum.photos/seed/collagen-front/800/800",  label: "Product front" },
    { src: "https://picsum.photos/seed/collagen-scoop/800/800",  label: "Powder close-up" },
    { src: "https://picsum.photos/seed/collagen-mix/800/800",    label: "Mixing into drink" },
    { src: "https://picsum.photos/seed/collagen-drink/800/800",  label: "Ready to drink" },
    { src: "https://picsum.photos/seed/collagen-active/800/800", label: "Active lifestyle" },
    { src: "https://picsum.photos/seed/collagen-glow/800/800",   label: "Visible results" },
  ],
};

type KeyFeature = { icon: typeof FlaskConical; label: string; desc: string };

const CATEGORY_FEATURES: Record<string, KeyFeature[]> = {
  Medicines: [
    { icon: BadgeCheck, label: "Clinically Tested", desc: "Evidence-based formula" },
    { icon: ShieldCheck, label: "Regulatory Approved", desc: "Quality & safety certified" },
    { icon: Award, label: "Pharma Grade", desc: "Manufactured to GMP standards" },
  ],
  Cosmetics: [
    { icon: FlaskConical, label: "Dermatologist Tested", desc: "Safe for all skin types" },
    { icon: Leaf, label: "Premium Formula", desc: "Carefully selected ingredients" },
    { icon: BadgeCheck, label: "Quality Assured", desc: "100% authentic product" },
  ],
  Consumables: [
    { icon: BadgeCheck, label: "100% Authentic", desc: "Sourced from verified suppliers" },
    { icon: ShieldCheck, label: "Quality Checked", desc: "Meets safety standards" },
    { icon: Award, label: "Best Value", desc: "Competitive UAE pricing" },
  ],
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      seller: true,
      reviews: { include: { user: true }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!product) notFound();

  const [related, wishlistedIds] = await Promise.all([
    prisma.product.findMany({
      where: { category: product.category, NOT: { id: product.id } },
      take: 4,
      include: { reviews: { select: { rating: true } }, seller: { select: { codAvailable: true } } },
    }),
    getWishlistedIds(session?.user?.id),
  ]);

  const { avgRating, reviewCount } = computeRating(product.reviews);
  const promoActive = isPromotionActive(product);
  const { finalPrice, originalPrice } = getEffectivePrice(product);
  const isWishlisted = wishlistedIds.has(product.id);
  const features = CATEGORY_FEATURES[product.category] ?? CATEGORY_FEATURES["Consumables"];
  const gallery = PRODUCT_GALLERIES[product.slug] ?? null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-neutral-500">
        <Link href="/products" className="hover:underline">Shop</Link>{" "}
        /{" "}
        <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="hover:underline">
          {product.category}
        </Link>{" "}
        / <span className="text-neutral-700 dark:text-neutral-300">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Product image / gallery */}
        {gallery ? (
          <div className="relative">
            {promoActive && (
              <span className="absolute left-4 top-4 z-10 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white shadow">
                {product.promotionLabel || `${product.discountPercent}% OFF`}
              </span>
            )}
            <div className="absolute right-4 top-4 z-10">
              <WishlistButton productId={product.id} initialWishlisted={isWishlisted} />
            </div>
            <ProductGallery photos={gallery} productName={product.name} />
          </div>
        ) : (
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-neutral-100 dark:bg-neutral-800">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              priority
            />
            {promoActive && (
              <span className="absolute left-4 top-4 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white shadow">
                {product.promotionLabel || `${product.discountPercent}% OFF`}
              </span>
            )}
            <div className="absolute right-4 top-4">
              <WishlistButton productId={product.id} initialWishlisted={isWishlisted} />
            </div>
            <span className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow backdrop-blur dark:bg-neutral-900/80 dark:text-neutral-200">
              <ZoomIn className="h-3.5 w-3.5" /> Zoom in
            </span>
          </div>
        )}

        {/* Product info */}
        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-wide text-indigo-600 uppercase dark:text-indigo-400">
            {product.category}
          </span>
          <h1 className="mt-1 text-3xl font-black tracking-tight">{product.name}</h1>
          <p className="mt-1.5 text-neutral-500 dark:text-neutral-400">{product.overview}</p>

          <Link
            href="#"
            className="mt-2 flex w-fit items-center gap-1.5 text-sm font-medium text-neutral-600 hover:underline dark:text-neutral-400"
          >
            <Store className="h-3.5 w-3.5" /> Sold by {product.seller.storeName}
          </Link>

          <div className="mt-3 flex items-center gap-2 text-sm">
            {reviewCount > 0 ? (
              <>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "text-neutral-200 dark:text-neutral-700"}`}
                    />
                  ))}
                </div>
                <span className="font-semibold">{avgRating.toFixed(1)}</span>
                <span className="text-neutral-500">
                  ({reviewCount} review{reviewCount === 1 ? "" : "s"})
                </span>
              </>
            ) : (
              <span className="text-neutral-500">No reviews yet</span>
            )}
            {product.stock <= 0 ? (
              <span className="font-semibold text-red-600 dark:text-red-400">· Out of stock</span>
            ) : product.stock <= 5 ? (
              <span className="font-semibold text-amber-600 dark:text-amber-400">· Only a few left</span>
            ) : (
              <span className="text-neutral-400">· In stock</span>
            )}
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <p className="text-3xl font-bold">{formatPrice(finalPrice)}</p>
            {promoActive && (
              <p className="text-lg text-neutral-400 line-through">{formatPrice(originalPrice)}</p>
            )}
          </div>

          {/* KEY FEATURES */}
          <div className="mt-6">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-neutral-400">Key features</p>
            <div className="grid grid-cols-3 gap-2.5">
              {features.map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-black/5 bg-neutral-50 p-3 text-center dark:border-white/10 dark:bg-neutral-900"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950/40">
                    <Icon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </span>
                  <div>
                    <p className="text-[11px] font-bold leading-tight">{label}</p>
                    <p className="mt-0.5 text-[10px] text-neutral-400 leading-tight">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-7">
            <ProductDetailActions
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                price: finalPrice,
                image: product.image,
                codAvailable: getEffectiveCod(product, product.seller),
              }}
              stock={product.stock}
              isWishlisted={isWishlisted}
            />
          </div>

          {/* Shipping/returns/warranty mini-cards */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-2.5 rounded-2xl border border-black/5 p-3 text-sm dark:border-white/10">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                <Truck className="h-4 w-4" />
              </span>
              <div>
                <p className="font-semibold text-xs">Free shipping</p>
                <p className="text-[11px] text-neutral-500">Over AED 200</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 rounded-2xl border border-black/5 p-3 text-sm dark:border-white/10">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
                <RotateCcw className="h-4 w-4" />
              </span>
              <div>
                <p className="font-semibold text-xs">Easy returns</p>
                <p className="text-[11px] text-neutral-500">On eligible orders</p>
              </div>
            </div>
            {product.warrantyMonths ? (
              <div className="flex items-center gap-2.5 rounded-2xl border border-black/5 p-3 text-sm dark:border-white/10">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <BadgeCheck className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-semibold text-xs">Warranty</p>
                  <p className="text-[11px] text-neutral-500">{product.warrantyMonths} months</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 rounded-2xl border border-black/5 p-3 text-sm dark:border-white/10">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-semibold text-xs">Secure checkout</p>
                  <p className="text-[11px] text-neutral-500">Every order protected</p>
                </div>
              </div>
            )}
          </div>

          {/* Accordion */}
          <div className="mt-6 flex flex-col divide-y divide-black/5 border-y border-black/5 dark:divide-white/10 dark:border-white/10">
            <details open className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-sm">
                Product details
                <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {product.description}
              </p>
            </details>
            <details className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-sm">
                Shipping &amp; returns
                <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
              </summary>
              <ul className="mt-3 flex flex-col gap-1.5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                <li>Free shipping on orders over AED 200.</li>
                <li>Same-day delivery available across Dubai.</li>
                <li>Eligible items can be returned after delivery.</li>
                {product.warrantyMonths && (
                  <li>Covered by a {product.warrantyMonths}-month manufacturer warranty.</li>
                )}
              </ul>
            </details>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-bold tracking-tight">
          Reviews {reviewCount > 0 && `(${reviewCount})`}
        </h2>
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <ReviewList
            reviews={product.reviews.map((r) => ({
              id: r.id,
              rating: r.rating,
              title: r.title,
              body: r.body,
              createdAt: r.createdAt,
              userName: r.user.name,
            }))}
          />
          <ReviewForm productId={product.id} />
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 text-2xl font-bold tracking-tight">You might also like</h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {related.map((p, i) => {
              const rel = computeRating(p.reviews);
              return (
                <ProductCard
                  key={p.id}
                  index={i}
                  product={{
                    ...p,
                    avgRating: rel.avgRating,
                    reviewCount: rel.reviewCount,
                    codAvailable: getEffectiveCod(p, p.seller),
                    isWishlisted: wishlistedIds.has(p.id),
                  }}
                />
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
