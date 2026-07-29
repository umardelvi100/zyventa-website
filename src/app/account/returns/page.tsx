import { redirect } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { BuyerOrderItem } from "@/components/orders/buyer-order-item";
import { isRelevantForReturnsTab } from "@/lib/return-eligibility";

export default async function CancellationsReturnsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account/returns");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          returns: { orderBy: { createdAt: "desc" }, take: 1, include: { images: true } },
          warrantyClaims: { orderBy: { createdAt: "desc" }, take: 1 },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const rows = orders.flatMap((order) =>
    order.items.map((item) => ({
      orderId: order.id,
      item: {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        status: item.status,
        warrantyMonths: item.warrantyMonths,
        cancelReason: item.cancelReason,
        activeReturn: item.returns[0]
          ? {
              reason: item.returns[0].reason,
              details: item.returns[0].details,
              status: item.returns[0].status,
              images: item.returns[0].images.map((img) => ({ url: img.url })),
            }
          : null,
        activeClaim: item.warrantyClaims[0]
          ? { issue: item.warrantyClaims[0].issue, status: item.warrantyClaims[0].status }
          : null,
      },
    })),
  ).filter((row) => isRelevantForReturnsTab(row.item));

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-orange-500 text-white">
          <RotateCcw className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Cancellations &amp; Returns</h1>
          <p className="mt-1 text-neutral-500">Cancel an order, request a return, or check on one already in progress.</p>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="mt-16 text-center text-neutral-500">
          Nothing to cancel or return right now — eligible orders show up here.
        </p>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {rows.map(({ orderId, item }) => (
            <div key={item.id}>
              <p className="mb-1.5 font-mono text-xs text-neutral-400">Order #{orderId.slice(-8)}</p>
              <BuyerOrderItem item={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
