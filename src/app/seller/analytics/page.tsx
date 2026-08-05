import { LineChart } from "@/components/admin/charts/line-chart";
import { BarChart } from "@/components/admin/charts/bar-chart";
import { DonutChart } from "@/components/admin/charts/donut-chart";
import {
  SELLER_MONTHLY_REVENUE,
  SELLER_MONTHLY_ORDERS,
  SELLER_MONTHLY_RETURNS,
  MOCK_SELLER_PRODUCTS,
} from "@/lib/seller/mock-data";
import { formatPrice } from "@/lib/format";

const CATEGORY_DONUT = [
  { label: "Medicines", value: 52, color: "#4f46e5" },
  { label: "Cosmetics", value: 36, color: "#f97316" },
  { label: "Consumables", value: 12, color: "#10b981" },
];

const topProducts = [...MOCK_SELLER_PRODUCTS]
  .sort((a, b) => b.revenueFils - a.revenueFils)
  .slice(0, 5);

export default function SellerAnalyticsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-slate-900">Analytics</h2>

      {/* Revenue chart */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-1 text-sm font-semibold text-slate-700">Monthly Revenue (AED)</h3>
        <p className="mb-4 text-xs text-slate-400">August 2025 – July 2026</p>
        <LineChart data={SELLER_MONTHLY_REVENUE} color="#4f46e5" gradientId="analytics-revenue-grad" />
      </div>

      {/* Orders & Returns side by side */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-slate-700">Monthly Orders</h3>
          <BarChart data={SELLER_MONTHLY_ORDERS} color="#4f46e5" />
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-slate-700">Monthly Returns</h3>
          <BarChart data={SELLER_MONTHLY_RETURNS} color="#f97316" />
        </div>
      </div>

      {/* Donut + Top products */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-slate-700">Revenue by Category</h3>
          <DonutChart data={CATEGORY_DONUT} />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-slate-700">Top 5 Products by Revenue</h3>
          <div className="space-y-3">
            {topProducts.map((p, i) => {
              const pct = Math.round((p.revenueFils / topProducts[0].revenueFils) * 100);
              return (
                <div key={p.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-700 truncate max-w-56">
                      <span className="text-xs text-slate-400 mr-1">#{i + 1}</span> {p.name}
                    </span>
                    <span className="text-sm font-semibold text-slate-900 shrink-0 ml-2">{formatPrice(p.revenueFils)}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
