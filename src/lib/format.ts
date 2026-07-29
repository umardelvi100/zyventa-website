export function formatPrice(fils: number) {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
  }).format(fils / 100);
}
