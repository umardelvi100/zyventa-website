"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Bell } from "lucide-react";

const TITLES: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/sellers": "Seller Management",
  "/admin/sellers/verification": "Verification Queue",
  "/admin/products": "Product Management",
  "/admin/products/approval": "Approval Queue",
  "/admin/orders": "Orders",
  "/admin/customers": "Customers",
  "/admin/analytics": "Analytics",
  "/admin/revenue": "Revenue",
  "/admin/notifications": "Notifications",
  "/admin/settings": "Settings",
};

function resolveTitle(pathname: string): string {
  if (TITLES[pathname]) return TITLES[pathname];
  // Dynamic routes like /admin/sellers/[id]
  if (/^\/admin\/sellers\/[^/]+$/.test(pathname)) return "Seller Profile";
  return "Admin";
}

const UNREAD = 4;

export function AdminHeader() {
  const pathname = usePathname();
  const title = resolveTitle(pathname);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-6 dark:border-neutral-800 dark:bg-neutral-900">
      <div>
        <h1 className="text-base font-semibold text-neutral-900 dark:text-white">{title}</h1>
        <p className="text-xs text-neutral-400">Zyventa Admin Portal</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Today's date */}
        <span className="hidden text-xs text-neutral-400 sm:inline">
          {new Date().toLocaleDateString("en-AE", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>

        {/* Notification bell */}
        <Link
          href="/admin/notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-800 dark:border-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-white"
        >
          <Bell className="h-4 w-4" />
          {UNREAD > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
              {UNREAD}
            </span>
          )}
        </Link>

        {/* Admin avatar */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
          UA
        </div>
      </div>
    </header>
  );
}
