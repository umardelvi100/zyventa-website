"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
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
      whileHover={{ y: -6 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm transition-shadow hover:shadow-xl hover:shadow-indigo-500/10 dark:border-white/10 dark:bg-neutral-900"
    >
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <motion.div whileHover={{ scale: 1.06 }} transition={{ duration: 0.4 }} className="relative h-full w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className={`object-cover ${outOfStock ? "opacity-50 grayscale" : ""}`}
          />
        </motion.div>
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full bg-neutral-900/80 px-3 py-1.5 text-xs font-bold text-white">
              Out of stock
            </span>
          </div>
        )}
        <span className={`absolute start-3 top-3 rounded-full bg-gradient-to-r ${palette.gradient} px-2.5 py-1 text-xs font-semibold text-white shadow backdrop-blur`}>
          {product.category}
        </span>
        {promoActive && (
          <span className="absolute end-3 top-3 rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-2.5 py-1 text-xs font-bold text-white shadow">
            -{product.discountPercent}%
          </span>
        )}
        <div className="absolute bottom-3 end-3">
          <WishlistButton productId={product.id} initialWishlisted={product.isWishlisted} />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-1 font-semibold tracking-tight">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-1 text-xs text-neutral-500">
          {product.reviewCount > 0 ? (
            <>
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {product.avgRating.toFixed(1)}
              <span className="text-neutral-400">({product.reviewCount})</span>
            </>
          ) : (
            <span className="text-neutral-400">{dict.product.noReviewsYet}</span>
          )}
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-lg font-bold">{formatPrice(finalPrice)}</span>
            {promoActive && (
              <span className="text-xs text-neutral-400 line-through">{formatPrice(originalPrice)}</span>
            )}
            {lowStock && (
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                Only a few left
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
