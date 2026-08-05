"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Store,
  Building2,
  ShieldCheck,
  CreditCard,
  Truck,
  FileText,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Step1 {
  storeName: string;
  description: string;
  category: string;
  website: string;
}

interface Step2 {
  businessType: string;
  country: string;
  state: string;
  city: string;
  warehouseAddress: string;
  codAvailable: boolean;
}

interface Step3 {
  legalName: string;
  businessRegNumber: string;
  idDocumentUrl: string;
  taxRegNumber: string;
  vatNumber: string;
  tradeLicense: string;
  businessCert: string;
}

interface Step4 {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  ifscSwift: string;
  currency: string;
}

interface Step5 {
  shippingType: string;
  avgDispatchTime: string;
  warehouseLocation: string;
  returnAddress: string;
}

interface Step6 {
  sellsRegulated: boolean;
  regulatoryDocUrl: string;
  regulatoryCertUrl: string;
  certExpiry: string;
  authorityName: string;
}

interface WizardState {
  step1: Step1;
  step2: Step2;
  step3: Step3;
  step4: Step4;
  step5: Step5;
  step6: Step6;
}

const DEFAULT: WizardState = {
  step1: { storeName: "", description: "", category: "", website: "" },
  step2: { businessType: "", country: "UAE", state: "", city: "", warehouseAddress: "", codAvailable: true },
  step3: { legalName: "", businessRegNumber: "", idDocumentUrl: "", taxRegNumber: "", vatNumber: "", tradeLicense: "", businessCert: "" },
  step4: { bankName: "", accountHolder: "", accountNumber: "", ifscSwift: "", currency: "AED" },
  step5: { shippingType: "", avgDispatchTime: "", warehouseLocation: "", returnAddress: "" },
  step6: { sellsRegulated: false, regulatoryDocUrl: "", regulatoryCertUrl: "", certExpiry: "", authorityName: "" },
};

// ─── Step config ─────────────────────────────────────────────────────────────

const STEPS = [
  { label: "Store Info",        icon: Store },
  { label: "Business Details",  icon: Building2 },
  { label: "Identity Verify",   icon: ShieldCheck },
  { label: "Bank Details",      icon: CreditCard },
  { label: "Shipping",          icon: Truck },
  { label: "Regulatory",        icon: FileText },
  { label: "Review & Submit",   icon: CheckCircle },
];

// ─── Field helpers ────────────────────────────────────────────────────────────

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

const INPUT =
  "w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20";

const SELECT =
  "w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20";

// ─── Step forms ──────────────────────────────────────────────────────────────

function Step1Form({ data, onChange }: { data: Step1; onChange: (d: Step1) => void }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <Field label="Store Name" required>
        <input className={INPUT} placeholder="My Medical Store" value={data.storeName} onChange={(e) => onChange({ ...data, storeName: e.target.value })} />
      </Field>
      <Field label="Category" required>
        <select className={SELECT} value={data.category} onChange={(e) => onChange({ ...data, category: e.target.value })}>
          <option value="">Select category</option>
          <option>Medicines</option>
          <option>Cosmetics</option>
          <option>Consumables</option>
          <option>Medical Devices</option>
          <option>Supplements</option>
        </select>
      </Field>
      <Field label="Store Description" required>
        <textarea
          className={`${INPUT} sm:col-span-2 min-h-24 resize-none`}
          placeholder="Describe what your store sells…"
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
        />
      </Field>
      <Field label="Website (optional)">
        <input className={INPUT} type="url" placeholder="https://mystore.com" value={data.website} onChange={(e) => onChange({ ...data, website: e.target.value })} />
      </Field>
    </div>
  );
}

