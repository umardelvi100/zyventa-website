import { redirect } from "next/navigation";
import Link from "next/link";
import {
  TrendingUp, Package, ShoppingBag, Users, AlertTriangle,
  RotateCcw, Boxes, ArrowRight, CheckCircle2,
} from "lucide-react";
import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  processing: { bg: "bg-amber-100 dark:bg-amber-950/50", text: "text-amber-700 dark:text-amber-400", label: "Processing" },
  shipped:    { bg: "bg-blue-100 dark:bg-blue-950/50",   text: "text-blue-700 dark:text-blue-400",   label: "Shipped" },
  delivered:  { bg: "bg-emerald-100 dark:bg-emerald-950/50", text: "text-emerald-700 dark:text-emerald-400", label: "Delivered" },
  cancelled:  { bg: "bg-red-100 dark:bg-red-950/50",     text: "text-red-700 dark:text-red-400",     label: "Cancelled" },
  return_requested: { bg: "bg-orange-100 dark:bg-orange-950/50", text: "text-orange-700 dark:text-orange-400", label: "Return Req." },
  return_approved:  { bg: "bg-orange-100 dark:bg-orange-950/50", text: "text-orange-700 dark:text-orange-400", label: "Return Appr." },
  refunded:   { bg: "bg-neutral-100 dark:bg-neutral-800", text: "text-neutral-600 dark:text-neutral-400", label: "Refunded" },
};

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent = "indigo",
}: {
  icon: typeof Package;
  label: string;
  value: string;
  sub?: string;
  accent?: "indigo" | "emerald" | "amber" | "orange";
}) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
    orange: "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400",
  };
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-neutral-900">
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colors[accent]}`}>
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{label}</p>
        <p className="mt-0.5 text-2xl font-black tracking-tight">{value}</p>
        {sub && <p className="mt-0.5 text-xs text-neutral-500">{sub}</p>}
      </div>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const ctx = await requireAdmin();
  if (!ctx) redirect("/");

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo  = new Date(Date.now() - 7  * 24 * 60 * 60 * 1000);

  const [
    allOrderItems,
    totalProducts,
    lowStockCount,
    outOfStockCount,
    totalUsers,
    activeSellers,
    pendingSellers,
    recentOrders,
    lowStockProducts,
  ] = await Promise.all([
    prisma.orderItem.findMany({
      select: { price: true, quantity: true, status: true, name: true, cancelReason: true, order: { select: { createdAt: true } } },
    }),
    prisma.product.count(),
    prisma.product.count({ where: { stock: { gt: 0, lte: 5 } } }),
    prisma.product.count({ where: { stock: 0 } }),
    prisma.user.count(),
    prisma.seller.count({ where: { verificationStatus: "approved" } }),
    prisma.seller.count({ where: { verificationStatus: "pending" } }),
    prisma.order.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        items: { select: { name: true, status: true, quantity: true, price: true } },
      },
    }),
    prisma.product.findMany({
      where: { stock: { lte: 5 } },
      select: { id: true, name: true, category: true, stock: true, slug: true },
      orderBy: { stock: "asc" },
      take: 8,
    }),
  ]);

  // Revenue
  const deliveredItems = allOrderItems.filter((i) => i.status === "delivered");
  const totalRevenue = deliveredItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const recentRevenue = deliveredItems
    .filter((i) => new Date(i.order.createdAt) >= thirtyDaysAgo)
    .reduce((s, i) => s + i.price * i.quantity, 0);
  const weekRevenue = deliveredItems
    .filter((i) => new Date(i.order.createdAt) >= sevenDaysAgo)
    .reduce((s, i) => s + i.price * i.quantity, 0);

  // Status counts
  const statusCounts = allOrderItems.reduce<Record<string, number>>((acc, i) => {
    acc[i.status] = (acc[i.status] ?? 0) + 1;
    return acc;
  }, {});
  const totalOrderItems = allOrderItems.length;
  const pendingDelivery = (statusCounts.processing ?? 0) + (statusCounts.shipped ?? 0);
  const pendingReturns  = (statusCounts.return_requested ?? 0) + (statusCounts.return_approved ?? 0);

  // Top products by revenue (delivered)
  const productRevMap: Record<string, { name: string; revenue: number; qty: number }> = {};
  for (const item of deliveredItems) {
    if (!productRevMap[item.name]) productRevMap[item.name] = { name: item.name, revenue: 0, qty: 0 };
    productRevMap[item.name].revenue += item.price * item.quantity;
    productRevMap[item.name].qty     += item.quantity;
  }
  const topProducts = Object.values(productRevMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
  const maxProductRevenue = topProducts[0]?.revenue ?? 1;

  // Last 7 days revenue bars
  const dayRevenue: number[] = Array.from({ length: 7 }, (_, i) => {
    const dayStart = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);
    return deliveredItems
      .filter((item) => {
        const d = new Date(item.order.createdAt);
        return d >= dayStart && d <= dayEnd;
      })
      .reduce((s, i) => s + i.price * i.quantity, 0);
  });
  const maxDay = Math.max(...dayRevenue, 1);
  const dayLabels = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000);
    return d.toLocaleDateString("en-US", { weekday: "short" });
  });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Platform overview · Last updated {new Date().toLocaleString("en-AE", { dateStyle: "medium", timeStyle: "short" })}
        </p>
      </div>

      {/* KPI stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={TrendingUp} label="Total Revenue" value={formatPrice(totalRevenue)} sub={`${formatPrice(recentRevenue)} last 30d`} accent="emerald" />
        <StatCard icon={ShoppingBag} label="Order Items" value={String(totalOrderItems)} sub={`${pendingDelivery} in transit`} accent="indigo" />
        <StatCard icon={Boxes} label="Products" value={String(totalProducts)} sub={`${lowStockCount} low · ${outOfStockCount} out`} accent="amber" />
        <StatCard icon={Users} label="Sellers" value={String(activeSellers)} sub={`${pendingSellers} pending review`} accent="orange" />
      </div>

      {/* Revenue trend + Order status */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* 7-day revenue bar chart */}
        <div className="rounded-2xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-neutral-900">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-bold">Revenue (7 days)</h2>
              <p className="text-xs text-neutral-500">{formatPrice(weekRevenue)} this week</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
              Delivered only
            </span>
          </div>
          <div className="flex h-36 items-end gap-2">
            {dayRevenue.map((rev, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div className="relative w-full rounded-t-lg bg-neutral-100 dark:bg-neutral-800" style={{ height: "100px" }}>
                  <div
                    className="absolute bottom-0 w-full rounded-t-lg bg-gradient-to-t from-indigo-600 to-indigo-400 transition-all"
                    style={{ height: `${Math.round((rev / maxDay) * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-neutral-400">{dayLabels[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order status breakdown */}
        <div className="rounded-2xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-neutral-900">
          <h2 className="mb-4 font-bold">Order status breakdown</h2>
          <div className="flex flex-col gap-3">
            {Object.entries(statusCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([status, count]) => {
                const s = STATUS_STYLES[status];
                const pct = Math.round((count / totalOrderItems) * 100);
                return (
                  <div key={status}>
                    <div className="mb-1 flex items-center justify-between text-xs font-medium">
                      <span className={`rounded-full px-2 py-0.5 ${s?.bg ?? "bg-neutral-100"} ${s?.text ?? "text-neutral-600"}`}>
                        {s?.label ?? status}
                      </span>
                      <span className="text-neutral-500">{count} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                      <div
                        className={`h-full rounded-full ${s?.bg ?? "bg-neutral-300"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Top products + Alerts */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Top 5 products */}
        <div className="rounded-2xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-neutral-900">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">Top products by revenue</h2>
            <Link href="/admin/inventory" className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">
              View all
            </Link>
          </div>
          {topProducts.length === 0 ? (
            <p className="text-sm text-neutral-500">No delivered orders yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {topProducts.map((p, i) => (
                <div key={p.name}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-100 text-[10px] font-bold text-neutral-500 dark:bg-neutral-800">
                        {i + 1}
                      </span>
                      <span className="line-clamp-1 font-medium">{p.name}</span>
                    </span>
                    <span className="shrink-0 font-semibold">{formatPrice(p.revenue)}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-orange-400"
                      style={{ width: `${Math.round((p.revenue / maxProductRevenue) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Inventory alerts */}
        <div className="rounded-2xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-neutral-900">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">Inventory alerts</h2>
            <Link href="/admin/inventory" className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">
              Manage
            </Link>
          </div>
          {pendingReturns > 0 && (
            <div className="mb-3 flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2.5 text-sm dark:border-orange-900/40 dark:bg-orange-950/30">
              <RotateCcw className="h-4 w-4 shrink-0 text-orange-500" />
              <span className="text-orange-700 dark:text-orange-400">
                <strong>{pendingReturns}</strong> return{pendingReturns === 1 ? "" : "s"} pending review
              </span>
              <Link href="/admin/orders" className="ml-auto text-xs font-semibold text-orange-600 hover:underline">
                View →
              </Link>
            </div>
          )}
          {pendingSellers > 0 && (
            <div className="mb-3 flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2.5 text-sm dark:border-indigo-900/40 dark:bg-indigo-950/30">
              <Users className="h-4 w-4 shrink-0 text-indigo-500" />
              <span className="text-indigo-700 dark:text-indigo-400">
                <strong>{pendingSellers}</strong> seller{pendingSellers === 1 ? "" : "s"} awaiting verification
              </span>
              <Link href="/admin/sellers" className="ml-auto text-xs font-semibold text-indigo-600 hover:underline">
                Review →
              </Link>
            </div>
          )}
          {lowStockProducts.length === 0 ? (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm dark:border-emerald-900/40 dark:bg-emerald-950/30">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
              <span className="text-emerald-700 dark:text-emerald-400">All products are well-stocked</span>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {lowStockProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/admin/inventory`}
                  className="flex items-center justify-between rounded-xl border border-black/5 px-3 py-2.5 text-sm transition hover:bg-black/3 dark:border-white/10 dark:hover:bg-white/5"
                >
                  <span className="flex items-center gap-2">
                    {p.stock === 0 ? (
                      <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                    ) : (
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                    )}
                    <span className="line-clamp-1 font-medium">{p.name}</span>
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    p.stock === 0
                      ? "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
                  }`}>
                    {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent orders */}
      <div className="rounded-2xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-neutral-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold">Recent orders</h2>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            All orders <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-neutral-500">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/5 text-left text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:border-white/10">
                  <th className="pb-3 pr-4">Order</th>
                  <th className="pb-3 pr-4">Customer</th>
                  <th className="pb-3 pr-4">Items</th>
                  <th className="pb-3 pr-4">Total</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/10">
                {recentOrders.map((order) => {
                  const total = order.items.reduce((s, i) => s + i.price * i.quantity, 0);
                  const allStatus = [...new Set(order.items.map((i) => i.status))];
                  return (
                    <tr key={order.id} className="hover:bg-black/2 dark:hover:bg-white/3">
                      <td className="py-3 pr-4 font-mono text-xs text-neutral-400">#{order.id.slice(-8)}</td>
                      <td className="py-3 pr-4">
                        <span className="font-medium">{order.user.name}</span>
                        <span className="ml-1 text-neutral-400">· {order.shippingCity}</span>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex flex-wrap gap-1">
                          {allStatus.map((s) => {
                            const style = STATUS_STYLES[s];
                            return (
                              <span key={s} className={`rounded-full px-2 py-0.5 text-xs font-semibold ${style?.bg ?? "bg-neutral-100"} ${style?.text ?? "text-neutral-600"}`}>
                                {style?.label ?? s}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className="py-3 pr-4 font-semibold">{formatPrice(total)}</td>
                      <td className="py-3 text-neutral-400">
                        {new Intl.DateTimeFormat("en-AE", { dateStyle: "medium" }).format(order.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick platform stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total users", value: totalUsers, icon: Users },
          { label: "In transit", value: pendingDelivery, icon: ShoppingBag },
          { label: "Pending returns", value: pendingReturns, icon: RotateCcw },
          { label: "Platform items sold", value: deliveredItems.reduce((s, i) => s + i.quantity, 0), icon: CheckCircle2 },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-center gap-3 rounded-xl border border-black/5 bg-white p-4 dark:border-white/10 dark:bg-neutral-900">
            <Icon className="h-4 w-4 shrink-0 text-neutral-400" />
            <div>
              <p className="text-lg font-black">{value}</p>
              <p className="text-xs text-neutral-500">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
