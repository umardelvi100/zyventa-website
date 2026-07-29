"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import {
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  LogOut,
  Package,
  MapPin,
  Store,
  ChevronDown,
  LayoutGrid,
  ShieldCheck,
  Truck,
  Search,
  RotateCcw,
} from "lucide-react";
import { useCartStore, cartCount } from "@/lib/cart-store";
import { useHasMounted } from "@/lib/use-has-mounted";
import { useLocale } from "@/components/locale-provider";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getCategoryPalette } from "@/lib/category-colors";

export type NavCategory = { name: string; subcategories: string[] };

export function Navbar({ categories }: { categories: NavCategory[] }) {
  const { data: session, status } = useSession();
  const { dict } = useLocale();
  const items = useCartStore((s) => s.items);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const mounted = useHasMounted();

  const count = mounted ? cartCount(items) : 0;
  const isSeller = Boolean(session?.user?.sellerId);
  const isAdmin = Boolean(session?.user?.isAdmin);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-lg dark:border-white/10 dark:bg-neutral-950/80">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex flex-col items-start">
          <motion.span whileHover={{ scale: 1.02 }} className="relative block h-9 w-[130px]">
            <Image
              src="/zyventa-logo.png"
              alt="Zyventa"
              fill
              sizes="130px"
              className="object-contain object-left"
              priority
            />
          </motion.span>
          <span className="mt-0.5 hidden text-[9px] font-bold uppercase tracking-[0.18em] text-neutral-400 sm:block">
            Health &amp; Beauty Marketplace
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/"
            className="rounded-full px-3 py-2 text-sm font-medium text-neutral-600 transition hover:bg-black/5 hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white"
          >
            {dict.nav.home}
          </Link>

          {categories.map((cat) => {
            const palette = getCategoryPalette(cat.name);
            return (
              <Link
                key={cat.name}
                href={`/products?category=${encodeURIComponent(cat.name)}`}
                className="rounded-full px-3 py-2 text-sm font-medium text-neutral-600 transition hover:bg-black/5 hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <span className="flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full bg-gradient-to-br ${palette.gradient}`} />
                  {cat.name}
                </span>
              </Link>
            );
          })}

          <div className="relative">
            <button
              onClick={() => setShopMenuOpen((v) => !v)}
              onBlur={() => setTimeout(() => setShopMenuOpen(false), 150)}
              className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-neutral-600 transition hover:bg-black/5 hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white"
            >
              More <ChevronDown className={`h-3.5 w-3.5 transition ${shopMenuOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {shopMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute start-0 mt-2 max-h-[75vh] w-80 overflow-y-auto rounded-2xl border border-black/5 bg-white p-1.5 shadow-xl dark:border-white/10 dark:bg-neutral-900"
                >
                  <Link
                    href="/products"
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    <LayoutGrid className="h-4 w-4" /> {dict.nav.allProducts}
                  </Link>
                  <div className="my-1 h-px bg-black/5 dark:bg-white/10" />
                  {categories.map((cat) => {
                    const palette = getCategoryPalette(cat.name);
                    return (
                      <div key={cat.name} className="px-1 py-1">
                        <Link
                          href={`/products?category=${encodeURIComponent(cat.name)}`}
                          className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-semibold transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        >
                          <span className={`h-2 w-2 shrink-0 rounded-full bg-gradient-to-br ${palette.gradient}`} />
                          {cat.name}
                        </Link>
                        {cat.subcategories.length > 0 && (
                          <div className="ms-4 flex flex-wrap gap-1 py-1">
                            {cat.subcategories.map((sub) => (
                              <Link
                                key={sub}
                                href={`/products?category=${encodeURIComponent(cat.name)}&subcategory=${encodeURIComponent(sub)}`}
                                className={`rounded-full px-2.5 py-1 text-xs font-medium transition hover:opacity-80 ${palette.bg} ${palette.text}`}
                              >
                                {sub}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href={isSeller ? "/seller/dashboard" : "/sell"}
            className="rounded-full px-3 py-2 text-sm font-medium text-neutral-600 transition hover:bg-black/5 hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white"
          >
            {isSeller ? dict.nav.sellerDashboard : dict.nav.sellOnNimbus}
          </Link>

          {isAdmin && (
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-neutral-600 transition hover:bg-black/5 hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <ShieldCheck className="h-3.5 w-3.5" /> {dict.nav.admin}
            </Link>
          )}
        </nav>

        <form action="/products" method="GET" className="mx-4 hidden max-w-md flex-1 lg:flex">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="search"
              name="search"
              placeholder={dict.shop.searchPlaceholder}
              className="w-full rounded-full border border-black/10 bg-neutral-100 py-2 ps-10 pe-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-neutral-900"
            />
          </div>
        </form>

        <div className="flex items-center gap-1">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          <Link
            href="/wishlist"
            className="hidden h-10 w-10 items-center justify-center rounded-full transition hover:bg-black/5 dark:hover:bg-white/10 sm:flex"
            aria-label={dict.nav.wishlist}
          >
            <Heart className="h-5 w-5" />
          </Link>

          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-black/5 dark:hover:bg-white/10"
            aria-label={dict.nav.cart}
          >
            <ShoppingBag className="h-5 w-5" />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -end-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[11px] font-bold text-white"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          <div className="relative hidden md:block">
            {status === "authenticated" ? (
              <>
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 transition hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                  aria-label={dict.nav.account}
                >
                  <User className="h-5 w-5" />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute end-0 mt-2 w-60 overflow-hidden rounded-2xl border border-black/5 bg-white p-1.5 shadow-xl dark:border-white/10 dark:bg-neutral-900"
                    >
                      <div className="px-3 py-2 text-sm">
                        <p className="font-semibold">{session.user?.name}</p>
                        <p className="truncate text-neutral-500">{session.user?.email}</p>
                      </div>
                      <div className="my-1 h-px bg-black/5 dark:bg-white/10" />
                      <Link
                        href="/account/tracking"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      >
                        <Truck className="h-4 w-4" /> {dict.nav.orderTracking}
                      </Link>
                      <Link
                        href="/account/returns"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      >
                        <RotateCcw className="h-4 w-4" /> {dict.nav.cancellationsReturns}
                      </Link>
                      <Link
                        href="/account/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      >
                        <Package className="h-4 w-4" /> {dict.nav.ordersReturns}
                      </Link>
                      <Link
                        href="/wishlist"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      >
                        <Heart className="h-4 w-4" /> {dict.nav.wishlist}
                      </Link>
                      <Link
                        href="/account/addresses"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      >
                        <MapPin className="h-4 w-4" /> {dict.nav.addresses}
                      </Link>
                      <Link
                        href={isSeller ? "/seller/dashboard" : "/sell"}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      >
                        <Store className="h-4 w-4" /> {isSeller ? dict.nav.sellerDashboard : dict.nav.becomeASeller}
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        >
                          <ShieldCheck className="h-4 w-4" /> {dict.nav.admin}
                        </Link>
                      )}
                      <div className="my-1 h-px bg-black/5 dark:bg-white/10" />
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/40"
                      >
                        <LogOut className="h-4 w-4" /> {dict.nav.signOut}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-full px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-black/5 dark:text-neutral-200 dark:hover:bg-white/10"
                >
                  {dict.nav.login}
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  {dict.nav.signup}
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-black/5 dark:hover:bg-white/10 md:hidden"
            aria-label="Menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-black/5 md:hidden dark:border-white/10"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              <form action="/products" method="GET" className="mb-2">
                <div className="relative w-full">
                  <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="search"
                    name="search"
                    placeholder={dict.shop.searchPlaceholder}
                    className="w-full rounded-full border border-black/10 bg-neutral-100 py-2 ps-10 pe-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-neutral-900"
                  />
                </div>
              </form>
              <div className="mb-1 sm:hidden">
                <LanguageSwitcher />
              </div>
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10"
              >
                {dict.nav.home}
              </Link>
              <Link
                href="/products"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10"
              >
                {dict.nav.allProducts}
              </Link>

              <p className="mt-2 px-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                {dict.home.shopByCategory}
              </p>
              <div className="flex flex-wrap gap-1.5 px-3 py-1">
                {categories.map((cat) => {
                  const palette = getCategoryPalette(cat.name);
                  return (
                    <Link
                      key={cat.name}
                      href={`/products?category=${encodeURIComponent(cat.name)}`}
                      onClick={() => setMenuOpen(false)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium ${palette.bg} ${palette.text}`}
                    >
                      {cat.name}
                    </Link>
                  );
                })}
              </div>

              <div className="my-1 h-px bg-black/5 dark:bg-white/10" />
              <Link
                href={isSeller ? "/seller/dashboard" : "/sell"}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10"
              >
                {isSeller ? dict.nav.sellerDashboard : dict.nav.sellOnNimbus}
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10"
              >
                {dict.nav.wishlist}
              </Link>
              {isAdmin && (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10"
                >
                  {dict.nav.admin}
                </Link>
              )}

              <div className="my-1 h-px bg-black/5 dark:bg-white/10" />
              {status === "authenticated" ? (
                <>
                  <Link
                    href="/account/tracking"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10"
                  >
                    {dict.nav.orderTracking}
                  </Link>
                  <Link
                    href="/account/returns"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10"
                  >
                    {dict.nav.cancellationsReturns}
                  </Link>
                  <Link
                    href="/account/orders"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10"
                  >
                    {dict.nav.ordersReturns}
                  </Link>
                  <Link
                    href="/account/addresses"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10"
                  >
                    {dict.nav.addresses}
                  </Link>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                  >
                    {dict.nav.signOut}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10"
                  >
                    {dict.nav.login}
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10"
                  >
                    {dict.nav.signup}
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
