"use client";

import { usePathname } from "next/navigation";
import { Bell, Menu } from "lucide-react";
import Link from "next/link";

const PAGE_TITLES: Record<string, string> = {
  "/seller/dashboard":     "Dashboard",
  "/seller/products":      "Products",
  "/seller/orders":        "Orders",
  "/seller/inventory":     "Inventory",
  "/seller/warehouses":    "Warehouses",
  "/seller/shipping":      "Shipping Center",
  "/seller/analytics":     "Analytics",
  "/seller/finance":       "Finance",
  "/seller/performance":   "Performance",
  "/seller/reviews":       "Reviews",
  "/seller/notifications": "Notifications",
};

interface HeaderProps {
  onMenuClick?: () => void;
  unreadNotifications?: number;
}

export function SellerHeader({ onMenuClick, unreadNotifications = 4 }: HeaderProps) {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "Seller Portal";

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="text-slate-500 hover:text-slate-700 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/seller/notifications" className="relative p-2 text-slate-500 hover:text-slate-700 transition">
          <Bell className="h-5 w-5" />
          {unreadNotifications > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
              {unreadNotifications}
            </span>
          )}
        </Link>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-orange-500 text-xs font-bold text-white">
          ZM
        </div>
      </div>
    </header>
  );
}
