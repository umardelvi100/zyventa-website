"use client";

import { useState } from "react";
import { Package, Plus, Edit, Trash2, Copy, PauseCircle, Star } from "lucide-react";
import { ApprovalBadge } from "@/components/seller/portal/status-badge";
import { MOCK_SELLER_PRODUCTS } from "@/lib/seller/mock-data";
import { formatPrice } from "@/lib/format";
import type { SellerProduct } from "@/lib/seller/types";

const FILTER_TABS = ["All", "Active", "Inactive", "Pending Approval", "Low Stock"];

export default function SellerProductsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = MOCK_SELLER_PRODUCTS.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());

    const matchTab =
      activeTab === "All" ||
      (activeTab === "Active" && p.active) ||
      (activeTab === "Inactive" && !p.active) ||
      (activeTab === "Pending Approval" && p.approvalStatus === "pending") ||
      (activeTab === "Low Stock" && p.stock < 10);

    return matchSearch && matchTab;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">My Products</h2>
        <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition">
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex overflow-hidden rounded-lg border border-slate-200 bg-white text-sm">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 font-medium transition ${
                activeTab === tab
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <input
          type="search"
          placeholder="Search name or SKU…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-48 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left">
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">Product</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">SKU</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">Category</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">Price</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">Stock</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">Status</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">Rating</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">Orders</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">Revenue</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((product: SellerProduct) => (
              <tr key={product.id} className="hover:bg-slate-50 transition">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                      <Package className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate max-w-44 font-medium text-slate-900">{product.name}</p>
                      <ApprovalBadge status={product.approvalStatus} />
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 font-mono text-xs text-slate-500">{product.sku}</td>
                <td className="px-5 py-3 text-slate-600">{product.category}</td>
                <td className="px-5 py-3 font-semibold text-slate-900">{formatPrice(product.priceFils)}</td>
                <td className="px-5 py-3">
                  <span
                    className={`font-semibold ${
                      product.stock === 0 ? "text-red-600" : product.stock < 10 ? "text-amber-600" : "text-slate-900"
                    }`}
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                      product.active
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-slate-50 text-slate-600"
                    }`}
                  >
                    {product.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className="flex items-center gap-1 text-amber-600 font-semibold">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {product.rating}
                  </span>
                </td>
                <td className="px-5 py-3 text-slate-700">{product.orders.toLocaleString()}</td>
                <td className="px-5 py-3 font-semibold text-slate-900">{formatPrice(product.revenueFils)}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1">
                    <button title="Edit" className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button title="Duplicate" className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-sky-600 transition">
                      <Copy className="h-4 w-4" />
                    </button>
                    <button title="Pause" className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-amber-600 transition">
                      <PauseCircle className="h-4 w-4" />
                    </button>
                    <button title="Delete" className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-600 transition">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-sm text-slate-400">No products found.</div>
        )}
      </div>
    </div>
  );
}
