"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore, cartTotal } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { useHasMounted } from "@/lib/use-has-mounted";
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE } from "@/lib/shipping";
import { useLocale } from "@/components/locale-provider";

export default function CartPage() {
  const { dict } = useLocale();
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const mounted = useHasMounted();
  const [stockMap, setStockMap] = useState<Record<string, number>>({});

  const productIds = items.map((i) => i.productId).join(",");
  useEffect(() => {
    if (!productIds) return;
    fetch(`/api/products/stock?ids=${encodeURIComponent(productIds)}`)
      .then((res) => res.json())
      .then((data) => setStockMap(data.stock ?? {}))
      .catch(() => {});
  }, [productIds]);

  if (!mounted) return null;

  const total = cartTotal(items);
  const freeShippingLeft = Math.max(0, FREE_SHIPPING_THRESHOLD - total);

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-32 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800"
        >
          <ShoppingBag className="h-9 w-9 text-neutral-400" />
        </motion.div>
        <h1 className="text-2xl font-bold">{dict.cart.emptyCart}</h1>
        <p className="mt-2 text-neutral-500">{dict.cart.emptyCartSubtitle}</p>
        <Link
          href="/products"
          className="mt-6 flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 dark:bg-white dark:text-neutral-950"
        >
          {dict.home.startShopping} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black tracking-tight">{dict.cart.yourCart}</h1>

      {freeShippingLeft > 0 ? (
        <p className="mt-3 text-sm text-neutral-500">
          {dict.cart.addMorePrefix}{" "}
          <span className="font-semibold text-indigo-700 dark:text-indigo-400">{formatPrice(freeShippingLeft)}</span>{" "}
          {dict.cart.addMoreSuffix}
        </p>
      ) : (
        <p className="mt-3 text-sm font-medium text-emerald-600">{dict.cart.freeShippingUnlocked}</p>
      )}

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {items.map((item) => {
              const availableStock = stockMap[item.productId];
              const atStockLimit = typeof availableStock === "number" && item.quantity >= availableStock;
              const exceedsStock = typeof availableStock === "number" && item.quantity > availableStock;
              return (
              <motion.div
                key={item.productId}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -40, transition: { duration: 0.2 } }}
                className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-4 dark:border-white/10 dark:bg-neutral-900"
              >
                <Link href={`/products/${item.slug}`} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
                  <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                </Link>

                <div className="min-w-0 flex-1">
                  <Link href={`/products/${item.slug}`} className="line-clamp-1 font-semibold hover:underline">
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-neutral-500">{formatPrice(item.price)}</p>
                  {exceedsStock && (
                    <p className="mt-1 text-xs font-semibold text-red-600 dark:text-red-400">
                      Not enough stock — reduce quantity
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 rounded-full border border-black/10 px-1.5 py-1 dark:border-white/15">
                  <button
                    onClick={() => setQuantity(item.productId, item.quantity - 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-black/5 dark:hover:bg-white/10"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-5 text-center text-sm font-semibold tabular-nums">{item.quantity}</span>
                  <button
                    onClick={() => !atStockLimit && setQuantity(item.productId, item.quantity + 1)}
                    disabled={atStockLimit}
                    className="flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-black/5 disabled:opacity-30 dark:hover:bg-white/10"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <p className="w-20 text-end font-semibold">{formatPrice(item.price * item.quantity)}</p>

                <button
                  onClick={() => removeItem(item.productId)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <motion.div
          layout
          className="h-fit rounded-2xl border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-neutral-900"
        >
          <h2 className="font-bold">{dict.cart.orderSummary}</h2>
          <div className="mt-4 flex justify-between text-sm text-neutral-500">
            <span>{dict.cart.subtotal}</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm text-neutral-500">
            <span>{dict.cart.shipping}</span>
            <span>{freeShippingLeft > 0 ? formatPrice(STANDARD_SHIPPING_FEE) : dict.cart.free}</span>
          </div>
          <div className="mt-4 flex justify-between border-t border-black/5 pt-4 font-bold dark:border-white/10">
            <span>{dict.cart.total}</span>
            <span>{formatPrice(total + (freeShippingLeft > 0 ? STANDARD_SHIPPING_FEE : 0))}</span>
          </div>
          <Link href="/checkout">
            <motion.span
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-6 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-orange-500 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/30"
            >
              {dict.checkout.checkout} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
