import {
  Building2,
  BadgeCheck,
  Users,
  LogIn,
  ShoppingCart,
  DollarSign,
  Package,
  TrendingDown,
  RotateCcw,
  Percent,
  Store,
  UserCheck,
} from "lucide-react";
import { KpiCard } from "@/components/admin/kpi-card";
import { LineChart } from "@/components/admin/charts/line-chart";
import { DonutChart } from "@/components/admin/charts/donut-chart";
import { VerificationBadge, OrderBadge } from "@/components/admin/status-badge";
import {
  MOCK_SELLERS,
  MOCK_ORDERS,
  MOCK_NOTIFICATIONS,
  PLATFORM_MONTHLY_REVENUE,
  PLATFORM_MONTHLY_ORDERS,
  CATEGORY_DISTRIBUTION,
} from "@/lib/admin/mock-data";

function aed(fils: number) {
  return `AED ${(fils / 100).toLocaleString("en-AE", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function fmtAED(v: number) {
  return `${(v / 1000).toFixed(0)}k`;
}

export default function DashboardPage() {
  const verified = MOCK_SELLERS.filter((s) => s.verificationStatus === "verified");
  const pending = MOCK_SELLERS.filter((s) => s.verificationStatus === "pending");
  const suspended = MOCK_SELLERS.filter((s) => s.verificationStatus === "suspended");

  const totalRevenueFils = MOCK_SELLERS.reduce((s, x) => s + x.totalRevenueFils, 0);
  const totalCommissionFils = MOCK_SELLERS.reduce((s, x) => s + x.commissionFils, 0);
  const totalSales = MOCK_SELLERS.reduce((s, x) => s + x.totalSales, 0);

  const unread = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  const recentOrders = MOCK_ORDERS.slice(0, 6);

  const kpis = [
    {
      title: "Total Registered Sellers",
      value: String(MOCK_SELLERS.length),
      change: 18,
      changeLabel: "vs last month",
      icon: <Building2 className="h-5 w-5" />,
      accent: "bg-indigo-100 dark:bg-indigo-950/40",
      iconColor: "text-indigo-600 dark:text-indigo-400",
    },
    {
      title: "Awaiting Verification",
      value: String(pending.length),
      change: -12,
      changeLabel: "vs last week",
      icon: <BadgeCheck className="h-5 w-5" />,
      accent: "bg-amber-100 dark:bg-amber-950/40",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
    {
      title: "Total Customers",
      value: "1,284",
      change: 9,
      changeLabel: "vs last month",
      icon: <Users className="h-5 w-5" />,
      accent: "bg-emerald-100 dark:bg-emerald-950/40",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Users Since Launch",
      value: "3,892",
      change: 14,
      changeLabel: "vs last month",
      icon: <LogIn className="h-5 w-5" />,
      accent: "bg-sky-100 dark:bg-sky-950/40",
      iconColor: "text-sky-600 dark:text-sky-400",
    },
    {
      title: "Total Orders",
      value: totalSales.toLocaleString(),
      change: 11,
      changeLabel: "vs last month",
      icon: <ShoppingCart className="h-5 w-5" />,
      accent: "bg-violet-100 dark:bg-violet-950/40",
      iconColor: "text-violet-600 dark:text-violet-400",
    },
    {
      title: "Total Revenue",
      value: aed(totalRevenueFils),
      change: 16,
      changeLabel: "vs last month",
      icon: <DollarSign className="h-5 w-5" />,
      accent: "bg-emerald-100 dark:bg-emerald-950/40",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Products Listed",
      value: String(MOCK_SELLERS.reduce((s, x) => s + x.productCount, 0)),
      change: 7,
      changeLabel: "vs last month",
      icon: <Package className="h-5 w-5" />,
      accent: "bg-fuchsia-100 dark:bg-fuchsia-950/40",
      iconColor: "text-fuchsia-600 dark:text-fuchsia-400",
    },
    {
      title: "Products Sold",
      value: "4,821",
      change: 13,
      changeLabel: "vs last month",
      icon: <TrendingDown className="h-5 w-5" />,
      accent: "bg-teal-100 dark:bg-teal-950/40",
      iconColor: "text-teal-600 dark:text-teal-400",
    },
    {
      title: "Products Returned",
      value: "143",
      change: -4,
      changeLabel: "vs last month",
      icon: <RotateCcw className="h-5 w-5" />,
      accent: "bg-orange-100 dark:bg-orange-950/40",
      iconColor: "text-orange-600 dark:text-orange-400",
    },
    {
      title: "Commission Earned",
      value: aed(totalCommissionFils),
      change: 16,
      changeLabel: "vs last month",
      icon: <Percent className="h-5 w-5" />,
      accent: "bg-rose-100 dark:bg-rose-950/40",
      iconColor: "text-rose-600 dark:text-rose-400",
    },
    {
      title: "Active Sellers",
      value: String(verified.length),
      change: 5,
      changeLabel: "vs last month",
      icon: <Store className="h-5 w-5" />,
      accent: "bg-indigo-100 dark:bg-indigo-950/40",
      iconColor: "text-indigo-600 dark:text-indigo-400",
    },
    {
      title: "Active Customers",
      value: "892",
      change: 8,
      changeLabel: "vs last 30 days",
      icon: <UserCheck className="h-5 w-5" />,
      accent: "bg-emerald-100 dark:bg-emerald-950/40",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        {kpis.map((k) => (
          <KpiCard key={k.title} {...k} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Revenue line chart */}
        <div className="col-span-1 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-neutral-800 dark:text-white">Revenue Trend</p>
              <p className="text-xs text-neutral-400">Last 12 months • AED</p>
            </div>
            <span className="text-lg font-bold text-neutral-900 dark:text-white">{aed(totalRevenueFils)}</span>
          </div>
          <LineChart data={PLATFORM_MONTHLY_REVENUE} gradientId="dash-rev" color="#6366f1" formatY={fmtAED} />
        </div>

        {/* Category donut */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <p className="mb-4 text-sm font-semibold text-neutral-800 dark:text-white">Category Split</p>
          <DonutChart data={CATEGORY_DISTRIBUTION} label="100%" />
        </div>
      </div>

      {/* Bottom row: recent orders + notifications */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Recent orders */}
        <div className="col-span-1 rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
            <p className="text-sm font-semibold text-neutral-800 dark:text-white">Recent Orders</p>
            <a href="/admin/orders" className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">
              View all
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800">
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-neutral-400">Order</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-neutral-400">Customer</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-neutral-400">Amount</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-neutral-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-neutral-50 last:border-0 dark:border-neutral-800/50">
                    <td className="px-5 py-3 font-mono text-xs text-neutral-500">{o.id}</td>
                    <td className="px-5 py-3 font-medium text-neutral-800 dark:text-neutral-200">{o.customerName}</td>
                    <td className="px-5 py-3 font-semibold text-neutral-900 dark:text-white">{aed(o.totalFils)}</td>
                    <td className="px-5 py-3"><OrderBadge status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
            <p className="text-sm font-semibold text-neutral-800 dark:text-white">
              Notifications
              {unread > 0 && (
                <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:bg-red-950/40 dark:text-red-400">
                  {unread} new
                </span>
              )}
            </p>
            <a href="/admin/notifications" className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">
              All
            </a>
          </div>
          <ul className="divide-y divide-neutral-50 dark:divide-neutral-800/50">
            {MOCK_NOTIFICATIONS.slice(0, 5).map((n) => (
              <li key={n.id} className={`px-4 py-3 ${!n.read ? "bg-indigo-50/40 dark:bg-indigo-950/10" : ""}`}>
                <div className="flex items-start gap-2.5">
                  <span
                    className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                      n.severity === "error" ? "bg-red-500" :
                      n.severity === "warning" ? "bg-amber-500" :
                      n.severity === "success" ? "bg-emerald-500" :
                      "bg-blue-500"
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">{n.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-[11px] text-neutral-500 dark:text-neutral-400">{n.message}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sellers overview */}
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
          <p className="text-sm font-semibold text-neutral-800 dark:text-white">Seller Overview</p>
          <a href="/admin/sellers" className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">View all</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 dark:border-neutral-800">
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-neutral-400">Company</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-neutral-400">Category</th>
                <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-neutral-400">Revenue</th>
                <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-neutral-400">Rating</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-neutral-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_SELLERS.slice(0, 5).map((s) => (
                <tr key={s.id} className="border-b border-neutral-50 last:border-0 dark:border-neutral-800/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white ${s.logoColor}`}>
                        {s.logoInitials}
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-800 dark:text-neutral-200">{s.companyName}</p>
                        <p className="text-xs text-neutral-400">{s.sellerName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-neutral-500">{s.businessCategory}</td>
                  <td className="px-5 py-3 text-right font-semibold text-neutral-900 dark:text-white">
                    {s.totalRevenueFils > 0 ? aed(s.totalRevenueFils) : "—"}
                  </td>
                  <td className="px-5 py-3 text-right text-neutral-600 dark:text-neutral-400">
                    {s.averageRating > 0 ? `★ ${s.averageRating}` : "—"}
                  </td>
                  <td className="px-5 py-3">
                    <VerificationBadge status={s.verificationStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
