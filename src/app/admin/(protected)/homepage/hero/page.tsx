import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getHomepageConfig } from "@/lib/homepage/config";
import { updateHeroConfigAction } from "@/app/admin/homepage-actions";

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
  rows,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
  type?: string;
  rows?: number;
}) {
  const base =
    "w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-indigo-400";
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-neutral-600 dark:text-neutral-400">
        {label}
      </label>
      {rows ? (
        <textarea
          name={name}
          defaultValue={defaultValue ?? ""}
          placeholder={placeholder}
          rows={rows}
          className={base}
        />
      ) : (
        <input
          type={type}
          name={name}
          defaultValue={defaultValue ?? ""}
          placeholder={placeholder}
          className={base}
        />
      )}
    </div>
  );
}

function Toggle({
  label,
  name,
  defaultChecked,
  description,
}: {
  label: string;
  name: string;
  defaultChecked: boolean;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/40">
      <div>
        <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{label}</p>
        {description && <p className="text-xs text-neutral-400">{description}</p>}
      </div>
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          name={name}
          defaultChecked={defaultChecked}
          className="peer sr-only"
        />
        <div className="h-5 w-9 rounded-full bg-neutral-200 transition after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-4 dark:bg-neutral-700" />
      </label>
    </div>
  );
}

export default async function HeroEditorPage() {
  const config = await getHomepageConfig();

  return (
    <form action={updateHeroConfigAction} className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/homepage"
          className="text-sm text-neutral-500 hover:text-neutral-800 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
            Hero &amp; Sections
          </h1>
          <p className="text-sm text-neutral-500">
            Configure homepage hero content and toggle visible sections.
          </p>
        </div>
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Save Changes
        </button>
      </div>

      {/* Hero content */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <p className="mb-5 text-sm font-semibold text-neutral-800 dark:text-white">Hero Content</p>
        <div className="grid gap-4">
          <Field
            label="Hero Title *"
            name="heroTitle"
            defaultValue={config.heroTitle}
            placeholder="Your Health & Beauty Destination"
          />
          <Field
            label="Hero Subtitle"
            name="heroSubtitle"
            defaultValue={config.heroSubtitle}
            placeholder="Tagline shown below the title"
            rows={2}
          />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Primary CTA Text"
              name="heroCta1Text"
              defaultValue={config.heroCta1Text}
              placeholder="Shop Now"
            />
            <Field
              label="Primary CTA Link"
              name="heroCta1Link"
              defaultValue={config.heroCta1Link}
              placeholder="/products"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Secondary CTA Text"
              name="heroCta2Text"
              defaultValue={config.heroCta2Text}
              placeholder="Browse Medicines"
            />
            <Field
              label="Secondary CTA Link"
              name="heroCta2Link"
              defaultValue={config.heroCta2Link}
              placeholder="/products?category=Medicines"
            />
          </div>
        </div>
      </div>

      {/* Campaign pill */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <p className="mb-1 text-sm font-semibold text-neutral-800 dark:text-white">
          Campaign Pill
        </p>
        <p className="mb-5 text-xs text-neutral-400">
          Optional badge shown above the hero headline. Leave blank to hide.
        </p>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Promo Label"
              name="heroPromoLabel"
              defaultValue={config.heroPromoLabel}
              placeholder="e.g. Ramadan Offers"
            />
            <Field
              label="Promo Tag"
              name="heroPromoTag"
              defaultValue={config.heroPromoTag}
              placeholder="e.g. Limited Time"
            />
          </div>
          <Field
            label="Promo Link"
            name="heroPromoLink"
            defaultValue={config.heroPromoLink}
            placeholder="/products?search=ramadan"
          />
        </div>
      </div>

      {/* Announcement bar */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <p className="mb-1 text-sm font-semibold text-neutral-800 dark:text-white">
          Announcement Bar
        </p>
        <p className="mb-5 text-xs text-neutral-400">
          Slim banner shown above the hero. Leave blank to hide.
        </p>
        <div className="grid gap-4">
          <Field
            label="Announcement Text"
            name="announcementText"
            defaultValue={config.announcementText}
            placeholder="Free delivery on orders above AED 150 →"
          />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Announcement Link"
              name="announcementLink"
              defaultValue={config.announcementLink}
              placeholder="/products"
            />
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                Color
              </label>
              <select
                name="announcementColor"
                defaultValue={config.announcementColor}
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              >
                <option value="indigo">Indigo (default)</option>
                <option value="orange">Orange</option>
                <option value="emerald">Emerald</option>
                <option value="rose">Rose</option>
                <option value="slate">Slate (dark)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Section toggles */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <p className="mb-5 text-sm font-semibold text-neutral-800 dark:text-white">
          Homepage Sections
        </p>
        <div className="flex flex-col gap-2">
          <Toggle
            label="Best Sellers"
            name="showBestSellers"
            defaultChecked={config.showBestSellers}
            description="Top-rated products shelf"
          />
          <Toggle
            label="New Arrivals"
            name="showNewArrivals"
            defaultChecked={config.showNewArrivals}
            description="Most recently added products"
          />
          <Toggle
            label="Brand Showcase"
            name="showBrands"
            defaultChecked={config.showBrands}
            description="Verified seller brands strip"
          />
          <Toggle
            label="Customer Reviews"
            name="showTestimonials"
            defaultChecked={config.showTestimonials}
            description="Curated customer testimonials"
          />
          <Toggle
            label="Health Journal"
            name="showArticles"
            defaultChecked={config.showArticles}
            description="Editorial articles section"
          />
          <Toggle
            label="Newsletter"
            name="showNewsletter"
            defaultChecked={config.showNewsletter}
            description="Email signup section"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-8 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
