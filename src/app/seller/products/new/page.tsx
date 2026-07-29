import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { requireSeller } from "@/lib/require-seller";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/seller/product-form";

export default async function NewProductPage() {
  const ctx = await requireSeller();
  if (!ctx) redirect("/sell");

  if (ctx.seller.verificationStatus !== "approved") {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950/40">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-2xl font-black tracking-tight">Verification required</h1>
        <p className="mt-2 text-neutral-500">
          {ctx.seller.verificationStatus === "rejected"
            ? "Your seller verification was rejected. Check your dashboard for details."
            : "Your seller account is still pending verification. You can list products once our team approves your submission."}
        </p>
        <Link
          href="/seller/dashboard"
          className="mt-6 inline-block rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  const categories = await prisma.product.findMany({
    distinct: ["category"],
    select: { category: true },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black tracking-tight">List a new product</h1>
      <p className="mt-2 text-neutral-500">Selling as {ctx.seller.storeName}</p>
      <div className="mt-8">
        <ProductForm categories={categories.map((c) => c.category)} />
      </div>
    </div>
  );
}
