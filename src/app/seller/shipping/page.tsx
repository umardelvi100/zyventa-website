import { Truck } from "lucide-react";
import { MOCK_SELLER_SHIPMENTS } from "@/lib/seller/mock-data";

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  pending:    { label: "Pending",    className: "bg-amber-50 text-amber-700 border-amber-200" },
  ready:      { label: "Ready",      className: "bg-blue-50 text-blue-700 border-blue-200" },
  in_transit: { label: "In Transit", className: "bg-sky-50 text-sky-700 border-sky-200" },
  delivered:  { label: "Delivered",  className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  failed:     { label: "Failed",     className: "bg-red-50 text-red-700 border-red-200" },
};

export default function SellerShippingPage() {
  const summaries = [
    { label: "Pending Pickup",  value: MOCK_SELLER_SHIPMENTS.filter(s => s.status === "pending").length,    color: "text-amber-600" },
    { label: "Ready to Ship",   value: MOCK_SELLER_SHIPMENTS.filter(s => s.status === "ready").length,      color: "text-blue-600" },
    { label: "In Transit",      value: MOCK_SELLER_SHIPMENTS.filter(s => s.status === "in_transit").length, color: "text-sky-600" },
    { label: "Delivered",       value: MOCK_SELLER_SHIPMENTS.filter(s => s.status === "delivered").length,  color: "text-emerald-600" },
    { label: "Failed",          value: MOCK_SELLER_SHIPMENTS.filter(s => s.status === "failed").length,     color: "text-red-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Shipping Center</h2>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {summaries.map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Shipments table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left">
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">Shipment</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">Order ID</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">Customer</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">Product</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">Status</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">Courier</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">Tracking</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">Est. Delivery</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {MOCK_SELLER_SHIPMENTS.map((s) => {
              const cfg = STATUS_CONFIG[s.status];
              return (
                <tr key={s.id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-slate-400" />
                      <span className="font-mono text-xs font-semibold text-indigo-600">{s.id}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-slate-500">{s.orderId}</td>
                  <td className="px-5 py-3 text-slate-700">{s.customerName}</td>
                  <td className="px-5 py-3 max-w-44 truncate text-slate-600">{s.product}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.className}`}>
                      {cfg.label}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{s.courier}</td>
                  <td className="px-5 py-3 font-mono text-xs text-slate-500">{s.trackingNumber}</td>
                  <td className="px-5 py-3 text-slate-500 whitespace-nowrap">{s.estimatedDelivery}</td>
                  <td className="px-5 py-3 text-slate-400 text-xs whitespace-nowrap">{s.createdAt}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
