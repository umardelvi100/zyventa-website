"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { formatPrice } from "@/lib/format";
import { OrderTracker } from "@/components/orders/order-tracker";

export type SellerOrderItemData = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  status: string;
  warrantyMonths: number | null;
  cancelReason: string | null;
  buyerName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingZip: string;
  createdAt: string;
  activeReturn: {
    id: string;
    reason: string;
    details: string | null;
    status: string;
    images: { url: string }[];
  } | null;
  activeClaim: { id: string; issue: string; status: string } | null;
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

export function SellerOrderItemRow({ item }: { item: SellerOrderItemData }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function updateStatus(status: string) {
    setBusy(true);
    const res = await fetch(`/api/seller/order-items/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusy(false);
    if (!res.ok) {
      toast.error("Could not update status.");
      return;
    }
    toast.success("Order status updated.");
    router.refresh();
  }

  async function resolveReturn(status: "approved" | "rejected" | "refunded") {
    if (!item.activeReturn) return;
    setBusy(true);
    const res = await fetch(`/api/seller/returns/${item.activeReturn.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusy(false);
    if (!res.ok) {
      toast.error("Could not update return.");
      return;
    }
    toast.success("Return updated.");
    router.refresh();
  }

  async function resolveClaim(status: "approved" | "rejected" | "resolved") {
    if (!item.activeClaim) return;
    setBusy(true);
    const res = await fetch(`/api/seller/warranty-claims/${item.activeClaim.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusy(false);
    if (!res.ok) {
      toast.error("Could not update warranty claim.");
      return;
    }
    toast.success("Warranty claim updated.");
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-neutral-900">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold">
            {item.name} × {item.quantity}
          </p>
          <p className="text-sm text-neutral-500">
            {formatPrice(item.price * item.quantity)} · Buyer: {item.buyerName}
          </p>
          <p className="text-xs text-neutral-400">
            Ship to {item.shippingAddress}, {item.shippingCity} {item.shippingZip}
          </p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[item.status] ?? "bg-neutral-100 text-neutral-600"}`}>
          {item.status.replace("_", " ")}
        </span>
      </div>

      {item.status === "cancelled" && (
        <p className="mt-3 text-xs text-red-600 dark:text-red-400">
          Cancelled by buyer{item.cancelReason ? `: "${item.cancelReason}"` : ""}
        </p>
      )}

      {!item.activeReturn && (item.status === "processing" || item.status === "shipped" || item.status === "delivered") && (
        <div className="mt-4 max-w-xs">
          <OrderTracker status={item.status} />
        </div>
      )}

      {!item.activeReturn && (item.status === "processing" || item.status === "shipped" || item.status === "delivered") && (
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs font-medium text-neutral-500">Update status:</span>
          {["processing", "shipped", "delivered"].map((s) => (
            <button
              key={s}
              disabled={busy || item.status === s}
              onClick={() => updateStatus(s)}
              className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition disabled:cursor-default ${
                item.status === s
                  ? "border-indigo-600 bg-indigo-600 text-white dark:border-white dark:bg-white dark:text-neutral-950"
                  : "border-black/10 hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {item.activeReturn && (
        <div className="mt-4 rounded-xl border border-orange-200 bg-orange-50 p-3 text-sm dark:border-orange-900/50 dark:bg-orange-950/30">
          <p className="font-medium text-orange-800 dark:text-orange-300">Return requested</p>
          <p className="mt-1 text-orange-700 dark:text-orange-400">
            {item.activeReturn.reason}
            {item.activeReturn.details ? ` — "${item.activeReturn.details}"` : ""}
          </p>
          {item.activeReturn.images.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {item.activeReturn.images.map((img) => (
                <a key={img.url} href={img.url} target="_blank" rel="noopener noreferrer">
                  <Image
                    src={img.url}
                    alt="Return evidence"
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-lg border border-orange-200 object-cover dark:border-orange-900/50"
                  />
                </a>
              ))}
            </div>
          )}
          {item.activeReturn.status === "requested" && (
            <div className="mt-3 flex gap-2">
              <button
                disabled={busy}
                onClick={() => resolveReturn("approved")}
                className="rounded-full bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-orange-700"
              >
                Approve
              </button>
              <button
                disabled={busy}
                onClick={() => resolveReturn("refunded")}
                className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
              >
                Refund
              </button>
              <button
                disabled={busy}
                onClick={() => resolveReturn("rejected")}
                className="rounded-full border border-orange-300 px-3 py-1.5 text-xs font-semibold text-orange-700 transition hover:bg-orange-100 dark:border-orange-800 dark:text-orange-300"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      )}

      {item.activeClaim && (
        <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-sm dark:border-indigo-900/50 dark:bg-indigo-950/30">
          <p className="font-medium text-indigo-800 dark:text-indigo-300">Warranty claim</p>
          <p className="mt-1 text-indigo-700 dark:text-indigo-400">&quot;{item.activeClaim.issue}&quot;</p>
          {item.activeClaim.status === "submitted" && (
            <div className="mt-3 flex gap-2">
              <button
                disabled={busy}
                onClick={() => resolveClaim("approved")}
                className="rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-700"
              >
                Approve
              </button>
              <button
                disabled={busy}
                onClick={() => resolveClaim("resolved")}
                className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
              >
                Mark resolved
              </button>
              <button
                disabled={busy}
                onClick={() => resolveClaim("rejected")}
                className="rounded-full border border-indigo-300 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100 dark:border-indigo-800 dark:text-indigo-300"
              >
                Reject
              </button>
            </div>
          )}
          {item.activeClaim.status === "approved" && (
            <div className="mt-3 flex gap-2">
              <button
                disabled={busy}
                onClick={() => resolveClaim("resolved")}
                className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
              >
                Mark resolved
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