function Step2Form({ data, onChange }: { data: Step2; onChange: (d: Step2) => void }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <Field label="Business Type" required>
        <select className={SELECT} value={data.businessType} onChange={(e) => onChange({ ...data, businessType: e.target.value })}>
          <option value="">Select type</option>
          <option>Individual</option>
          <option>LLC</option>
          <option>Free Zone Entity</option>
          <option>Mainland Company</option>
          <option>Branch Office</option>
        </select>
      </Field>
      <Field label="Country" required>
        <input className={INPUT} value={data.country} onChange={(e) => onChange({ ...data, country: e.target.value })} />
      </Field>
      <Field label="Emirates / State" required>
        <select className={SELECT} value={data.state} onChange={(e) => onChange({ ...data, state: e.target.value })}>
          <option value="">Select emirate</option>
          <option>Dubai</option>
          <option>Abu Dhabi</option>
          <option>Sharjah</option>
          <option>Ajman</option>
          <option>Ras Al Khaimah</option>
          <option>Fujairah</option>
          <option>Umm Al Quwain</option>
        </select>
      </Field>
      <Field label="City" required>
        <input className={INPUT} placeholder="Dubai" value={data.city} onChange={(e) => onChange({ ...data, city: e.target.value })} />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Warehouse / Pickup Address" required>
          <input className={INPUT} placeholder="Street, Area, Dubai, UAE" value={data.warehouseAddress} onChange={(e) => onChange({ ...data, warehouseAddress: e.target.value })} />
        </Field>
      </div>
      <div className="sm:col-span-2 flex items-center gap-3">
        <input
          id="cod"
          type="checkbox"
          checked={data.codAvailable}
          onChange={(e) => onChange({ ...data, codAvailable: e.target.checked })}
          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor="cod" className="text-sm font-medium text-slate-700">
          Cash on Delivery (COD) available
        </label>
      </div>
    </div>
  );
}

function Step3Form({ data, onChange }: { data: Step3; onChange: (d: Step3) => void }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <Field label="Legal Name" required>
        <input className={INPUT} placeholder="As on trade license" value={data.legalName} onChange={(e) => onChange({ ...data, legalName: e.target.value })} />
      </Field>
      <Field label="Business Registration No." required>
        <input className={INPUT} placeholder="BR-12345678" value={data.businessRegNumber} onChange={(e) => onChange({ ...data, businessRegNumber: e.target.value })} />
      </Field>
      <Field label="Tax Registration No." required>
        <input className={INPUT} placeholder="TRN-000000000" value={data.taxRegNumber} onChange={(e) => onChange({ ...data, taxRegNumber: e.target.value })} />
      </Field>
      <Field label="VAT Number">
        <input className={INPUT} placeholder="VAT-000000" value={data.vatNumber} onChange={(e) => onChange({ ...data, vatNumber: e.target.value })} />
      </Field>
      <Field label="ID Document URL" required>
        <input className={INPUT} type="url" placeholder="https://drive.google.com/…" value={data.idDocumentUrl} onChange={(e) => onChange({ ...data, idDocumentUrl: e.target.value })} />
      </Field>
      <Field label="Trade License URL">
        <input className={INPUT} type="url" placeholder="https://…" value={data.tradeLicense} onChange={(e) => onChange({ ...data, tradeLicense: e.target.value })} />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Business Certificate URL">
          <input className={INPUT} type="url" placeholder="https://…" value={data.businessCert} onChange={(e) => onChange({ ...data, businessCert: e.target.value })} />
        </Field>
      </div>
    </div>
  );
}

function Step4Form({ data, onChange }: { data: Step4; onChange: (d: Step4) => void }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <Field label="Bank Name" required>
        <input className={INPUT} placeholder="Emirates NBD" value={data.bankName} onChange={(e) => onChange({ ...data, bankName: e.target.value })} />
      </Field>
      <Field label="Account Holder Name" required>
        <input className={INPUT} placeholder="Full name as on account" value={data.accountHolder} onChange={(e) => onChange({ ...data, accountHolder: e.target.value })} />
      </Field>
      <Field label="Account Number" required>
        <input className={INPUT} placeholder="AE07 0331 2345 6789 0123 456" value={data.accountNumber} onChange={(e) => onChange({ ...data, accountNumber: e.target.value })} />
      </Field>
      <Field label="IFSC / SWIFT Code" required>
        <input className={INPUT} placeholder="EBILAEAD" value={data.ifscSwift} onChange={(e) => onChange({ ...data, ifscSwift: e.target.value })} />
      </Field>
      <Field label="Currency" required>
        <select className={SELECT} value={data.currency} onChange={(e) => onChange({ ...data, currency: e.target.value })}>
          <option>AED</option>
          <option>USD</option>
          <option>EUR</option>
        </select>
      </Field>
    </div>
  );
}

