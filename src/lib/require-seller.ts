import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function requireSeller() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const seller = await prisma.seller.findUnique({ where: { userId: session.user.id } });
  if (!seller) return null;
  return { session, seller };
}
