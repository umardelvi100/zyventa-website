export function computeRating(reviews: { rating: number }[]) {
  if (reviews.length === 0) return { avgRating: 0, reviewCount: 0 };
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  return { avgRating, reviewCount: reviews.length };
}
