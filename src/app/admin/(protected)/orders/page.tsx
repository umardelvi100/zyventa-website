import { MOCK_ORDERS } from "@/lib/admin/mock-data";
import { OrderBadge } from "@/components/admin/status-badge";

function aed(fils: number) {
  return `AED ${(fils / 100).toLocaleString("en-AE", { maximumFractionDigits: 0 })}`;
}

const STATUS_COUNTS = ["pending", "processing", "shipped", "delivered", "returned", "cancelled"] as const;

export default function OrdersPage() {
  const totals = Object.fromEntries(
    STATUS_COUNTS.map((s) => [s, MOCK_ORDERS.filter((o) => o.status === s).length]),
  );
  const totalRevenue = MOCK_ORDERS.filter((o) => o.status === "delivered").reduce(
    (acc, o) => acc + o.totalFils,
    0,
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
        {STATUS_COUNTS.map((s) => (
          <div key={s} className="rounded-2xl border border-neutral-200 bg-white p-4 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <p className="text-xl font-bold text-neutral-900 dark:text-white">{totals[s]}</p>
            <p className="mt-0.5 text-[11px] capitalize text-neutral-400">{s}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <p className="text-xs text-neutral-400">Total Revenue from Delivered Orders</p>
        <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{aed(totalRevenue)}</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
          <p className="text-sm font-semibold text-neutral-800 dark:text-white">All Orders</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-800/50">
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Order ID</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Customer</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Seller</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Products</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">Total</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">Commission</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">City</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Date</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800/50">
              {MOCK_ORDERS.map((o) => (
                <tr key={o.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/30">
                  <td className="px-5 py-4 font-mono text-xs text-neutral-500">{o.id}</td>
                  <td className="px-5 py-4 font-medium text-neutral-800 dark:text-neutral-200">{o.customerName}</td>
                  <td className="px-5 py-4 text-neutral-500">{o.sellerName}</td>
                  <td className="px-5 py-4 max-w-[200px]">
                    <p className="truncate text-xs text-neutral-600 dark:text-neutral-400">{o.products.join(", ")}</p>
                  </td>
                  <td className="px-5 py-4 text-right font-semibold tabular-nums text-neutral-900 dark:text-white">{aed(o.totalFils)}</td>
                  <td className="px-5 py-4 text-right tabular-nums text-emerald-600 dark:text-emerald-400">{aed(o.commissionFils)}</td>
                  <td className="px-5 py-4 text-neutral-400">{o.city}</td>
                  <td className="px-5 py-4 text-neutral-400">{o.orderDate}</td>
                  <td className="px-5 py-4"><OrderBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
