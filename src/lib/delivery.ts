export const STANDARD_DELIVERY_DAYS = 4;

export function getEstimatedDelivery(order: { createdAt: Date; estimatedDeliveryAt: Date | null }): Date {
  return order.estimatedDeliveryAt ?? new Date(order.createdAt.getTime() + STANDARD_DELIVERY_DAYS * 24 * 60 * 60 * 1000);
}

export function formatEstimatedDelivery(date: Date): string {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
}
