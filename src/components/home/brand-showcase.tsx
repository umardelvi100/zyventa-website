import { prisma } from "@/lib/prisma";

const LOGO_COLORS = [
  "bg-indigo-100 text-indigo-700",
  "bg-emerald-100 text-emerald-700",
  "bg-orange-100 text-orange-700",
  "bg-rose-100 text-rose-700",
  "bg-violet-100 text-violet-700",
  "bg-sky-100 text-sky-700",
  "bg-teal-100 text-teal-700",
  "bg-amber-100 text-amber-700",
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

export async function BrandShowcase() {
  const sellers = await prisma.seller.findMany({
    where: { verificationStatus: "approved" },
    select: { id: true, storeName: true },
    take: 10,
  });

  if (sellers.length === 0) return null;

  return (
    <section className="border-y border-black/[0.05] bg-white py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400">
            Verified Marketplace Brands
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {sellers.map((s) => (
            <div key={s.id} className="flex items-center gap-2.5">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${getColor(s.id)}`}
              >
                {getInitials(s.storeName)}
              </span>
              <span className="text-sm font-semibold text-neutral-600">{s.storeName}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
