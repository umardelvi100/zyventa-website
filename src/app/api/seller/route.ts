import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isSafeHttpUrl } from "@/lib/safe-url";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  const existing = await prisma.seller.findUnique({ where: { userId: session.user.id } });
  if (existing) {
    return NextResponse.json({ error: "You already have a seller account." }, { status: 409 });
  }

  const body = await req.json().catch(() => null);
  const storeName = typeof body?.storeName === "string" ? body.storeName.trim() : "";
  const description = typeof body?.description === "string" ? body.description.trim() : "";
  const codAvailable = Boolean(body?.codAvailable);
  const legalName = typeof body?.legalName === "string" ? body.legalName.trim() : "";
  const businessRegNumber = typeof body?.businessRegNumber === "string" ? body.businessRegNumber.trim() : "";
  const idDocumentUrl = typeof body?.idDocumentUrl === "string" ? body.idDocumentUrl.trim() : "";
  const regulatoryDocUrl = typeof body?.regulatoryDocUrl === "string" ? body.regulatoryDocUrl.trim() : "";

  if (!storeName) {
    return NextResponse.json({ error: "Store name is required." }, { status: 400 });
  }
  if (!legalName || !businessRegNumber || !idDocumentUrl) {
    return NextResponse.json(
      { error: "Legal name, business registration number, and a document link are required for verification." },
      { status: 400 },
    );
  }
  if (!isSafeHttpUrl(idDocumentUrl) || (regulatoryDocUrl && !isSafeHttpUrl(regulatoryDocUrl))) {
    return NextResponse.json({ error: "Document links must be valid http(s) URLs." }, { status: 400 });
  }

  const seller = await prisma.seller.create({
    data: {
      userId: session.user.id,
      storeName,
      description: description || null,
      codAvailable,
      legalName,
      businessName: storeName,
      businessRegNumber,
      idDocumentUrl,
      regulatoryDocUrl: regulatoryDocUrl || null,
      verificationStatus: "pending",
      submittedAt: new Date(),
    },
  });

  return NextResponse.json({ sellerId: seller.id });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  const seller = await prisma.seller.findUnique({ where: { userId: session.user.id } });
  if (!seller) {
    return NextResponse.json({ error: "You must have a seller account." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const regulatoryDocUrl = typeof body?.regulatoryDocUrl === "string" ? body.regulatoryDocUrl.trim() : "";
  if (!regulatoryDocUrl) {
    return NextResponse.json({ error: "A document link is required." }, { status: 400 });
  }
  if (!isSafeHttpUrl(regulatoryDocUrl)) {
    return NextResponse.json({ error: "The document link must be a valid http(s) URL." }, { status: 400 });
  }

  await prisma.seller.update({
    where: { id: seller.id },
    data: { regulatoryDocUrl },
  });

  return NextResponse.json({ ok: true });
}
