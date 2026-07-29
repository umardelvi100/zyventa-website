import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CheckCircle2, Clock, Plus, ShieldAlert, Store, XCircle,
  TrendingUp, Package, ShoppingBag, AlertTriangle, RotateCcw,
  Boxes, ArrowRight, BadgeCheck,
} from "lucide-react";
import { requireSeller } from "@/lib/require-seller";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { isPromotionActive } from "@/lib/pricing";
import { DeleteProductButton } from "@/components/seller/delete-product-button";
import { SellerOrderItemRow, type SellerOrderItemData } from "@/components/seller/seller-order-item";
import { RegulatoryDocCard } from "@/components/seller/regulatory-doc-card";
import { SellerDashboardTabs } from "@/components/seller/seller-dashboard-tabs";

const VERIFICATION_BANNERS = {
  pending: {
    icon: Clock,
    className: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300",
    title: "Verification pending",
    body: "Our team is reviewing your business details. You'll be able to list products once you're approved.",
  },
  approved: {
    icon: CheckCircle2,
    className: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300",
    title: "Verified seller",
    body: "Your account is verified — your products are live on Zyventa.",
  },
  rejected: {
    icon: XCircle,
    className: "border-red-200 bg-red-50 text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300",
    title: "Verification rejected",
    body: "We couldn't verify your account. Check the notes below and contact support to resubmit.",
  },
};

const STATUS_STYLES: Record<string, string> = {
  processing: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
  shipped:    "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400",
  delivered:  "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
  cancelled:  "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400",
  return_requested: "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400",
};

function stockBadge(stock: number) {
  if (stock === 0)
    return <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-950/50 dark:text-red-400">Out of stock</span>;
  if (stock <= 5)
    return <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">{stock} left</span>;
  return <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">{stock} in stock</span>;
}

