"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  BadgeCheck,
  Package,
  ClipboardCheck,
  ShoppingCart,
  Users,
  BarChart3,
  DollarSign,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  Globe,
} from "lucide-react";
import { adminLogoutAction } from "@/app/admin/actions";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

interface NavGroup {
  items: NavItem[];
}

const UNREAD_NOTIFICATIONS = 4;
const PENDING_PRODUCTS = 4;
const PENDING_SELLERS = 3;

const NAV: NavGroup[] = [
  {
    items: [
      {
        label: "Dashboard",
        href: "/admin/dashboard",
        icon: <LayoutDashboard className="h-4 w-4" />,
      },
    ],
  },
  {
    items: [
      {
        label: "All Sellers",
        href: "/admin/sellers",
        icon: <Building2 className="h-4 w-4" />,
      },
      {
        label: "Verification Queue",
        href: "/admin/sellers/verification",
        icon: <BadgeCheck className="h-4 w-4" />,
        badge: PENDING_SELLERS,
      },
      {
        label: "All Products",
        href: "/admin/products",
        icon: <Package className="h-4 w-4" />,
      },
      {
        label: "Approval Queue",
        href: "/admin/products/approval",
        icon: <ClipboardCheck className="h-4 w-4" />,
        badge: PENDING_PRODUCTS,
      },
      {
        label: "Orders",
        href: "/admin/orders",
        icon: <ShoppingCart className="h-4 w-4" />,
      },
      {
        label: "Customers",
        href: "/admin/customers",
        icon: <Users className="h-4 w-4" />,
      },
    ],
  },
  {
    items: [
      {
        label: "Analytics",
        href: "/admin/analytics",
        icon: <BarChart3 className="h-4 w-4" />,
      },
      {
        label: "Revenue",
        href: "/admin/revenue",
        icon: <DollarSign className="h-4 w-4" />,
      },
      {
        label: "Notifications",
        href: "/admin/notifications",
        icon: <Bell className="h-4 w-4" />,
        badge: UNREAD_NOTIFICATIONS,
      },
    ],
  },
  {
    items: [
      {
        label: "Homepage CMS",
        href: "/admin/homepage",
        icon: <Globe className="h-4 w-4" />,
      },
    ],
  },
  {
    items: [
      {
        label: "Settings",
        href: "/admin/settings",
        icon: <Settings className="h-4 w-4" />,
      },
    ],
  },
];

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const active =
    item.href === "/admin/dashboard"
      ? pathname === item.href
      : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ${
        active
          ? "bg-indigo-600 text-white"
          : "text-slate-400 hover:bg-slate-800 hover:text-white"
      }`}
    >
      <span className="shrink-0">{item.icon}</span>
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge ? (
        <span
          className={`ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
            active ? "bg-white/20 text-white" : "bg-indigo-600 text-white"
          }`}
        >
          {item.badge}
        </span>
      ) : active ? (
        <ChevronRight className="h-3.5 w-3.5 opacity-60" />
      ) : null}
    </Link>
  );
}

export function AdminSidebar() {
  return (
    <aside className="flex h-full w-60 shrink-0 flex-col bg-slate-950 select-none">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-5">
        <div className="relative h-7 w-24">
          <Image
            src="/zyventa-logo.png"
            alt="Zyventa"
            fill
            sizes="96px"
            className="object-contain object-left brightness-0 invert"
          />
        </div>
        <span className="rounded-md bg-indigo-600/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-indigo-400">
          Admin
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAV.map((group, gi) => (
          <div key={gi} className={gi > 0 ? "mt-1 border-t border-slate-800 pt-3" : ""}>
            {group.items.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>
        ))}
      </nav>

      {/* Admin user + logout */}
      <div className="border-t border-slate-800 p-3">
        <div className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
            UA
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-xs font-semibold text-white">Umar Delvi</p>
            <p className="truncate text-[10px] text-slate-500">Platform Admin</p>
          </div>
        </div>
        <form action={adminLogoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
