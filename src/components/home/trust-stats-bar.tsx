import { ShieldCheck, Lock, Truck, RotateCcw } from "lucide-react";

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: "Verified sellers" },
  { icon: Lock, label: "Secure checkout" },
  { icon: Truck, label: "Fast delivery" },
  { icon: RotateCcw, label: "Easy returns" },
];

export function TrustStatsBar({
  productCount,
  sellerCount,
  reviewCount,
}: {
  productCount: number;
  sellerCount: number;
  reviewCount: number;
}) {
  const stats = [
    { value: `${productCount}+`, label: "Products" },
    { value: String(sellerCount), label: "Sellers" },
    { value: `${reviewCount}+`, label: "Reviews" },
    { value: "UAE", label: "Same-day" },
  ];

  return (
    <section className="border-b border-black/[0.05] bg-white py-5">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
          {TRUST_ITEMS.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/10 text-accent">
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-xs font-medium text-neutral-600 sm:text-sm">{label}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-6">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-right leading-none">
              <p className="font-display text-lg font-bold tracking-tight">{value}</p>
              <p className="mt-1 text-[11px] text-neutral-500">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
