"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Store, Building2, ShieldCheck, Landmark, Truck, FileCheck, ClipboardList,
  ChevronRight, ChevronLeft, Check, Upload,
} from "lucide-react";

const STEPS = [
  { id: 1, label: "Store Info",     icon: Store },
  { id: 2, label: "Business",       icon: Building2 },
  { id: 3, label: "Identity",       icon: ShieldCheck },
  { id: 4, label: "Bank Details",   icon: Landmark },
  { id: 5, label: "Shipping",       icon: Truck },
  { id: 6, label: "Regulatory",     icon: FileCheck },
  { id: 7, label: "Review",         icon: ClipboardList },
];

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-sm font-medium text-slate-700">{children}</label>;
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
      rows={3}
    />
  );
}

function UploadBox({ label }: { label: string }) {
  return (
    <div className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-indigo-400 hover:bg-indigo-50/40">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
        <Upload className="h-4 w-4" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-700">{label}</p>
        <p className="text-xs text-slate-400">PDF, JPG, PNG · Max 5 MB</p>
      </div>
    </div>
  );
}

// ── Step forms ──────────────────────────────────────────────────────────────

function Step1({ data, set }: { data: Record<string, string>; set: (k: string, v: string) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Store Name *</Label>
        <Input placeholder="e.g. Al Noor Pharmacy" value={data.storeName ?? ""} onChange={(e) => set("storeName", e.target.value)} />
      </div>
      <div>
        <Label>Store Description *</Label>
        <Textarea placeholder="Tell customers about your store…" value={data.description ?? ""} onChange={(e) => set("description", e.target.value)} />
      </div>
      <div>
        <Label>Primary Category *</Label>
        <Select value={data.category ?? ""} onChange={(e) => set("category", e.target.value)}>
          <option value="">Select a category</option>
          <option>Medicines</option>
          <option>Cosmetics</option>
          <option>Consumables</option>
        </Select>
      </div>
      <div>
        <Label>Store Website</Label>
        <Input type="url" placeholder="https://yourstore.com" value={data.website ?? ""} onChange={(e) => set("website", e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Store Logo</Label>
          <UploadBox label="Upload Logo" />
        </div>
        <div>
          <Label>Store Banner</Label>
          <UploadBox label="Upload Banner" />
        </div>
      </div>
    </div>
  );
}

function Step2({ data, set }: { data: Record<string, string>; set: (k: string, v: string) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Business Type *</Label>
        <Select value={data.businessType ?? ""} onChange={(e) => set("businessType", e.target.value)}>
          <option value="">Select type</option>
          <option>Individual / Sole Proprietor</option>
          <option>LLC</option>
          <option>Corporation</option>
          <option>Partnership</option>
        </Select>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Country *</Label>
          <Select value={data.country ?? ""} onChange={(e) => set("country", e.target.value)}>
            <option value="">Select</option>
            <option>UAE</option>
            <option>Saudi Arabia</option>
            <option>India</option>
          </Select>
        </div>
        <div>
          <Label>Emirate / State</Label>
          <Select value={data.state ?? ""} onChange={(e) => set("state", e.target.value)}>
            <option value="">Select</option>
            <option>Dubai</option>
            <option>Abu Dhabi</option>
            <option>Sharjah</option>
            <option>Ajman</option>
            <option>Ras Al Khaimah</option>
            <option>Fujairah</option>
            <option>Umm Al Quwain</option>
          </Select>
        </div>
        <div>
          <Label>City</Label>
          <Input placeholder="e.g. Dubai" value={data.city ?? ""} onChange={(e) => set("city", e.target.value)} />
        </div>
      </div>
      <div>
        <Label>Warehouse / Pickup Address</Label>
        <Textarea placeholder="Full address where orders will be collected from…" value={data.warehouseAddress ?? ""} onChange={(e) => set("warehouseAddress", e.target.value)} />
      </div>
      <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
        <input type="checkbox" id="cod" checked={data.codAvailable === "true"} onChange={(e) => set("codAvailable", String(e.target.checked))} className="h-4 w-4 rounded border-slate-300 accent-indigo-600" />
        <label htmlFor="cod" className="text-sm font-medium text-slate-700">I accept Cash on Delivery (COD) orders</label>
      </div>
    </div>
  );
}

function Step3({ data, set }: { data: Record<string, string>; set: (k: string, v: string) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Legal Name *</Label>
        <Input placeholder="Full legal name as on your ID" value={data.legalName ?? ""} onChange={(e) => set("legalName", e.target.value)} />
      </div>
      <div>
        <Label>Business Registration Number *</Label>
        <Input placeholder="e.g. DED-12345678" value={data.businessRegNumber ?? ""} onChange={(e) => set("businessRegNumber", e.target.value)} />
      </div>
      <div>
        <Label>Tax Registration Number</Label>
        <Input placeholder="VAT TRN" value={data.taxRegNumber ?? ""} onChange={(e) => set("taxRegNumber", e.target.value)} />
      </div>
      <div>
        <Label>VAT Number</Label>
        <Input placeholder="e.g. 100123456789003" value={data.vatNumber ?? ""} onChange={(e) => set("vatNumber", e.target.value)} />
      </div>
      <div>
        <Label>Government-issued ID *</Label>
        <UploadBox label="Upload ID Document (Emirates ID / Passport)" />
        <input type="hidden" value={data.idDocumentUrl ?? ""} onChange={(e) => set("idDocumentUrl", e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Trade License</Label>
          <UploadBox label="Upload Trade License" />
        </div>
        <div>
          <Label>Business Certificate</Label>
          <UploadBox label="Upload Certificate" />
        </div>
      </div>
    </div>
  );
}

function Step4({ data, set }: { data: Record<string, string>; set: (k: string, v: string) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Bank Name *</Label>
        <Input placeholder="e.g. Emirates NBD" value={data.bankName ?? ""} onChange={(e) => set("bankName", e.target.value)} />
      </div>
      <div>
        <Label>Account Holder Name *</Label>
        <Input placeholder="As it appears on the bank account" value={data.accountHolder ?? ""} onChange={(e) => set("accountHolder", e.target.value)} />
      </div>
      <div>
        <Label>Account Number *</Label>
        <Input type="password" placeholder="••••••••••••" value={data.accountNumber ?? ""} onChange={(e) => set("accountNumber", e.target.value)} />
      </div>
      <div>
        <Label>IFSC / SWIFT Code</Label>
        <Input placeholder="e.g. EBILAEAD" value={data.ifscSwift ?? ""} onChange={(e) => set("ifscSwift", e.target.value)} />
      </div>
      <div>
        <Label>Settlement Currency *</Label>
        <Select value={data.currency ?? ""} onChange={(e) => set("currency", e.target.value)}>
          <option value="">Select currency</option>
          <option>AED</option>
          <option>USD</option>
          <option>EUR</option>
          <option>GBP</option>
        </Select>
      </div>
    </div>
  );
}

function Step5({ data, set }: { data: Record<string, string>; set: (k: string, v: string) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Shipping Type *</Label>
        <Select value={data.shippingType ?? ""} onChange={(e) => set("shippingType", e.target.value)}>
          <option value="">Select</option>
          <option>Self-ship</option>
          <option>Marketplace Logistics</option>
          <option>Both</option>
        </Select>
      </div>
      <div>
        <Label>Average Dispatch Time</Label>
        <Select value={data.avgDispatchTime ?? ""} onChange={(e) => set("avgDispatchTime", e.target.value)}>
          <option value="">Select</option>
          <option>Same day</option>
          <option>Within 24 hours</option>
          <option>1–2 business days</option>
          <option>2–3 business days</option>
          <option>3–5 business days</option>
        </Select>
      </div>
      <div>
        <Label>Warehouse / Pickup Location</Label>
        <Textarea placeholder="Address from which orders will be dispatched" value={data.warehouseLocation ?? ""} onChange={(e) => set("warehouseLocation", e.target.value)} />
      </div>
      <div>
        <Label>Return Address</Label>
        <Textarea placeholder="Address where returned items should be sent" value={data.returnAddress ?? ""} onChange={(e) => set("returnAddress", e.target.value)} />
      </div>
    </div>
  );
}

function Step6({ data, set }: { data: Record<string, string>; set: (k: string, v: string) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
        <input type="checkbox" id="regulated" checked={data.sellsRegulated === "true"} onChange={(e) => set("sellsRegulated", String(e.target.checked))} className="h-4 w-4 rounded border-slate-300 accent-indigo-600" />
        <label htmlFor="regulated" className="text-sm font-medium text-slate-700">I sell regulated products (prescription medicines, controlled substances)</label>
      </div>
      {data.sellsRegulated === "true" && (
        <>
          <div>
            <Label>Regulatory Authority Name</Label>
            <Input placeholder="e.g. Dubai Health Authority (DHA)" value={data.authorityName ?? ""} onChange={(e) => set("authorityName", e.target.value)} />
          </div>
          <div>
            <Label>Regulatory Document</Label>
            <UploadBox label="Upload Regulatory License" />
            <input type="hidden" value={data.regulatoryDocUrl ?? ""} onChange={(e) => set("regulatoryDocUrl", e.target.value)} />
          </div>
          <div>
            <Label>Regulatory Certificate</Label>
            <UploadBox label="Upload Certificate" />
          </div>
          <div>
            <Label>Certificate Expiry Date</Label>
            <Input type="date" value={data.certExpiry ?? ""} onChange={(e) => set("certExpiry", e.target.value)} />
          </div>
        </>
      )}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-4 py-2 border-b border-slate-100 last:border-0">
      <p className="w-44 shrink-0 text-xs font-semibold text-slate-500">{label}</p>
      <p className="text-sm text-slate-800">{value}</p>
    </div>
  );
}

function Step7({ data }: { data: Record<string, string> }) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-500">Please review your information before submitting.</p>
      {[
        { section: "Store Information", rows: [
          ["Store Name", data.storeName], ["Description", data.description], ["Category", data.category], ["Website", data.website],
        ]},
        { section: "Business Details", rows: [
          ["Business Type", data.businessType], ["Country", data.country], ["Emirate/State", data.state], ["City", data.city], ["COD Available", data.codAvailable === "true" ? "Yes" : "No"],
        ]},
        { section: "Identity Verification", rows: [
          ["Legal Name", data.legalName], ["Business Reg. No.", data.businessRegNumber], ["Tax Reg. No.", data.taxRegNumber], ["VAT Number", data.vatNumber],
        ]},
        { section: "Bank Details", rows: [
          ["Bank Name", data.bankName], ["Account Holder", data.accountHolder], ["Currency", data.currency],
        ]},
        { section: "Shipping", rows: [
          ["Shipping Type", data.shippingType], ["Avg Dispatch Time", data.avgDispatchTime],
        ]},
        { section: "Regulatory", rows: [
          ["Sells Regulated", data.sellsRegulated === "true" ? "Yes" : "No"], ["Authority", data.authorityName],
        ]},
      ].map(({ section, rows }) => (
        <div key={section} className="rounded-xl border border-slate-200 bg-white p-5">
          <h4 className="mb-3 text-sm font-bold text-slate-900">{section}</h4>
          {rows.map(([label, value]) => (
            <ReviewRow key={label} label={label} value={value ?? ""} />
          ))}
        </div>
      ))}
      <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-800">
        By submitting you agree to Zyventa's Seller Terms of Service and Marketplace Policies.
      </div>
    </div>
  );
}

// ── Main Wizard ──────────────────────────────────────────────────────────────

export function SellerRegistrationWizard() {
  const { update } = useSession();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function set(key: string, value: string) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    const payload = {
      storeName: data.storeName ?? "",
      description: data.description ?? "",
      codAvailable: data.codAvailable === "true",
      legalName: data.legalName ?? "",
      businessRegNumber: data.businessRegNumber ?? "",
      idDocumentUrl: data.idDocumentUrl || "https://placeholder.zyventa.com/id-document",
      regulatoryDocUrl: data.regulatoryDocUrl || "",
    };
    try {
      await fetch("/api/seller", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setSubmitted(true);
      // Refresh JWT so navbar immediately shows "Seller Dashboard"
      await update();
    } catch {
      /* handle error */
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <Check className="h-10 w-10 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Application Submitted!</h2>
          <p className="mt-2 text-slate-500 max-w-sm">
            Our team will review your application and get back to you within 2–3 business days.
            Once approved, you can start listing products.
          </p>
        </div>
        <Link
          href="/seller/dashboard"
          className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
        >
          Go to Seller Dashboard
        </Link>
      </div>
    );
  }

  const stepData = [null, Step1, Step2, Step3, Step4, Step5, Step6, Step7];
  const CurrentStep = stepData[step] as React.ComponentType<{ data: Record<string, string>; set: (k: string, v: string) => void }>;

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress steps */}
      <div className="mb-8 flex items-center justify-between">
        {STEPS.map(({ id, label, icon: Icon }) => (
          <div key={id} className="flex flex-col items-center gap-1.5">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition ${
                id < step
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : id === step
                  ? "border-indigo-600 bg-white text-indigo-600"
                  : "border-slate-200 bg-white text-slate-400"
              }`}
            >
              {id < step ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
            </div>
            <span className={`hidden text-[10px] font-semibold sm:block ${id === step ? "text-indigo-700" : "text-slate-400"}`}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="mb-6 text-xl font-bold text-slate-900">
              Step {step} of 7 — {STEPS[step - 1].label}
            </h2>
            {step === 7 ? (
              <Step7 data={data} />
            ) : (
              <CurrentStep data={data} set={set} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="mt-6 flex justify-between gap-4">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
          className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        {step < 7 ? (
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(7, s + 1))}
            className="flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            Continue <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-orange-500 px-8 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Submit Application"}
          </button>
        )}
      </div>
    </div>
  );
}
