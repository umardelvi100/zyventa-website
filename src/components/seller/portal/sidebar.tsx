"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Warehouse,
  BarChart3,
  Wallet,
  Bell,
  Star,
  Truck,
  Activity,
  MessageSquare,
  ChevronRight,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/seller/dashboard",    icon: LayoutDashboard, label: "Dashboard" },
  { href: "/seller/products",     icon: Package,         label: "Products" },
  { href: "/seller/orders",       icon: ShoppingCart,    label: "Orders" },
  { href: "/seller/inventory",    icon: Activity,        label: "Inventory" },
  { href: "/seller/warehouses",   icon: Warehouse,       label: "Warehouses" },
  { href: "/seller/shipping",     icon: Truck,           label: "Shipping" },
  { href: "/seller/analytics",    icon: BarChart3,       label: "Analytics" },
  { href: "/seller/finance",      icon: Wallet,          label: "Finance" },
  { href: "/seller/performance",  icon: Star,            label: "Performance" },
  { href: "/seller/reviews",      icon: MessageSquare,   label: "Reviews" },
  { href: "/seller/notifications",icon: Bell,            label: "Notifications" },
];

interface SidebarProps {
  onClose?: () => void;
}

export function SellerSidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between gap-2 border-b border-slate-100 px-5">
        <div className="relative h-7 w-28">
          <Image src="/zyventa-logo.png" alt="Zyventa" fill sizes="112px" className="object-contain object-left" />
        </div>
        <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 uppercase tracking-wide">
          Seller
        </span>
        {onClose && (
          <button onClick={onClose} className="ml-2 text-slate-400 hover:text-slate-600 lg:hidden">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Store info */}
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-orange-500 text-sm font-bold text-white">
            ZM
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">Zyventa Medical</p>
            <p className="text-xs text-emerald-600 font-medium">● Verified Seller</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || (href !== "/seller/dashboard" && pathname.startsWith(href));
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${active ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                    {label}
                  </span>
                  {active && <ChevronRight className="h-3.5 w-3.5 text-indigo-400" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-100 p-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition"
        >
          Back to Marketplace
        </Link>
      </div>
    </aside>
  );
}
