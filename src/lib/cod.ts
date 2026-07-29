export function getEffectiveCod(product: { codOverride: boolean | null }, seller: { codAvailable: boolean }) {
  return product.codOverride ?? seller.codAvailable;
}
