import { AlertTriangle, TrendingDown, Package, ArrowDownToLine } from "lucide-react";
import { MOCK_SELLER_INVENTORY } from "@/lib/seller/mock-data";

export default function SellerInventoryPage() {
  const lowStock = MOCK_SELLER_INVENTORY.filter((i) => i.availableStock < 10);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Inventory Tracking</h2>
        <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
          <ArrowDownToLine className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Low stock alert */}
      {lowStock.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <p className="text-sm font-semibold text-amber-800">{lowStock.length} item{lowStock.length > 1 ? "s" : ""} running low</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStock.map((i) => (
              <span key={i.id} className="rounded-full bg-amber-100 border border-amber-200 px-3 py-1 text-xs font-medium text-amber-800">
                {i.productName} — {i.availableStock} left
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total SKUs",         value: MOCK_SELLER_INVENTORY.length,                       icon: <Package className="h-4 w-4"/>,        color: "text-indigo-600 bg-indigo-50" },
          { label: "Low Stock Items",    value: lowStock.length,                                     icon: <AlertTriangle className="h-4 w-4"/>,  color: "text-amber-600 bg-amber-50" },
          { label: "Out of Stock",       value: MOCK_SELLER_INVENTORY.filter(i => i.availableStock === 0).length, icon: <TrendingDown className="h-4 w-4"/>, color: "text-red-600 bg-red-50" },
          { label: "Incoming Stock",     value: MOCK_SELLER_INVENTORY.reduce((s,i) => s + i.incomingStock, 0).toLocaleString() + " units", icon: <ArrowDownToLine className="h-4 w-4"/>, color: "text-emerald-600 bg-emerald-50" },
        ].map((c) => (
          <div key={c.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className={`mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg ${c.color}`}>{c.icon}</div>
            <p className="text-xl font-bold text-slate-900">{c.value}</p>
            <p className="text-xs text-slate-500">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left">
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">Product</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">SKU</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">Current</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">Reserved</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">Available</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">Incoming</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">Warehouse</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">Last Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {MOCK_SELLER_INVENTORY.map((item) => {
              const isLow = item.availableStock < 10;
              const isOut = item.availableStock === 0;
              return (
                <tr key={item.id} className={`transition ${isOut ? "bg-red-50/40" : isLow ? "bg-amber-50/40" : "hover:bg-slate-50"}`}>
                  <td className="px-5 py-3">
                    <p className="font-medium text-slate-900">{item.productName}</p>
                    {isLow && !isOut && <p className="text-xs text-amber-600 font-medium mt-0.5">⚠ Low stock</p>}
                    {isOut && <p className="text-xs text-red-600 font-medium mt-0.5">✕ Out of stock</p>}
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-slate-500">{item.sku}</td>
                  <td className="px-5 py-3 text-slate-700">{item.currentStock}</td>
                  <td className="px-5 py-3 text-slate-500">{item.reservedStock}</td>
                  <td className={`px-5 py-3 font-semibold ${isOut ? "text-red-600" : isLow ? "text-amber-600" : "text-emerald-600"}`}>
                    {item.availableStock}
                  </td>
                  <td className="px-5 py-3 text-slate-500">{item.incomingStock > 0 ? `+${item.incomingStock}` : "—"}</td>
                  <td className="px-5 py-3 text-slate-600">{item.warehouseLocation}</td>
                  <td className="px-5 py-3 text-slate-400 text-xs">{item.lastUpdated}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
