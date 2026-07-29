"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Save, Tag } from "lucide-react";
import { toast } from "sonner";

export type ProductFormValues = {
  id?: string;
  name: string;
  category: string;
  image: string;
  price: string;
  stock: string;
  overview: string;
  description: string;
  warrantyMonths: string;
  discountPercent: string;
  promotionLabel: string;
  promotionEndsAt: string;
};

const emptyValues: ProductFormValues = {
  name: "",
  category: "",
  image: "",
  price: "",
  stock: "50",
  overview: "",
  description: "",
  warrantyMonths: "",
  discountPercent: "",
  promotionLabel: "",
  promotionEndsAt: "",
};

export function ProductForm({
  initial,
  categories,
}: {
  initial?: Partial<ProductFormValues>;
  categories: string[];
}) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [values, setValues] = useState<ProductFormValues>({ ...emptyValues, ...initial });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof ProductFormValues>(field: K, value: ProductFormValues[K]) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = isEdit ? `/api/seller/products/${initial!.id}` : "/api/seller/products";
    const res = await fetch(url, {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong.");
      setLoading(false);
      return;
    }

    toast.success(isEdit ? "Product updated" : "Product listed");
    router.push("/seller/dashboard");
    router.refresh();
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="flex flex-col gap-6"
    >
      <div className="rounded-2xl border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-neutral-900">
        <h2 className="mb-4 font-bold">Basics</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Product name</label>
            <input
              required
              value={values.name}
              onChange={(e) => update("name", e.target.value)}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-900"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Category</label>
              <input
                required
                list="category-options"
                value={values.category}
                onChange={(e) => update("category", e.target.value)}
                placeholder="e.g. Medicines"
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-900"
              />
              <datalist id="category-options">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Image URL</label>
              <input
                required
                type="url"
                value={values.image}
                onChange={(e) => update("image", e.target.value)}
                placeholder="https://..."
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-900"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Price (AED)</label>
              <input
                required
                type="number"
                min="0.01"
                step="0.01"
                value={values.price}
                onChange={(e) => update("price", e.target.value)}
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-900"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Stock</label>
              <input
                required
                type="number"
                min="0"
                step="1"
                value={values.stock}
                onChange={(e) => update("stock", e.target.value)}
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-900"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-neutral-900">
        <h2 className="mb-4 font-bold">Overview &amp; description</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Short overview</label>
            <input
              required
              maxLength={120}
              value={values.overview}
              onChange={(e) => update("overview", e.target.value)}
              placeholder="One line shown in search results and cards"
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-900"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Full description</label>
            <textarea
              required
              rows={4}
              value={values.description}
              onChange={(e) => update("description", e.target.value)}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-900"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-neutral-900">
        <h2 className="mb-4 font-bold">Warranty (optional)</h2>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Warranty length (months)</label>
          <input
            type="number"
            min="0"
            step="1"
            value={values.warrantyMonths}
            onChange={(e) => update("warrantyMonths", e.target.value)}
            placeholder="Leave blank if no warranty offered"
            className="w-full max-w-xs rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-900"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-neutral-900">
        <h2 className="mb-4 flex items-center gap-2 font-bold">
          <Tag className="h-4 w-4" /> Promotion (optional)
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Discount %</label>
            <input
              type="number"
              min="1"
              max="90"
              value={values.discountPercent}
              onChange={(e) => update("discountPercent", e.target.value)}
              placeholder="e.g. 15"
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-900"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Label</label>
            <input
              value={values.promotionLabel}
              onChange={(e) => update("promotionLabel", e.target.value)}
              placeholder="e.g. Summer Sale"
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-900"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Ends on</label>
            <input
              type="date"
              value={values.promotionEndsAt}
              onChange={(e) => update("promotionEndsAt", e.target.value)}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-900"
            />
          </div>
        </div>
      </div>

      {error && <p className="text-sm font-medium text-red-600">{error}</p>}

      <motion.button
        type="submit"
        disabled={loading}
        whileTap={{ scale: 0.97 }}
        className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-orange-500 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/30 transition disabled:opacity-70"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {loading ? "Saving..." : isEdit ? "Save changes" : "List product"}
      </motion.button>
    </motion.form>
  );
}
