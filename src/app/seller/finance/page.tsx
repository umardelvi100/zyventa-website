import { DollarSign, TrendingDown, Wallet, CreditCard, Clock, CheckCircle } from "lucide-react";
import { formatPrice } from "@/lib/format";

const SUMMARY_CARDS = [
  { label: "Gross Revenue",      value: 394000,  icon: <DollarSign className="h-5 w-5"/>, accent: "indigo",  note: "This month" },
  { label: "Platform Commission",value: -39400,  icon: <TrendingDown className="h-5 w-5"/>, accent: "red",   note: "10%" },
  { label: "Taxes (VAT 5%)",     value: -17730,  icon: <CreditCard className="h-5 w-5"/>, accent: "amber",  note: "5% VAT" },
  { label: "Net Earnings",       value: 336870,  icon: <Wallet className="h-5 w-5"/>, accent: "emerald",  note: "After deductions" },
];

const PAYOUTS = [
  { id: "PAY-2226", amount: 234000, date: "2026-07-28", status: "completed", method: "Bank Transfer — ADIB ****4432" },
  { id: "PAY-2191", amount: 318000, date: "2026-06-28", status: "completed", method: "Bank Transfer — ADIB ****4432" },
  { id: "PAY-2155", amount: 287000, date: "2026-05-28", status: "completed", method: "Bank Transfer — ADIB ****4432" },
  { id: "PAY-2120", amount: 344000, date: "2026-04-28", status: "completed", method: "Bank Transfer — ADIB ****4432" },
  { id: "PAY-2085", amount: 128700, date: "2026-08-10", status: "pending",   method: "Bank Transfer — ADIB ****4432" },
];

const ACCENT_MAP: Record<string, string> = {
  indigo:  "bg-indigo-100 text-indigo-600",
  red:     "bg-red-100 text-red-600",
  amber:   "bg-amber-100 text-amber-600",
  emerald: "bg-emerald-100 text-emerald-600",
};

export default function SellerFinancePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Finance</h2>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {SUMMARY_CARDS.map((c) => (
          <div key={c.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg ${ACCENT_MAP[c.accent]}`}>
              {c.icon}
            </div>
            <p className="text-xs font-medium text-slate-500">{c.label}</p>
            <p className={`mt-1 text-xl font-bold ${c.value < 0 ? "text-red-600" : "text-slate-900"}`}>
              {c.value < 0 ? `- ${formatPrice(Math.abs(c.value))}` : formatPrice(c.value)}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{c.note}</p>
          </div>
        ))}
      </div>

      {/* Wallet */}
      <div className="rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 text-white shadow-sm">
        <p className="text-sm font-medium text-indigo-200">Wallet Balance</p>
        <p className="mt-1 text-3xl font-bold">AED 1,280.00</p>
        <p className="text-sm text-indigo-200 mt-1">Available for withdrawal</p>
        <button className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 transition">
          Request Withdrawal
        </button>
      </div>

      {/* Payout history */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h3 className="text-sm font-semibold text-slate-700">Payout History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left">
                <th className="px-6 py-3 text-xs font-semibold text-slate-500">Payout ID</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500">Amount</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500">Date</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500">Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {PAYOUTS.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-3 font-mono text-xs font-semibold text-indigo-600">{p.id}</td>
                  <td className="px-6 py-3 font-semibold text-slate-900">{formatPrice(p.amount)}</td>
                  <td className="px-6 py-3 text-slate-500">{p.date}</td>
                  <td className="px-6 py-3">
                    {p.status === "completed" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                        <CheckCircle className="h-3.5 w-3.5" /> Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                        <Clock className="h-3.5 w-3.5" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-slate-500 text-xs">{p.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
