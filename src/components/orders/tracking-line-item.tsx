import { OrderTracker } from "@/components/orders/order-tracker";
import { formatEstimatedDelivery } from "@/lib/delivery";

export type TrackingLineItemData = {
  id: string;
  name: string;
  quantity: number;
  status: string;
  estimatedDelivery: Date;
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

const TRACKABLE_STATUSES = ["processing", "shipped", "delivered"];

const NON_TRACKABLE_NOTES: Record<string, string> = {
  cancelled: "This order was cancelled.",
  return_requested: "Return in progress — see Cancellations & Returns.",
  return_approved: "Return approved — see Cancellations & Returns.",
  refunded: "Refunded.",
};

export function TrackingLineItem({ item }: { item: TrackingLineItemData }) {
  return (
    <div className="rounded-xl border border-black/5 p-4 dark:border-white/10">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm text-neutral-600 dark:text-neutral-400">
          {item.name} × {item.quantity}
        </span>
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[item.status] ?? "bg-neutral-100 text-neutral-600"}`}>
          {STATUS_LABELS[item.status] ?? item.status}
        </span>
      </div>

      {TRACKABLE_STATUSES.includes(item.status) ? (
        <>
          <div className="mt-3">
            <OrderTracker status={item.status} />
          </div>
          {item.status !== "delivered" && (
            <p className="mt-2 text-xs text-neutral-500">
              Estimated delivery:{" "}
              <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                {formatEstimatedDelivery(item.estimatedDelivery)}
              </span>
            </p>
          )}
        </>
      ) : (
        <p className="mt-3 text-xs text-neutral-500">{NON_TRACKABLE_NOTES[item.status] ?? item.status}</p>
      )}
    </div>
  );
}
