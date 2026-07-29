"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Truck, Boxes, Users } from "lucide-react";

const LINKS = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/orders", icon: Truck, label: "Order Tracking" },
  { href: "/admin/inventory", icon: Boxes, label: "Inventory" },
  { href: "/admin/sellers", icon: Users, label: "Sellers" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-row flex-wrap gap-1 rounded-2xl border border-black/5 bg-white p-2 dark:border-white/10 dark:bg-neutral-900 lg:w-52 lg:shrink-0 lg:flex-col">
      <p className="hidden w-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-neutral-400 lg:block">
        Admin Panel
      </p>
      {LINKS.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              isActive
                ? "bg-indigo-600 text-white"
                : "text-neutral-600 hover:bg-black/5 dark:text-neutral-300 dark:hover:bg-white/10"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" /> {label}
          </Link>
        );
      })}
    </nav>
  );
}
