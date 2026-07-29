import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { SuccessAnimation } from "@/components/checkout/success-animation";

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order || order.userId !== session.user.id) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <SuccessAnimation />

      <h1 className="mt-6 text-3xl font-black tracking-tight">Order confirmed!</h1>
      <p className="mt-2 text-neutral-500">
        Thanks for your order — a confirmation has been saved to your account.
      </p>

      <div className="mt-10 rounded-2xl border border-black/5 bg-white p-6 text-left dark:border-white/10 dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-black/5 pb-4 text-sm dark:border-white/10">
          <span className="text-neutral-500">Order ID</span>
          <span className="font-mono font-medium">{order.id}</span>
        </div>
        <div className="flex flex-col gap-3 py-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-neutral-600 dark:text-neutral-400">
                {item.name} × {item.quantity}
              </span>
              <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between border-t border-black/5 pt-4 font-bold dark:border-white/10">
          <span>Total paid</span>
          <span>{formatPrice(order.total)}</span>
        </div>
        <div className="mt-4 border-t border-black/5 pt-4 text-sm text-neutral-500 dark:border-white/10">
          Shipping to {order.shippingName}, {order.shippingAddress}, {order.shippingCity}{" "}
          {order.shippingZip}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/products"
          className="rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 dark:bg-white dark:text-neutral-950"
        >
          Keep shopping
        </Link>
        <Link
          href="/account/orders"
          className="rounded-full border border-black/10 px-6 py-3 font-semibold transition hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
        >
          View order history
        </Link>
      </div>
    </div>
  );
}
