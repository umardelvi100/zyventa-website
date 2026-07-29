import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { BecomeSellerForm } from "@/components/seller/become-seller-form";

export default async function SellPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/sell");

  const existing = await prisma.seller.findUnique({ where: { userId: session.user.id } });
  if (existing) redirect("/seller/dashboard");

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-black tracking-tight">Become a seller</h1>
      <p className="mt-2 text-neutral-500">
        Open your own storefront on Zyventa — list products, run promotions, and manage your own
        orders and returns.
      </p>
      <div className="mt-10">
        <BecomeSellerForm />
      </div>
    </div>
  );
}
