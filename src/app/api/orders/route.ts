import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getEffectivePrice } from "@/lib/pricing";
import { getEffectiveCod } from "@/lib/cod";
import { STANDARD_DELIVERY_DAYS } from "@/lib/delivery";

type OrderRequestItem = { productId: string; quantity: number };

const VALID_PAYMENT_METHODS = ["card", "apple_pay", "google_pay", "cod"];

class InsufficientStockError extends Error {}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const items: OrderRequestItem[] = Array.isArray(body?.items) ? body.items : [];
  const shipping = body?.shipping ?? {};
  const paymentMethod = typeof body?.paymentMethod === "string" ? body.paymentMethod : "card";

  if (items.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  if (!VALID_PAYMENT_METHODS.includes(paymentMethod)) {
    return NextResponse.json({ error: "Invalid payment method." }, { status: 400 });
  }

  const shippingName = typeof shipping.name === "string" ? shipping.name.trim() : "";
  const shippingAddress = typeof shipping.address === "string" ? shipping.address.trim() : "";
  const shippingCity = typeof shipping.city === "string" ? shipping.city.trim() : "";
  const shippingZip = typeof shipping.zip === "string" ? shipping.zip.trim() : "";

  if (!shippingName || !shippingAddress || !shippingCity || !shippingZip) {
    return NextResponse.json({ error: "Complete shipping details are required." }, { status: 400 });
  }

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) } },
    include: { seller: true },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));

  if (paymentMethod === "cod") {
    const codUnavailable = products.some((p) => !getEffectiveCod(p, p.seller));
    if (codUnavailable) {
      return NextResponse.json(
        { error: "Cash on delivery isn't available for one or more items in your cart." },
        { status: 400 },
      );
    }
  }

  type OrderItemData = {
    productId: string;
    sellerId: string;
    name: string;
    price: number;
    quantity: number;
    warrantyMonths: number | null;
  };

  let total = 0;
  const orderItemsData: OrderItemData[] = [];
  for (const item of items) {
    const product = productMap.get(item.productId);
    const quantity = Math.max(1, Math.min(99, Number(item.quantity) || 1));
    if (!product) continue;
    const { finalPrice } = getEffectivePrice(product);
    total += finalPrice * quantity;
    orderItemsData.push({
      productId: product.id,
      sellerId: product.sellerId,
      name: product.name,
      price: finalPrice,
      quantity,
      warrantyMonths: product.warrantyMonths,
    });
  }

  if (orderItemsData.length === 0) {
    return NextResponse.json({ error: "No valid items in cart." }, { status: 400 });
  }

  try {
    const order = await prisma.$transaction(async (tx) => {
      for (const item of orderItemsData) {
        // Compare-and-swap: only decrements if enough stock remains, so concurrent
        // orders for the same product can never oversell it.
        const updated = await tx.product.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (updated.count === 0) {
          const product = productMap.get(item.productId);
          throw new InsufficientStockError(
            `Only ${product?.stock ?? 0} left of "${item.name}" — reduce the quantity in your cart.`,
          );
        }
      }

      return tx.order.create({
        data: {
          userId: session.user.id,
          paymentMethod,
          total,
          shippingName,
          shippingAddress,
          shippingCity,
          shippingZip,
          estimatedDeliveryAt: new Date(Date.now() + STANDARD_DELIVERY_DAYS * 24 * 60 * 60 * 1000),
          items: { create: orderItemsData },
        },
      });
    });

    return NextResponse.json({ orderId: order.id });
  } catch (err) {
    if (err instanceof InsufficientStockError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    throw err;
  }
}
