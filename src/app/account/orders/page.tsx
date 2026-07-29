import Link from "next/link";
import { redirect } from "next/navigation";
import { Package } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { OrderLineItem } from "@/components/orders/order-line-item";

const PAYMENT_LABELS: Record<string, string> = {
  card: "Card",
  apple_pay: "Apple Pay",
  google_pay: "Google Pay",
  cod: "Cash on delivery",
};

export default async function OrderHistoryPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account/orders");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-3xl font-black tracking-tight">Order history</h1>
      <p className="mt-2 text-neutral-500">{orders.length} orders placed</p>

      {orders.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <Package className="h-10 w-10 text-neutral-300" />
          <p className="mt-4 text-neutral-500">You haven&apos;t placed any orders yet.</p>
          <Link
            href="/products"
            className="mt-6 rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 dark:bg-white dark:text-neutral-950"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-neutral-900"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/5 pb-3 text-sm dark:border-white/10">
                <span className="font-mono text-neutral-500">#{order.id.slice(-8)}</span>
                <span className="text-neutral-500">
                  {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(order.createdAt)}
                </span>
                <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                  {PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}
                </span>
              </div>
              <div className="flex flex-col gap-2 py-3">
                {order.items.map((item) => (
                  <OrderLineItem
                    key={item.id}
                    item={{
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      quantity: item.quantity,
                      status: item.status,
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between border-t border-black/5 pt-3 font-bold dark:border-white/10">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
