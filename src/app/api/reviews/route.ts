import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You must be signed in to leave a review." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const productId = typeof body?.productId === "string" ? body.productId : "";
  const rating = Math.round(Number(body?.rating));
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const reviewBody = typeof body?.body === "string" ? body.body.trim() : "";

  if (!productId || !title || !reviewBody || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Please provide a rating, title, and review." }, { status: 400 });
  }

  const review = await prisma.review.upsert({
    where: { userId_productId: { userId: session.user.id, productId } },
    update: { rating, title, body: reviewBody },
    create: { userId: session.user.id, productId, rating, title, body: reviewBody },
  });

  return NextResponse.json({ id: review.id });
}
