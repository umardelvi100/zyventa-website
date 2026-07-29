"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { toast } from "sonner";

export function WishlistButton({
  productId,
  initialWishlisted = false,
  variant = "icon",
}: {
  productId: string;
  initialWishlisted?: boolean;
  variant?: "icon" | "full";
}) {
  const { status } = useSession();
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [busy, setBusy] = useState(false);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (status !== "authenticated") {
      toast.info("Sign in to save items to your wishlist.");
      router.push("/login");
      return;
    }

    setBusy(true);
    const next = !wishlisted;
    setWishlisted(next);

    const res = next
      ? await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        })
      : await fetch(`/api/wishlist/${productId}`, { method: "DELETE" });

    setBusy(false);

    if (!res.ok) {
      setWishlisted(!next);
      toast.error("Could not update wishlist.");
      return;
    }
    toast.success(next ? "Saved to wishlist" : "Removed from wishlist");
    router.refresh();
  }

  if (variant === "full") {
    return (
      <button
        onClick={toggle}
        disabled={busy}
        className={`flex w-full items-center justify-center gap-2 rounded-full border px-6 py-3 font-semibold text-sm transition disabled:opacity-60 ${
          wishlisted
            ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400"
            : "border-black/10 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-white/15 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
        }`}
      >
        <Heart className={`h-4 w-4 ${wishlisted ? "fill-red-500 text-red-500" : ""}`} />
        {wishlisted ? "Saved to wishlist" : "Add to wishlist"}
      </button>
    );
  }

  return (
    <motion.button
      onClick={toggle}
      disabled={busy}
      whileTap={{ scale: 0.8 }}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-neutral-600 shadow backdrop-blur transition hover:text-red-500 disabled:opacity-60 dark:bg-black/60 dark:text-neutral-300"
      aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
    >
      <motion.span
        key={wishlisted ? "filled" : "empty"}
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <Heart className={`h-4 w-4 ${wishlisted ? "fill-red-500 text-red-500" : ""}`} />
      </motion.span>
    </motion.button>
  );
}
