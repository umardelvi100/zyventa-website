export const RETURN_REASONS = [
  "Item arrived damaged",
  "Box or packaging was damaged",
  "Item is defective or doesn't work",
  "Wrong item received",
  "Missing parts or accessories",
  "Item not as described",
  "No longer needed",
  "Found a better price elsewhere",
  "Arrived too late",
  "Other",
] as const;

export type ReturnReason = (typeof RETURN_REASONS)[number];

export function isValidReturnReason(value: string): value is ReturnReason {
  return (RETURN_REASONS as readonly string[]).includes(value);
}
