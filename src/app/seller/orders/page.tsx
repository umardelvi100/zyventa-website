"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { OrderStatusBadge } from "@/components/seller/portal/status-badge";
import { MOCK_SELLER_ORDERS } from "@/lib/seller/mock-data";
import { formatPrice } from "@/lib/format";
import type { SellerOrderStatus } from "@/lib/seller/types";

const STATUS_TABS: Array<{ label: string; value: SellerOrderStatus | "all" }> = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Packed", value: "packed" },
  { label: "Warehouse", value: "warehouse_accepted" },
  { label: "Ready", value: "ready_for_pickup" },
  { label: "Shipped", value: "shipped" },
  { label: "Out for Delivery", value: "out_for_delivery" },
  { label: "Delivered", value: "delivered" },
  { label: "Returned", value: "returned" },
  { label: "Cancelled", value: "cancelled" },
];

export default function SellerOrdersPage() {
  const [tab, setTab] = useState<SellerOrderStatus | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = MOCK_SELLER_ORDERS.filter((o) => {
    const matchStatus = tab === "all" || o.status === tab;
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.product.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Orders</h2>
      </div>

      {/* Status tabs */}
      <div className="flex overflow-x-auto gap-1 rounded-xl border border-slate-200 bg-white p-1 text-sm">
        {STATUS_TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`shrink-0 rounded-lg px-3 py-1.5 font-medium transition ${
              tab === t.value
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="search"
          placeholder="Search order ID, customer, or product…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left">
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">Order ID</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">Customer</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">Product</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">Qty</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">Date</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">Status</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">Courier</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">Tracking</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">Est. Delivery</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">Payment</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50 transition">
                <td className="px-5 py-3 font-mono text-xs font-semibold text-indigo-600">{order.id}</td>
                <td className="px-5 py-3 text-slate-700">{order.customerName}</td>
                <td className="px-5 py-3 max-w-44 truncate text-slate-600">{order.product}</td>
                <td className="px-5 py-3 text-slate-700">{order.quantity}</td>
                <td className="px-5 py-3 text-slate-500 whitespace-nowrap">{order.orderDate}</td>
                <td className="px-5 py-3 whitespace-nowrap"><OrderStatusBadge status={order.status} /></td>
                <td className="px-5 py-3 text-slate-600">{order.courier}</td>
                <td className="px-5 py-3 font-mono text-xs text-slate-500">{order.trackingNumber}</td>
                <td className="px-5 py-3 text-slate-500 whitespace-nowrap">{order.estimatedDelivery}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-medium ${
                    order.paymentStatus === "paid" ? "text-emerald-600" :
                    order.paymentStatus === "refunded" ? "text-orange-600" : "text-amber-600"
                  }`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="px-5 py-3 font-semibold text-slate-900 whitespace-nowrap">{formatPrice(order.totalFils)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-sm text-slate-400">No orders match the current filter.</div>
        )}
      </div>
    </div>
  );
}
