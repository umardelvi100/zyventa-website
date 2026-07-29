import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AddressList } from "@/components/addresses/address-list";

export default async function AddressesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account/addresses");

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-black tracking-tight">Delivery addresses</h1>
      <p className="mt-2 text-neutral-500">Manage where your orders get shipped.</p>
      <div className="mt-8">
        <AddressList addresses={addresses} />
      </div>
    </div>
  );
}
