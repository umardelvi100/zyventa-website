import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createBannerAction } from "@/app/admin/homepage-actions";

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-neutral-600 dark:text-neutral-400">
        {label}
        {required && " *"}
      </label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-indigo-400"
      />
    </div>
  );
}

export default function NewBannerPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/homepage/banners"
          className="text-sm text-neutral-500 hover:text-neutral-800 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
            Create Promotional Banner
          </h1>
          <p className="text-sm text-neutral-500">Design a campaign banner for the homepage.</p>
        </div>
      </div>

      <form action={createBannerAction} className="flex flex-col gap-6">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <p className="mb-5 text-sm font-semibold text-neutral-800 dark:text-white">
            Banner Details
          </p>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Internal Name"
                name="name"
                placeholder="e.g. Ramadan Offers 2026"
                required
              />
              <Field
                label="Campaign Tag"
                name="tag"
                placeholder="e.g. Limited Time, Eid Mubarak"
              />
            </div>
            <Field
              label="Headline"
              name="title"
              placeholder="e.g. Ramadan Health Deals"
              required
            />
            <Field
              label="Subtitle"
              name="subtitle"
              placeholder="e.g. Save up to 30% on health & beauty essentials"
            />
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="CTA Button Text"
                name="ctaText"
                defaultValue="Shop Now"
                placeholder="Shop Now"
              />
              <Field
                label="CTA Link"
                name="ctaLink"
                defaultValue="/products"
                placeholder="/products"
                required
              />
            </div>
            <Field
              label="Sort Order"
              name="sortOrder"
              defaultValue="0"
              type="number"
              placeholder="0 = highest priority"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <p className="mb-2 text-sm font-semibold text-neutral-800 dark:text-white">
            Gradient Colors
          </p>
          <p className="mb-5 text-xs text-neutral-400">
            The banner uses a diagonal gradient from the From color to the To color.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                From Color
              </label>
              <input
                type="color"
                name="bgFrom"
                defaultValue="#6366f1"
                className="h-12 w-full cursor-pointer rounded-lg border border-neutral-200 p-1 dark:border-neutral-700"
              />
              <p className="mt-1 text-[11px] text-neutral-400">Default: Indigo #6366f1</p>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                To Color
              </label>
              <input
                type="color"
                name="bgTo"
                defaultValue="#f97316"
                className="h-12 w-full cursor-pointer rounded-lg border border-neutral-200 p-1 dark:border-neutral-700"
              />
              <p className="mt-1 text-[11px] text-neutral-400">Default: Orange #f97316</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-neutral-800 dark:text-white">
                Activate Immediately
              </p>
              <p className="text-xs text-neutral-400">
                Show this banner on the homepage now. Only one banner is displayed at a time.
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" name="isActive" className="peer sr-only" />
              <div className="h-5 w-9 rounded-full bg-neutral-200 transition after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-4 dark:bg-neutral-700" />
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href="/admin/homepage/banners"
            className="rounded-lg border border-neutral-200 bg-white px-5 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-8 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Create Banner
          </button>
        </div>
      </form>
    </div>
  );
}
