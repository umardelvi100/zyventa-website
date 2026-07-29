import { notFound, redirect } from "next/navigation";
import { requireSeller } from "@/lib/require-seller";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/seller/product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ctx = await requireSeller();
  if (!ctx) redirect("/sell");

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.product.findMany({ distinct: ["category"], select: { category: true } }),
  ]);

  if (!product || product.sellerId !== ctx.seller.id) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black tracking-tight">Edit product</h1>
      <p className="mt-2 text-neutral-500">{product.name}</p>
      <div className="mt-8">
        <ProductForm
          categories={categories.map((c) => c.category)}
          initial={{
            id: product.id,
            name: product.name,
            category: product.category,
            image: product.image,
            price: (product.price / 100).toString(),
            stock: product.stock.toString(),
            overview: product.overview,
            description: product.description,
            warrantyMonths: product.warrantyMonths?.toString() ?? "",
            discountPercent: product.discountPercent?.toString() ?? "",
            promotionLabel: product.promotionLabel ?? "",
            promotionEndsAt: product.promotionEndsAt
              ? product.promotionEndsAt.toISOString().slice(0, 10)
              : "",
          }}
        />
      </div>
    </div>
  );
}
