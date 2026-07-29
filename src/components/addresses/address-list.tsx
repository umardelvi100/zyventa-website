"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, MapPin, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

export type AddressData = {
  id: string;
  label: string;
  fullName: string;
  line1: string;
  city: string;
  state: string | null;
  zip: string;
  isDefault: boolean;
};

export function AddressList({ addresses }: { addresses: AddressData[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(addresses.length === 0);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [form, setForm] = useState({ label: "Home", fullName: "", line1: "", city: "", state: "", zip: "" });
  const [submitting, setSubmitting] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || "Could not save address.");
      return;
    }
    toast.success("Address saved.");
    setForm({ label: "Home", fullName: "", line1: "", city: "", state: "", zip: "" });
    setShowForm(false);
    router.refresh();
  }

  async function setDefault(id: string) {
    setBusyId(id);
    const res = await fetch(`/api/addresses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ setDefault: true }),
    });
    setBusyId(null);
    if (!res.ok) {
      toast.error("Could not update default address.");
      return;
    }
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Remove this address?")) return;
    setBusyId(id);
    const res = await fetch(`/api/addresses/${id}`, { method: "DELETE" });
    setBusyId(null);
    if (!res.ok) {
      toast.error("Could not remove address.");
      return;
    }
    toast.success("Address removed.");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      {addresses.map((address) => (
        <div
          key={address.id}
          className="flex items-start justify-between gap-4 rounded-2xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-neutral-900"
        >
          <div className="flex gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-neutral-400" />
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">{address.label}</p>
                {address.isDefault && (
                  <span className="flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400">
                    <Star className="h-3 w-3 fill-indigo-700 dark:fill-indigo-400" /> Default
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{address.fullName}</p>
              <p className="text-sm text-neutral-500">
                {address.line1}, {address.city}
                {address.state ? `, ${address.state}` : ""} {address.zip}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {!address.isDefault && (
              <button
                disabled={busyId === address.id}
                onClick={() => setDefault(address.id)}
                className="rounded-full px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50 disabled:opacity-50 dark:text-indigo-400 dark:hover:bg-indigo-950/40"
              >
                Set default
              </button>
            )}
            <button
              disabled={busyId === address.id}
              onClick={() => remove(address.id)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:hover:bg-red-950/40"
              aria-label={`Remove ${address.label}`}
            >
              {busyId === address.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </button>
          </div>
        </div>
      ))}

      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.form
            key="form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAdd}
            className="flex flex-col gap-3 overflow-hidden rounded-2xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-neutral-900"
          >
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                placeholder="Label (e.g. Home)"
                value={form.label}
                onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-900"
              />
              <input
                required
                placeholder="Full name"
                value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-900"
              />
            </div>
            <input
              required
              placeholder="Street address"
              value={form.line1}
              onChange={(e) => setForm((f) => ({ ...f, line1: e.target.value }))}
              className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-900"
            />
            <div className="grid grid-cols-3 gap-3">
              <input
                required
                placeholder="City"
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-900"
              />
              <input
                placeholder="State"
                value={form.state}
                onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-900"
              />
              <input
                required
                placeholder="ZIP"
                value={form.zip}
                onChange={(e) => setForm((f) => ({ ...f, zip: e.target.value }))}
                className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-900"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-70 dark:bg-white dark:text-neutral-950"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Save address
              </button>
              {addresses.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold transition hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
                >
                  Cancel
                </button>
              )}
            </div>
          </motion.form>
        ) : (
          <motion.button
            key="add-button"
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-black/15 py-4 text-sm font-semibold text-neutral-500 transition hover:border-indigo-400 hover:text-indigo-700 dark:border-white/15 dark:hover:text-indigo-400"
          >
            <Plus className="h-4 w-4" /> Add a new address
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
