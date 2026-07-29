export const REGULATED_CATEGORIES = ["Medicines", "Cosmetics"];

export function isRegulatedCategory(category: string) {
  return REGULATED_CATEGORIES.includes(category);
}
