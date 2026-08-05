import Link from "next/link";
import Image from "next/image";
import { MapPin, Mail, ShieldCheck, BadgeCheck, Lock, Truck } from "lucide-react";

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
function IconX() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function IconYoutube() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon fill="white" points="9.75,15.02 15.5,12 9.75,8.98 9.75,15.02" />
    </svg>
  );
}

const SOCIAL = [
  { Icon: IconInstagram, label: "Instagram", href: "#" },
  { Icon: IconX,         label: "X / Twitter", href: "#" },
  { Icon: IconFacebook,  label: "Facebook", href: "#" },
  { Icon: IconYoutube,   label: "YouTube", href: "#" },
];

const SHOP_LINKS = [
  { label: "All Products", href: "/products" },
  { label: "Medicines", href: "/products?category=Medicines" },
  { label: "Cosmetics", href: "/products?category=Cosmetics" },
  { label: "Consumables", href: "/products?category=Consumables" },
];

const CUSTOMER_LINKS = [
  { label: "Order History", href: "/account/orders" },
  { label: "Order Tracking", href: "/account/tracking" },
  { label: "Returns & Refunds", href: "/account/returns" },
  { label: "My Addresses", href: "/account/addresses" },
  { label: "Wishlist", href: "/wishlist" },
];

const SELLER_LINKS = [
  { label: "Become a Seller", href: "/sell" },
  { label: "Seller Dashboard", href: "/seller/dashboard" },
  { label: "Add a Product", href: "/seller/products/new" },
];

const COMPANY_LINKS = [
  { label: "About Zyventa", href: "#" },
  { label: "Contact Us", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Cookie Policy", href: "#" },
];

const TRUST_BADGES = [
  { icon: BadgeCheck, label: "Genuine Products" },
  { icon: ShieldCheck, label: "Verified Sellers" },
  { icon: Lock, label: "Secure Payments" },
  { icon: Truck, label: "Fast UAE Delivery" },
];

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-400">
      {children}
    </p>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-neutral-600 transition-colors duration-150 hover:text-indigo-600"
      >
        {children}
      </Link>
    </li>
  );
}

export async function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-black/[0.06] bg-neutral-50/80">
      {/* Trust badges strip */}
      <div className="border-b border-black/[0.05] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
                <Icon className="h-4 w-4 text-indigo-500 shrink-0" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-14 md:grid-cols-3 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <div className="relative mb-4 h-8 w-[120px]">
              <Image
                src="/zyventa-logo.png"
                alt="Zyventa"
                fill
                sizes="120px"
                className="object-contain object-left"
              />
            </div>
            <p className="mb-5 max-w-[260px] text-sm leading-relaxed text-neutral-500">
              Your trusted health &amp; beauty marketplace across the UAE. Verified sellers, authentic products, fast delivery.
            </p>
            <div className="flex flex-col gap-2.5 text-sm text-neutral-500">
              <span className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-500" />
                <span>Office 2211, Al Rehan Block, Omniyat Building, Al Mamzar, Dubai — UAE</span>
              </span>
              <a
                href="mailto:contact@zyventa.com"
                className="flex items-center gap-2 transition-colors hover:text-indigo-600"
              >
                <Mail className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
                contact@zyventa.com
              </a>
            </div>
            {/* Social links */}
            <div className="mt-5 flex gap-2">
              {SOCIAL.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-neutral-500 transition-all duration-150 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <FooterHeading>Shop</FooterHeading>
            <ul className="flex flex-col gap-2.5">
              {SHOP_LINKS.map((l) => (
                <FooterLink key={l.href} href={l.href}>{l.label}</FooterLink>
              ))}
            </ul>
          </div>

          {/* Customer */}
          <div>
            <FooterHeading>Customer</FooterHeading>
            <ul className="flex flex-col gap-2.5">
              {CUSTOMER_LINKS.map((l) => (
                <FooterLink key={l.href} href={l.href}>{l.label}</FooterLink>
              ))}
            </ul>
          </div>

          {/* Sell */}
          <div>
            <FooterHeading>Sell on Zyventa</FooterHeading>
            <ul className="flex flex-col gap-2.5">
              {SELLER_LINKS.map((l) => (
                <FooterLink key={l.href} href={l.href}>{l.label}</FooterLink>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <FooterHeading>Company</FooterHeading>
            <ul className="flex flex-col gap-2.5">
              {COMPANY_LINKS.map((l) => (
                <FooterLink key={l.label} href={l.href}>{l.label}</FooterLink>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-black/[0.06] py-6 text-xs text-neutral-500 sm:flex-row">
          <p>© {year} Zyventa. All rights reserved.</p>
          <p className="text-center text-neutral-400">
            Demo store — payments are simulated, no real charges are made.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="transition-colors hover:text-indigo-600">Privacy</Link>
            <Link href="#" className="transition-colors hover:text-indigo-600">Terms</Link>
            <Link href="#" className="transition-colors hover:text-indigo-600">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
