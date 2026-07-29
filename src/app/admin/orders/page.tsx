import { redirect } from "next/navigation";
import Image from "next/image";
import { Package } from "lucide-react";
import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { OrderTracker } from "@/components/orders/order-tracker";

const STATUS_STYLES: Record<string, string> = {
  processing: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
  shipped: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400",
  delivered: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400",
  return_requested: "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400",
  return_approved: "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400",
  refunded: "bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
};

export default async function AdminOrdersPage() {
  const ctx = await requireAdmin();
  if (!ctx) redirect("/");

  const orderItems = await prisma.orderItem.findMany({
    include: {
      order: { include: { user: true } },
      product: { include: { seller: { select: { storeName: true } } } },
      returns: { orderBy: { createdAt: "desc" }, take: 1, include: { images: true } },
      warrantyClaims: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { id: "desc" },
  });

  const counts = orderItems.reduce<Record<string, number>>((acc, item) => {
    acc[item.status] = (acc[item.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-orange-500 text-white">
          <Package className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Order tracking</h1>
          <p className="text-sm text-neutral-500">{orderItems.length} order items across the platform</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 text-xs">
        {Object.entries(counts).map(([status, count]) => (
          <span
            key={status}
            className={`rounded-full px-3 py-1 font-semibold capitalize ${STATUS_STYLES[status] ?? "bg-neutral-100 text-neutral-600"}`}
          >
            {status.replace("_", " ")}: {count}
          </span>
        ))}
      </div>

      {orderItems.length === 0 ? (
        <p className="mt-16 text-center text-neutral-500">No orders placed yet.</p>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {orderItems.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-neutral-900"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    {item.name} × {item.quantity}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {formatPrice(item.price * item.quantity)} · Buyer: {item.order.user.name} (
                    {item.order.user.email}) · Seller: {item.product.seller.storeName}
                  </p>
                  <p className="text-xs text-neutral-400">
                    Order #{item.orderId.slice(-8)} · Ship to {item.order.shippingAddress}, {item.order.shippingCity}{" "}
                    {item.order.shippingZip} ·{" "}
                    {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(item.order.createdAt)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[item.status] ?? "bg-neutral-100 text-neutral-600"}`}
                >
                  {item.status.replace("_", " ")}
                </span>
              </div>

              {!["cancelled", "return_requested", "return_approved", "refunded"].includes(item.status) && (
                <div className="mt-4 max-w-xs">
                  <OrderTracker status={item.status} />
                </div>
              )}

              {item.status === "cancelled" && (
                <p className="mt-3 text-xs text-red-600 dark:text-red-400">
                  Cancelled by buyer{item.cancelReason ? `: "${item.cancelReason}"` : ""}
                </p>
              )}

              {item.returns[0] && (
                <div className="mt-3 text-xs text-orange-600 dark:text-orange-400">
                  <p>
                    Return {item.returns[0].status}: {item.returns[0].reason}
                    {item.returns[0].details ? ` — "${item.returns[0].details}"` : ""}
                  </p>
                  {item.returns[0].images.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {item.returns[0].images.map((img) => (
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
                </div>
              )}
              {item.warrantyClaims[0] && (
                <p className="mt-2 text-xs text-indigo-600 dark:text-indigo-400">
                  Warranty claim {item.warrantyClaims[0].status}: &quot;{item.warrantyClaims[0].issue}&quot;
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
