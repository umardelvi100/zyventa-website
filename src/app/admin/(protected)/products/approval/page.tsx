import { MOCK_PRODUCTS } from "@/lib/admin/mock-data";
import { ApprovalBadge } from "@/components/admin/status-badge";
import { approveProductAction, rejectProductAction } from "@/app/admin/actions";

function aed(fils: number) {
  return `AED ${(fils / 100).toFixed(2)}`;
}

export default function ProductApprovalPage() {
  const pending = MOCK_PRODUCTS.filter((p) => p.approvalStatus === "pending_review");
  const rejected = MOCK_PRODUCTS.filter((p) => p.approvalStatus === "rejected");

  return (
    <div className="flex flex-col gap-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pending Review", value: pending.length, cls: "text-amber-600 dark:text-amber-400" },
          {
            label: "Approved (total)",
            value: MOCK_PRODUCTS.filter((p) => p.approvalStatus === "approved").length,
            cls: "text-emerald-600 dark:text-emerald-400",
          },
          { label: "Rejected (total)", value: rejected.length, cls: "text-red-600 dark:text-red-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">{s.value}</p>
            <p className={`text-xs font-medium ${s.cls}`}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Workflow explanation */}
      <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4 dark:border-indigo-900 dark:bg-indigo-950/20">
        <p className="text-sm font-semibold text-indigo-800 dark:text-indigo-300">Product Approval Workflow</p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-indigo-700 dark:text-indigo-400">
          <span className="font-medium">Seller Upload</span>
          <span>→</span>
          <span className="font-medium">Pending Review</span>
          <span>→</span>
          <span className="font-medium">Admin Review</span>
          <span>→</span>
          <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">Approved → Live</span>
          <span>or</span>
          <span className="rounded bg-red-100 px-1.5 py-0.5 font-semibold text-red-700 dark:bg-red-950/40 dark:text-red-400">Rejected → Not listed</span>
        </div>
      </div>

      {/* Pending products */}
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
          <p className="text-sm font-semibold text-neutral-800 dark:text-white">Pending Product Review</p>
        </div>
        {pending.length === 0 ? (
          <div className="py-16 text-center text-sm text-neutral-400">No products pending review.</div>
        ) : (
          <div className="divide-y divide-neutral-50 dark:divide-neutral-800/50">
            {pending.map((p) => (
              <div key={p.id} className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-neutral-900 dark:text-white">{p.name}</span>
                    <ApprovalBadge status={p.approvalStatus} />
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-400">
                    <span>Seller: <span className="font-medium text-neutral-600 dark:text-neutral-300">{p.sellerName}</span></span>
                    <span>Category: {p.category}</span>
                    <span>Price: {aed(p.priceFils)}</span>
                    <span>Stock: {p.stock} units</span>
                    <span>Submitted: {p.submittedDate}</span>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <form action={rejectProductAction.bind(null, p.id, "Does not meet platform standards.")}>
                    <button
                      type="submit"
                      className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-xs font-medium text-red-700 hover:bg-red-100 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400"
                    >
                      Reject
                    </button>
                  </form>
                  <form action={approveProductAction.bind(null, p.id)}>
                    <button
                      type="submit"
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                    >
                      Approve & Publish
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rejected products */}
      {rejected.length > 0 && (
        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
            <p className="text-sm font-semibold text-neutral-800 dark:text-white">Rejected Products</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-800/50">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Product</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Seller</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Reason</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800/50">
                {rejected.map((p) => (
                  <tr key={p.id}>
                    <td className="px-5 py-3 font-medium text-neutral-800 dark:text-neutral-200">{p.name}</td>
                    <td className="px-5 py-3 text-neutral-500">{p.sellerName}</td>
                    <td className="px-5 py-3 max-w-xs text-red-600 dark:text-red-400">
                      {p.rejectionReason ?? "—"}
                    </td>
                    <td className="px-5 py-3 text-neutral-400">{p.reviewedDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
