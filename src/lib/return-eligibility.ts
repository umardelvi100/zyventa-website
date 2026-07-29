type ReturnEligibilityItem = {
  status: string;
  warrantyMonths: number | null;
  activeReturn: unknown;
  activeClaim: unknown;
};

export function isRelevantForReturnsTab(item: ReturnEligibilityItem): boolean {
  const canCancel = item.status === "processing";
  const canReturn = item.status === "delivered" && !item.activeReturn;
  const canClaimWarranty = Boolean(item.warrantyMonths) && item.status === "delivered" && !item.activeClaim;
  return (
    canCancel ||
    canReturn ||
    canClaimWarranty ||
    Boolean(item.activeReturn) ||
    Boolean(item.activeClaim) ||
    item.status === "cancelled"
  );
}