export default async function SellerDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const ctx = await requireSeller();
  if (!ctx) redirect("/sell");

  const { tab = "overview" } = await searchParams;

  const [products, orderItems] = await Promise.all([
    prisma.product.findMany({
      where: { sellerId: ctx.seller.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.orderItem.findMany({
      where: { sellerId: ctx.seller.id },
      include: {
        order: { include: { user: true } },
        returns: { orderBy: { createdAt: "desc" }, take: 1, include: { images: true } },
        warrantyClaims: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { id: "desc" },
    }),
  ]);

  // Analytics
  const deliveredItems = orderItems.filter((i) => i.status === "delivered");
  const totalRevenue   = deliveredItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const thirtyDaysAgo  = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo   = new Date(Date.now() - 7  * 24 * 60 * 60 * 1000);
  const recentRevenue  = deliveredItems
    .filter((i) => new Date(i.order.createdAt) >= thirtyDaysAgo)
    .reduce((s, i) => s + i.price * i.quantity, 0);
  const weekRevenue    = deliveredItems
    .filter((i) => new Date(i.order.createdAt) >= sevenDaysAgo)
    .reduce((s, i) => s + i.price * i.quantity, 0);

  const statusCounts = orderItems.reduce<Record<string, number>>((acc, i) => {
    acc[i.status] = (acc[i.status] ?? 0) + 1;
    return acc;
  }, {});

  const pendingOrders  = (statusCounts.processing ?? 0) + (statusCounts.shipped ?? 0);
  const pendingReturns = (statusCounts.return_requested ?? 0) + (statusCounts.return_approved ?? 0);
  const lowStockProducts = products.filter((p) => p.stock <= 5);

  // 7-day revenue bars (seller-specific)
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

  // Top products by qty sold
  const productQty: Record<string, { name: string; qty: number; revenue: number }> = {};
  for (const item of deliveredItems) {
    if (!productQty[item.name]) productQty[item.name] = { name: item.name, qty: 0, revenue: 0 };
    productQty[item.name].qty     += item.quantity;
    productQty[item.name].revenue += item.price * item.quantity;
  }
  const topProducts = Object.values(productQty).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  const maxRevenue = topProducts[0]?.revenue ?? 1;

  const sellerOrderItems: SellerOrderItemData[] = orderItems.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    status: item.status,
    warrantyMonths: item.warrantyMonths,
    cancelReason: item.cancelReason,
    buyerName: item.order.user.name,
    shippingAddress: item.order.shippingAddress,
    shippingCity: item.order.shippingCity,
    shippingZip: item.order.shippingZip,
    createdAt: item.order.createdAt.toISOString(),
    activeReturn: item.returns[0]
      ? {
          id: item.returns[0].id,
          reason: item.returns[0].reason,
          details: item.returns[0].details,
          status: item.returns[0].status,
          images: item.returns[0].images.map((img) => ({ url: img.url })),
        }
      : null,
    activeClaim: item.warrantyClaims[0]
      ? { id: item.warrantyClaims[0].id, issue: item.warrantyClaims[0].issue, status: item.warrantyClaims[0].status }
      : null,
  }));

  const banner = VERIFICATION_BANNERS[ctx.seller.verificationStatus as keyof typeof VERIFICATION_BANNERS] ?? VERIFICATION_BANNERS.pending;
  const BannerIcon = banner.icon;
  const isApproved = ctx.seller.verificationStatus === "approved";

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Store header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-orange-500 text-white">
            <Store className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl font-black tracking-tight">{ctx.seller.storeName}</h1>
            <p className="flex items-center gap-1.5 text-sm text-neutral-500">
              {isApproved && <BadgeCheck className="h-4 w-4 text-emerald-500" />}
              {isApproved ? "Verified seller" : "Pending verification"}
              {ctx.seller.codAvailable && " · COD enabled"}
            </p>
          </div>
        </div>
        {isApproved ? (
          <Link
            href="/seller/products/new"
            className="flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" /> List product
          </Link>
        ) : (
          <span className="flex items-center gap-2 rounded-full bg-neutral-100 px-5 py-2.5 text-sm font-semibold text-neutral-400 dark:bg-neutral-800">
            <ShieldAlert className="h-4 w-4" /> Listing locked
          </span>
        )}
      </div>

      {/* Verification banner */}
      <div className={`mt-5 flex items-start gap-3 rounded-2xl border p-4 text-sm ${banner.className}`}>
        <BannerIcon className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p className="font-semibold">{banner.title}</p>
          <p className="mt-0.5">{banner.body}</p>
          {ctx.seller.verificationNotes && (
            <p className="mt-2 rounded-lg bg-white/60 p-2 text-xs italic dark:bg-black/20">
              &quot;{ctx.seller.verificationNotes}&quot;
            </p>
          )}
        </div>
      </div>

      <div className="mt-5">
        <RegulatoryDocCard regulatoryDocUrl={ctx.seller.regulatoryDocUrl} />
      </div>

      {/* Tabs */}
      <div className="mt-8">
        <SellerDashboardTabs activeTab={tab} />
      </div>

      {/* ─── OVERVIEW TAB ─────────────────────────────────────────── */}
      {tab === "overview" && (
        <div className="mt-6 flex flex-col gap-6">
          {/* KPI cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: TrendingUp, label: "Total revenue", value: formatPrice(totalRevenue), sub: `${formatPrice(recentRevenue)} last 30d`, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40" },
              { icon: ShoppingBag, label: "Orders", value: String(orderItems.length), sub: `${pendingOrders} in transit`, color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40" },
              { icon: Package, label: "Products", value: String(products.length), sub: `${lowStockProducts.length} need restocking`, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40" },
              { icon: RotateCcw, label: "Returns", value: String(pendingReturns), sub: "pending review", color: "text-orange-600 bg-orange-50 dark:bg-orange-950/40" },
            ].map(({ icon: Icon, label, value, sub, color }) => (
              <div key={label} className="flex items-start gap-3 rounded-2xl border border-black/5 bg-white p-4 dark:border-white/10 dark:bg-neutral-900">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${color}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-medium text-neutral-400">{label}</p>
                  <p className="text-xl font-black">{value}</p>
                  <p className="text-[11px] text-neutral-500">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent orders */}
          <div className="rounded-2xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-neutral-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold">Recent orders</h2>
              <Link href="?tab=orders" className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                View all →
              </Link>
            </div>
            {orderItems.length === 0 ? (
              <p className="text-sm text-neutral-500">No orders yet.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {sellerOrderItems.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-xl border border-black/5 px-3 py-2.5 text-sm dark:border-white/10">
                    <div className="min-w-0">
                      <p className="line-clamp-1 font-medium">{item.name} × {item.quantity}</p>
                      <p className="text-xs text-neutral-500">{item.buyerName} · {item.shippingCity}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 pl-4">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[item.status] ?? "bg-neutral-100 text-neutral-600"}`}>
                        {item.status.replace("_", " ")}
                      </span>
                      <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Low stock alert */}
          {lowStockProducts.length > 0 && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/40 dark:bg-amber-950/20">
              <div className="mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <h2 className="font-bold text-amber-800 dark:text-amber-300">Stock alerts ({lowStockProducts.length})</h2>
                <Link href="?tab=inventory" className="ml-auto text-xs font-semibold text-amber-700 hover:underline dark:text-amber-400">
                  Manage inventory →
                </Link>
              </div>
              <div className="flex flex-col gap-2">
                {lowStockProducts.slice(0, 5).map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-2 text-sm dark:bg-black/20">
                    <span className="font-medium">{p.name}</span>
                    {stockBadge(p.stock)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── INVENTORY TAB ────────────────────────────────────────── */}
      {tab === "inventory" && (
        <div className="mt-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Products & Inventory ({products.length})</h2>
            {isApproved && (
              <Link href="/seller/products/new" className="flex items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700">
                <Plus className="h-3.5 w-3.5" /> Add product
              </Link>
            )}
          </div>

          {/* Summary badges */}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
              {products.filter((p) => p.stock > 5).length} well-stocked
            </span>
            <span className="rounded-full bg-amber-100 px-3 py-1 font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
              {products.filter((p) => p.stock > 0 && p.stock <= 5).length} low stock
            </span>
            <span className="rounded-full bg-red-100 px-3 py-1 font-semibold text-red-700 dark:bg-red-950/50 dark:text-red-400">
              {products.filter((p) => p.stock === 0).length} out of stock
            </span>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <Boxes className="h-10 w-10 text-neutral-300" />
              <p className="mt-4 font-semibold">No products listed yet</p>
              {isApproved && (
                <Link href="/seller/products/new" className="mt-4 rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
                  List your first product
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-black/5 bg-white dark:border-white/10 dark:bg-neutral-900">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/5 bg-neutral-50 text-left dark:border-white/10 dark:bg-neutral-800/50">
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">Product</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">Category</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">Price</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">Stock</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/10">
                  {[...products].sort((a, b) => a.stock - b.stock).map((product) => (
                    <tr key={product.id} className="hover:bg-black/2 dark:hover:bg-white/3">
                      <td className="px-4 py-3">
                        <Link href={`/products/${product.slug}`} className="font-medium hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">
                          {product.name}
                        </Link>
                        {isPromotionActive(product) && (
                          <span className="ml-2 rounded-full bg-orange-100 px-1.5 py-0.5 text-[11px] font-semibold text-orange-700 dark:bg-orange-950/50 dark:text-orange-400">
                            {product.discountPercent}% off
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-neutral-500">{product.category}</td>
                      <td className="px-4 py-3 font-semibold">{formatPrice(product.price)}</td>
                      <td className="px-4 py-3">{stockBadge(product.stock)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Link href={`/seller/products/${product.id}/edit`} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/40">
                            Edit
                          </Link>
                          <DeleteProductButton productId={product.id} name={product.name} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ─── ORDERS TAB ───────────────────────────────────────────── */}
      {tab === "orders" && (
        <div className="mt-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">All orders ({sellerOrderItems.length})</h2>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {Object.entries(statusCounts).map(([status, count]) => (
                <span key={status} className={`rounded-full px-2.5 py-1 font-semibold capitalize ${STATUS_STYLES[status] ?? "bg-neutral-100 text-neutral-600"}`}>
                  {status.replace("_", " ")}: {count}
                </span>
              ))}
            </div>
          </div>
          {sellerOrderItems.length === 0 ? (
            <p className="text-sm text-neutral-500">No orders yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {sellerOrderItems.map((item) => (
                <SellerOrderItemRow key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── ANALYTICS TAB ────────────────────────────────────────── */}
      {tab === "analytics" && (
        <div className="mt-6 flex flex-col gap-6">
          {/* Summary numbers */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[
              { label: "Total revenue", value: formatPrice(totalRevenue) },
              { label: "Last 30 days", value: formatPrice(recentRevenue) },
              { label: "This week", value: formatPrice(weekRevenue) },
              { label: "Items sold", value: String(deliveredItems.reduce((s, i) => s + i.quantity, 0)) },
              { label: "Orders fulfilled", value: String(deliveredItems.length) },
              { label: "Avg. order value", value: deliveredItems.length > 0 ? formatPrice(Math.round(totalRevenue / deliveredItems.length)) : "—" },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-2xl border border-black/5 bg-white p-4 dark:border-white/10 dark:bg-neutral-900">
                <p className="text-xs font-medium text-neutral-400">{label}</p>
                <p className="mt-1 text-xl font-black">{value}</p>
              </div>
            ))}
          </div>

          {/* 7-day revenue chart */}
          <div className="rounded-2xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-neutral-900">
            <h2 className="mb-4 font-bold">Revenue — last 7 days</h2>
            <div className="flex h-40 items-end gap-2">
              {dayRevenue.map((rev, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[10px] font-semibold text-neutral-500">{rev > 0 ? formatPrice(rev) : ""}</span>
                  <div className="relative w-full rounded-t-lg bg-neutral-100 dark:bg-neutral-800" style={{ height: "100px" }}>
                    <div
                      className="absolute bottom-0 w-full rounded-t-lg bg-gradient-to-t from-indigo-600 to-indigo-400"
                      style={{ height: `${Math.round((rev / maxDay) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-neutral-400">{dayLabels[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top products */}
          <div className="rounded-2xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-neutral-900">
            <h2 className="mb-4 font-bold">Top products by revenue</h2>
            {topProducts.length === 0 ? (
              <p className="text-sm text-neutral-500">No delivered orders yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {topProducts.map((p, i) => (
                  <div key={p.name}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-100 text-[10px] font-bold text-neutral-500 dark:bg-neutral-800">{i + 1}</span>
                        <span className="line-clamp-1 font-medium">{p.name}</span>
                        <span className="text-xs text-neutral-400">× {p.qty} sold</span>
                      </span>
                      <span className="shrink-0 font-semibold">{formatPrice(p.revenue)}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-orange-400"
                        style={{ width: `${Math.round((p.revenue / maxRevenue) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order status breakdown */}
          <div className="rounded-2xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-neutral-900">
            <h2 className="mb-4 font-bold">Order status breakdown</h2>
            {Object.keys(statusCounts).length === 0 ? (
              <p className="text-sm text-neutral-500">No orders yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {Object.entries(statusCounts).sort((a, b) => b[1] - a[1]).map(([status, count]) => {
                  const pct = Math.round((count / orderItems.length) * 100);
                  return (
                    <div key={status}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[status] ?? "bg-neutral-100 text-neutral-600"}`}>
                          {status.replace("_", " ")}
                        </span>
                        <span className="text-neutral-500">{count} ({pct}%)</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                        <div className={`h-full rounded-full ${STATUS_STYLES[status]?.split(" ")[0] ?? "bg-neutral-300"}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <Link href="?tab=orders" className="flex items-center gap-1.5 rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-black/5 dark:border-white/15 dark:text-neutral-300 dark:hover:bg-white/5">
              View all orders <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
