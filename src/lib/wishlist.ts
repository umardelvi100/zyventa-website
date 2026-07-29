import { prisma } from "@/lib/prisma";

export async function getWishlistedIds(userId: string | undefined) {
  if (!userId) return new Set<string>();
  const items = await prisma.wishlistItem.findMany({
    where: { userId },
    select: { productId: true },
  });
  return new Set(items.map((i) => i.productId));
}
