import { Star, TrendingUp, TrendingDown, Clock, Package, RefreshCw, XCircle } from "lucide-react";

interface MetricRowProps {
  label: string;
  value: string;
  target: string;
  score: number;
  good?: boolean;
  icon: React.ReactNode;
  description: string;
}

function MetricRow({ label, value, target, score, good = true, icon, description }: MetricRowProps) {
  const barColor = good ? (score >= 80 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-red-500") : (score <= 20 ? "bg-emerald-500" : score <= 50 ? "bg-amber-500" : "bg-red-500");
  const textColor = good ? (score >= 80 ? "text-emerald-600" : score >= 50 ? "text-amber-600" : "text-red-600") : (score <= 20 ? "text-emerald-600" : score <= 50 ? "text-amber-600" : "text-red-600");

  return (
    <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-4 mb-1">
          <p className="text-sm font-semibold text-slate-900">{label}</p>
          <p className={`text-lg font-bold tabular-nums ${textColor}`}>{value}</p>
        </div>
        <p className="text-xs text-slate-400 mb-3">{description} · Target: {target}</p>
        <div className="h-2 w-full rounded-full bg-slate-100">
          <div className={`h-2 rounded-full ${barColor}`} style={{ width: `${Math.min(score, 100)}%` }} />
        </div>
      </div>
    </div>
  );
}

export default function SellerPerformancePage() {
  const overallScore = 82;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-slate-900">Performance Score</h2>

      {/* Overall score */}
      <div className="rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 text-white shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/30 bg-white/10 text-3xl font-extrabold">
            {overallScore}
          </div>
          <div>
            <p className="text-lg font-bold">Overall Performance Score</p>
            <p className="text-indigo-200 text-sm mt-1">Good — keep maintaining quality for Verified+ tier</p>
            <div className="flex items-center gap-1.5 mt-2">
              <TrendingUp className="h-4 w-4 text-emerald-300" />
              <span className="text-sm text-emerald-300 font-semibold">+4 pts vs last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Individual metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <MetricRow
          label="Seller Rating"
          value="4.6 / 5"
          target="≥ 4.5"
          score={92}
          good
          icon={<Star className="h-5 w-5" />}
          description="Avg rating from verified buyers"
        />
        <MetricRow
          label="Order Fulfillment Rate"
          value="96.8%"
          target="≥ 95%"
          score={97}
          good
          icon={<Package className="h-5 w-5" />}
          description="Orders shipped vs received"
        />
        <MetricRow
          label="Return Rate"
          value="1.8%"
          target="≤ 5%"
          score={18}
          good={false}
          icon={<RefreshCw className="h-5 w-5" />}
          description="Returns vs total orders"
        />
        <MetricRow
          label="Late Shipment Rate"
          value="3.2%"
          target="≤ 5%"
          score={32}
          good={false}
          icon={<Clock className="h-5 w-5" />}
          description="Shipments beyond promised date"
        />
        <MetricRow
          label="Cancellation Rate"
          value="1.1%"
          target="≤ 2%"
          score={11}
          good={false}
          icon={<XCircle className="h-5 w-5" />}
          description="Seller-cancelled orders"
        />
        <MetricRow
          label="Avg Response Time"
          value="1.4 hrs"
          target="≤ 4 hrs"
          score={85}
          good
          icon={<TrendingUp className="h-5 w-5" />}
          description="Time to first customer reply"
        />
        <MetricRow
          label="Avg Delivery Time"
          value="2.4 days"
          target="≤ 3 days"
          score={80}
          good
          icon={<TrendingDown className="h-5 w-5" />}
          description="Order placed → delivered"
        />
      </div>
    </div>
  );
}
