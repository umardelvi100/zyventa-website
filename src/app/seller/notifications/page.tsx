"use client";

import { useState } from "react";
import { Bell, Package, ShoppingCart, AlertTriangle, Star, RefreshCw, DollarSign, Wallet, Clock, CheckCircle } from "lucide-react";
import { MOCK_SELLER_NOTIFICATIONS } from "@/lib/seller/mock-data";
import { SeverityDot } from "@/components/seller/portal/status-badge";
import type { SellerNotification } from "@/lib/seller/types";

const TYPE_ICON: Record<SellerNotification["type"], React.ReactNode> = {
  order:     <ShoppingCart className="h-4 w-4" />,
  approval:  <CheckCircle className="h-4 w-4" />,
  rejection: <AlertTriangle className="h-4 w-4" />,
  low_stock: <AlertTriangle className="h-4 w-4" />,
  review:    <Star className="h-4 w-4" />,
  return:    <RefreshCw className="h-4 w-4" />,
  payment:   <DollarSign className="h-4 w-4" />,
  payout:    <Wallet className="h-4 w-4" />,
  delay:     <Clock className="h-4 w-4" />,
};

const SEVERITY_BG: Record<SellerNotification["severity"], string> = {
  info:    "bg-blue-100 text-blue-600",
  warning: "bg-amber-100 text-amber-600",
  success: "bg-emerald-100 text-emerald-600",
  error:   "bg-red-100 text-red-600",
};

export default function SellerNotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const notifications = MOCK_SELLER_NOTIFICATIONS.filter((n) =>
    filter === "all" ? true : !n.read,
  );
  const unreadCount = MOCK_SELLER_NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
          {unreadCount > 0 && (
            <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-700">
              {unreadCount} unread
            </span>
          )}
        </div>
        <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition">
          Mark all as read
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 rounded-xl border border-slate-200 bg-white p-1 w-fit text-sm">
        {(["all", "unread"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-4 py-1.5 font-medium transition capitalize ${
              filter === f ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm divide-y divide-slate-100">
        {notifications.length === 0 && (
          <div className="py-16 flex flex-col items-center gap-3 text-slate-400">
            <Bell className="h-8 w-8" />
            <p className="text-sm">No notifications</p>
          </div>
        )}
        {notifications.map((n) => (
          <div key={n.id} className={`flex items-start gap-4 px-6 py-4 transition hover:bg-slate-50 ${!n.read ? "bg-indigo-50/30" : ""}`}>
            <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${SEVERITY_BG[n.severity]}`}>
              {TYPE_ICON[n.type]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <SeverityDot severity={n.severity} />
                <p className="text-sm font-semibold text-slate-900">{n.title}</p>
                {!n.read && (
                  <span className="rounded-full bg-indigo-600 px-1.5 py-0.5 text-[10px] font-bold text-white">NEW</span>
                )}
              </div>
              <p className="mt-0.5 text-sm text-slate-600">{n.message}</p>
              <p className="mt-1 text-xs text-slate-400">{new Date(n.timestamp).toLocaleString("en-AE")}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
