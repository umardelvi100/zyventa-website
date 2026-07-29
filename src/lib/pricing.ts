export type PromotableProduct = {
  price: number;
  discountPercent: number | null;
  promotionEndsAt: Date | null;
  promotionLabel: string | null;
};

export function isPromotionActive(product: PromotableProduct) {
  if (!product.discountPercent) return false;
  if (product.promotionEndsAt && product.promotionEndsAt.getTime() < Date.now()) return false;
  return true;
}

export function getEffectivePrice(product: PromotableProduct) {
  if (isPromotionActive(product)) {
    const finalPrice = Math.round(product.price * (1 - product.discountPercent! / 100));
    return { finalPrice, originalPrice: product.price, isDiscounted: true };
  }
  return { finalPrice: product.price, originalPrice: product.price, isDiscounted: false };
}
