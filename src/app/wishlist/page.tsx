import Link from "next/link";
import { redirect } from "next/navigation";
import { Heart } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { computeRating } from "@/lib/ratings";
import { getEffectiveCod } from "@/lib/cod";
import { ProductCard } from "@/components/product-card";

export default async function WishlistPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/wishlist");

  const items = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        include: { reviews: { select: { rating: true } }, seller: { select: { codAvailable: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black tracking-tight">Your wishlist</h1>
      <p className="mt-2 text-neutral-500">{items.length} saved products</p>

      {items.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <Heart className="h-10 w-10 text-neutral-300" />
          <p className="mt-4 text-neutral-500">Nothing saved yet — tap the heart on any product.</p>
          <Link
            href="/products"
            className="mt-6 rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 dark:bg-white dark:text-neutral-950"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {items.map(({ product }, i) => {
            const { avgRating, reviewCount } = computeRating(product.reviews);
            return (
              <ProductCard
                key={product.id}
                index={i}
                product={{
                  ...product,
                  avgRating,
                  reviewCount,
                  codAvailable: getEffectiveCod(product, product.seller),
                  isWishlisted: true,
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
