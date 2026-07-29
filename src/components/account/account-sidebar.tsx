"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Truck, RotateCcw, Package, MapPin, Heart } from "lucide-react";
import { useLocale } from "@/components/locale-provider";

export function AccountSidebar() {
  const pathname = usePathname();
  const { dict } = useLocale();

  const links = [
    { href: "/account/tracking", label: dict.nav.orderTracking, icon: Truck },
    { href: "/account/returns", label: dict.nav.cancellationsReturns, icon: RotateCcw },
    { href: "/account/orders", label: dict.nav.ordersReturns, icon: Package },
    { href: "/account/addresses", label: dict.nav.addresses, icon: MapPin },
    { href: "/wishlist", label: dict.nav.wishlist, icon: Heart },
  ];

  return (
    <nav className="flex gap-1 overflow-x-auto pb-2 lg:w-56 lg:shrink-0 lg:flex-col lg:overflow-visible lg:pb-0">
      {links.map((link) => {
        const isActive = pathname === link.href;
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              isActive
                ? "bg-indigo-600 text-white dark:bg-white dark:text-neutral-950"
                : "text-neutral-600 hover:bg-black/5 dark:text-neutral-300 dark:hover:bg-white/10"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" /> {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
