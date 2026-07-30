import { LineChart } from "@/components/admin/charts/line-chart";
import { BarChart } from "@/components/admin/charts/bar-chart";
import {
  PLATFORM_MONTHLY_REVENUE,
  PLATFORM_COMMISSION,
  MOCK_SELLERS,
  MOCK_ORDERS,
} from "@/lib/admin/mock-data";

function aed(fils: number) {
  return `AED ${(fils / 100).toLocaleString("en-AE", { maximumFractionDigits: 0 })}`;
}

export default function RevenuePage() {
  const totalRevenue = MOCK_SELLERS.reduce((s, x) => s + x.totalRevenueFils, 0);
  const totalCommission = MOCK_SELLERS.reduce((s, x) => s + x.commissionFils, 0);
  const deliveredRevenue = MOCK_ORDERS.filter((o) => o.status === "delivered").reduce(
    (s, o) => s + o.totalFils,
    0,
  );

  const sellerRevenues = [...MOCK_SELLERS]
    .filter((s) => s.totalRevenueFils > 0)
    .sort((a, b) => b.totalRevenueFils - a.totalRevenueFils);

  return (
    <div className="flex flex-col gap-6">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Gross Revenue", value: aed(totalRevenue), accent: "text-emerald-600 dark:text-emerald-400" },
          { label: "Platform Commission", value: aed(totalCommission), accent: "text-indigo-600 dark:text-indigo-400" },
          { label: "Delivered Orders Revenue", value: aed(deliveredRevenue), accent: "text-sky-600 dark:text-sky-400" },
          {
            label: "Commission Rate",
            value: "10%",
            accent: "text-amber-600 dark:text-amber-400",
          },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <p className={`text-2xl font-bold ${s.accent}`}>{s.value}</p>
            <p className="text-xs text-neutral-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue + Commission charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <p className="mb-1 text-sm font-semibold text-neutral-800 dark:text-white">Monthly Revenue (AED)</p>
          <p className="mb-4 text-xs text-neutral-400">Gross marketplace revenue — last 12 months</p>
          <LineChart
            data={PLATFORM_MONTHLY_REVENUE}
            gradientId="revenue-rev"
            color="#22c55e"
            formatY={(v) => `${(v / 1000).toFixed(0)}k`}
          />
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <p className="mb-1 text-sm font-semibold text-neutral-800 dark:text-white">Commission Earned (AED)</p>
          <p className="mb-4 text-xs text-neutral-400">10% of monthly gross revenue</p>
          <BarChart
            data={PLATFORM_COMMISSION}
            color="#6366f1"
            formatY={(v) => `${(v / 1000).toFixed(0)}k`}
          />
        </div>
      </div>

      {/* Per-seller revenue breakdown */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
          <p className="text-sm font-semibold text-neutral-800 dark:text-white">Revenue by Seller</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-800/50">
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Seller</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">Orders</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">Gross Revenue</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">Commission (10%)</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">Net to Seller</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">Return Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800/50">
              {sellerRevenues.map((s) => (
                <tr key={s.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/30">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white ${s.logoColor}`}>
                        {s.logoInitials}
                      </div>
                      <p className="font-medium text-neutral-800 dark:text-neutral-200">{s.companyName}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right tabular-nums text-neutral-600 dark:text-neutral-400">{s.totalSales}</td>
                  <td className="px-5 py-4 text-right tabular-nums font-semibold text-neutral-900 dark:text-white">{aed(s.totalRevenueFils)}</td>
                  <td className="px-5 py-4 text-right tabular-nums text-indigo-600 dark:text-indigo-400">{aed(s.commissionFils)}</td>
                  <td className="px-5 py-4 text-right tabular-nums text-emerald-600 dark:text-emerald-400">
                    {aed(s.totalRevenueFils - s.commissionFils)}
                  </td>
                  <td className={`px-5 py-4 text-right tabular-nums font-medium ${s.returnRate > 5 ? "text-red-600 dark:text-red-400" : "text-neutral-600 dark:text-neutral-400"}`}>
                    {s.returnRate}%
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
