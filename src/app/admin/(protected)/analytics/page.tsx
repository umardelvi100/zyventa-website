import { LineChart } from "@/components/admin/charts/line-chart";
import { BarChart } from "@/components/admin/charts/bar-chart";
import { DonutChart } from "@/components/admin/charts/donut-chart";
import {
  PLATFORM_MONTHLY_REVENUE,
  PLATFORM_MONTHLY_ORDERS,
  PLATFORM_CUSTOMER_GROWTH,
  PLATFORM_SELLER_GROWTH,
  PLATFORM_COMMISSION,
  CATEGORY_DISTRIBUTION,
  MOCK_SELLERS,
  MOCK_PRODUCTS,
} from "@/lib/admin/mock-data";

function aed(fils: number) {
  return `AED ${(fils / 100).toLocaleString("en-AE", { maximumFractionDigits: 0 })}`;
}

const TOP_SELLERS = [...MOCK_SELLERS]
  .filter((s) => s.totalRevenueFils > 0)
  .sort((a, b) => b.totalRevenueFils - a.totalRevenueFils)
  .slice(0, 5);

const TOP_PRODUCTS = [...MOCK_PRODUCTS]
  .filter((p) => p.totalSold > 0)
  .sort((a, b) => b.totalSold - a.totalSold)
  .slice(0, 5);

export default function AnalyticsPage() {
  const approvalRate = Math.round(
    (MOCK_PRODUCTS.filter((p) => p.approvalStatus === "approved").length / MOCK_PRODUCTS.length) * 100,
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Summary KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Revenue", value: aed(MOCK_SELLERS.reduce((s, x) => s + x.totalRevenueFils, 0)) },
          { label: "Platform Commission", value: aed(MOCK_SELLERS.reduce((s, x) => s + x.commissionFils, 0)) },
          { label: "Product Approval Rate", value: `${approvalRate}%` },
          {
            label: "Avg. Return Rate",
            value: `${(MOCK_SELLERS.filter((s) => s.returnRate > 0).reduce((s, x) => s + x.returnRate, 0) / MOCK_SELLERS.filter((s) => s.returnRate > 0).length).toFixed(1)}%`,
          },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <p className="text-xl font-bold text-neutral-900 dark:text-white">{s.value}</p>
            <p className="text-xs text-neutral-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue + Orders charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <p className="mb-1 text-sm font-semibold text-neutral-800 dark:text-white">Revenue Trend (AED)</p>
          <p className="mb-4 text-xs text-neutral-400">Monthly platform revenue — last 12 months</p>
          <LineChart data={PLATFORM_MONTHLY_REVENUE} gradientId="analytics-rev" color="#6366f1" formatY={(v) => `${(v / 1000).toFixed(0)}k`} />
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <p className="mb-1 text-sm font-semibold text-neutral-800 dark:text-white">Orders Per Month</p>
          <p className="mb-4 text-xs text-neutral-400">Monthly order volume — last 12 months</p>
          <BarChart data={PLATFORM_MONTHLY_ORDERS} color="#22c55e" />
        </div>
      </div>

      {/* Customer + Seller growth */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <p className="mb-1 text-sm font-semibold text-neutral-800 dark:text-white">Customer Growth</p>
          <p className="mb-4 text-xs text-neutral-400">Cumulative registered customers</p>
          <LineChart data={PLATFORM_CUSTOMER_GROWTH} gradientId="analytics-cust" color="#ec4899" />
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <p className="mb-1 text-sm font-semibold text-neutral-800 dark:text-white">Commission Earned</p>
          <p className="mb-4 text-xs text-neutral-400">Monthly 10% platform commission (AED)</p>
          <BarChart data={PLATFORM_COMMISSION} color="#f59e0b" formatY={(v) => `${(v / 1000).toFixed(0)}k`} />
        </div>
      </div>

      {/* Category + Top sellers/products */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <p className="mb-4 text-sm font-semibold text-neutral-800 dark:text-white">Most Popular Categories</p>
          <DonutChart data={CATEGORY_DISTRIBUTION} label="100%" />
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <p className="mb-4 text-sm font-semibold text-neutral-800 dark:text-white">Top Sellers by Revenue</p>
          <ul className="flex flex-col gap-3">
            {TOP_SELLERS.map((s, i) => (
              <li key={s.id} className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                  {i + 1}
                </span>
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-bold text-white ${s.logoColor}`}>
                  {s.logoInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-xs font-semibold text-neutral-800 dark:text-neutral-200">{s.companyName}</p>
                  <p className="text-[11px] text-neutral-400">
                    {aed(s.totalRevenueFils)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <p className="mb-4 text-sm font-semibold text-neutral-800 dark:text-white">Best Selling Products</p>
          <ul className="flex flex-col gap-3">
            {TOP_PRODUCTS.map((p, i) => (
              <li key={p.id} className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-xs font-semibold text-neutral-800 dark:text-neutral-200">{p.name}</p>
                  <p className="text-[11px] text-neutral-400">
                    {p.totalSold} sold · ★ {p.rating}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
