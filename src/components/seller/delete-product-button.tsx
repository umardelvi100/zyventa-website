"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function DeleteProductButton({ productId, name }: { productId: string; name: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Remove "${name}" from your store?`)) return;
    setLoading(true);
    const res = await fetch(`/api/seller/products/${productId}`, { method: "DELETE" });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || "Could not delete product.");
      return;
    }
    toast.success("Product removed.");
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:hover:bg-red-950/40"
      aria-label={`Delete ${name}`}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </button>
  );
}
