import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/translations";

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/checkout");
  }

  const [addresses, dict] = await Promise.all([
    prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    }),
    getDictionary(await getLocale()),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black tracking-tight">{dict.checkout.checkout}</h1>
      <p className="mt-2 text-neutral-500">{dict.checkout.demoNotice}</p>
      <div className="mt-10">
        <CheckoutForm userName={session.user.name ?? ""} addresses={addresses} />
      </div>
    </div>
  );
}
