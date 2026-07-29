"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCartStore } from "@/lib/cart-store";

type Props = {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    image: string;
    codAvailable: boolean;
  };
  quantity?: number;
  compact?: boolean;
  disabled?: boolean;
};

export function AddToCartButton({ product, quantity = 1, compact = false, disabled = false }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.image,
        codAvailable: product.codAvailable,
      },
      quantity,
    );
    toast.success(`Added ${product.name} to cart`);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  }

  if (compact) {
    return (
      <motion.button
        onClick={handleAdd}
        whileTap={disabled ? undefined : { scale: 0.85 }}
        disabled={disabled}
        className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
          disabled
            ? "cursor-not-allowed bg-neutral-200 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-600"
            : "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-white dark:text-neutral-950"
        }`}
        aria-label={disabled ? `${product.name} is out of stock` : `Add ${product.name} to cart`}
      >
        <motion.span
          key={justAdded ? "check" : "cart"}
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          {justAdded ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
        </motion.span>
      </motion.button>
    );
  }

  if (disabled) {
    return (
      <button
        disabled
        className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-neutral-200 px-6 py-3.5 font-semibold text-neutral-400 dark:bg-neutral-800 dark:text-neutral-600"
      >
        Out of stock
      </button>
    );
  }

  return (
    <motion.button
      onClick={handleAdd}
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-orange-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:shadow-xl hover:shadow-indigo-500/40"
    >
      {justAdded ? (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex items-center gap-2"
        >
          <Check className="h-5 w-5" /> Added to cart
        </motion.span>
      ) : (
        <span className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" /> Add to cart
        </span>
      )}
    </motion.button>
  );
}
