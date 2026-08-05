import { Warehouse, MapPin, User, Package, ShoppingCart, Activity } from "lucide-react";
import { MOCK_SELLER_WAREHOUSES } from "@/lib/seller/mock-data";

export default function SellerWarehousesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Warehouses</h2>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {MOCK_SELLER_WAREHOUSES.map((wh) => {
          const statusColor =
            wh.status === "active"
              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
              : wh.status === "maintenance"
              ? "bg-amber-100 text-amber-700 border-amber-200"
              : "bg-slate-100 text-slate-600 border-slate-200";

          const barColor =
            wh.capacityPercent >= 80
              ? "bg-red-500"
              : wh.capacityPercent >= 50
              ? "bg-amber-500"
              : "bg-emerald-500";

          return (
            <div key={wh.id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <Warehouse className="h-5 w-5" />
                </div>
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColor}`}>
                  {wh.status === "active" ? "Active" : wh.status === "maintenance" ? "Maintenance" : "Inactive"}
                </span>
              </div>

              <h3 className="text-base font-semibold text-slate-900">{wh.name}</h3>

              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span>{wh.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <User className="h-4 w-4 shrink-0" />
                  <span>{wh.manager}</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-slate-50 p-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                    <Package className="h-3.5 w-3.5" />
                    Products
                  </div>
                  <p className="text-base font-bold text-slate-900">{wh.productsStored}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                    <ShoppingCart className="h-3.5 w-3.5" />
                    Orders
                  </div>
                  <p className="text-base font-bold text-slate-900">{wh.ordersProcessed.toLocaleString()}</p>
                </div>
              </div>

              {/* Capacity bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Activity className="h-3.5 w-3.5" /> Capacity
                  </span>
                  <span className="text-xs font-semibold text-slate-700">{wh.capacityPercent}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div
                    className={`h-2 rounded-full transition-all ${barColor}`}
                    style={{ width: `${wh.capacityPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
