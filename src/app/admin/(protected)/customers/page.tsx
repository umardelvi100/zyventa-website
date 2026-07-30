import { MOCK_CUSTOMERS } from "@/lib/admin/mock-data";

function aed(fils: number) {
  return fils > 0
    ? `AED ${(fils / 100).toLocaleString("en-AE", { maximumFractionDigits: 0 })}`
    : "—";
}

export default function CustomersPage() {
  const totalSpent = MOCK_CUSTOMERS.reduce((s, c) => s + c.totalSpentFils, 0);
  const totalOrders = MOCK_CUSTOMERS.reduce((s, c) => s + c.totalOrders, 0);
  const avgOrderValue = totalOrders > 0 ? Math.round(totalSpent / totalOrders) : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Customers", value: MOCK_CUSTOMERS.length },
          { label: "Total Orders", value: totalOrders },
          { label: "Total Spent", value: aed(totalSpent) },
          { label: "Avg. Order Value", value: aed(avgOrderValue) },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">{s.value}</p>
            <p className="text-xs text-neutral-400">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
          <p className="text-sm font-semibold text-neutral-800 dark:text-white">All Customers</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-800/50">
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Name</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Contact</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">City</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">Orders</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">Total Spent</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Registered</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800/50">
              {MOCK_CUSTOMERS.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/30">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400">
                        {c.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                      </div>
                      <p className="font-medium text-neutral-800 dark:text-neutral-200">{c.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-neutral-600 dark:text-neutral-400">{c.email}</p>
                    <p className="text-xs text-neutral-400">{c.phone}</p>
                  </td>
                  <td className="px-5 py-4 text-neutral-500">{c.city}</td>
                  <td className="px-5 py-4 text-right tabular-nums font-medium text-neutral-800 dark:text-neutral-200">{c.totalOrders}</td>
                  <td className="px-5 py-4 text-right tabular-nums font-semibold text-neutral-900 dark:text-white">{aed(c.totalSpentFils)}</td>
                  <td className="px-5 py-4 text-neutral-400">{c.registrationDate}</td>
                  <td className="px-5 py-4 text-neutral-400">{c.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
