import Link from "next/link";
import { MOCK_PRODUCTS } from "@/lib/admin/mock-data";
import { ApprovalBadge } from "@/components/admin/status-badge";

function aed(fils: number) {
  return `AED ${(fils / 100).toFixed(2)}`;
}

export default function ProductsPage() {
  const pending = MOCK_PRODUCTS.filter((p) => p.approvalStatus === "pending_review");

  return (
    <div className="flex flex-col gap-6">
      {pending.length > 0 && (
        <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 dark:border-amber-800 dark:bg-amber-950/20">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
            {pending.length} product{pending.length > 1 ? "s" : ""} are pending review and not yet live on the marketplace.
          </p>
          <Link
            href="/admin/products/approval"
            className="rounded-lg bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-700"
          >
            Review Now
          </Link>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
          <p className="text-sm font-semibold text-neutral-800 dark:text-white">
            All Products <span className="ml-2 text-neutral-400">({MOCK_PRODUCTS.length})</span>
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-800/50">
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Product</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Seller</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Category</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">Price</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">Stock</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">Sold</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">Rating</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800/50">
              {MOCK_PRODUCTS.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/30">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-neutral-900 dark:text-white">{p.name}</p>
                    <p className="text-xs text-neutral-400">{p.slug}</p>
                  </td>
                  <td className="px-5 py-4 text-neutral-600 dark:text-neutral-400">{p.sellerName}</td>
                  <td className="px-5 py-4 text-neutral-500">{p.category}</td>
                  <td className="px-5 py-4 text-right tabular-nums text-neutral-700 dark:text-neutral-300">{aed(p.priceFils)}</td>
                  <td className="px-5 py-4 text-right tabular-nums text-neutral-700 dark:text-neutral-300">{p.stock}</td>
                  <td className="px-5 py-4 text-right tabular-nums text-neutral-700 dark:text-neutral-300">{p.totalSold}</td>
                  <td className="px-5 py-4 text-right text-neutral-600 dark:text-neutral-400">
                    {p.rating > 0 ? `★ ${p.rating}` : "—"}
                  </td>
                  <td className="px-5 py-4"><ApprovalBadge status={p.approvalStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
