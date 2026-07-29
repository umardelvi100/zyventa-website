import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(_req: Request, { params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  await prisma.wishlistItem.deleteMany({
    where: { userId: session.user.id, productId },
  });

  return NextResponse.json({ ok: true });
}
