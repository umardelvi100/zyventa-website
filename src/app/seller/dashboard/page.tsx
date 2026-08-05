import {
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  DollarSign,
  Wallet,
  Package,
  AlertTriangle,
  Star,
  Truck,
  BarChart3,
} from "lucide-react";
import { KpiCard } from "@/components/seller/portal/kpi-card";
import { LineChart } from "@/components/admin/charts/line-chart";
import { BarChart } from "@/components/admin/charts/bar-chart";
import { DonutChart } from "@/components/admin/charts/donut-chart";
import { OrderStatusBadge } from "@/components/seller/portal/status-badge";
import {
  MOCK_SELLER_ORDERS,
  SELLER_MONTHLY_REVENUE,
  SELLER_MONTHLY_ORDERS,
} from "@/lib/seller/mock-data";
import { formatPrice } from "@/lib/format";

const CATEGORY_DONUT = [
  { label: "Medicines", value: 52, color: "#4f46e5" },
  { label: "Cosmetics", value: 36, color: "#f97316" },
  { label: "Consumables", value: 12, color: "#10b981" },
];

const KPI_DATA = [
  { title: "Total Sales",        value: "AED 23,840",   subtitle: "All-time",    icon: <DollarSign className="h-5 w-5"/>, accent: "indigo" as const,  trend: 12,  trendLabel: "vs last month" },
  { title: "Today's Orders",     value: "18",            subtitle: "New today",   icon: <ShoppingCart className="h-5 w-5"/>, accent: "sky" as const,    trend: 8,   trendLabel: "vs yesterday" },
  { title: "Pending",            value: "5",             subtitle: "Awaiting action", icon: <Clock className="h-5 w-5"/>, accent: "amber" as const,  trend: -2,  trendLabel: "vs yesterday" },
  { title: "Completed",          value: "1,432",         subtitle: "Delivered",   icon: <CheckCircle className="h-5 w-5"/>, accent: "emerald" as const, trend: 15, trendLabel: "vs last month" },
  { title: "Cancelled",          value: "23",            subtitle: "This month",  icon: <XCircle className="h-5 w-5"/>, accent: "red" as const,   trend: -5,  trendLabel: "vs last month" },
  { title: "Returned",           value: "12",            subtitle: "This month",  icon: <RefreshCw className="h-5 w-5"/>, accent: "orange" as const, trend: 2,  trendLabel: "vs last month" },
  { title: "Revenue",            value: "AED 3,940",    subtitle: "This month",  icon: <BarChart3 className="h-5 w-5"/>, accent: "indigo" as const, trend: 18,  trendLabel: "vs last month" },
  { title: "Wallet Balance",     value: "AED 1,280",    subtitle: "Available",   icon: <Wallet className="h-5 w-5"/>, accent: "purple" as const, trend: 0,   trendLabel: "" },
  { title: "Products Listed",    value: "10",            subtitle: "Active: 9",   icon: <Package className="h-5 w-5"/>, accent: "sky" as const,    trend: 0,   trendLabel: "" },
  { title: "Low Stock",          value: "3",             subtitle: "Below 10 units", icon: <AlertTriangle className="h-5 w-5"/>, accent: "amber" as const, trend: 1, trendLabel: "vs yesterday" },
  { title: "Customer Rating",    value: "4.6 ★",         subtitle: "Avg out of 5",icon: <Star className="h-5 w-5"/>, accent: "orange" as const, trend: 3,   trendLabel: "vs last month" },
  { title: "Avg Delivery Time",  value: "2.4 days",      subtitle: "Last 30 days",icon: <Truck className="h-5 w-5"/>, accent: "emerald" as const,trend: -8,  trendLabel: "vs last month" },
];

const recentOrders = MOCK_SELLER_ORDERS.slice(0, 5);

export default function SellerDashboardPage() {
  return (
    <div className="space-y-8">
      {/* KPI Grid */}
      <section>
        <h2 className="mb-4 text-sm font-semibold text-slate-500 uppercase tracking-wide">Overview</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {KPI_DATA.map((kpi) => (
            <KpiCard key={kpi.title} {...kpi} />
          ))}
        </div>
      </section>

      {/* Charts row */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-slate-700">Monthly Revenue (AED)</h3>
          <LineChart
            data={SELLER_MONTHLY_REVENUE}
            color="#4f46e5"
            gradientId="seller-revenue-grad"
          />
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-slate-700">Revenue by Category</h3>
          <DonutChart data={CATEGORY_DONUT} />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-slate-700">Monthly Orders</h3>
        <BarChart data={SELLER_MONTHLY_ORDERS} color="#4f46e5" />
      </section>

      {/* Recent orders */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h3 className="text-sm font-semibold text-slate-700">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left">
                <th className="px-6 py-3 text-xs font-semibold text-slate-500">Order ID</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500">Customer</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500">Product</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-3 font-mono text-xs text-indigo-600">{order.id}</td>
                  <td className="px-6 py-3 text-slate-700">{order.customerName}</td>
                  <td className="px-6 py-3 text-slate-600">{order.product}</td>
                  <td className="px-6 py-3"><OrderStatusBadge status={order.status} /></td>
                  <td className="px-6 py-3 font-semibold text-slate-900">{formatPrice(order.totalFils)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
