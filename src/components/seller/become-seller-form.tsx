"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Loader2, ShieldCheck, Store } from "lucide-react";
import { toast } from "sonner";

export function BecomeSellerForm() {
  const router = useRouter();
  const { update } = useSession();

  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");
  const [codAvailable, setCodAvailable] = useState(true);
  const [legalName, setLegalName] = useState("");
  const [businessRegNumber, setBusinessRegNumber] = useState("");
  const [idDocumentUrl, setIdDocumentUrl] = useState("");
  const [sellsRegulated, setSellsRegulated] = useState(false);
  const [regulatoryDocUrl, setRegulatoryDocUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/seller", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        storeName,
        description,
        codAvailable,
        legalName,
        businessRegNumber,
        idDocumentUrl,
        regulatoryDocUrl: sellsRegulated ? regulatoryDocUrl : "",
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong.");
      setLoading(false);
      return;
    }

    await update();
    toast.success("Store created — your verification is now pending review.");
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
      <div className="flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-neutral-900">
        <h2 className="font-bold">Store details</h2>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Store name</label>
          <input
            required
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="e.g. Riverside Goods"
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-900"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Store description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="What do you sell?"
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-900"
          />
        </div>

        <label className="flex items-center gap-3 rounded-xl border border-black/10 px-4 py-3 text-sm dark:border-white/15">
          <input
            type="checkbox"
            checked={codAvailable}
            onChange={(e) => setCodAvailable(e.target.checked)}
            className="h-4 w-4 rounded accent-indigo-600"
          />
          Offer Cash on Delivery for my products
        </label>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-neutral-900">
        <h2 className="flex items-center gap-2 font-bold">
          <ShieldCheck className="h-4 w-4 text-indigo-600" /> Identity verification
        </h2>
        <p className="text-sm text-neutral-500">
          We verify every seller before their products go live. This info is reviewed by our team —
          it&apos;s never charged or shared with buyers.
        </p>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Legal / business name</label>
          <input
            required
            value={legalName}
            onChange={(e) => setLegalName(e.target.value)}
            placeholder="e.g. Riverside Trading LLC"
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-900"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Trade license / business registration number</label>
          <input
            required
            value={businessRegNumber}
            onChange={(e) => setBusinessRegNumber(e.target.value)}
            placeholder="e.g. DED-123456"
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-900"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Link to ID / trade license document</label>
          <input
            required
            type="url"
            value={idDocumentUrl}
            onChange={(e) => setIdDocumentUrl(e.target.value)}
            placeholder="https://..."
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-900"
          />
          <p className="mt-1.5 text-xs text-neutral-400">
            Demo store — paste any link. In production this would be a secure document upload.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-neutral-900">
        <h2 className="flex items-center gap-2 font-bold">
          <ShieldCheck className="h-4 w-4 text-indigo-600" /> Regulatory approval
        </h2>
        <label className="flex items-center gap-3 rounded-xl border border-black/10 px-4 py-3 text-sm dark:border-white/15">
          <input
            type="checkbox"
            checked={sellsRegulated}
            onChange={(e) => setSellsRegulated(e.target.checked)}
            className="h-4 w-4 rounded accent-indigo-600"
          />
          I plan to list Medicines and/or Cosmetics products
        </label>

        {sellsRegulated && (
          <div>
            <label className="mb-1.5 block text-sm font-medium">Government / regulatory approval document link</label>
            <input
              required
              type="url"
              value={regulatoryDocUrl}
              onChange={(e) => setRegulatoryDocUrl(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-900"
            />
            <p className="mt-1.5 text-xs text-neutral-400">
              Required for Medicines and Cosmetics — e.g. a health authority license or product registration
              certificate. You can also add this later from your seller dashboard.
            </p>
          </div>
        )}
      </div>

      {error && <p className="text-sm font-medium text-red-600">{error}</p>}

      <motion.button
        type="submit"
        disabled={loading}
        whileTap={{ scale: 0.97 }}
        className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-orange-500 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/30 transition disabled:opacity-70"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Store className="h-4 w-4" />}
        {loading ? "Setting up..." : "Create my store"}
      </motion.button>
    </motion.form>
  );
}
