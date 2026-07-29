"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Loader2,
  Lock,
  ShieldCheck,
  Wallet,
  Banknote,
  Apple,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { useCartStore, cartTotal } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import type { AddressData } from "@/components/addresses/address-list";
import { useLocale } from "@/components/locale-provider";

type Step = "shipping" | "payment";
type PaymentMethod = "card" | "apple_pay" | "google_pay" | "cod";

export function CheckoutForm({
  userName,
  addresses,
}: {
  userName: string;
  addresses: AddressData[];
}) {
  const router = useRouter();
  const { dict } = useLocale();

  const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; icon: typeof CreditCard }[] = [
    { id: "card", label: dict.checkout.creditDebitCard, icon: CreditCard },
    { id: "apple_pay", label: "Apple Pay", icon: Apple },
    { id: "google_pay", label: "Google Pay", icon: Wallet },
    { id: "cod", label: dict.checkout.cashOnDelivery, icon: Banknote },
  ];
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const total = cartTotal(items);
  const codAvailable = items.length > 0 && items.every((i) => i.codAvailable);

  const [step, setStep] = useState<Step>("shipping");
  const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0];
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(defaultAddress?.id ?? null);
  const [useNewAddress, setUseNewAddress] = useState(addresses.length === 0);
  const [shipping, setShipping] = useState({
    name: userName,
    address: "",
    city: "",
    zip: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "" });
  const [processing, setProcessing] = useState(false);

  function updateShipping(field: keyof typeof shipping, value: string) {
    setShipping((s) => ({ ...s, [field]: value }));
  }

  function handleShippingSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep("payment");
  }

  function resolvedShipping() {
    if (!useNewAddress && selectedAddressId) {
      const addr = addresses.find((a) => a.id === selectedAddressId);
      if (addr) {
        return {
          name: addr.fullName,
          address: addr.line1,
          city: addr.city,
          zip: addr.zip,
        };
      }
    }
    return shipping;
  }

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    if (paymentMethod === "cod" && !codAvailable) {
      toast.error("Cash on delivery isn't available for one or more items in your cart.");
      return;
    }
    setProcessing(true);

    // Simulated payment processing — no real gateway is called and no card
    // data ever leaves this form.
    await new Promise((resolve) => setTimeout(resolve, paymentMethod === "cod" ? 600 : 1400));

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          shipping: resolvedShipping(),
          paymentMethod,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Could not place order.");
        setProcessing(false);
        return;
      }

      const data = await res.json();
      clear();
      toast.success(paymentMethod === "cod" ? "Order placed!" : "Payment successful!");
      router.push(`/checkout/success/${data.orderId}`);
    } catch {
      toast.error("Something went wrong. Please try again.");
      setProcessing(false);
    }
  }

  const cardNumberDisplay = card.number || "•••• •••• •••• ••••";
  const shippingReady = !useNewAddress && selectedAddressId;

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
      <div>
        <div className="mb-8 flex items-center gap-3 text-sm font-medium">
          <span className={step === "shipping" ? "text-indigo-700 dark:text-indigo-400" : "text-neutral-400"}>
            1. {dict.checkout.stepShipping}
          </span>
          <span className="h-px w-8 bg-black/10 dark:bg-white/15" />
          <span className={step === "payment" ? "text-indigo-700 dark:text-indigo-400" : "text-neutral-400"}>
            2. {dict.checkout.stepPayment}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {step === "shipping" ? (
            <motion.form
              key="shipping"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              onSubmit={handleShippingSubmit}
              className="flex flex-col gap-4"
            >
              {addresses.length > 0 && (
                <div className="flex flex-col gap-2">
                  {addresses.map((addr) => (
                    <button
                      type="button"
                      key={addr.id}
                      onClick={() => {
                        setSelectedAddressId(addr.id);
                        setUseNewAddress(false);
                      }}
                      className={`flex items-start justify-between gap-3 rounded-2xl border p-4 text-left transition ${
                        !useNewAddress && selectedAddressId === addr.id
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30"
                          : "border-black/10 hover:border-indigo-300 dark:border-white/15"
                      }`}
                    >
                      <div>
                        <p className="text-sm font-semibold">
                          {addr.label}
                          {addr.isDefault && (
                            <span className="ms-2 text-xs font-normal text-neutral-500">{dict.checkout.default}</span>
                          )}
                        </p>
                        <p className="mt-0.5 text-sm text-neutral-500">
                          {addr.fullName} · {addr.line1}, {addr.city}
                          {addr.state ? `, ${addr.state}` : ""} {addr.zip}
                        </p>
                      </div>
                      {!useNewAddress && selectedAddressId === addr.id && (
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                      )}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setUseNewAddress(true)}
                    className={`rounded-2xl border p-4 text-left text-sm font-semibold transition ${
                      useNewAddress
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30"
                        : "border-dashed border-black/15 text-neutral-500 hover:border-indigo-300 dark:border-white/15"
                    }`}
                  >
                    {dict.checkout.useNewAddress}
                  </button>
                </div>
              )}

              {useNewAddress && (
                <>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">{dict.checkout.fullName}</label>
                    <input
                      required
                      value={shipping.name}
                      onChange={(e) => updateShipping("name", e.target.value)}
                      className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">{dict.checkout.streetAddress}</label>
                    <input
                      required
                      value={shipping.address}
                      onChange={(e) => updateShipping("address", e.target.value)}
                      placeholder="123 Market Street"
                      className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-900"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">{dict.checkout.city}</label>
                      <input
                        required
                        value={shipping.city}
                        onChange={(e) => updateShipping("city", e.target.value)}
                        className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">{dict.checkout.zipCode}</label>
                      <input
                        required
                        value={shipping.zip}
                        onChange={(e) => updateShipping("zip", e.target.value)}
                        className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-900"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Tip: save addresses for next time from{" "}
                    <a href="/account/addresses" className="underline">
                      your address book
                    </a>
                    .
                  </p>
                </>
              )}

              <motion.button
                type="submit"
                disabled={useNewAddress ? false : !shippingReady}
                whileTap={{ scale: 0.97 }}
                className="mt-2 rounded-full bg-indigo-600 py-3.5 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50 dark:bg-white dark:text-neutral-950"
              >
                {dict.common.continueToPayment}
              </motion.button>
            </motion.form>
          ) : (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
            >
              <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {PAYMENT_OPTIONS.map((opt) => {
                  const disabled = opt.id === "cod" && !codAvailable;
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={disabled}
                      onClick={() => setPaymentMethod(opt.id)}
                      className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
                        paymentMethod === opt.id
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30"
                          : "border-black/10 hover:border-indigo-300 dark:border-white/15"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
              {!codAvailable && (
                <p className="mb-6 -mt-3 text-xs text-neutral-400">
                  Cash on delivery isn&apos;t offered by one or more sellers in your cart.
                </p>
              )}

              {paymentMethod === "card" && (
                <motion.div
                  initial={{ rotateY: -15, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  className="mb-6 flex aspect-[1.6/1] w-full max-w-sm flex-col justify-between rounded-2xl bg-gradient-to-br from-indigo-600 to-orange-500 p-6 text-white shadow-xl shadow-indigo-500/30"
                >
                  <div className="flex items-center justify-between">
                    <CreditCard className="h-7 w-7" />
                    <span className="text-xs font-semibold tracking-widest opacity-80">TEST CARD</span>
                  </div>
                  <p className="font-mono text-xl tracking-widest">{cardNumberDisplay}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="uppercase opacity-90">{shipping.name || dict.checkout.yourName}</span>
                    <span className="opacity-90">{card.expiry || "MM/YY"}</span>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handlePay} className="flex flex-col gap-4">
                {paymentMethod === "card" && (
                  <>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">{dict.checkout.cardNumber}</label>
                      <input
                        required
                        inputMode="numeric"
                        maxLength={19}
                        placeholder="4242 4242 4242 4242"
                        value={card.number}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
                          const grouped = digits.replace(/(.{4})/g, "$1 ").trim();
                          setCard((c) => ({ ...c, number: grouped }));
                        }}
                        className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-900"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium">{dict.checkout.expiry}</label>
                        <input
                          required
                          placeholder="MM/YY"
                          maxLength={5}
                          value={card.expiry}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
                            const formatted =
                              digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
                            setCard((c) => ({ ...c, expiry: formatted }));
                          }}
                          className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-900"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium">{dict.checkout.cvc}</label>
                        <input
                          required
                          inputMode="numeric"
                          maxLength={3}
                          placeholder="123"
                          value={card.cvc}
                          onChange={(e) =>
                            setCard((c) => ({ ...c, cvc: e.target.value.replace(/\D/g, "").slice(0, 3) }))
                          }
                          className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-900"
                        />
                      </div>
                    </div>
                    <p className="flex items-center gap-1.5 text-xs text-neutral-500">
                      <Lock className="h-3.5 w-3.5" /> Demo checkout — this card form is simulated, nothing is
                      charged or stored.
                    </p>
                  </>
                )}

                {(paymentMethod === "apple_pay" || paymentMethod === "google_pay") && (
                  <p className="flex items-center gap-1.5 rounded-xl bg-neutral-100 p-4 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                    <Lock className="h-3.5 w-3.5 shrink-0" /> Simulated {paymentMethod === "apple_pay" ? "Apple Pay" : "Google Pay"} —
                    tap Pay to confirm your order. No real wallet is charged.
                  </p>
                )}

                {paymentMethod === "cod" && (
                  <p className="flex items-center gap-1.5 rounded-xl bg-neutral-100 p-4 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                    <Banknote className="h-3.5 w-3.5 shrink-0" /> Pay with cash when your order arrives.
                  </p>
                )}

                <div className="mt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep("shipping")}
                    className="rounded-full border border-black/10 px-6 py-3.5 font-semibold transition hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
                  >
                    {dict.common.back}
                  </button>
                  <motion.button
                    type="submit"
                    disabled={processing}
                    whileTap={{ scale: 0.97 }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-orange-500 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/30 transition disabled:opacity-70"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> {dict.common.processing}
                      </>
                    ) : paymentMethod === "cod" ? (
                      `${dict.common.placeOrder} · ${formatPrice(total)}`
                    ) : (
                      `${dict.common.pay} ${formatPrice(total)}`
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="h-fit rounded-2xl border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-neutral-900">
        <h2 className="mb-4 font-bold">{dict.checkout.orderSummary}</h2>
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between text-sm">
              <span className="line-clamp-1 text-neutral-600 dark:text-neutral-400">
                {item.name} × {item.quantity}
              </span>
              <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between border-t border-black/5 pt-4 font-bold dark:border-white/10">
          <span>{dict.cart.total}</span>
          <span>{formatPrice(total)}</span>
        </div>
        <div className="mt-4 flex items-center gap-1.5 text-xs text-neutral-500">
          <ShieldCheck className="h-3.5 w-3.5" /> Secure, simulated checkout
        </div>
      </div>
    </div>
  );
}