function Step5Form({ data, onChange }: { data: Step5; onChange: (d: Step5) => void }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <Field label="Shipping Type" required>
        <select className={SELECT} value={data.shippingType} onChange={(e) => onChange({ ...data, shippingType: e.target.value })}>
          <option value="">Select</option>
          <option>Self-Ship</option>
          <option>Fulfilled by Zyventa</option>
          <option>Hybrid</option>
        </select>
      </Field>
      <Field label="Avg Dispatch Time" required>
        <select className={SELECT} value={data.avgDispatchTime} onChange={(e) => onChange({ ...data, avgDispatchTime: e.target.value })}>
          <option value="">Select</option>
          <option>Same Day</option>
          <option>1 Business Day</option>
          <option>2 Business Days</option>
          <option>3–5 Business Days</option>
        </select>
      </Field>
      <div className="sm:col-span-2">
        <Field label="Primary Warehouse Location" required>
          <input className={INPUT} placeholder="Al Quoz Industrial Area, Dubai" value={data.warehouseLocation} onChange={(e) => onChange({ ...data, warehouseLocation: e.target.value })} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Return Address">
          <input className={INPUT} placeholder="Same as pickup address" value={data.returnAddress} onChange={(e) => onChange({ ...data, returnAddress: e.target.value })} />
        </Field>
      </div>
    </div>
  );
}

function Step6Form({ data, onChange }: { data: Step6; onChange: (d: Step6) => void }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2 flex items-center gap-3">
        <input
          id="regulated"
          type="checkbox"
          checked={data.sellsRegulated}
          onChange={(e) => onChange({ ...data, sellsRegulated: e.target.checked })}
          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor="regulated" className="text-sm font-medium text-slate-700">
          I sell regulated products (medicines, medical devices, controlled substances)
        </label>
      </div>
      {data.sellsRegulated && (
        <>
          <Field label="Regulatory Document URL">
            <input className={INPUT} type="url" placeholder="https://…" value={data.regulatoryDocUrl} onChange={(e) => onChange({ ...data, regulatoryDocUrl: e.target.value })} />
          </Field>
          <Field label="Regulatory Certificate URL">
            <input className={INPUT} type="url" placeholder="https://…" value={data.regulatoryCertUrl} onChange={(e) => onChange({ ...data, regulatoryCertUrl: e.target.value })} />
          </Field>
          <Field label="Certificate Expiry">
            <input className={INPUT} type="date" value={data.certExpiry} onChange={(e) => onChange({ ...data, certExpiry: e.target.value })} />
          </Field>
          <Field label="Issuing Authority">
            <input className={INPUT} placeholder="Ministry of Health, UAE" value={data.authorityName} onChange={(e) => onChange({ ...data, authorityName: e.target.value })} />
          </Field>
        </>
      )}
    </div>
  );
}

