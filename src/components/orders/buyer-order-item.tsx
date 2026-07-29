"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Ban, HelpCircle, ImagePlus, Loader2, RotateCcw, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/format";
import { RETURN_REASONS } from "@/lib/return-reasons";

export type BuyerOrderItemData = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  status: string;
  warrantyMonths: number | null;
  cancelReason: string | null;
  activeReturn: {
    reason: string;
    details: string | null;
    status: string;
    images: { url: string }[];
  } | null;
  activeClaim: { issue: string; status: string } | null;
};

const STATUS_LABELS: Record<string, string> = {
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  return_requested: "Return requested",
  return_approved: "Return approved",
  refunded: "Refunded",
};

const STATUS_STYLES: Record<string, string> = {
  processing: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
  shipped: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400",
  delivered: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400",
  return_requested: "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400",
  return_approved: "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400",
  refunded: "bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
};

const MAX_RETURN_IMAGES = 4;

export function BuyerOrderItem({ item }: { item: BuyerOrderItemData }) {
  const router = useRouter();
  const [helpOpen, setHelpOpen] = useState(false);
  const [openForm, setOpenForm] = useState<"cancel" | "return" | "warranty" | null>(null);
  const [reason, setReason] = useState("");
  const [returnReason, setReturnReason] = useState("");
  const [returnDetails, setReturnDetails] = useState("");
  const [returnImages, setReturnImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const canCancel = item.status === "processing";
  const canReturn = item.status === "delivered" && !item.activeReturn;
  const canClaimWarranty = item.warrantyMonths && item.status === "delivered" && !item.activeClaim;
  const hasHelpOptions = canCancel || canReturn || canClaimWarranty;

  function addReturnImages(files: FileList | null) {
    if (!files) return;
    setReturnImages((prev) => [...prev, ...Array.from(files)].slice(0, MAX_RETURN_IMAGES));
  }

  function removeReturnImage(index: number) {
    setReturnImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function submitCancel(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/cancellations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderItemId: item.id, reason }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || "Could not cancel this order.");
      return;
    }
    toast.success("Order cancelled.");
    setOpenForm(null);
    setHelpOpen(false);
    setReason("");
    router.refresh();
  }

  async function submitReturn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    let imageUrls: string[] = [];
    if (returnImages.length > 0) {
      const formData = new FormData();
      returnImages.forEach((file) => formData.append("images", file));
      const uploadRes = await fetch("/api/uploads/return-images", { method: "POST", body: formData });
      if (!uploadRes.ok) {
        const data = await uploadRes.json().catch(() => ({}));
        setLoading(false);
        toast.error(data.error || "Could not upload images.");
        return;
      }
      const uploadData = await uploadRes.json();
      imageUrls = uploadData.urls ?? [];
    }

    const res = await fetch("/api/returns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderItemId: item.id,
        reason: returnReason,
        details: returnDetails,
        images: imageUrls,
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || "Could not submit return request.");
      return;
    }
    toast.success("Return requested.");
    setOpenForm(null);
    setHelpOpen(false);
    setReturnReason("");
    setReturnDetails("");
    setReturnImages([]);
    router.refresh();
  }

  async function submitWarranty(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/warranty-claims", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderItemId: item.id, issue: reason }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || "Could not submit warranty claim.");
      return;
    }
    toast.success("Warranty claim submitted.");
    setOpenForm(null);
    setHelpOpen(false);
    setReason("");
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-black/5 p-4 dark:border-white/10">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm text-neutral-600 dark:text-neutral-400">
          {item.name} × {item.quantity}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[item.status] ?? "bg-neutral-100 text-neutral-600"}`}>
            {STATUS_LABELS[item.status] ?? item.status}
          </span>
        </div>
      </div>

      {item.status === "cancelled" && item.cancelReason && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400">
          Cancelled: &quot;{item.cancelReason}&quot;
        </p>
      )}
      {item.activeReturn && (
        <div className="mt-2 text-xs text-orange-600 dark:text-orange-400">
          <p>
            Return {item.activeReturn.status}: {item.activeReturn.reason}
            {item.activeReturn.details ? ` — "${item.activeReturn.details}"` : ""}
          </p>
          {item.activeReturn.images.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {item.activeReturn.images.map((img) => (
                <a key={img.url} href={img.url} target="_blank" rel="noopener noreferrer">
                  <Image
                    src={img.url}
                    alt="Return evidence"
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-lg border border-orange-200 object-cover dark:border-orange-900/50"
                  />
                </a>
              ))}
            </div>
          )}
        </div>
      )}
      {item.activeClaim && (
        <p className="mt-2 text-xs text-indigo-600 dark:text-indigo-400">
          Warranty claim {item.activeClaim.status}: &quot;{item.activeClaim.issue}&quot;
        </p>
      )}

      {hasHelpOptions && (
        <div className="mt-3">
          <button
            onClick={() => {
              setHelpOpen((v) => !v);
              setOpenForm(null);
            }}
            className="flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium transition hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
          >
            <HelpCircle className="h-3 w-3" /> Help with this order
          </button>

          <AnimatePresence>
            {helpOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 overflow-hidden rounded-xl border border-black/10 bg-neutral-50 p-3 dark:border-white/15 dark:bg-neutral-900/60"
              >
                <div className="flex flex-wrap gap-2">
                  {canCancel && (
                    <button
                      onClick={() => setOpenForm(openForm === "cancel" ? null : "cancel")}
                      className="flex items-center gap-1.5 rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/40"
                    >
                      <Ban className="h-3 w-3" /> Cancel order
                    </button>
                  )}
                  {canReturn && (
                    <button
                      onClick={() => setOpenForm(openForm === "return" ? null : "return")}
                      className="flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium transition hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
                    >
                      <RotateCcw className="h-3 w-3" /> Request return
                    </button>
                  )}
                  {canClaimWarranty && (
                    <button
                      onClick={() => setOpenForm(openForm === "warranty" ? null : "warranty")}
                      className="flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium transition hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
                    >
                      <ShieldCheck className="h-3 w-3" /> Claim warranty
                    </button>
                  )}
                </div>

                <AnimatePresence>
                  {openForm === "return" && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={submitReturn}
                      className="mt-3 flex flex-col gap-2 overflow-hidden"
                    >
                      <select
                        required
                        value={returnReason}
                        onChange={(e) => setReturnReason(e.target.value)}
                        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-900"
                      >
                        <option value="" disabled>
                          Select a reason
                        </option>
                        {RETURN_REASONS.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                      <textarea
                        rows={2}
                        value={returnDetails}
                        onChange={(e) => setReturnDetails(e.target.value)}
                        placeholder="Additional details (optional)"
                        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-900"
                      />

                      <div className="flex flex-wrap items-center gap-2">
                        {returnImages.map((file, i) => (
                          <div key={i} className="relative h-14 w-14">
                            {/* eslint-disable-next-line @next/next/no-img-element -- blob: object URL, next/image only supports local/remote http(s) sources */}
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="h-14 w-14 rounded-lg border border-black/10 object-cover dark:border-white/15"
                            />
                            <button
                              type="button"
                              onClick={() => removeReturnImage(i)}
                              className="absolute -end-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-white"
                              aria-label="Remove image"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                        {returnImages.length < MAX_RETURN_IMAGES && (
                          <label className="flex h-14 w-14 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-lg border border-dashed border-black/20 text-neutral-400 transition hover:border-indigo-400 hover:text-indigo-600 dark:border-white/20">
                            <ImagePlus className="h-4 w-4" />
                            <span className="text-[9px]">Add photo</span>
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/webp,image/gif"
                              multiple
                              className="hidden"
                              onChange={(e) => addReturnImages(e.target.files)}
                            />
                          </label>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-400">
                        Photos help us review damage or defect claims faster (optional, up to {MAX_RETURN_IMAGES}).
                      </p>

                      <button
                        type="submit"
                        disabled={loading}
                        className="mt-1 flex w-fit items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-70 dark:bg-white dark:text-neutral-950"
                      >
                        {loading && <Loader2 className="h-3 w-3 animate-spin" />}
                        Submit
                      </button>
                    </motion.form>
                  )}
                  {(openForm === "cancel" || openForm === "warranty") && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={openForm === "cancel" ? submitCancel : submitWarranty}
                      className="mt-3 overflow-hidden"
                    >
                      <textarea
                        required
                        rows={2}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder={
                          openForm === "cancel" ? "Why are you cancelling this order?" : "Describe the issue"
                        }
                        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-900"
                      />
                      <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 flex items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-70 dark:bg-white dark:text-neutral-950"
                      >
                        {loading && <Loader2 className="h-3 w-3 animate-spin" />}
                        Submit
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
