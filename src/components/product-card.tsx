"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Banknote } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { getEffectivePrice, isPromotionActive } from "@/lib/pricing";
import { getCategoryPalette } from "@/lib/category-colors";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { WishlistButton } from "@/components/wishlist-button";
import { useLocale } from "@/components/locale-provider";

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  overview?: string | null;
  price: number;
  image: string;
  category: string;
  avgRating: number;
  reviewCount: number;
  discountPercent: number | null;
  promotionEndsAt: Date | null;
  promotionLabel: string | null;
  isWishlisted?: boolean;
  codAvailable: boolean;
  stock: number;
};

const LOW_STOCK_THRESHOLD = 5;

export function ProductCard({ product, index = 0 }: { product: ProductCardData; index?: number }) {
  const { dict } = useLocale();
  const promoActive = isPromotionActive(product);
  const { finalPrice, originalPrice } = getEffectivePrice(product);
  const palette = getCategoryPalette(product.category);
  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= LOW_STOCK_THRESHOLD;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index, 8) * 0.04 }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-sm transition-all duration-300 hover:border-black/[0.1] hover:shadow-xl hover:shadow-neutral-900/8 dark:border-white/10 dark:bg-neutral-900"
    >
      {/* Image area */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-800"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative h-full w-full"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className={`object-cover transition-opacity duration-300 ${outOfStock ? "opacity-40 grayscale" : ""}`}
          />
        </motion.div>

        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full bg-neutral-900/75 px-3 py-1.5 text-xs font-semibold tracking-wide text-white backdrop-blur-sm">
              Out of stock
            </span>
          </div>
        )}

        {/* Category badge */}
        <span
          className={`absolute start-2.5 top-2.5 rounded-full bg-gradient-to-r ${palette.gradient} px-2.5 py-1 text-[11px] font-bold tracking-wide text-white shadow-sm`}
        >
          {product.category}
        </span>

        {/* Discount badge */}
        {promoActive && (
          <span className="absolute end-2.5 top-2.5 rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
            -{product.discountPercent}%
          </span>
        )}

        {/* Wishlist */}
        <div className="absolute bottom-2.5 end-2.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <WishlistButton productId={product.id} initialWishlisted={product.isWishlisted} />
        </div>
      </Link>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="line-clamp-1 font-semibold leading-snug tracking-tight transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
            {product.name}
          </h3>
        </Link>

        {product.overview && (
          <p className="line-clamp-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            {product.overview}
          </p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1 text-xs text-neutral-500">
          {product.reviewCount > 0 ? (
            <>
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-medium text-neutral-700 dark:text-neutral-300">
                {product.avgRating.toFixed(1)}
              </span>
              <span className="text-neutral-400">({product.reviewCount})</span>
            </>
          ) : (
            <span className="text-neutral-400">{dict.product.noReviewsYet}</span>
          )}
        </div>

        {/* Price row */}
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-lg font-black leading-none tracking-tight">{formatPrice(finalPrice)}</span>
            {promoActive && (
              <span className="text-xs text-neutral-400 line-through">{formatPrice(originalPrice)}</span>
            )}
            {lowStock && (
              <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">Only a few left</span>
            )}
            {product.codAvailable && (
              <span className="flex items-center gap-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                <Banknote className="h-3 w-3" /> COD
              </span>
            )}
          </div>
          <AddToCartButton
            disabled={outOfStock}
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: finalPrice,
              image: product.image,
              codAvailable: product.codAvailable,
            }}
            compact
          />
        </div>
      </div>
    </motion.div>
  );
}
