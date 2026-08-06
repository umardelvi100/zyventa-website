import Link from "next/link";
import { ArrowRight } from "lucide-react";

type PromoBannerData = {
  title: string;
  subtitle?: string | null;
  tag?: string | null;
  ctaText: string;
  ctaLink: string;
  bgFrom: string;
  bgTo: string;
};

export function PromoBannerSection({ banner }: { banner: PromoBannerData }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div
        className="relative overflow-hidden rounded-3xl px-8 py-12 md:px-14 md:py-16"
        style={{ background: `linear-gradient(135deg, ${banner.bgFrom}, ${banner.bgTo})` }}
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-12 right-1/3 h-40 w-40 rounded-full bg-white/5" />
        <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            {banner.tag && (
              <span className="mb-3 inline-block rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white">
                {banner.tag}
              </span>
            )}
            <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl md:text-4xl">
              {banner.title}
            </h2>
            {banner.subtitle && (
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/80">
                {banner.subtitle}
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <Link
              href={banner.ctaLink}
              className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-neutral-900 shadow-lg transition hover:scale-105 hover:shadow-xl"
            >
              {banner.ctaText} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
