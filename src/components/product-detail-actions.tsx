"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { WishlistButton } from "@/components/wishlist-button";

type Props = {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    image: string;
    codAvailable: boolean;
  };
  stock: number;
  isWishlisted?: boolean;
};

export function ProductDetailActions({ product, stock, isWishlisted = false }: Props) {
  const [quantity, setQuantity] = useState(1);

  if (stock <= 0) {
    return (
      <div className="flex flex-col gap-3">
        <AddToCartButton product={product} disabled />
        <WishlistButton productId={product.id} initialWishlisted={isWishlisted} variant="full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <div className="flex items-center gap-2 rounded-full border border-black/10 px-2 py-1.5 dark:border-white/15">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-black/5 disabled:opacity-30 dark:hover:bg-white/10"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </motion.button>
          <span className="w-6 text-center font-semibold tabular-nums">{quantity}</span>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
            disabled={quantity >= stock}
            className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-black/5 disabled:opacity-30 dark:hover:bg-white/10"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </motion.button>
        </div>
        <div className="flex-1">
          <AddToCartButton product={product} quantity={quantity} />
        </div>
      </div>
      <WishlistButton productId={product.id} initialWishlisted={isWishlisted} variant="full" />
    </div>
  );
}
