import { redirect } from "next/navigation";
import { Truck } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getEstimatedDelivery } from "@/lib/delivery";
import { TrackingLineItem } from "@/components/orders/tracking-line-item";

export default async function OrderTrackingPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account/tracking");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-orange-500 text-white">
          <Truck className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Order tracking</h1>
          <p className="mt-1 text-neutral-500">Where your orders are and when they&apos;ll arrive.</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <p className="mt-16 text-center text-neutral-500">You haven&apos;t placed any orders yet.</p>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {orders.map((order) => {
            const estimatedDelivery = getEstimatedDelivery(order);
            return (
              <div
                key={order.id}
                className="rounded-2xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-neutral-900"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/5 pb-3 text-sm dark:border-white/10">
                  <span className="font-mono text-neutral-500">#{order.id.slice(-8)}</span>
                  <span className="text-neutral-500">
                    {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(order.createdAt)}
                  </span>
                </div>
                <div className="flex flex-col gap-2 py-3">
                  {order.items.map((item) => (
                    <TrackingLineItem
                      key={item.id}
                      item={{
                        id: item.id,
                        name: item.name,
                        quantity: item.quantity,
                        status: item.status,
                        estimatedDelivery,
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