function ReviewStep({ state }: { state: WizardState }) {
  const sections: Array<{ title: string; rows: Array<{ label: string; value: string | boolean }> }> = [
    {
      title: "Store Information",
      rows: [
        { label: "Store Name", value: state.step1.storeName },
        { label: "Category", value: state.step1.category },
        { label: "Description", value: state.step1.description },
        { label: "Website", value: state.step1.website || "—" },
      ],
    },
    {
      title: "Business Details",
      rows: [
        { label: "Business Type", value: state.step2.businessType },
        { label: "Location", value: `${state.step2.city}, ${state.step2.state}, ${state.step2.country}` },
        { label: "Warehouse Address", value: state.step2.warehouseAddress },
        { label: "COD Available", value: state.step2.codAvailable },
      ],
    },
    {
      title: "Identity Verification",
      rows: [
        { label: "Legal Name", value: state.step3.legalName },
        { label: "Business Reg. No.", value: state.step3.businessRegNumber },
        { label: "Tax Reg. No.", value: state.step3.taxRegNumber },
        { label: "VAT Number", value: state.step3.vatNumber || "—" },
      ],
    },
    {
      title: "Bank Details",
      rows: [
        { label: "Bank", value: state.step4.bankName },
        { label: "Account Holder", value: state.step4.accountHolder },
        { label: "Account No.", value: state.step4.accountNumber },
        { label: "Currency", value: state.step4.currency },
      ],
    },
    {
      title: "Shipping",
      rows: [
        { label: "Shipping Type", value: state.step5.shippingType },
        { label: "Avg Dispatch", value: state.step5.avgDispatchTime },
        { label: "Warehouse Location", value: state.step5.warehouseLocation },
      ],
    },
    {
      title: "Regulatory",
      rows: [
        { label: "Sells Regulated Products", value: state.step6.sellsRegulated },
        ...(state.step6.sellsRegulated
          ? [
              { label: "Authority", value: state.step6.authorityName },
              { label: "Cert. Expiry", value: state.step6.certExpiry },
            ]
          : []),
      ],
    },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">Review your information before submitting. You can go back to edit any step.</p>
      {sections.map((section) => (
        <div key={section.title} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h4 className="mb-3 text-xs font-bold text-slate-500 uppercase tracking-wide">{section.title}</h4>
          <div className="space-y-1.5">
            {section.rows.map((row) => (
              <div key={row.label} className="flex justify-between gap-4 text-sm">
                <span className="text-slate-500 shrink-0">{row.label}</span>
                <span className="text-slate-900 font-medium text-right">
                  {typeof row.value === "boolean" ? (row.value ? "Yes" : "No") : row.value || "—"}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Wizard ──────────────────────────────────────────────────────────────

export function SellerRegistrationWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardState>(DEFAULT);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLast = step === STEPS.length - 1;

  async function handleNext() {
    if (isLast) {
      setSubmitting(true);
      setError(null);
      try {
        const payload = {
          storeName: data.step1.storeName,
          description: data.step1.description,
          codAvailable: data.step2.codAvailable,
          legalName: data.step3.legalName,
          businessRegNumber: data.step3.businessRegNumber,
          idDocumentUrl: data.step3.idDocumentUrl,
          regulatoryDocUrl: data.step6.regulatoryDocUrl,
        };
        const res = await fetch("/api/seller", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error((await res.json()).error ?? "Submission failed");
        router.push("/seller/dashboard");
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Something went wrong");
        setSubmitting(false);
      }
      return;
    }
    setStep((s) => s + 1);
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress steps */}
      <div className="mb-8 flex items-center gap-0">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const done = i < step;
          const active = i === step;
          return (
            <div key={s.label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition ${
                    done
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : active
                      ? "border-indigo-600 bg-white text-indigo-600"
                      : "border-slate-200 bg-white text-slate-400"
                  }`}
                >
                  {done ? <CheckCircle className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
                <span className={`hidden sm:block text-[10px] font-medium whitespace-nowrap ${active ? "text-indigo-600" : done ? "text-slate-600" : "text-slate-400"}`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`mb-5 h-0.5 flex-1 mx-1 ${i < step ? "bg-indigo-600" : "bg-slate-200"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="mb-1 text-xl font-bold text-slate-900">
          Step {step + 1}: {STEPS[step].label}
        </h2>
        <p className="mb-6 text-sm text-slate-500">
          {step + 1} of {STEPS.length}
        </p>

        {step === 0 && <Step1Form data={data.step1} onChange={(d) => setData({ ...data, step1: d })} />}
        {step === 1 && <Step2Form data={data.step2} onChange={(d) => setData({ ...data, step2: d })} />}
        {step === 2 && <Step3Form data={data.step3} onChange={(d) => setData({ ...data, step3: d })} />}
        {step === 3 && <Step4Form data={data.step4} onChange={(d) => setData({ ...data, step4: d })} />}
        {step === 4 && <Step5Form data={data.step5} onChange={(d) => setData({ ...data, step5: d })} />}
        {step === 5 && <Step6Form data={data.step6} onChange={(d) => setData({ ...data, step6: d })} />}
        {step === 6 && <ReviewStep state={data} />}

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={submitting}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {submitting ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</>
            ) : isLast ? (
              <><CheckCircle className="h-4 w-4" /> Submit Application</>
            ) : (
              <>Continue <ChevronRight className="h-4 w-4" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
