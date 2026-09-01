"use client";

import { motion } from "framer-motion";
import { ShieldCheck, BadgeCheck, Lock, Truck, RotateCcw, Headphones } from "lucide-react";

const PILLARS = [
  {
    icon: BadgeCheck,
    title: "100% Genuine Products",
    desc: "Every product listed on Zyventa is sourced directly from verified manufacturers and authorised distributors.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Sellers Only",
    desc: "All sellers go through a rigorous KYC and license verification process before listing any product.",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    desc: "PCI-DSS compliant checkout with SSL encryption. Your payment details are never stored on our servers.",
  },
  {
    icon: Truck,
    title: "Fast UAE Delivery",
    desc: "Same-day and next-day delivery across all 7 Emirates, with real-time order tracking at every step.",
  },
  {
    icon: RotateCcw,
    title: "Hassle-Free Returns",
    desc: "Changed your mind? Our 7-day no-questions-asked return policy means shopping is always risk-free.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    desc: "A real team based in Dubai, available 7 days a week to help with orders, returns, or product queries.",
  },
];

const LOGO_COLORS = [
  "bg-indigo-100 text-indigo-700",
  "bg-emerald-100 text-emerald-700",
  "bg-orange-100 text-orange-700",
  "bg-rose-100 text-rose-700",
  "bg-violet-100 text-violet-700",
  "bg-sky-100 text-sky-700",
];

function getColor(id: string) {
  const idx = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % LOGO_COLORS.length;
  return LOGO_COLORS[idx];
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export type Brand = { id: string; storeName: string };

export function WhyZyventa({ brands, showBrands }: { brands: Brand[]; showBrands: boolean }) {
  const brandStripVisible = showBrands && brands.length > 0;

  return (
    <section className="border-y border-black/[0.05] bg-neutral-50/60 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-accent">Why Choose Us</p>
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            A marketplace built on trust
          </h2>
        </div>

        <div className={`grid grid-cols-1 gap-10 ${brandStripVisible ? "lg:grid-cols-[1.3fr_1fr]" : ""}`}>
          <div className={`grid grid-cols-1 gap-5 sm:grid-cols-2 ${brandStripVisible ? "" : "lg:grid-cols-3"}`}>
            {PILLARS.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex gap-4 rounded-xl border border-black/[0.05] bg-white p-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold leading-snug text-neutral-900">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-500">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {brandStripVisible && (
            <div className="border-t border-black/[0.06] pt-8 lg:border-t-0 lg:border-s lg:ps-10 lg:pt-0">
              <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                Verified Marketplace Brands
              </p>
              <div className="flex flex-col gap-4">
                {brands.map((b) => (
                  <div key={b.id} className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${getColor(b.id)}`}
                    >
                      {getInitials(b.storeName)}
                    </span>
                    <span className="text-sm font-semibold text-neutral-700">{b.storeName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
