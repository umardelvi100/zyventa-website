import { formatPrice } from "@/lib/format";

export type OrderLineItemData = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  status: string;
};

const STATUS_LABELS: Record<string, string> = {
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  return_requested: "Return requested",
  return_approved: "Return approved",
  refunded: "Refunded",
};

const STATUS_STYLES: Record<string, string> = {
  processing: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
  shipped: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400",
  delivered: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400",
  return_requested: "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400",
  return_approved: "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400",
  refunded: "bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
};

export function OrderLineItem({ item }: { item: OrderLineItemData }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-black/5 p-4 dark:border-white/10">
      <span className="text-sm text-neutral-600 dark:text-neutral-400">
        {item.name} × {item.quantity}
      </span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[item.status] ?? "bg-neutral-100 text-neutral-600"}`}>
          {STATUS_LABELS[item.status] ?? item.status}
        </span>
      </div>
    </div>
  );
}
